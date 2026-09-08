import { canonicalMessageDigest } from '../messages/mechanics';

export interface CampaignContainer {
  protocol: 1; directory: string; endpoint: string; daemon_id: string; image: string;
  container_id: string; request_sha256: string; configuration_sha256: string;
}

type ObjectValue = Record<string, unknown>;
export interface Difference {
  path: string; expected: unknown; actual: unknown; expected_type: string; actual_type: string;
  classification: 'security_mismatch' | 'known_representation_difference' | 'lifecycle_mismatch' | 'unsupported_output' | 'unclassified';
  source: string; decision: 'reject_before_workload_start' | 'equivalent_for_this_field';
}
export interface Expected {
  engine: string; api: string; fields: ObjectValue; mounts: ObjectValue[]; phase: ObjectValue; sources: Record<string, string>;
}
function object(value: unknown): ObjectValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('unsupported object shape');
  return value as ObjectValue;
}
const kind = (value: unknown) => value === undefined ? 'missing' : value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
const same = (a: unknown, b: unknown) => canonicalMessageDigest({ value: a ?? null }) === canonicalMessageDigest({ value: b ?? null }) && kind(a) === kind(b);
function at(value: ObjectValue, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => current && typeof current === 'object' && !Array.isArray(current) ? (current as ObjectValue)[key] : undefined, value);
}
function difference(path: string, expected: unknown, actual: unknown, classification: Difference['classification'], source: string): Difference {
  return { path, expected: expected === undefined ? '<missing>' : expected, actual: actual === undefined ? '<missing>' : actual,
    expected_type: kind(expected), actual_type: kind(actual), classification, source,
    decision: classification === 'known_representation_difference' ? 'equivalent_for_this_field' : 'reject_before_workload_start' };
}
/** Bind mount facts are keyed by unique destination, not daemon iteration order. */
export function mountsByDestination(value: unknown): ObjectValue[] {
  if (!Array.isArray(value)) throw new Error('Mounts must be an array');
  const destinations = new Set<string>();
  const mounts = value.map(item => {
    const mount = object(item);
    if (!same(Object.keys(mount).sort(), ['Destination', 'Mode', 'Propagation', 'RW', 'Source', 'Type'])
      || mount.Type !== 'bind' || typeof mount.Source !== 'string' || !mount.Source.startsWith('/')
      || typeof mount.Destination !== 'string' || !mount.Destination.startsWith('/')
      || typeof mount.Mode !== 'string' || typeof mount.Propagation !== 'string' || typeof mount.RW !== 'boolean'
      || destinations.has(mount.Destination)) throw new Error('unsupported or duplicate mount facts');
    destinations.add(mount.Destination);
    return mount;
  });
  return [...mounts].sort((a, b) => String(a.Destination) < String(b.Destination) ? -1 : String(a.Destination) > String(b.Destination) ? 1 : 0);
}
/** Docker Mount.ReadOnly is a bool with json omitempty (Moby v28.3.2 mount.go). */
function requestMountFacts(value: unknown): ObjectValue[] {
  if (!Array.isArray(value)) throw new Error('HostConfig.Mounts must be an array');
  return value.map(item => {
    const mount = object(item);
    if (Object.hasOwn(mount, 'ReadOnly') && typeof mount.ReadOnly !== 'boolean') throw new Error('unsupported ReadOnly value');
    return { ...mount, ReadOnly: Object.hasOwn(mount, 'ReadOnly') ? mount.ReadOnly : false };
  });
}
export function containmentDifferences(expected: Expected, response: unknown): Difference[] {
  const observed = object(response); const differences: Difference[] = [];
  for (const [path, value] of Object.entries(expected.fields)) {
    const raw = at(observed, path);
    let actual = raw;
    try { if (path === 'HostConfig.Mounts') actual = requestMountFacts(raw); } catch { /* Report the unsupported original value. */ }
    if (!same(value, actual)) differences.push(difference(path, value, actual, kind(value) !== kind(actual) ? 'unsupported_output' : 'security_mismatch', expected.sources[path] ?? expected.sources.default!));
  }
  for (const [path, value] of Object.entries(expected.phase)) {
    const actual = at(observed, path);
    if (!same(value, actual)) differences.push(difference(path, value, actual, 'lifecycle_mismatch', 'pre-start lifecycle requirement'));
  }
  try {
    const required = mountsByDestination(expected.mounts), actual = mountsByDestination(observed.Mounts);
    const requiredMap = new Map(required.map(m => [m.Destination, m]));
    const actualMap = new Map(actual.map(m => [m.Destination, m]));
    for (const destination of new Set([...requiredMap.keys(), ...actualMap.keys()])) {
      const a = requiredMap.get(destination), b = actualMap.get(destination);
      const path = `Mounts[destination=${destination}]`;
      if (!a || !b) differences.push(difference(path, a, b, 'security_mismatch', 'exact authorized mount inventory'));
      else for (const field of Object.keys(a)) if (!same(a[field], b[field])) differences.push(difference(`${path}.${field}`, a[field], b[field], 'security_mismatch', 'input paths/access + create bind options'));
    }
    if (same(required, actual) && !same(expected.mounts, observed.Mounts)) differences.push(difference('Mounts.order', expected.mounts.map(m => m.Destination), (observed.Mounts as ObjectValue[]).map(m => m.Destination), 'known_representation_difference', 'Docker 28.3.2 repeated inspect of same created container; destination-keyed mount facts'));
  } catch (error) {
    differences.push(difference('Mounts', 'unique, typed bind mount facts', observed.Mounts, 'unsupported_output', String(error)));
  }
  return differences;
}
export function frozenConfiguration(response: unknown): ObjectValue {
  const value = object(response); const host = object(value.HostConfig);
  if (host.OomKillDisable !== false && host.OomKillDisable !== null) throw new Error('container must permit OOM termination');
  return { Id: value.Id, Image: value.Image, Path: value.Path, Args: value.Args, Config: value.Config,
    HostConfig: { ...host, OomKillDisable: false, Mounts: requestMountFacts(host.Mounts) },
    Mounts: mountsByDestination(value.Mounts) };
}

export function assertContainment(expected: Expected, response: unknown): void {
  const errors = containmentDifferences(expected, response).filter(item => item.decision === 'reject_before_workload_start');
  if (errors.length) throw new Error(`container containment mismatch: ${JSON.stringify(errors)}`);
}

export const CAMPAIGN_INIT = '/usr/local/bin/repo-harness-campaign-init';
export function buildContainmentSpec(input: {
  image: string; image_env: unknown; worktree: string; common: string; auth?: string;
  argv: readonly string[]; deadline: number; uid: number; gid: number; writable: boolean; probe: boolean;
}): Expected {
  if (!Number.isSafeInteger(input.deadline) || !Number.isSafeInteger(input.uid) || input.uid <= 0
    || !Number.isSafeInteger(input.gid) || input.gid <= 0 || !/^sha256:[a-f0-9]{64}$/.test(input.image)
    || !input.argv.length || !input.argv[0]?.startsWith('/') || input.argv.some(arg => typeof arg !== 'string')) throw new Error('invalid containment input');
  const protectedPaths = ['/usr', '/bin', '/sbin', '/lib', '/lib64', '/etc', '/proc', '/sys', '/dev', '/tmp', '/run', '/home/campaign'];
  const overlaps = (a: string, b: string) => a === b || a.startsWith(b + '/') || b.startsWith(a + '/');
  for (const path of [input.worktree, input.common]) {
    if (!path.startsWith('/') || path === '/' || path.includes(',') || protectedPaths.some(p => overlaps(path, p))) throw new Error('mount overlaps trusted runtime or special filesystem');
  }
  if (input.worktree === input.common) throw new Error('duplicate mount destination');
  if (!Array.isArray(input.image_env) || input.image_env.some(v => typeof v !== 'string')) throw new Error('unsupported image environment');
  const keys = input.image_env.map(v => (v as string).split('=')[0]);
  if (new Set(keys).size !== keys.length || keys.some(k => !k || ['LD_PRELOAD', 'LD_LIBRARY_PATH', 'NODE_OPTIONS'].includes(k!))) throw new Error('duplicate or unsafe image environment');
  const argv = [String(input.deadline), String(input.uid), String(input.gid), input.auth ? 'auth' : 'no-auth', ...input.argv];
  const mount = (source: string, destination: string, rw: boolean) => ({ Type: 'bind', Source: source, Destination: destination, Mode: '', RW: rw, Propagation: 'rprivate' });
  const mounts = [mount(input.worktree, input.worktree, input.writable && !input.probe), mount(input.common, input.common, false)];
  if (input.auth) {
    if (!input.auth.startsWith('/') || input.auth.includes(',')) throw new Error('invalid auth source');
    mounts.push(mount(input.auth, '/run/codex-auth.json', false));
  }
  const fields: ObjectValue = {
    Image: input.image, Path: CAMPAIGN_INIT, Args: argv,
    'Config.Entrypoint': [CAMPAIGN_INIT], 'Config.Cmd': argv, 'Config.User': '0:0', 'Config.Image': input.image,
    'Config.Env': input.image_env, 'Config.WorkingDir': input.worktree, 'Config.Volumes': null,
    'Config.Healthcheck.Test': ['NONE'], 'Config.Tty': false, 'Config.OpenStdin': false,
    'HostConfig.Privileged': false, 'HostConfig.ReadonlyRootfs': true, 'HostConfig.AutoRemove': false,
    'HostConfig.PidMode': '', 'HostConfig.CgroupnsMode': 'private', 'HostConfig.IpcMode': 'private',
    'HostConfig.UsernsMode': '', 'HostConfig.UTSMode': '', 'HostConfig.Runtime': 'runc',
    'HostConfig.RestartPolicy': { Name: 'no', MaximumRetryCount: 0 },
    'HostConfig.CapAdd': ['CAP_SETGID', 'CAP_SETUID'], 'HostConfig.CapDrop': ['ALL'],
    'HostConfig.SecurityOpt': ['no-new-privileges'], 'HostConfig.NetworkMode': input.probe ? 'none' : 'bridge',
    'HostConfig.Memory': 1073741824, 'HostConfig.MemorySwap': 1073741824, 'HostConfig.NanoCpus': 1000000000, 'HostConfig.PidsLimit': 128,
    'HostConfig.MaskedPaths': ['/proc/asound', '/proc/acpi', '/proc/interrupts', '/proc/kcore', '/proc/keys', '/proc/latency_stats', '/proc/timer_list', '/proc/timer_stats', '/proc/sched_debug', '/proc/scsi', '/sys/firmware', '/sys/devices/virtual/powercap'],
    'HostConfig.ReadonlyPaths': ['/proc/bus', '/proc/fs', '/proc/irq', '/proc/sys', '/proc/sysrq-trigger'],
    'HostConfig.Devices': [], 'HostConfig.DeviceRequests': null, 'HostConfig.DeviceCgroupRules': null,
    'HostConfig.GroupAdd': null, 'HostConfig.Binds': null, 'HostConfig.VolumesFrom': null,
    'HostConfig.PublishAllPorts': false, 'HostConfig.PortBindings': {},
    'HostConfig.Tmpfs': { '/tmp': 'rw,nosuid,nodev,size=536870912,mode=1777', '/home/campaign': 'rw,nosuid,nodev,size=67108864,mode=1777' },
    'HostConfig.LogConfig': { Type: 'local', Config: { 'max-size': '1m', 'max-file': '2' } },
    'HostConfig.Mounts': mounts.map(m => ({ Type: 'bind', Source: m.Source, Target: m.Destination, ReadOnly: !m.RW, BindOptions: { Propagation: m.Propagation } })),
  };
  return { engine: '28.3.2', api: '1.51', fields, mounts,
    phase: { 'State.Status': 'created', 'State.Running': false, 'State.Pid': 0, 'State.Restarting': false, 'State.Dead': false, RestartCount: 0 },
    sources: { default: 'frozen containment input and pinned image environment before create' } };
}
/** Encode the same expected facts that admission subsequently verifies. */
export function encodeContainmentCreate(spec: Expected, name: string): string[] {
  const f = spec.fields;
  const args = ['create', '--pull', 'never', '--name', name, '--restart', String(object(f['HostConfig.RestartPolicy']).Name),
    '--read-only', '--user', String(f['Config.User']), '--no-healthcheck', '--runtime', String(f['HostConfig.Runtime']),
    '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges', '--cgroupns', String(f['HostConfig.CgroupnsMode']),
    '--ipc', String(f['HostConfig.IpcMode']), '--pids-limit', String(f['HostConfig.PidsLimit']),
    '--memory', String(f['HostConfig.Memory']), '--memory-swap', String(f['HostConfig.MemorySwap']),
    '--cpus', String(Number(f['HostConfig.NanoCpus']) / 1e9), '--log-driver', String(object(f['HostConfig.LogConfig']).Type),
    '--entrypoint', String(f.Path), '--network', String(f['HostConfig.NetworkMode']), '--workdir', String(f['Config.WorkingDir'])];
  for (const cap of f['HostConfig.CapAdd'] as string[]) args.push('--cap-add', cap);
  for (const [key, value] of Object.entries(object(object(f['HostConfig.LogConfig']).Config))) args.push('--log-opt', `${key}=${value}`);
  for (const [path, options] of Object.entries(object(f['HostConfig.Tmpfs']))) args.push('--tmpfs', `${path}:${options}`);
  for (const m of spec.mounts) args.push('--mount', `type=bind,src=${m.Source},dst=${m.Destination},bind-propagation=${m.Propagation}${m.RW ? '' : ',readonly'}`);
  return [...args, String(f.Image), ...(f.Args as string[])];
}

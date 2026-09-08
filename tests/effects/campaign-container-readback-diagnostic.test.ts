import { describe, expect, test } from 'bun:test';
import fixture from '../fixtures/campaign-container-readback/mount-order.json';
import { containmentDifferences, frozenConfiguration, positionalDifferences } from '../../scripts/diagnose-campaign-container-readback';
import { canonicalMessageDigest } from '../../src/core/messages/mechanics';

const clone = () => structuredClone(fixture.rejected);
const errors = (value: unknown) => containmentDifferences(fixture.expected, value).filter(d => d.decision === 'reject_before_workload_start');
const digest = (value: unknown, candidate = true) => canonicalMessageDigest(frozenConfiguration(value, candidate));

describe('saved Docker 28.3.2 created-state readback (offline only)', () => {
  test('reproduces original rejection with all four actual positional differences', () => {
    expect(digest(fixture.before, false)).not.toBe(digest(fixture.rejected, false));
    expect(positionalDifferences(fixture.before, fixture.rejected).map(d => d.path).sort()).toEqual([
      'Mounts[0].Destination', 'Mounts[0].Source', 'Mounts[1].Destination', 'Mounts[1].Source',
    ]);
  });
  test('candidate fixes only mount order; frozen request expectations still pass', () => {
    expect(errors(fixture.before)).toEqual([]);
    expect(errors(fixture.rejected)).toEqual([]);
    expect(containmentDifferences(fixture.expected, fixture.rejected).map(d => d.classification)).toEqual(['known_representation_difference']);
    expect(digest(fixture.before)).toBe(digest(fixture.rejected));
  });
  test('extra or missing mounts cannot hide in an order-independent comparison', () => {
    const extra = clone(); extra.Mounts.push({ ...extra.Mounts[0]!, Source: '/var/run/docker.sock', Destination: '/var/run/docker.sock', RW: true });
    expect(errors(extra).some(d => d.path.includes('/var/run/docker.sock'))).toBe(true);
    expect(digest(extra)).not.toBe(digest(fixture.before));
    const missing = clone(); missing.Mounts.pop(); expect(errors(missing).length).toBeGreaterThan(0);
  });
  test('duplicate destination and unrecognized mount fields reject', () => {
    const duplicate = clone(); duplicate.Mounts.push({ ...duplicate.Mounts[0]! });
    expect(() => digest(duplicate)).toThrow('duplicate');
    const unknown = clone(); Object.assign(unknown.Mounts[0]!, { UnsafeNewOption: true });
    expect(() => digest(unknown)).toThrow('unsupported');
  });
  test('readonly becoming writable reports exact field and boolean types', () => {
    const value = clone(); value.Mounts[0]!.RW = true;
    const mismatch = errors(value).find(d => d.path.endsWith('.RW'))!;
    expect(mismatch).toMatchObject({ expected: false, actual: true, expected_type: 'boolean', actual_type: 'boolean', classification: 'security_mismatch' });
    expect(digest(value)).not.toBe(digest(fixture.before));
  });
  test.each(['Source', 'Propagation', 'Type'] as const)('changed mount %s rejects', field => {
    const value = clone(); value.Mounts[0]![field] = field === 'Type' ? 'volume' : 'unauthorized';
    expect(errors(value).length).toBeGreaterThan(0);
  });
  test('watchdog bypass and ordered command permutations both reject', () => {
    const bypass = clone(); bypass.Config.Entrypoint = ['/bin/sh']; bypass.Path = '/bin/sh';
    expect(errors(bypass).length).toBeGreaterThan(0); expect(digest(bypass)).not.toBe(digest(fixture.before));
    const reordered = clone(); reordered.Config.Cmd.reverse(); reordered.Args.reverse();
    expect(errors(reordered).length).toBeGreaterThan(0); expect(digest(reordered)).not.toBe(digest(fixture.before));
  });
  test('image replacement, security weakening and inherited environment injection reject', () => {
    const image = clone(); image.Image = 'sha256:' + 'b'.repeat(64); expect(errors(image).length).toBeGreaterThan(0);
    const privileged = clone(); privileged.HostConfig.Privileged = true; privileged.HostConfig.SecurityOpt = [];
    expect(errors(privileged).length).toBeGreaterThan(0); expect(digest(privileged)).not.toBe(digest(fixture.before));
    const env = clone(); env.Config.Env.push('PATH=/untrusted');
    expect(errors(env).some(d => d.path === 'Config.Env')).toBe(true); expect(digest(env)).not.toBe(digest(fixture.before));
  });
  test('missing booleans and null arrays are not silently defaulted', () => {
    const missing = clone(); Reflect.deleteProperty(missing.HostConfig, 'Privileged');
    expect(errors(missing).some(d => d.actual_type === 'missing')).toBe(true);
    const invalid = clone(); Reflect.set(invalid, 'Mounts', null); expect(() => digest(invalid)).toThrow();
  });
  test('running state is a separate lifecycle rejection even when config matches', () => {
    const running = clone(); running.State.Running = true; running.State.Status = 'running'; running.State.Pid = 123;
    expect(digest(running)).toBe(digest(fixture.before));
    expect(errors(running).every(d => d.classification === 'lifecycle_mismatch')).toBe(true);
    expect(errors(running).length).toBe(3);
  });
});

test('only the documented request-side ReadOnly bool may be omitted for false', () => {
  const expected = structuredClone(fixture.expected);
  expected.fields['HostConfig.Mounts'][0]!.ReadOnly = false;
  expected.mounts[0]!.RW = true;
  const value = structuredClone(fixture.before);
  Reflect.deleteProperty(value.HostConfig.Mounts[0]!, 'ReadOnly'); value.Mounts[0]!.RW = true;
  expect(containmentDifferences(expected, value).filter(d => d.decision === 'reject_before_workload_start')).toEqual([]);
  Reflect.set(value.HostConfig.Mounts[0]!, 'ReadOnly', null);
  expect(containmentDifferences(expected, value).some(d => d.path === 'HostConfig.Mounts' && d.decision === 'reject_before_workload_start')).toBe(true);
  Reflect.deleteProperty(value.Mounts[0]!, 'RW');
  expect(containmentDifferences(expected, value).some(d => d.path === 'Mounts' && d.classification === 'unsupported_output')).toBe(true);
});

import { readyFixture } from '../helpers/campaign-acquisition-fixture';
import { buildProviderIssueObservation, buildExternalSourceRefreshReceipt } from '../../src/core/external-sources/issue-observation';
import { runCampaignPlanningStep } from '../../src/effects/automation/campaign-planning';
import { runCampaignPlanningPreflight } from '../../src/cli/commands/campaign';
import { makeSnapshot } from '../helpers/issue-batch-adoption-fixture';
import { buildExternalSourceProjection } from '../../src/core/external-sources/projection';
import { writeProviderIssueObservation, writeExternalSourceRefreshReceipt } from '../../src/effects/external-sources/store';
import { bindEngineer, readEngineerBindingStatus } from '../../src/effects/engineers/binding-store';
import { loadEngineerProfile } from '../../src/effects/engineers/profile-store';
import { enrollEngineerPrincipal } from '../../src/effects/engineers/principal-store';
import { readClaimActorReceipt } from '../../src/effects/engineers/claim-actor-store';
import { acquireNextScheduledEngineerTask } from '../../src/effects/engineers/scheduling-acquire-next';
import { resolveEngineerPrincipal } from '../../src/effects/engineers/principal';
import { collectEngineerOffers } from '../../src/effects/engineers/scheduling';
import { afterEach, expect, test } from 'bun:test';
import { execFileSync } from 'child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createAdoptionRepository } from '../helpers/campaign-adoption-repository';
import { adoptIssueBatch } from '../../src/effects/automation/issue-batch-adoption';
import { withCampaignCapacity } from '../../src/effects/automation/campaign-capacity';
import { runCampaignAcquisition } from '../../src/effects/automation/campaign-acquisition';
import { projectCanonicalTasks } from '../../src/core/state/coordination-identity';
import { resolveRepoIdentity } from '../../src/effects/state/coordination-canonical-source';
import { claimSprintCommand, processSprintDependencies, releaseSprintCommand } from '../../src/effects/state/coordination-sprint';
import { readLease, leaseOwnerPath } from '../../src/effects/state/coordination-lease-store';

const roots: string[] = [];
afterEach(() => { roots.splice(0).forEach(root => rmSync(root, { recursive: true, force: true })); });
const sprint = 'plans/sprints/repair.sprint.md';
const git = (root: string, args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
async function fixture(limit: 1 | 2 | 3 = 1) {
  const f = await createAdoptionRepository('active', 1, undefined, {}, {}, { max_parallel_tasks: limit });
  roots.push(f.root, f.home);
  const publication = (await adoptIssueBatch(f.input, f.deps)).publication!;
  git(f.root, ['merge', '--ff-only', publication.materialized_commit]);
  const tasks = projectCanonicalTasks({ repoIdentity: resolveRepoIdentity(f.root), sprintPath: sprint, sprintText: readFileSync(join(f.root, sprint), 'utf8') });
  const claim = (index: number) => claimSprintCommand({ taskId: tasks[index]!.task_id, expectedTaskRevision: tasks[index]!.task_revision, targetRef: 'main', sprintPath: sprint, sessionId: `engineer-${index}` }, processSprintDependencies(f.root));
  return { ...f, tasks, claim };
}

test('real campaign leases consume capacity until released; unknown lease fails closed', async () => {
  const f = await fixture();
  const first = withCampaignCapacity(f.root, f.tasks[0]!.task_id, 'main', f.env, () => f.claim(0));
  expect(first.exitCode).toBe(0);
  expect(() => withCampaignCapacity(f.root, f.tasks[1]!.task_id, 'main', f.env, () => f.claim(1))).toThrow('max_parallel_tasks');
  const lease = JSON.parse(first.stdout);
  expect(releaseSprintCommand({ claimId: lease.claim_id }, processSprintDependencies(f.root)).exitCode).toBe(0);
  const second = withCampaignCapacity(f.root, f.tasks[1]!.task_id, 'main', f.env, () => f.claim(1));
  expect(second.exitCode).toBe(0);
  writeFileSync(leaseOwnerPath(f.root, f.tasks[1]!.task_id), '{}');
  expect(() => withCampaignCapacity(f.root, f.tasks[0]!.task_id, 'main', f.env, () => f.claim(0))).toThrow('Lease state is unknown');
});

test('two processes competing for different campaign tasks cannot exceed one live lease', async () => {
  const f = await fixture();
  const capacity = join(import.meta.dir, '../../src/effects/automation/campaign-capacity.ts');
  const coordination = join(import.meta.dir, '../../src/effects/state/coordination-sprint.ts');
  const children = f.tasks.map((task, index) => Bun.spawn([process.execPath, '-e', `
    import { withCampaignCapacity } from ${JSON.stringify(capacity)};
    import { claimSprintCommand, processSprintDependencies } from ${JSON.stringify(coordination)};
    try {
      const result = withCampaignCapacity(process.cwd(), ${JSON.stringify(task.task_id)}, 'main', process.env, () => claimSprintCommand({taskId:${JSON.stringify(task.task_id)}, expectedTaskRevision:${JSON.stringify(task.task_revision)}, targetRef:'main', sprintPath:${JSON.stringify(sprint)}, sessionId:'engineer-${index}'}, processSprintDependencies(process.cwd())));
      console.log(JSON.stringify(result));
    } catch (error) { console.log(JSON.stringify({error:error.code})); }
  `], { cwd: f.root, env: f.env, stdout: 'pipe', stderr: 'pipe' }));
  const results = await Promise.all(children.map(async child => {
    const output = await new Response(child.stdout).text();
    const stderr = await new Response(child.stderr).text();
    expect(await child.exited, stderr).toBe(0);
    return JSON.parse(output);
  }));
  expect(results.filter(r => r.exitCode === 0)).toHaveLength(1);
  expect(results.filter(r => r.error === 'campaign_capacity_full')).toHaveLength(1);
  expect(f.tasks.filter(task => readLease(f.root, task.task_id).record !== null)).toHaveLength(1);
});

test('campaign execution requires the exact local planning parent and shadow never acquires', async () => {
  const f = await fixture();
  const input = { repo_root: f.root, campaign_id: f.intent.campaign_id, group_number: 1, intent_sha256: f.intent.intent_sha256, host: 'codex' as const, session_id: 'parent', authorization_id: 'missing', idempotency_key: 'one', env: f.env };
  expect(() => runCampaignAcquisition(input)).toThrow('does not own');
  expect(() => runCampaignAcquisition({ ...input, host: 'claude' })).toThrow('authorized local parent');
  const path = join(f.root, '.ai/harness/policy.json'); const policy = JSON.parse(readFileSync(path, 'utf8'));
  policy.development_campaign.mode = 'shadow'; writeFileSync(path, JSON.stringify(policy)); git(f.root, ['add', '.']); git(f.root, ['commit', '-qm', 'shadow']);
  expect(runCampaignAcquisition(input)).toMatchObject({ action: 'idle' });
  expect(f.tasks.every(task => readLease(f.root, task.task_id).record === null)).toBe(true);
  policy.development_campaign.mode = 'off'; writeFileSync(path, JSON.stringify(policy)); git(f.root, ['add', '.']); git(f.root, ['commit', '-qm', 'off']);
  expect(() => runCampaignAcquisition(input)).toThrow();
});


test('real Engineer acquisition returns a bound envelope, replays it, and fences lost ownership', async () => {
  const f = await readyFixture(); roots.push(f.root, f.home);
  const acquired = runCampaignAcquisition(f.executeInput);
  expect(acquired, JSON.stringify(acquired)).toMatchObject({ action: 'dispatch' });
  if (!('envelope' in acquired) || !acquired.envelope || !acquired.receipt) throw new Error(JSON.stringify(acquired));
  roots.push(acquired.envelope.worktree_path);
  expect(readLease(f.root, acquired.envelope.task_id).record).toMatchObject({ state: 'bound', claim_id: acquired.envelope.claim_id, execution_worktree: acquired.envelope.worktree_path });
  expect(readClaimActorReceipt(f.root, acquired.envelope.task_id, acquired.envelope.claim_id)).toEqual(acquired.receipt);
  expect(runCampaignAcquisition(f.executeInput)).toEqual(acquired);
  const contract = join(f.root, acquired.envelope.plan.contract_path);
  const originalContract = readFileSync(contract, 'utf8');
  writeFileSync(contract, originalContract + '\nChanged after acquisition.');
  expect(() => runCampaignAcquisition(f.executeInput)).toThrow('plan or contract proof changed');
  expect(readLease(f.root, acquired.envelope.task_id).record?.claim_id).toBe(acquired.envelope.claim_id);
  writeFileSync(contract, originalContract);

  expect(runCampaignAcquisition({ ...f.executeInput, idempotency_key: 'second' })).toMatchObject({ action: 'idle' });
  expect(() => runCampaignAcquisition({ ...f.executeInput, authorization_id: 'unissued' })).toThrow('not mapped');
  expect(releaseSprintCommand({ claimId: acquired.envelope.claim_id }, processSprintDependencies(f.root)).exitCode).toBe(0);
  expect(() => runCampaignAcquisition(f.executeInput)).toThrow('live Lease');
});

test('fresh handoff authority drift releases its own lease and persists a refusal', async () => {
  const f = await readyFixture(true); roots.push(f.root, f.home);
  let taskId = '';
  let originalContract = '';
  let contract = '';
  let result: ReturnType<typeof runCampaignAcquisition> | undefined;
  try {
    result = runCampaignAcquisition(f.executeInput, options => acquireNextScheduledEngineerTask({ ...options,
      accept_acquired: acquired => {
        taskId = acquired.envelope.task_id;
        roots.push(acquired.envelope.worktree_path);
        contract = join(f.root, acquired.envelope.plan.contract_path);
        originalContract = readFileSync(contract, 'utf8');
        writeFileSync(contract, originalContract + '\nAuthority drift before first handoff.');
        return options.accept_acquired?.(acquired);
      },
    }));
  } catch (error) { throw new Error('handoff failure must produce a durable typed refusal', { cause: error }); }
  expect(taskId).not.toBe('');
  expect(readLease(f.root, taskId).record).toBeNull();
  expect(result).toMatchObject({ ok: false, error: 'claim_actor_receipt_failed' });
  writeFileSync(contract, originalContract);
  expect(runCampaignAcquisition(f.executeInput)).toEqual(result);
  const next = runCampaignAcquisition({ ...f.executeInput, authorization_id: f.secondAuthorization, idempotency_key: 'after-refused-handoff' });
  expect(next).toMatchObject({ action: 'dispatch' });
  if ('envelope' in next && next.envelope) roots.push(next.envelope.worktree_path);
});

test.each(['shadow', 'foreign'] as const)('fresh handoff refuses %s drift and never releases another owner', async drift => {
  const f = await readyFixture(); roots.push(f.root, f.home);
  let taskId = '';
  let foreignClaim = '';
  const result = runCampaignAcquisition(f.executeInput, options => acquireNextScheduledEngineerTask({ ...options,
    accept_acquired: acquired => {
      const work = acquired.envelope;
      taskId = work.task_id;
      roots.push(work.worktree_path);
      if (drift === 'shadow') {
        const path = join(f.root, '.ai/harness/policy.json');
        const policy = JSON.parse(readFileSync(path, 'utf8'));
        policy.development_campaign.mode = 'shadow';
        writeFileSync(path, JSON.stringify(policy));
        git(f.root, ['add', '.']); git(f.root, ['commit', '-qm', 'shadow before handoff']);
      } else {
        const deps = processSprintDependencies(f.root);
        expect(releaseSprintCommand({ claimId: work.claim_id }, deps).exitCode).toBe(0);
        const claim = claimSprintCommand({ taskId, expectedTaskRevision: work.task_revision, targetRef: 'main', sprintPath: sprint, sessionId: 'other-owner' }, deps);
        expect(claim.exitCode).toBe(0);
        foreignClaim = JSON.parse(claim.stdout).claim_id;
      }
      return options.accept_acquired?.(acquired);
    },
  }));
  expect(result).toMatchObject({ ok: false, error: 'claim_actor_receipt_failed' });
  expect(taskId).not.toBe('');
  const live = readLease(f.root, taskId).record;
  if (drift === 'shadow') expect(live).toBeNull();
  else expect(live?.claim_id).toBe(foreignClaim);
});


test('different authenticated Engineers share the campaign cap across real acquisition processes', async () => {
  const f = await readyFixture(true); roots.push(f.root, f.home);
  const entry = join(import.meta.dir, '../../src/effects/automation/campaign-acquisition.ts');
  const children = [f.executeInput.authorization_id, f.secondAuthorization].map((authorization_id, index) => Bun.spawn([process.execPath, '-e', `
    import { runCampaignAcquisition } from ${JSON.stringify(entry)};
    console.log(JSON.stringify(runCampaignAcquisition(${JSON.stringify({ ...f.executeInput, authorization_id, idempotency_key: `engineer-${index}` })})));
  `], { cwd: f.root, env: f.env, stdout: 'pipe', stderr: 'pipe' }));
  const results = await Promise.all(children.map(async child => {
    const output = await new Response(child.stdout).text(); const stderr = await new Response(child.stderr).text();
    expect(await child.exited, stderr).toBe(0);
    return JSON.parse(output);
  }));
  const dispatched = results.filter(r => r.action === 'dispatch');
  for (const result of dispatched) roots.push(result.envelope.worktree_path);
  expect(dispatched, JSON.stringify(results)).toHaveLength(1);
  expect(results.filter(r => r.action === 'idle'), JSON.stringify(results)).toHaveLength(1);
  const winner = dispatched[0]!;
  expect(readLease(f.root, winner.envelope.task_id).record?.claim_id).toBe(winner.envelope.claim_id);
  expect(releaseSprintCommand({ claimId: winner.envelope.claim_id }, processSprintDependencies(f.root)).exitCode).toBe(0);
  const loser = winner.receipt.engineer_id.endsWith('.second') ? f.executeInput.authorization_id : f.secondAuthorization;
  const next = runCampaignAcquisition({ ...f.executeInput, authorization_id: loser, idempotency_key: loser === f.executeInput.authorization_id ? 'engineer-0' : 'engineer-1' });
  expect(next, JSON.stringify(next)).toMatchObject({ action: 'dispatch' });
  if ('envelope' in next && next.envelope) roots.push(next.envelope.worktree_path);
});

test('real Engineer acquire-next skips a full campaign for later unrelated ready work', async () => {
  const f = await readyFixture(true); roots.push(f.root, f.home);
  const taskId = 'e'.repeat(64);
  const task = 'Unrelated ready repair';
  const plan = 'plans/plan-unrelated.md';
  const contract = 'tasks/contracts/unrelated.contract.md';
  const sprintPath = join(f.root, sprint);
  writeFileSync(sprintPath, readFileSync(sprintPath, 'utf8').replace('\n## Execution Log', `\n| 3 | ${taskId} | [ ] | ${task} | contract | Unrelated repair passes | (pending) |\n\n## Execution Log`));
  const graphPath = join(f.root, 'plans/sprints/repair.work-graph.v1.json');
  const graph = JSON.parse(readFileSync(graphPath, 'utf8'));
  const campaignTask = graph.work_packages[0].task_id;
  graph.work_packages.push({ ...graph.work_packages[0], work_package_id: 'unrelated-ready', task_id: taskId, priority: 0, depends_on: [] });
  writeFileSync(graphPath, JSON.stringify(graph));
  writeFileSync(join(f.root, plan), readFileSync(join(f.root, 'plans/plan-repair-0.md'), 'utf8')
    .replace(/^> \*\*Source Ref\*\*: .*$/m, `> **Source Ref**: sprint:${sprint}#${task}`)
    .replace('tasks/contracts/repair-0.contract.md', contract));
  writeFileSync(join(f.root, contract), readFileSync(join(f.root, 'tasks/contracts/repair-0.contract.md'), 'utf8').replace('plans/plan-repair-0.md', plan));
  git(f.root, ['add', '.']); git(f.root, ['commit', '-qm', 'unrelated canonical ready task']);

  const winner = runCampaignAcquisition({ ...f.executeInput, authorization_id: f.secondAuthorization, idempotency_key: 'fill-capacity' });
  expect(winner).toMatchObject({ action: 'dispatch' });
  if ('envelope' in winner && winner.envelope) roots.push(winner.envelope.worktree_path);
  const principal = resolveEngineerPrincipal({ repo_root: f.root, authorization_id: f.executeInput.authorization_id, env: f.env });
  expect(collectEngineerOffers({ repo_root: f.root, principal, env: f.env }).offers.map(offer => offer.task_id)).toEqual([campaignTask, taskId]);
  const input = { repo_root: f.root, principal, env: f.env, session_id: 'parent', idempotency_key: 'unrelated-next' };
  const acquired = acquireNextScheduledEngineerTask(input);
  expect(acquired, JSON.stringify(acquired)).toMatchObject({ ok: true, envelope: { task_id: taskId } });
  if (acquired.ok) {
    roots.push(acquired.envelope.worktree_path);
    expect(readLease(f.root, taskId).record).toMatchObject({ state: 'bound', claim_id: acquired.envelope.claim_id });
    expect(acquireNextScheduledEngineerTask(input)).toEqual(acquired);
  }
  expect(readLease(f.root, campaignTask).record).toBeNull();
});


test('canonical group without local authority cannot disappear from campaign capacity accounting', async () => {
  const f = await fixture();
  const groupOne = join(f.root, `tasks/campaigns/${f.intent.campaign_id}/group-1.issues.json`);
  const groupTwo = join(f.root, `tasks/campaigns/${f.intent.campaign_id}/group-2.issues.json`);
  writeFileSync(groupTwo, readFileSync(groupOne));
  git(f.root, ['add', '.']); git(f.root, ['commit', '-qm', 'unavailable group authority']);
  expect(() => withCampaignCapacity(f.root, f.tasks[0]!.task_id, 'main', f.env, () => f.claim(0))).toThrow('group authority is unavailable');
  expect(readLease(f.root, f.tasks[0]!.task_id).record).toBeNull();
});

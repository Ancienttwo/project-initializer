import { afterEach, expect, test } from 'bun:test';
import { execFileSync } from 'child_process';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { historicalPlanningFixture, installHistoricalBoundDispatch } from '../helpers/historical-campaign-lifecycle';
import { runCampaignAcquisition } from '../../src/effects/automation/campaign-acquisition';
import { withCampaignCapacity } from '../../src/effects/automation/campaign-capacity';
import { ensureCampaignAuthoringBudget, readAutomationBudgetStatus } from '../../src/effects/automation/budget-store';
import { requireCampaignPlanningAuthority } from '../../src/effects/automation/campaign-planning-proof';
import { readLease } from '../../src/effects/state/coordination-lease-store';
import { resolveEngineerPrincipal } from '../../src/effects/engineers/principal';
import { collectEngineerOffers } from '../../src/effects/engineers/scheduling';
import { acquireNextScheduledEngineerTask } from '../../src/effects/engineers/scheduling-acquire-next';
import { validateFleetWorkEnvelope } from '../../src/effects/fleet/acquire';
import { validateClaimActorReceiptLive } from '../../src/effects/engineers/claim-actor-store';
const roots: string[] = [];
afterEach(() => roots.splice(0).forEach(root => rmSync(root, { recursive: true, force: true })));
const sprint = 'plans/sprints/repair.sprint.md';
const git = (root: string, args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

test('new acquisition and repeated request refuse before budget, callback or Lease mutation', async () => {
  const f = await historicalPlanningFixture(); roots.push(f.root, f.home);
  const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env }).budget;
  const before = readAutomationBudgetStatus(f.root, budget.automation_run_id, f.env);
  let invoked = 0;
  for (const idempotency_key of ['execute', 'execute', 'new-request']) {
    expect(() => runCampaignAcquisition({ ...f.executeInput, idempotency_key }, () => { invoked++; throw new Error('unexpected acquire'); })).toThrow('trusted exact revision readback');
  }
  expect(invoked).toBe(0);
  expect(readAutomationBudgetStatus(f.root, budget.automation_run_id, f.env)).toEqual(before);
  const authority = requireCampaignPlanningAuthority(f.root, f.intent, f.env);
  for (const task of authority.manifest.slots) expect(readLease(f.root, task.task_id).record).toBeNull();
});

test('generic campaign claim actuator cannot bypass the readiness projection', async () => {
  const f = await historicalPlanningFixture(); roots.push(f.root, f.home);
  const task = requireCampaignPlanningAuthority(f.root, f.intent, f.env).manifest.slots[0]!.task_id;
  let claims = 0;
  expect(() => withCampaignCapacity(f.root, task, 'main', f.env, () => { claims++; })).toThrow('trusted exact revision readback');
  expect(claims).toBe(0); expect(readLease(f.root, task).record).toBeNull();
  expect(withCampaignCapacity(f.root, 'f'.repeat(64), 'main', f.env, () => 'unrelated')).toBe('unrelated');
});

test('historical bound envelope and actor remain valid without admitting another dispatch', async () => {
  const f = await historicalPlanningFixture(); roots.push(f.root, f.home);
  const d = installHistoricalBoundDispatch(f);
  expect(() => validateFleetWorkEnvelope(f.root, d.envelope, f.env)).not.toThrow();
  expect(() => validateClaimActorReceiptLive(f.root, d.receipt, d.envelope)).not.toThrow();
  const before = readLease(f.root, d.envelope.task_id);
  expect(() => runCampaignAcquisition(f.executeInput)).toThrow('trusted exact revision readback');
  expect(readLease(f.root, d.envelope.task_id)).toEqual(before);
});

test('two OS callers cannot allocate campaign Claims under the frozen admission boundary', async () => {
  const f = await historicalPlanningFixture(true); roots.push(f.root, f.home);
  const entry = join(import.meta.dir, '../../src/effects/automation/campaign-acquisition.ts');
  const children = [f.executeInput.authorization_id, f.secondAuthorization].map(authorization_id => Bun.spawn([process.execPath, '-e', `
    import { runCampaignAcquisition } from ${JSON.stringify(entry)};
    try { runCampaignAcquisition(${JSON.stringify({ ...f.executeInput, authorization_id })}); process.exit(2); }
    catch (error) { if (!String(error).includes('trusted exact revision readback')) throw error; }
  `], { cwd: f.root, env: f.env, stdout: 'pipe', stderr: 'pipe' }));
  for (const child of children) expect(await child.exited, await new Response(child.stderr).text()).toBe(0);
  for (const task of requireCampaignPlanningAuthority(f.root, f.intent, f.env).manifest.slots) expect(readLease(f.root, task.task_id).record).toBeNull();
});

test('real Engineer acquire-next skips a campaign with unavailable revision admission for later unrelated ready work', async () => {
  const f = await historicalPlanningFixture(true); roots.push(f.root, f.home);
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

  const principal = resolveEngineerPrincipal({ repo_root: f.root, authorization_id: f.executeInput.authorization_id, env: f.env });
  expect(collectEngineerOffers({ repo_root: f.root, principal, env: f.env }).offers.map(offer => offer.task_id)).toEqual([taskId]);
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
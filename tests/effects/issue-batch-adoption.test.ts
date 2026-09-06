import { createAdoptionRepository } from '../helpers/campaign-adoption-repository';
import { buildProviderIssueObservation, buildExternalSourceRefreshReceipt } from '../../src/core/external-sources/issue-observation';
import { afterEach, describe, expect, spyOn, test } from 'bun:test';
import * as fs from 'fs';
import { execFileSync } from 'child_process';
import { createHash } from 'crypto';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { sealProgramAuthorization, validateAutomationReservation } from '../../src/core/automation/budget';
import { buildDevelopmentCampaignDefinition } from '../../src/core/automation/development-campaign';
import { createDevelopmentCampaign, appendDevelopmentCampaignEvent } from '../../src/effects/automation/development-campaign-store';
import { mintProgramAuthorization } from '../../src/effects/automation/grant-store';
import { repoHarnessRepoIdFor } from '../../src/effects/repo-registry';
import { startIssueBatchAuthoring } from '../../src/effects/automation/gpt-pro-issue-authoring';
import { adoptIssueBatch, type IssueBatchAdoptionDependencies } from '../../src/effects/automation/issue-batch-adoption';
import { readIssueBatchAdoptionArtifact } from '../../src/effects/automation/issue-batch-store';
import { observeIssueBatch } from '../../src/effects/automation/issue-batch-observer';
import { readCampaignBudgetLedger, readCampaignAuthoringReadonlyContinuation } from '../../src/effects/automation/budget-store';
import type { GithubCommandRunner } from '../../src/effects/external-sources/github';
import { AUTOMATION_BUDGET_STORE_RELATIVE_ROOT, appendAutomationUsage, reconcileAutomationReservation, ensureCampaignAuthoringBudget, readCampaignAuthoringBudgetTerminal, reserveCampaignAuthoringBudget } from '../../src/effects/automation/budget-store';
import { makeSnapshot, AT, CAP, policy } from '../helpers/issue-batch-adoption-fixture';
const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
const SPRINT = 'plans/sprints/repair.sprint.md';
test('publication recovery completes durable observation bookkeeping before fresh verification', async () => {
  const f = await fixture();
  await adoptIssueBatch({ ...f.input, dry_run: true }, f.deps);
  const link = fs.linkSync;
  const fault = spyOn(fs, 'linkSync').mockImplementation((from, to) => {
    if (String(to).includes('/events/') && JSON.parse(fs.readFileSync(from, 'utf8')).kind === 'repo-harness-campaign-budget-step-completion') {
      throw new Error('injected completion persistence failure');
    }
    return link(from, to);
  });
  try { await expect(adoptIssueBatch(f.input, f.deps)).rejects.toThrow(); }
  finally { fault.mockRestore(); }
  let observations = 0;
  const result = await adoptIssueBatch(f.input, { ...f.deps, observe: () => { observations++; return makeSnapshot(f.intent); } });
  expect(result.publication).not.toBeNull();
  expect(observations).toBe(1);
}, 60_000);
function git(root: string, args: string[]) { return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim(); }
async function fixture(mode: 'shadow' | 'active' = 'active', rounds = 1, maxProviderCalls = 100) {
  const f = await createAdoptionRepository(mode, rounds, undefined, {}, {}, { max_provider_calls: maxProviderCalls });
  roots.push(f.root, f.home);
  return f;
}
function terminal(f: Awaited<ReturnType<typeof fixture>>) {
  const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env });
  return readCampaignAuthoringReadonlyContinuation({ repo_root: f.root, automation_run_id: budget.budget.automation_run_id, expected_budget_sha256: budget.budget.budget_sha256, campaign_id: f.intent.campaign_id, group_number: 1, intent_sha256: f.intent.intent_sha256, env: f.env })?.terminal ?? null;
}
describe('BRC6 budgeted challenge and adoption', () => {
  test('unknown active read keeps its reservation and replay performs no I/O', async () => {
    const f = await fixture(); let calls = 0;
    const deps = { ...f.deps, observe: observeIssueBatch, runner: () => { calls++; throw new Error('unknown transport result'); } };
    await expect(adoptIssueBatch(f.input, deps)).rejects.toThrow();
    const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env });
    expect(budget.current.open_reservation_sha256s).toHaveLength(1);
    await expect(adoptIssueBatch(f.input, deps)).rejects.toThrow();
    expect(calls).toBe(1);
    expect(readIssueBatchAdoptionArtifact(f.root, f.intent, 'adoption')).toBeNull();
  });
  test('active provider cap refuses observation before I/O', async () => {
    const f = await fixture('active', 1, 2); let calls = 0;
    const deps = { ...f.deps, observe: observeIssueBatch, runner: () => { calls++; return { stdout: '{}' }; } };
    await expect(adoptIssueBatch(f.input, deps)).rejects.toThrow();
    expect(calls).toBe(0);
    expect(readIssueBatchAdoptionArtifact(f.root, f.intent, 'adoption')).toBeNull();
  });
  test('real adoption observations reserve each GitHub invocation before and after seal', async () => {
    const f = await fixture();
    const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env }).budget;
    const before = readCampaignBudgetLedger(f.root, budget.automation_run_id, f.env).provider_calls;
    const snapshot = makeSnapshot(f.intent);
    let calls = 0;
    const runner: GithubCommandRunner = args => {
      calls++;
      const endpoint = args[3]!;
      return { stdout: JSON.stringify(endpoint === 'repos/acme/widgets'
        ? { id: 100, full_name: 'acme/widgets', html_url: 'https://github.com/acme/widgets' }
        : snapshot.observations.map((o, index) => ({ id: Number(o.provider_issue_id), number: index + 1, html_url: o.url,
          created_at: o.provider_created_at, updated_at: o.provider_updated_at, state: o.state, title: o.title,
          body: o.body, labels: [{ name: 'campaign' }], assignees: [] }))) };
    };
    const deps = { ...f.deps, runner,
      observe: (options: Parameters<typeof observeIssueBatch>[0]) => observeIssueBatch({ ...options, runner: options.runner ?? runner }) };
    const result = await adoptIssueBatch(f.input, deps);
    expect(result.receipt.issues).toHaveLength(2);
    expect(calls).toBe(4);
    // One challenge plus repository identity and issue page for each of the two probes.
    expect(readCampaignBudgetLedger(f.root, budget.automation_run_id, f.env).provider_calls - before).toBe(5);
    expect(terminal(f)).not.toBeNull();
  }, 60_000);
  test('challenge completes before seal; full batch seals early and replay makes no provider calls', async () => {
    const f = await fixture('active', 3);
    const result = await adoptIssueBatch(f.input, f.deps);
    expect(result.receipt.issues).toHaveLength(2); expect(result.publication).not.toBeNull(); expect(f.calls()).toBe(1);
    expect(terminal(f)?.reason).toBe('authoring_completed'); expect(terminal(f)?.completed_authoring_rounds).toBe(1);
    expect(await adoptIssueBatch(f.input, f.deps)).toEqual(result); expect(f.calls()).toBe(1);
    git(f.root, ['update-ref', 'refs/heads/main', result.publication!.materialized_commit, f.intent.base_main_sha]);
    expect(await adoptIssueBatch(f.input, f.deps)).toEqual(result); expect(f.calls()).toBe(1);
  });
  test('partial batch adopts only after exhaustion and shadow dry-run publishes no ref', async () => {
    const f = await fixture('shadow');
    const result = await adoptIssueBatch({ ...f.input, dry_run: true }, { ...f.deps, observe: () => makeSnapshot(f.intent, ['01']) });
    expect(result.receipt.unfilled_slots).toEqual(['02']); expect(result.publication).toBeNull(); expect(terminal(f)?.reason).toBe('authoring_exhausted');
    expect(git(f.root, ['for-each-ref', '--format=%(refname)', 'refs/heads'])).toBe('refs/heads/main');
    expect(readIssueBatchAdoptionArtifact(f.root, f.intent, 'publication')).toBeNull();
  });
  test('partial batch cannot use completed terminal before rounds are exhausted', async () => {
    const f = await fixture('active', 3);
    await expect(adoptIssueBatch(f.input, { ...f.deps, observe: () => makeSnapshot(f.intent, ['01']) })).rejects.toThrow();
    expect(terminal(f)).toBeNull(); expect(readIssueBatchAdoptionArtifact(f.root, f.intent, 'publication')).toBeNull();
  });
  test('unknown browser result cannot settle, seal or invoke again', async () => {
    const f = await fixture(); let calls = 0;
    const deps = { ...f.deps, followup: async () => { calls++; return { sessionId: 'unknown', status: 'recoverable' as const, meta: { model: { verified: true } } }; } };
    await expect(adoptIssueBatch(f.input, deps)).rejects.toThrow('unresolved');
    await expect(adoptIssueBatch(f.input, deps)).rejects.toThrow('unresolved'); expect(calls).toBe(1); expect(terminal(f)).toBeNull();
  });
  test('source main drift and shadow publication reject before challenge', async () => {
    const f = await fixture('shadow'); await expect(adoptIssueBatch(f.input, f.deps)).rejects.toThrow('mode'); expect(f.calls()).toBe(0);
    git(f.root, ['commit', '--allow-empty', '-qm', 'move']);
    await expect(adoptIssueBatch({ ...f.input, dry_run: true }, f.deps)).rejects.toThrow(); expect(f.calls()).toBe(0);
  });
  test('in-flight authoring prevents seal even with correct challenge and complete snapshot', async () => {
    const f = await fixture('active', 3); const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env });
    reserveCampaignAuthoringBudget({ repo_root: f.root, automation_run_id: budget.budget.automation_run_id, expected_budget_sha256: budget.budget.budget_sha256, campaign_id: f.intent.campaign_id, group_number: 1, intent_sha256: f.intent.intent_sha256, operation: 'edit_issue', idempotency_key: 'inflight', env: f.env });
    await expect(adoptIssueBatch(f.input, f.deps)).rejects.toThrow(); expect(terminal(f)).toBeNull();
  });
});

test('missing exact-main policy fails before provider invocation', async () => {
  const f = await fixture();
  await expect(adoptIssueBatch({ ...f.input, publication_policy_path: 'missing.json' }, f.deps)).rejects.toThrow();
  expect(f.calls()).toBe(0);
});
test('source edits after final seal cannot become a new adoption baseline', async () => {
  const f = await fixture(); let observations = 0;
  await expect(adoptIssueBatch(f.input, { ...f.deps, observe: () => makeSnapshot(f.intent, f.intent.slots, ++observations === 1 ? {} : { priority: 99 }) })).rejects.toThrow();
  expect(readIssueBatchAdoptionArtifact(f.root, f.intent, 'publication')).toBeNull();
});

test('recoverable challenge reads its exact completed session without another admission', async () => {
  const f = await fixture(); let calls = 0;
  const deps = { ...f.deps, followup: async () => { calls++; return { sessionId: 'recoverable', status: 'recoverable' as const, meta: { model: { verified: true } } }; } };
  await expect(adoptIssueBatch(f.input, deps)).rejects.toThrow('unresolved');
  const challenge = readIssueBatchAdoptionArtifact(f.root, f.intent, 'challenge')!;
  const response = JSON.stringify({ base_main_sha: f.intent.base_main_sha, answers: (challenge.targets as { expected: string }[]).map(t => t.expected) });
  const result = await adoptIssueBatch(f.input, { ...deps, readSession: () => ({ output: response, meta: { repo: f.root, sessionId: 'recoverable', sourceSessionId: 'initial', status: 'completed', model: { verified: true }, browser: { profileDirectory: 'Profile 1' } } }) });
  expect(result.receipt.connector_evidence).toBe('challenge_verified'); expect(calls).toBe(1);
});

test('explicit not-started reconciliation permits one replacement with the same request key', async () => {
  const f = await fixture();
  await expect(adoptIssueBatch(f.input, { ...f.deps, followup: async () => { throw new Error('not started'); } })).rejects.toThrow('not started');
  const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env });
  const directory = join(f.root, '.git', AUTOMATION_BUDGET_STORE_RELATIVE_ROOT, 'runs', budget.budget.automation_run_id, 'reservations');
  const reservations = readdirSync(directory).filter(name => name.endsWith('.json')).map(name => validateAutomationReservation(JSON.parse(readFileSync(join(directory, name), 'utf8'))));
  const held = reservations.find(r => 'campaign_context' in r && r.campaign_context.operation === 'challenge')!;
  await expect(adoptIssueBatch(f.input, f.deps)).rejects.toThrow('reconcile'); expect(f.calls()).toBe(0);
  reconcileAutomationReservation({ repo_root: f.root, reservation: held, resolution: 'reconciled_not_started', outcome: 'no_progress', reason: 'fixture transport rejected before external execution', evidence_refs: [{ ref: 'provider-run:not-started', sha256: 'e'.repeat(64) }], env: f.env });
  const results = await Promise.allSettled([adoptIssueBatch(f.input, f.deps), adoptIssueBatch(f.input, f.deps)]);
  expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1); expect(f.calls()).toBe(1);
  expect(terminal(f)?.completed_authoring_rounds).toBe(1);
});

 test.each(['title', 'labels'] as const)('post-seal %s mutation is rejected, including retry against the changed source', async field => {
  const f = await fixture(); let calls = 0;
  const changed = () => {
    const snapshot = makeSnapshot(f.intent);
    const observations = snapshot.observations.map(o => {
      const { protocol, kind, observation_sha256, source_revision, ...raw } = o;
      return buildProviderIssueObservation({ ...raw, ...(field === 'title' ? { title: 'human revised title' } : { labels: ['human-label'] }) });
    });
    const { protocol, kind, receipt_sha256, ...rawReceipt } = snapshot.receipt;
    return { observations, receipt: buildExternalSourceRefreshReceipt({ ...rawReceipt, source_revisions: observations.map(o => o.source_revision).sort() }) };
  };
  const deps = { ...f.deps, observe: () => ++calls === 1 ? makeSnapshot(f.intent) : changed() };
  await expect(adoptIssueBatch(f.input, deps)).rejects.toThrow('sources changed');
  expect(terminal(f)).not.toBeNull();
  await expect(adoptIssueBatch(f.input, deps)).rejects.toThrow();
  expect(readIssueBatchAdoptionArtifact(f.root, f.intent, 'publication')).toBeNull();
 });

test('premature partial adoption can resume after an authorized fill completes', async () => {
  const f = await fixture('active', 3);
  await expect(adoptIssueBatch(f.input, { ...f.deps, observe: () => makeSnapshot(f.intent, ['01']) })).rejects.toThrow();
  expect(terminal(f)).toBeNull();
  const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env });
  const admission = reserveCampaignAuthoringBudget({ repo_root: f.root, automation_run_id: budget.budget.automation_run_id, expected_budget_sha256: budget.budget.budget_sha256, campaign_id: f.intent.campaign_id, group_number: 1, intent_sha256: f.intent.intent_sha256, operation: 'fill_missing', idempotency_key: 'authorized-fill', env: f.env });
  expect(admission.disposition).toBe('reserved');
  appendAutomationUsage({ repo_root: f.root, reservation: admission.reservation, outcome: 'progress', evidence_refs: [{ ref: 'provider-run:authorized-fill', sha256: 'a'.repeat(64) }], env: f.env });
  const result = await adoptIssueBatch(f.input, f.deps);
  expect(result.receipt.issues).toHaveLength(2); expect(terminal(f)?.completed_authoring_rounds).toBe(2); expect(f.calls()).toBe(1);
});
test('crash after seal resumes from its staged source set', async () => {
  const f = await fixture(); let calls = 0;
  await expect(adoptIssueBatch(f.input, { ...f.deps, observe: () => { if (++calls === 2) throw new Error('crash after seal'); return makeSnapshot(f.intent); } })).rejects.toThrow('crash after seal');
  expect(terminal(f)).not.toBeNull();
  expect((await adoptIssueBatch(f.input, f.deps)).receipt.issues).toHaveLength(2); expect(f.calls()).toBe(1);
});

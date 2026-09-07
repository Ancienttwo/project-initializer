import { test, expect, afterEach } from 'bun:test';
import { execFileSync } from 'child_process';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createAdoptionRepository } from '../helpers/campaign-adoption-repository';
import { installHistoricalAdoption } from '../helpers/historical-campaign-lifecycle';
import { readDevelopmentCampaignStatus, appendDevelopmentCampaignEvent } from '../../src/effects/automation/development-campaign-store';
import {
  buildCampaignGroupSnapshot,
  persistCampaignGroupSnapshot,
  runCampaignFreshAudit,
  resolveCampaignGroupBaseline,
} from '../../src/effects/automation/campaign-fresh-audit';
import { withCampaignPlanningLock, persistPlanningRecord } from '../../src/effects/automation/campaign-planning-store';
import { campaignCloseoutKey } from '../../src/core/automation/campaign-closeout';
import { canonicalMessageDigest } from '../../src/core/messages/mechanics';
import { ensureCampaignAuthoringBudget, readCampaignBudgetLedger } from '../../src/effects/automation/budget-store';
import { listIssueAuthoringSessions } from '../../src/effects/automation/issue-batch-store';
const roots: string[] = [];
afterEach(() => {
  for (const p of roots.splice(0)) rmSync(p, { recursive: true, force: true });
});
const git = (root: string, args: string[]) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
async function fixture(cleanup = true) {
  const f = await createAdoptionRepository(
    'active',
    1,
    undefined,
    {},
    {},
    { max_provider_calls: 20, max_provider_failures: 10, max_agent_turns: 30, max_runner_invocations: 30 },
  );
  roots.push(f.root, f.home);
  const status = readDevelopmentCampaignStatus(f.root, f.intent.campaign_id, f.env);
  appendDevelopmentCampaignEvent({
    repo_root: f.root,
    campaign_id: f.intent.campaign_id,
    operation: 'start_group',
    expected_current_sha256: status.current.current_sha256,
    idempotency_key: 'start-audit-group',
    observed_at: new Date().toISOString(),
    env: f.env,
  });
  const publication = installHistoricalAdoption(f);
  git(f.root, ['merge', '--ff-only', publication.materialized_commit]);
  const manifest = JSON.parse(git(f.root, ['show', `${publication.materialized_commit}:${publication.manifest_path}`]));
  // Synthetic historical completion, never current active-admission evidence.
  if (cleanup)
    withCampaignPlanningLock(f.root, f.intent, () => {
      for (const row of manifest.slots)
        persistPlanningRecord(f.root, f.intent, campaignCloseoutKey(row.task_id, 'complete'), {
          protocol: 1,
          kind: 'repo-harness-campaign-cleanup',
          disposition: 'not_planned',
          decision_sha256: canonicalMessageDigest({ task: row.task_id }),
          execution_topology: null,
          task_id: row.task_id,
          task_revision: 'c'.repeat(64),
        });
    });
  const input = {
    repo_root: f.root,
    campaign_id: f.intent.campaign_id,
    group_number: 1,
    intent_sha256: f.intent.intent_sha256,
    idempotency_key: 'audit-1',
    env: f.env,
  };
  const binding = () => ({
    path: 'fixture',
    binding: { version: 1 as const, profileDir: '/fixture/profile', profileDirectory: f.authorization.campaign!.chrome_profile_directory },
    error: undefined,
  });
  return { ...f, input, binding, publication };
}
test('fresh audit uses current default/GitHub, charges after authoring sealed, and replays without I/O', async () => {
  const f = await fixture();
  let calls = 0;
  const deps = {
    readBinding: f.binding,
    consult: async (input: any) => {
      calls++;
      expect(input.chatgptApp).toBe('GitHub');
      expect(input.model).toBeUndefined();
      expect(input.thinkingTime).toBeUndefined();
      expect(input.sessionId).toBeUndefined();
      return {
        sessionId: 'audit-new',
        status: 'completed' as const,
        meta: { model: { verified: false } },
        output: JSON.stringify({
          protocol: 1,
          disposition: 'accepted',
          observed_main_sha: git(f.root, ['rev-parse', 'HEAD']),
          slots: ['01', '02'],
          findings: [],
        }),
      };
    },
  };
  const result = await runCampaignFreshAudit(f.input, deps);
  expect(result.observation.disposition).toBe('unverified');
  expect(result.snapshot.slots).toHaveLength(2);
  expect(readDevelopmentCampaignStatus(f.root, f.intent.campaign_id, f.env).current.state).toBe('group_auditing');
  const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env });
  const before = readCampaignBudgetLedger(f.root, budget.budget.automation_run_id, f.env);
  expect(
    (
      await runCampaignFreshAudit(f.input, {
        ...deps,
        readBinding: () => {
          throw new Error('replay must not need a browser');
        },
      })
    ).replayed,
  ).toBe(true);
  expect(calls).toBe(1);
  expect(readCampaignBudgetLedger(f.root, budget.budget.automation_run_id, f.env)).toEqual(before);
  const status = readDevelopmentCampaignStatus(f.root, f.intent.campaign_id, f.env);
  expect(() =>
    appendDevelopmentCampaignEvent({
      repo_root: f.root,
      campaign_id: f.intent.campaign_id,
      operation: 'accept_group',
      expected_current_sha256: status.current.current_sha256,
      idempotency_key: 'accept',
      evidence_refs: [result.observation.observation_sha256],
      observed_at: new Date().toISOString(),
      env: f.env,
    }),
  ).toThrow('trusted exact-version');
  expect(() => resolveCampaignGroupBaseline(f.root, status.campaign, status.events, 2, f.env)).toThrow('current lifecycle group');
}, 60000);
test('missing cleanup and stale snapshot fail before audit dispatch', async () => {
  const f = await fixture(false);
  expect(() => buildCampaignGroupSnapshot(f.root, f.intent, f.env)).toThrow('cleanup');
}, 60000);
test.each(['reused', 'malformed', 'wrong-sha', 'pending'])(
  'audit outcome %s never advances',
  async (mode) => {
    const f = await fixture();
    const source = listIssueAuthoringSessions(f.root, f.intent.campaign_id, 1)[0]!;
    let calls = 0;
    const deps = {
      readBinding: f.binding,
      consult: async () => {
        calls++;
        return {
          sessionId: mode === 'reused' ? source.session_ref : 'new',
          status: mode === 'pending' ? ('running' as const) : ('completed' as const),
          meta: { model: { verified: false } },
          output:
            mode === 'malformed'
              ? 'invalid'
              : JSON.stringify({
                  protocol: 1,
                  disposition: 'accepted',
                  observed_main_sha: 'f'.repeat(40),
                  slots: ['01', '02'],
                  findings: [],
                }),
        };
      },
    };
    if (mode === 'wrong-sha') {
      expect((await runCampaignFreshAudit(f.input, deps)).observation.disposition).toBe('unverified');
    } else await expect(runCampaignFreshAudit(f.input, deps)).rejects.toThrow();
    expect(readDevelopmentCampaignStatus(f.root, f.intent.campaign_id, f.env).current.state).toBe('group_auditing');
    if (mode === 'pending') {
      await expect(runCampaignFreshAudit(f.input, deps)).rejects.toThrow('do not repeat provider I/O');
      await expect(runCampaignFreshAudit({ ...f.input, idempotency_key: 'another-audit' }, deps)).rejects.toThrow(
        'reconciliation_required',
      );
      expect(calls).toBe(1);
    }
  },
  60000,
);
test('stale stored snapshot and opaque audit references cannot change lifecycle', async () => {
  const f = await fixture();
  const snapshot = buildCampaignGroupSnapshot(f.root, f.intent, f.env);
  persistCampaignGroupSnapshot(f.root, f.intent, snapshot);
  writeFileSync(join(f.root, 'advance.txt'), 'main advanced');
  git(f.root, ['add', 'advance.txt']);
  git(f.root, ['commit', '-qm', 'advance']);
  const status = readDevelopmentCampaignStatus(f.root, f.intent.campaign_id, f.env);
  const request = {
    repo_root: f.root,
    campaign_id: f.intent.campaign_id,
    operation: 'begin_group_audit' as const,
    expected_current_sha256: status.current.current_sha256,
    idempotency_key: 'stale-audit',
    observed_at: new Date().toISOString(),
    env: f.env,
  };
  expect(() => appendDevelopmentCampaignEvent({ ...request, evidence_refs: [snapshot.snapshot_sha256] })).toThrow('snapshot is stale');
  expect(() => appendDevelopmentCampaignEvent({ ...request, evidence_refs: ['opaque'] })).toThrow('snapshot reference');
  expect(readDevelopmentCampaignStatus(f.root, f.intent.campaign_id, f.env).current).toEqual(status.current);
}, 60000);

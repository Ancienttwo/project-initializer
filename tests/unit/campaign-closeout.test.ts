import { expect, test } from 'bun:test';
import { campaignIssueMembers, allCampaignIssueTasksMerged, assertCampaignCleanupReceipt, validateCampaignNotPlannedDecision } from '../../src/core/automation/campaign-closeout';
import type { CampaignIssueAdoptionV1 } from '../../src/core/automation/issue-batch-adoption';
import { buildPublicationIntegrationObservation } from '../../src/core/publication/publication-lifecycle';

const sha = (letter: string) => `sha256:${letter.repeat(64)}`;
const issue: CampaignIssueAdoptionV1 = { slot: 'one', provider_issue_id: '123', issue_number: 1, source_observation_sha256: sha('a'),
  title_sha256: sha('b'), body_sha256: sha('c'), issue_kind: 'bugfix', primary_capability: 'capability.fixture', priority: 1, depends_on_slots: [], suspected_paths: ['src/index.ts'] };
function proof(taskId: string) {
  return { integration_state: 'merged', merge_commit_sha: 'a'.repeat(40), evidence: buildPublicationIntegrationObservation({
    publication_id: sha('a'), receipt_sha256: sha('b'), task_id: taskId, task_revision: 'c'.repeat(64), claim_id: 'claim', generation: 1,
    head_sha: 'd'.repeat(40), target_ref: 'main', fetched_target_oid: 'e'.repeat(40), observation_ref: 'refs/repo-harness/observations/test',
    provider_pr_number: 1, provider_state: 'MERGED', provider_merged_at: '2026-09-07T00:00:00Z', integration_state: 'merged',
  }) };
}

test('every Task mapped to an Issue must have its own real merge evidence', () => {
  const first = 'a'.repeat(64); const second = 'b'.repeat(64);
  const joined = campaignIssueMembers({ issues: [issue], slots: [
    { slot: 'one', task_id: first, work_package_id: 'wp-one' }, { slot: 'one', task_id: second, work_package_id: 'wp-two' },
  ] }, '123');
  expect(joined.members).toHaveLength(2);
  expect(allCampaignIssueTasksMerged([first, second], [proof(first), null])).toBe(false);
  expect(allCampaignIssueTasksMerged([first, second], [proof(first), proof(first)])).toBe(false);
  expect(allCampaignIssueTasksMerged([first, second], [proof(first), proof(second)])).toBe(true);
  expect(() => campaignIssueMembers({ issues: [issue, { ...issue, slot: 'two', body_sha256: sha('d') }], slots: joined.members }, '123')).toThrow('conflicting source');
});

test('a cleanup label without its disposition proof never unlocks a group', () => {
  expect(() => assertCampaignCleanupReceipt({ protocol: 1, kind: 'repo-harness-campaign-cleanup', task_id: 'a'.repeat(64), task_revision: 'b'.repeat(64) }, 'a'.repeat(64))).toThrow('fields differ');
  expect(() => validateCampaignNotPlannedDecision({ outcome: 'not_reproducible', evidence_refs: ['anything'] })).toThrow('fields differ');
});

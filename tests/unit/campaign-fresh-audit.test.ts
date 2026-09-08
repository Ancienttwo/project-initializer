import { test, expect } from 'bun:test';
import {
  campaignGroupProgress,
  sealCampaignGroupSnapshot,
  parseCampaignAuditAnswer,
  sealCampaignFreshAuditObservation,
  validateCampaignFreshAuditObservation,
  validateCampaignGroupSnapshot,
} from '../../src/core/automation/campaign-fresh-audit';
import type { DevelopmentCampaignEventV1 } from '../../src/core/automation/development-campaign';
import { canonicalMessageDigest, messageSha256 } from '../../src/core/messages/mechanics';
import {
  campaignProviderForOperation,
  campaignProviderCallReservation,
  isCampaignAuthoringOperation,
  validateCampaignAutomationReservationContext,
} from '../../src/core/automation/budget';
const sha = 'sha256:' + 'a'.repeat(64),
  oid = 'b'.repeat(40);
const snapshot = () =>
  sealCampaignGroupSnapshot({
    campaign_id: 'c',
    group_number: 1,
    intent_sha256: sha,
    provider_repository: 'owner/repo',
    target_ref: 'refs/heads/main',
    expected_final_main_sha: oid,
    adoption_sha256: sha,
    publication_sha256: sha,
    slots: Array.from({ length: 10 }, (_, i) => ({
      slot: String(i + 1).padStart(2, '0'),
      disposition: 'unfilled' as const,
      task_id: null,
      cleanup_sha256: null,
      merge_commit_sha: null,
    })),
  });
const events = (operations: string[]) => operations.map((operation) => ({ operation }) as DevelopmentCampaignEventV1);
test('audit budget is one provider call and never an authoring round', () => {
  expect(campaignProviderForOperation('audit')).toBe('gpt-pro');
  expect(campaignProviderCallReservation('audit')).toBe(1);
  expect(isCampaignAuthoringOperation('audit')).toBe(false);
  expect(
    validateCampaignAutomationReservationContext({
      campaign_id: 'c',
      group_number: 1,
      intent_sha256: sha,
      step_admission_sha256: null,
      operation: 'audit',
    }).operation,
  ).toBe('audit');
});
test('group projection enforces 1/2/3 sequencing and terminal cap', () => {
  const ops = ['prepare_group', 'accept_group', 'prepare_group', 'accept_group', 'prepare_group', 'accept_group', 'complete'];
  expect(campaignGroupProgress(events(ops), 3)).toEqual({ group_number: 3, accepted_groups: 3, group_count: 3 });
  for (const bad of [
    ['prepare_group', 'prepare_group'],
    ['accept_group'],
    ['prepare_group', 'accept_group', 'complete'],
    [...ops, 'prepare_group'],
  ])
    expect(() => campaignGroupProgress(events(bad), 3)).toThrow();
});
test('complete slot snapshot rejects missing middle slot and duplicate Task identity', () => {
  const s = snapshot();
  expect(validateCampaignGroupSnapshot(s)).toEqual(s);
  expect(() => sealCampaignGroupSnapshot({ ...s, slots: s.slots.filter((r) => r.slot !== '07') })).toThrow('every ordered slot');
  const filled = { disposition: 'not_planned' as const, task_id: 'c'.repeat(64), cleanup_sha256: sha, merge_commit_sha: null };
  expect(() => sealCampaignGroupSnapshot({ ...s, slots: s.slots.map((r, i) => (i < 2 ? { ...r, ...filled } : r)) })).toThrow(
    'cleanup identity',
  );
});
test('model SHA echo and accepted recommendation never create version authority', () => {
  const s = snapshot(),
    raw = JSON.stringify({ protocol: 1, disposition: 'accepted', observed_main_sha: oid, slots: s.slots.map((r) => r.slot), findings: [] });
  const observation = sealCampaignFreshAuditObservation({
    prompt_sha256: "sha256:"+"1".repeat(64), revision_evidence:null,
    snapshot_sha256: s.snapshot_sha256,
    session_ref: 'fresh',
    provider_session_ref: 'provider',
    answer_sha256: messageSha256(raw),
    recommendation: parseCampaignAuditAnswer(raw, s),
    observed_at: new Date().toISOString(),
  });
  expect(validateCampaignFreshAuditObservation(observation, s).disposition).toBe('unverified');
  const { observation_sha256, ...forged } = observation;
  const altered = { ...forged, disposition: 'accepted', revision_evidence: 'verified' };
  expect(() => validateCampaignFreshAuditObservation({ ...altered, observation_sha256: canonicalMessageDigest(altered) }, s)).toThrow();
});
test('audit JSON cannot omit unfilled slots or add semantic fields', () => {
  const s = snapshot(),
    answer = {
      protocol: 1,
      disposition: 'rejected',
      observed_main_sha: null,
      slots: s.slots.map((r) => r.slot),
      findings: ['Follow-up remains'],
    };
  expect(parseCampaignAuditAnswer(JSON.stringify(answer), s).disposition).toBe('rejected');
  for (const raw of ['```json\n{}\n```', JSON.stringify({ ...answer, slots: ['01'] }), JSON.stringify({ ...answer, verified: true })])
    expect(() => parseCampaignAuditAnswer(raw, s)).toThrow();
});

test.each([1,2,3])('follow-up completion requires exactly %s accepted groups', groupCount => {
  const ops=Array.from({length:groupCount},()=>['prepare_group','accept_group']).flat();
  expect(campaignGroupProgress(events([...ops,'complete_with_followups']),groupCount).accepted_groups).toBe(groupCount);
  expect(()=>campaignGroupProgress(events([...ops.slice(0,-1),'complete_with_followups']),groupCount)).toThrow('before all authorized groups');
  expect(()=>campaignGroupProgress(events([...ops,'complete_with_followups','prepare_group']),groupCount)).toThrow();
});

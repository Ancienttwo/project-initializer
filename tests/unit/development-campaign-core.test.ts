import { describe, expect, test } from 'bun:test';

import {
  buildDevelopmentCampaignDefinition,
  buildDevelopmentCampaignEvent,
  foldDevelopmentCampaignCurrent,
  validateDevelopmentCampaignDefinition,
  validateDevelopmentCampaignEvent,
} from '../../src/core/automation/development-campaign';

const hex = (seed: string): string => new Bun.CryptoHasher('sha256').update(seed).digest('hex');
const observedAt = '2026-09-05T00:00:00.000Z';

function definition() {
  return buildDevelopmentCampaignDefinition({
    campaign_id: 'campaign-1', authorization_id: 'authorization-1', authorization_sha256: hex('authorization'),
    repository_id: 'repo-1', target_ref: 'refs/heads/main', target_revision: hex('target').slice(0, 40), created_at: observedAt,
  });
}

describe('development campaign canonical protocol', () => {
  test('uses exact keys and content-bound digests', () => {
    const campaign = definition();
    expect(validateDevelopmentCampaignDefinition(campaign)).toEqual(campaign);
    expect(() => validateDevelopmentCampaignDefinition({ ...campaign, extra: true })).toThrow('fields are invalid');
    expect(() => validateDevelopmentCampaignDefinition({ ...campaign, campaign_sha256: `sha256:${hex('wrong')}` })).toThrow('digest is stale');
  });

  test('folds one contiguous append-only chain into current', () => {
    const campaign = definition();
    const first = buildDevelopmentCampaignEvent({ campaign_id: campaign.campaign_id, revision: 1, idempotency_key: 'authorize-1', operation: 'authorize', previous_state: null, evidence_refs: [], observed_at: observedAt, previous_event_sha256: null });
    const second = buildDevelopmentCampaignEvent({ campaign_id: campaign.campaign_id, revision: 2, idempotency_key: 'group-1', operation: 'prepare_group', previous_state: first.next_state, evidence_refs: ['intent-1'], observed_at: observedAt, previous_event_sha256: first.event_sha256 });
    expect(validateDevelopmentCampaignEvent(second)).toEqual(second);
    expect(foldDevelopmentCampaignCurrent(campaign, [first, second])).toMatchObject({ revision: 2, state: 'group_preparing', current_event_sha256: second.event_sha256 });
    expect(() => foldDevelopmentCampaignCurrent(campaign, [second])).toThrow('not contiguous');
  });

  test('rejects transitions outside the frozen state machine', () => {
    expect(() => buildDevelopmentCampaignEvent({ campaign_id: 'campaign-1', revision: 1, idempotency_key: 'complete-early', operation: 'complete', previous_state: null, evidence_refs: [], observed_at: observedAt, previous_event_sha256: null })).toThrow('cannot follow empty');
  });
});

test('completed_with_followups is canonical and refuses every later transition', () => {
  const event = buildDevelopmentCampaignEvent({campaign_id:'campaign-1',revision:6,idempotency_key:'finish-followups',operation:'complete_with_followups',previous_state:'group_accepted',evidence_refs:[],observed_at:observedAt,previous_event_sha256:'sha256:'+hex('previous')});
  expect(validateDevelopmentCampaignEvent(event).next_state).toBe('completed_with_followups');
  for (const operation of ['prepare_group','complete','complete_with_followups','stop','exhaust_budget','require_human_attention','require_reconciliation','expire_authorization'] as const)
    expect(() => buildDevelopmentCampaignEvent({...event,revision:7,idempotency_key:'next',operation,previous_state:event.next_state,previous_event_sha256:event.event_sha256})).toThrow('cannot follow');
});

test('recovery acknowledges expiry with a terminal stop and never reopens execution', () => {
  const campaign = definition();
  const authorized = buildDevelopmentCampaignEvent({ campaign_id: campaign.campaign_id, revision: 1,
    idempotency_key: 'authorize', operation: 'authorize', previous_state: null, evidence_refs: [],
    observed_at: observedAt, previous_event_sha256: null });
  const expired = buildDevelopmentCampaignEvent({ campaign_id: campaign.campaign_id, revision: 2,
    idempotency_key: 'expiry', operation: 'expire_authorization', previous_state: authorized.next_state,
    evidence_refs: [], observed_at: observedAt, previous_event_sha256: authorized.event_sha256 });
  const stopped = buildDevelopmentCampaignEvent({ campaign_id: campaign.campaign_id, revision: 3,
    idempotency_key: 'acknowledge-stop', operation: 'stop', previous_state: expired.next_state,
    evidence_refs: [expired.event_sha256], observed_at: observedAt, previous_event_sha256: expired.event_sha256 });
  expect(validateDevelopmentCampaignEvent(stopped).next_state).toBe('stopped');
  expect(foldDevelopmentCampaignCurrent(campaign, [authorized, expired, stopped])).toMatchObject({ revision: 3, state: 'stopped' });
  for (const operation of ['authorize', 'prepare_group', 'start_group', 'begin_group_audit', 'accept_group', 'complete', 'complete_with_followups', 'stop', 'exhaust_budget', 'require_human_attention', 'require_reconciliation', 'expire_authorization'] as const) {
    expect(() => buildDevelopmentCampaignEvent({ campaign_id: campaign.campaign_id, revision: 4,
      idempotency_key: `forbidden-${operation}`, operation, previous_state: 'stopped', evidence_refs: [],
      observed_at: observedAt, previous_event_sha256: stopped.event_sha256 })).toThrow('cannot follow');
    if (operation !== 'stop') expect(() => buildDevelopmentCampaignEvent({ campaign_id: campaign.campaign_id, revision: 3,
      idempotency_key: `expired-${operation}`, operation, previous_state: 'authorization_expired', evidence_refs: [],
      observed_at: observedAt, previous_event_sha256: expired.event_sha256 })).toThrow('cannot follow');
  }
});

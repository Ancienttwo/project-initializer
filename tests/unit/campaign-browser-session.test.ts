import { expect, test } from 'bun:test';
import { readCampaignBrowserSessionEvidence, validateCampaignBrowserSessionEvidence } from '../../src/core/automation/campaign-browser-session';
import { requireVerifiedIssueAuthoringSession, validateIssueAuthoringSession } from '../../src/core/automation/issue-batch';
import { campaignBrowserMetadata, campaignSessionEvidence } from '../helpers/campaign-browser-session';
import { makeAdoptionInput } from '../helpers/issue-batch-adoption-fixture';
import { verifyConnectorChallenge } from '../../src/core/automation/connector-challenge';
const binding = { repoRoot: '/repo', profileDir: '/profiles', profileDirectory: 'Profile 1', sourceSessionId: null, parentProviderSessionId: null };
function result() { return { sessionId: 'initial-session', status: 'completed', meta: campaignBrowserMetadata({ repoRoot: binding.repoRoot, profileDir: binding.profileDir, profileDirectory: binding.profileDirectory, sessionId: 'initial-session' }) }; }
test('default model identity stays unverified while a completed bound GitHub session yields structured evidence', () => {
  const value = result();
  const evidence = readCampaignBrowserSessionEvidence(value, binding)!;
  expect(value.meta.model.verified).toBe(false);
  expect(evidence).toMatchObject({ session_ref: 'initial-session', provider_session_ref: 'oracle-initial-session', source_session_ref: null, parent_provider_session_ref: null, app: 'GitHub' });
  expect(validateCampaignBrowserSessionEvidence(evidence)).toEqual(evidence);
});
const faults: Record<string, (v: ReturnType<typeof result>) => void> = {
  'incomplete result': v => { v.status = 'recoverable'; },
  'incomplete metadata': v => { v.meta.status = 'recoverable'; },
  'local session mismatch': v => { v.meta.sessionId = 'foreign'; },
  'foreign repository': v => { v.meta.repo = '/foreign'; },
  'foreign profile root': v => { v.meta.browser.profileDir = '/foreign'; },
  'foreign profile directory': v => { v.meta.browser.profileDirectory = 'Profile 2'; },
  'wrong provider': v => { v.meta.provider = 'native'; },
  'missing descriptor': v => { delete v.meta.providerSessionId; },
  'descriptor mismatch': v => { v.meta.providerSessionId = 'foreign'; },
  'descriptor error': v => { v.meta.oracle!.evidenceError = 'invalid descriptor'; },
  'missing app': v => { delete v.meta.oracle!.observation!.appSelection; },
  'wrong app': v => { (v.meta.oracle!.observation!.appSelection as Record<string, unknown>).app = 'Other'; },
  'unselected app': v => { (v.meta.oracle!.observation!.appSelection as Record<string, unknown>).status = 'unverified'; },
  'wrong observation origin': v => { (v.meta.oracle!.observation!.appSelection as Record<string, unknown>).source = 'answer-text'; },
  'model-only proof': v => { delete v.meta.oracle; v.meta.model.verified = true; },
  'initial foreign parent': v => { v.meta.parentProviderSessionId = 'foreign'; v.meta.oracle!.observation!.parentSessionId = 'foreign'; },
};
for (const [name, corrupt] of Object.entries(faults)) test(`refuses ${name}`, () => { const v = result(); corrupt(v); expect(readCampaignBrowserSessionEvidence(v, binding)).toBeNull(); });
test('followup parent is checked against the stored source provider, not two matching foreign fields', () => {
  const meta = campaignBrowserMetadata({ ...binding, sessionId: 'reply', sourceSessionId: 'initial-session' });
  const followup = { ...binding, sourceSessionId: 'initial-session', parentProviderSessionId: 'oracle-initial-session' };
  expect(readCampaignBrowserSessionEvidence({ sessionId: 'reply', status: 'completed', meta }, followup)).not.toBeNull();
  meta.parentProviderSessionId = 'foreign'; meta.oracle!.observation!.parentSessionId = 'foreign';
  expect(readCampaignBrowserSessionEvidence({ sessionId: 'reply', status: 'completed', meta }, followup)).toBeNull();
});
test('legacy model-only authoring sessions and boolean-only challenge inputs fail closed', () => {
  const f = makeAdoptionInput();
  const { browser_evidence: _, ...rest } = f.session;
  const legacy = { ...rest, protocol: 1 };
  expect(() => validateIssueAuthoringSession(legacy)).toThrow();
  expect(() => requireVerifiedIssueAuthoringSession(legacy as unknown as typeof f.session)).toThrow();
  expect(() => verifyConnectorChallenge({ challenge: f.challenge, response: f.challenge_response, response_session_ref: f.response_session_ref, session_verified: true } as unknown as Parameters<typeof verifyConnectorChallenge>[0])).toThrow();
});
test('evidence tampering and response parent mismatch are rejected; receipts preserve provider linkage', () => {
  const f = makeAdoptionInput();
  expect(() => validateCampaignBrowserSessionEvidence({ ...f.response_session_evidence, provider_session_ref: 'foreign' })).toThrow();
  expect(() => verifyConnectorChallenge({ challenge: f.challenge, response: f.challenge_response, response_session_ref: f.response_session_ref, response_session_evidence: campaignSessionEvidence(f.response_session_ref, 'foreign') })).toThrow();
  const receipt = verifyConnectorChallenge({ challenge: f.challenge, response: f.challenge_response, response_session_ref: f.response_session_ref, response_session_evidence: f.response_session_evidence });
  expect(receipt.response_provider_session_ref).toBe(f.response_session_evidence!.provider_session_ref);
  expect(receipt.response_session_evidence_sha256).toBe(f.response_session_evidence!.evidence_sha256);
  expect(receipt).not.toHaveProperty('observed_main_sha');
});

import { describe, expect, test } from 'bun:test';
import { buildConnectorChallenge, renderConnectorChallenge, verifyConnectorChallenge } from '../../src/core/automation/connector-challenge';
import { makeAdoptionInput } from '../helpers/issue-batch-adoption-fixture';
describe('BRC6 content challenge evidence', () => {
  test('hides expected answers from prompt and binds receipt to exact challenge', () => {
    const f = makeAdoptionInput(); const prompt = renderConnectorChallenge(f.challenge, f.intent.provider_repository);
    expect(prompt).not.toContain('export {};'); expect(prompt).not.toContain('b'.repeat(64));
    const receipt = verifyConnectorChallenge({ challenge: f.challenge, response: f.challenge_response, response_session_ref: 'reply', model_verified: true });
    expect(receipt.connector_evidence).toBe('challenge_verified'); expect(receipt.challenge_sha256).toBe(f.challenge.challenge_sha256);
  });
  test('unchanged old answers with a new echoed SHA prove content only', () => {
    const f = makeAdoptionInput();
    const challenge = buildConnectorChallenge({ intent_sha256: f.intent.intent_sha256, base_main_sha: 'c'.repeat(40),
      source_session_ref: f.challenge.source_session_ref, targets: f.challenge.targets });
    const oldAnswers = JSON.parse(f.challenge_response).answers;
    const receipt = verifyConnectorChallenge({ challenge, response: JSON.stringify({ base_main_sha: challenge.base_main_sha, answers: oldAnswers }),
      response_session_ref: 'reply', model_verified: true });
    expect(challenge.base_main_sha).not.toBe(f.challenge.base_main_sha);
    expect(receipt.connector_evidence).toBe('challenge_verified');
    expect(Object.hasOwn(receipt, 'observed_main_sha')).toBe(false);
  });
  test.each(['wrong-sha', 'missing-answer', 'changed-character', 'extra-field', 'fenced-json', 'model-self-report'])('rejects %s', kind => {
    const f = makeAdoptionInput(); const raw = JSON.parse(f.challenge_response);
    if (kind === 'wrong-sha') raw.base_main_sha = '0'.repeat(40);
    if (kind === 'missing-answer') raw.answers.pop();
    if (kind === 'changed-character') raw.answers[1] += ' ';
    if (kind === 'extra-field') raw.connector_calls = [];
    let response = JSON.stringify(raw);
    if (kind === 'fenced-json') response = `\`\`\`json\n${response}\n\`\`\``;
    expect(() => verifyConnectorChallenge({ challenge: f.challenge, response, response_session_ref: 'reply', model_verified: kind !== 'model-self-report' })).toThrow();
  });
});

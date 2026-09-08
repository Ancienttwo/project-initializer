import { expect, test } from 'bun:test';
import { buildIssueAuthoringPrompt } from '../src/effects/automation/gpt-pro-issue-authoring';
import { parseIssueBatchMetadata } from '../src/core/automation/issue-batch-reconcile';

const intent = { campaign_id: 'campaign', group_number: 1, provider_repository: 'acme/widgets', repository_id: 'repo', target_ref: 'refs/heads/main', base_main_sha: 'a'.repeat(40), slots: ['01'], allowed_issue_kinds: ['bugfix', 'test_gap'] } as unknown as Parameters<typeof buildIssueAuthoringPrompt>[0];
for (const operation of ['initial', 'fill_missing', 'edit_issue'] as const) test(`${operation} renders the complete metadata contract and a parser-valid example`, () => {
  const prompt = buildIssueAuthoringPrompt(intent, operation, ['01'], '123', 'https://github.com/acme/widgets/issues/1', ['capability.fixture']);
  expect(parseIssueBatchMetadata(prompt)).not.toBeNull();
  for (const rule of ['0–100', 'integer', 'sorted', 'duplicates', 'non-blank', 'extra keys', 'exactly one']) expect(prompt).toContain(rule);
  if (operation === 'edit_issue') expect(prompt).toContain('Do not create a new Issue.');
});
const valid = { protocol: 1, kind: 'repo-harness-campaign-issue-metadata', issue_kind: 'bugfix', primary_capability: 'capability.fixture', priority: 50, depends_on_slots: [], suspected_paths: ['src/a.ts', 'src/z.ts'] };
for (const delta of [{ priority: '50' }, { priority: -1 }, { priority: 101 }, { priority: 1.5 }, { extra: true }, { suspected_paths: ['z', 'a'] }, { suspected_paths: ['a', 'a'] }, { depends_on_slots: ['02', '01'] }, { depends_on_slots: ['01', '01'] }]) test(`parser still rejects ${JSON.stringify(delta)}`, () => {
  expect(parseIssueBatchMetadata('```json\n' + JSON.stringify({ ...valid, ...delta }) + '\n```')).toBeNull();
});
test('parser rejects multiple JSON fences', () => {
  const fence = '```json\n' + JSON.stringify(valid) + '\n```';
  expect(parseIssueBatchMetadata(fence + '\n' + fence)).toBeNull();
});

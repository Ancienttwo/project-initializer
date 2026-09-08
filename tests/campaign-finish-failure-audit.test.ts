import { expect, test } from 'bun:test';
import { spawnSync } from 'child_process';
import { join } from 'path';
import { requireCampaignActiveAdmission } from '../src/effects/automation/campaign-revision-admission';
for (const scenario of ['worker_nonzero', 'verifier_fail']) test(`actual finish(fail): ${scenario} settles once`, () => {
  const run = spawnSync(process.execPath, [join(import.meta.dir, 'fixtures/brc-audit/finish-failure.ts'), scenario], { encoding: 'utf8', timeout: 20000 });
  expect(run.status, run.stdout + run.stderr).toBe(0);
  expect(run.stdout).toContain('actual finish(fail) settled and replayed');
}, 25000);
test('production admission remains closed outside the isolated fixture', () => {
  expect(requireCampaignActiveAdmission).toThrow('trusted exact revision readback');
});

#!/usr/bin/env bun
import { execFileSync } from 'node:child_process';
import { readFileSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Discover the selected CLI's package; managed skills may be copied elsewhere.
const doc = execFileSync('repo-harness', ['docs', 'path', 'harness-overview'], {
  encoding: 'utf8', timeout: 10000, stdio: ['ignore', 'pipe', 'pipe'],
}).trim();
const runtime = resolve(dirname(realpathSync(doc)), '../..');
const { sealProgramAuthorization, canonicalAutomationJson } = await import(
  pathToFileURL(join(runtime, 'src/core/automation/budget.ts')).href
);

if (process.argv.length !== 3) throw new Error('Usage: bun prepare-grant.ts <authoritative-input.json>');
const input = JSON.parse(readFileSync(process.argv[2]!, 'utf8'));
const fields = ['authorization_id', 'repository_id', 'target_ref', 'target_revision',
  'work_graph_revision', 'allowed_work_package_ids', 'issued_by', 'issued_at',
  'campaign_id', 'local_parent_host', 'chrome_profile_directory'];
if (!input || typeof input !== 'object' || Array.isArray(input)
  || JSON.stringify(Object.keys(input).sort()) !== JSON.stringify(fields.sort())) {
  throw new Error('Supply only the complete authoritative identity fields; budget overrides are not standard');
}
const preset = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../references/standard.json'), 'utf8'));
const { campaign_id, local_parent_host, chrome_profile_directory, ...identity } = input;
const draft = sealProgramAuthorization({
  ...identity,
  merge_mode: preset.merge_mode,
  allowed_merge_method: preset.allowed_merge_method,
  allowed_risk_tiers: preset.allowed_risk_tiers,
  contract_scope: preset.contract_scope,
  contract_path: preset.contract_path,
  budget: preset.budget,
  max_repair_cycles: preset.budget.max_repair_cycles,
  expires_at: new Date(Date.parse(input.issued_at) + preset.budget.max_wall_clock_seconds * 1000).toISOString(),
  campaign: { ...preset.campaign, campaign_id, local_parent_host, chrome_profile_directory },
});
process.stdout.write(`${canonicalAutomationJson(draft)}\n`);

import { buildProviderIssueObservation, buildExternalSourceRefreshReceipt } from '../../src/core/external-sources/issue-observation';
import { runCampaignPlanningStep } from '../../src/effects/automation/campaign-planning';
import { runCampaignPlanningPreflight } from '../../src/cli/commands/campaign';
import { makeSnapshot, policy as publicationPolicy } from '../helpers/issue-batch-adoption-fixture';
import type { WorkPackageRetryPolicyV1 } from '../../src/core/engineers/scheduling';
import { buildExternalSourceProjection } from '../../src/core/external-sources/projection';
import { writeProviderIssueObservation, writeExternalSourceRefreshReceipt } from '../../src/effects/external-sources/store';
import { bindEngineer, readEngineerBindingStatus } from '../../src/effects/engineers/binding-store';
import { loadEngineerProfile } from '../../src/effects/engineers/profile-store';
import { enrollEngineerPrincipal } from '../../src/effects/engineers/principal-store';
import { readClaimActorReceipt } from '../../src/effects/engineers/claim-actor-store';
import { acquireNextScheduledEngineerTask } from '../../src/effects/engineers/scheduling-acquire-next';
import { resolveEngineerPrincipal } from '../../src/effects/engineers/principal';
import { collectEngineerOffers } from '../../src/effects/engineers/scheduling';
import { expect } from 'bun:test';
import { execFileSync } from 'child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createAdoptionRepository } from '../helpers/campaign-adoption-repository';
import { adoptIssueBatch } from '../../src/effects/automation/issue-batch-adoption';
import { withCampaignCapacity } from '../../src/effects/automation/campaign-capacity';
import { runCampaignAcquisition } from '../../src/effects/automation/campaign-acquisition';
import { projectCanonicalTasks } from '../../src/core/state/coordination-identity';
import { resolveRepoIdentity } from '../../src/effects/state/coordination-canonical-source';
import { claimSprintCommand, processSprintDependencies, releaseSprintCommand } from '../../src/effects/state/coordination-sprint';
import { readLease, leaseOwnerPath } from '../../src/effects/state/coordination-lease-store';
import { buildLeaseLivenessPolicy } from '../../src/core/state/lease-liveness';

const sprint = 'plans/sprints/repair.sprint.md';
const git = (root: string, args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
export async function readyFixture(twoEngineers = false, requiredReview = false, retryPolicy?: WorkPackageRetryPolicyV1, grantLiveness = true) {
  const capability = 'capability.runtime-harness.fixture';
  const inventory = readFileSync(join(import.meta.dir, '../fixtures/repair-campaign/protected-capabilities.json'), 'utf8');
  const otherCapability = 'capability.runtime-harness.second';
  const files: Record<string, string> = { 'tests/fixtures/repair-campaign/protected-capabilities.json': inventory };
  if (retryPolicy) files['plans/policies/publication.json'] = JSON.stringify({ ...publicationPolicy, retry_policy: retryPolicy });
  if (twoEngineers) {
    files['src/second/index.ts'] = 'export {};';
    files['.archcontext/model/nodes/second.yaml'] = JSON.stringify({ schemaVersion: 'archcontext.node/v2', id: otherCapability, kind: 'capability', name: 'Second', status: 'active', summary: 'Second fixture capability', responsibilities: ['Own second fixture'], source: { include: ['src/second/**'] }, extensions: { contractFiles: { agents: 'AGENTS.md', claude: 'CLAUDE.md' }, lspProfile: 'typescript-lsp', verification: [] } });
  }
  const f = await createAdoptionRepository('active', 1, capability, {}, files, { max_parallel_tasks: twoEngineers ? 1 : 2, ...(retryPolicy ? { max_successful_acquisitions: 3 } : {}),
    ...(grantLiveness ? { liveness_policy: buildLeaseLivenessPolicy({ renewal_interval_ms: 1000, maximum_ttl_ms: 6000, renewal_actor_kind: 'controller', required_evidence_sources: ['controller', 'runtime_effect', 'publication', 'binding'], unproven_behavior: 'require_attention' }) } : {}) });
  let snapshot = makeSnapshot(f.intent, undefined, { primary_capability: capability });
  if (twoEngineers) {
    const observations = snapshot.observations.map((o, index) => {
      if (index === 0) return o;
      const { protocol, kind, source_revision, observation_sha256, ...input } = o;
      return buildProviderIssueObservation({ ...input, body: input.body.replace(capability, otherCapability).replace('src/index.ts', 'src/second/index.ts') });
    });
    snapshot = { observations, receipt: buildExternalSourceRefreshReceipt({ ...snapshot.receipt, source_revisions: observations.map(o => o.source_revision).sort() }) };
  }
  const publication = (await adoptIssueBatch(f.input, { ...f.deps, observe: () => snapshot })).publication!;
  git(f.root, ['merge', '--ff-only', publication.materialized_commit]);
  cpSync(join(import.meta.dir, '../../assets/templates/helpers'), join(f.root, 'scripts'), { recursive: true });
  writeFileSync(join(f.root, 'package.json'), '{"scripts":{"test":"bun test"}}\n');
  const profile = JSON.parse(readFileSync(join(import.meta.dir, '../../agents/engineers/profiles/verification-evals-checks.json'), 'utf8'));
  profile.engineer_id = `engineer:${capability}`; profile.capability_id = capability; profile.sop_ref = 'agents/engineers/sops/fixture.md'; profile.max_active_claims = 2;
  for (const directory of ['agents/engineers/profiles', 'agents/engineers/sops', '.ai/harness/sprint', '.claude/templates', 'tasks/contracts', 'tasks/evidence']) mkdirSync(join(f.root, directory), { recursive: true });
  cpSync(join(import.meta.dir, '../../.claude/templates/contract.template.md'), join(f.root, '.claude/templates/contract.template.md'));
  writeFileSync(join(f.root, 'agents/engineers/profiles/fixture.json'), JSON.stringify(profile));
  writeFileSync(join(f.root, profile.sop_ref), '# Fixture Engineer');
  writeFileSync(join(f.root, '.ai/harness/sprint/active-sprint'), sprint);
  writeFileSync(join(f.home, 'registered-repos.json'), JSON.stringify({ version: 1, authorizationRevision: 1, repos: [{ id: f.intent.repository_id, path: f.root, accessMode: 'read_write', source: 'manual', registeredAt: '2026-09-05T00:00:00Z', lastSeenAt: '2026-09-05T00:00:00Z' }] }));
  if (twoEngineers) {
    writeFileSync(join(f.root, 'agents/engineers/profiles/second.json'), JSON.stringify({ ...profile, engineer_id: `engineer:${otherCapability}`, capability_id: otherCapability }));
  }
  git(f.root, ['add', '.']); git(f.root, ['commit', '-qm', 'execution fixture']);
  const resolved = loadEngineerProfile(f.root, profile.engineer_id);
  bindEngineer(f.root, { engineer_id: profile.engineer_id, idempotency_key: 'bind', provider: 'codex', provider_thread_id: 'worker-thread', host_id: 'local', engineer_contract_revision: resolved.engineer_contract_revision,
    expected_current_digest: null, expected_binding_generation: 0, expected_binding_id: null, expected_engineer_contract_revision: resolved.engineer_contract_revision });
  const binding = readEngineerBindingStatus(f.root, profile.engineer_id, resolved.engineer_contract_revision).binding!;
  const authorization = '22222222-2222-4222-8222-222222222222';
  enrollEngineerPrincipal({ repository_id: f.intent.repository_id, authorization_id: authorization, binding, created_at: '2026-09-05T00:00:00Z', env: f.env });
  const secondAuthorization = '33333333-3333-4333-8333-333333333333';
  if (twoEngineers) {
    const second = loadEngineerProfile(f.root, `engineer:${otherCapability}`);
    bindEngineer(f.root, { engineer_id: second.profile.engineer_id, idempotency_key: 'bind-second', provider: 'codex', provider_thread_id: 'second-worker-thread', host_id: 'local', engineer_contract_revision: second.engineer_contract_revision,
      expected_current_digest: null, expected_binding_generation: 0, expected_binding_id: null, expected_engineer_contract_revision: second.engineer_contract_revision });
    const secondBinding = readEngineerBindingStatus(f.root, second.profile.engineer_id, second.engineer_contract_revision).binding!;
    enrollEngineerPrincipal({ repository_id: f.intent.repository_id, authorization_id: secondAuthorization, binding: secondBinding, created_at: '2026-09-05T00:00:00Z', env: f.env });
  }

  const input = { repo_root: f.root, campaign_id: f.intent.campaign_id, group_number: 1, intent_sha256: f.intent.intent_sha256, host: 'codex' as const, session_id: 'parent', authorization_id: authorization, idempotency_key: 'execute', env: f.env };
  const deps = { preflight: runCampaignPlanningPreflight, refresh: () => {
    const observations = snapshot.observations.map(o => writeProviderIssueObservation(f.root, o));
    writeExternalSourceRefreshReceipt(f.root, snapshot.receipt);
    return { receipt: snapshot.receipt, projection: buildExternalSourceProjection({ registered_repository_id: f.intent.repository_id, observations, receipts: [snapshot.receipt] }) };
  } };
  for (let index = 0; index < 2; index++) {
    const step = runCampaignPlanningStep({ ...input, idempotency_key: `plan-${index}` }, deps);
    if (!('job' in step) || !step.job) throw new Error(JSON.stringify(step));
    const job = step.job;
    const plan = `plans/plan-repair-${index}.md`; const contract = `tasks/contracts/repair-${index}.contract.md`;
    const source = twoEngineers && index === 1 ? 'src/second/index.ts' : 'src/index.ts';
    const guard = `tests/guard-${index}.test.ts`; const evidence = `tasks/evidence/pre-${index}.txt`;
    writeFileSync(join(f.root, guard), 'import { expect, test } from "bun:test";\ntest("guard", () => expect(true).toBe(true));\n'); writeFileSync(join(f.root, evidence), `${guard}\nPRE_FIX_EXIT=1\n`);
    writeFileSync(join(f.root, plan), ['# Plan: repair', '> **Status**: Approved', `> **Source Ref**: ${job.source_ref}`, '> **Artifact Level**: work-package', '> **Promotion Reason**: verification_boundary', '> **Verification Boundary**: exact local plan proof', '> **Rollback Surface**: revert repair', `> **Task Contract**: ${contract}`, '', '## Promotion Gate', ...['Merge/PR unit','Rollback surface','Verification boundary','Review/acceptance boundary','High-risk surface','Why not checklist row'].map(k => `- **${k}**: exact repair boundary`), '', '## Evidence Contract', ...['State/progress path','Verification evidence','Evaluator rubric','Stop condition','Rollback surface'].map(k => `- **${k}**: bounded repair fixture`)].join('\n'));
    writeFileSync(join(f.root, contract), `# Contract\n> **Plan**: ${plan}\n> **Task Profile**: bugfix\n${requiredReview ? "> **Review File**: tasks/reviews/required-review.md\n" : ""}\n## Goal\nRepair the observed empty-input behavior.\n\n## Why\nMissing validation lets the defect recur.\n\n## Scope\n- In scope: local empty-input guard.\n- Out of scope: other behavior.\n\n## Allowed Paths\n\n\`\`\`yaml\nallowed_paths:\n  - ${source}\n  - ${guard}\n\`\`\`\n\n## Root Cause Evidence\n- root_cause: src/index.ts:1 accepts empty input.\n- repro: bun test ${guard}\n- regression_guard: ${guard}\n- pre_fix_failure_artifact: ${evidence}\n\n## Exit Criteria\n\`\`\`yaml\nexit_criteria:\n  files_exist:\n    - ${guard}\n\`\`\`\n\n## Verification Plan\n\`\`\`json\n{"protocol":1,"checks":[{"id":"guard-${index}","kind":"package_test","path":"${guard}","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the root cause guard.","inputs":{"env":[]}}]}\n\`\`\`\n`);
    expect(runCampaignPlanningStep({ ...input, idempotency_key: `admit-${index}`, result: { job_sha256: job.job_sha256, outcome: 'plan_ready', explanation: 'The local evidence justifies a bounded repair.', surfaces: { paths: [source, guard], cli_commands: [], mcp_tools: [], public_exports: [], protocol_kinds: [], capability_nodes: [] }, characterization: null } }, deps)).toMatchObject({ outcome: 'plan_ready' });
  }
  git(f.root, ['add', '.']); git(f.root, ['commit', '-qm', 'ready plans']);
  return { ...f, executeInput: input, secondAuthorization };
}

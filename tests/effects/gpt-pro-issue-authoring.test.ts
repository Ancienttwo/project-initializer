import { afterEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { execFileSync } from 'child_process';

import { sealProgramAuthorization, type ProgramBudgetLimitV1 } from '../../src/core/automation/budget';
import { buildDevelopmentCampaignDefinition } from '../../src/core/automation/development-campaign';
import { readBrowserBinding } from '../../src/cli/chatgpt-browser/binding';
import type { BrowserConsultInput, BrowserConsultResult } from '../../src/cli/chatgpt-browser/types';
import { mintProgramAuthorization } from '../../src/effects/automation/grant-store';
import { appendDevelopmentCampaignEvent, createDevelopmentCampaign, readDevelopmentCampaignStatus } from '../../src/effects/automation/development-campaign-store';
import { continueIssueBatchAuthoring, startIssueBatchAuthoring } from '../../src/effects/automation/gpt-pro-issue-authoring';
import { issueBatchGroupStoreRoot } from '../../src/effects/automation/issue-batch-store';

const fixtures: string[] = [];
afterEach(() => { while (fixtures.length) rmSync(fixtures.pop()!, { recursive: true, force: true }); });
const hex = (seed: string): string => new Bun.CryptoHasher('sha256').update(seed).digest('hex');
const observedAt = '2026-09-05T00:00:00.000Z';
const limits: ProgramBudgetLimitV1 = { max_agent_turns: 10, max_successful_acquisitions: 2, max_runner_invocations: 10, max_provider_failures: 2, max_consecutive_no_progress_steps: 2, max_repair_cycles: 2, max_wall_clock_seconds: 3600, max_input_tokens: null, max_output_tokens: null, max_cost_micros: null };

function fixture(groupCount: 1 | 2 = 1, authoringRounds = 5, validRegistry = true) {
  const root = mkdtempSync(join(tmpdir(), 'gpt-pro-authoring-'));
  const home = mkdtempSync(join(tmpdir(), 'gpt-pro-authoring-home-'));
  const profile = mkdtempSync(join(tmpdir(), 'gpt-pro-profile-'));
  fixtures.push(root, home, profile);
  execFileSync('git', ['init', '-q', '-b', 'main'], { cwd: root });
  execFileSync('git', ['config', 'user.email', 'fixture@example.com'], { cwd: root });
  execFileSync('git', ['config', 'user.name', 'Fixture'], { cwd: root });
  mkdirSync(join(root, '.ai', 'harness'), { recursive: true });
  writeFileSync(join(root, '.ai', 'harness', 'policy.json'), `${JSON.stringify({ development_campaign: { version: 1, mode: 'shadow', limits: { maximum_group_count: groupCount, maximum_issues_per_group: 10, maximum_parallel_tasks: 2 } }, external_sources: { version: 1, mode: 'manual', github: { enabled: true, repository: 'acme/widgets', selection: { kind: 'labels', labels_all: ['campaign'], assignees_any: [] }, limits: { max_pages: 1, max_issues: 10, max_body_bytes: 4096, max_total_bytes: 65536, deadline_ms: 1000 } } } })}\n`);
  mkdirSync(join(root, '.repo-harness'), { recursive: true });
  writeFileSync(join(root, '.repo-harness', 'chatgpt-browser.local.json'), `${JSON.stringify({ version: 1, product: 'chatgpt', profileDir: profile, profileDirectory: 'Profile 13', selectedProfilePath: join(profile, 'Profile 13'), browserChannel: 'chrome', chatgptUrl: 'https://chatgpt.com/', updatedAt: observedAt })}\n`);
  mkdirSync(join(root, '.archcontext/model/nodes'), { recursive: true });
  mkdirSync(join(root, 'src'), { recursive: true });
  writeFileSync(join(root, 'src/index.ts'), 'export {};\n');
  writeFileSync(join(root, '.archcontext/model/nodes/capability.yaml'), JSON.stringify({ schemaVersion: 'archcontext.node/v2', id: 'capability.runtime-harness.authoring', kind: 'capability', name: 'Authoring', status: 'active', summary: 'Own authoring', responsibilities: ['Own authoring'], source: { include: ['src/**'] }, extensions: { contractFiles: { agents: 'AGENTS.md', claude: 'CLAUDE.md' }, lspProfile: 'typescript-lsp', verification: [] } }));
  if (!validRegistry) writeFileSync(join(root, '.archcontext/model/nodes/capability.yaml'), '{}');
  execFileSync('git', ['add', '.archcontext', 'src'], { cwd: root });
  execFileSync('git', ['add', '.ai'], { cwd: root }); execFileSync('git', ['commit', '-qm', 'baseline'], { cwd: root });
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const authorization = sealProgramAuthorization({ authorization_id: 'authorization-1', repository_id: 'repo-1', target_ref: 'refs/heads/main', target_revision: revision, work_graph_revision: hex('work'), allowed_work_package_ids: ['campaign-1'], allowed_risk_tiers: ['low'], merge_mode: 'manual', allowed_merge_method: 'squash', max_repair_cycles: 2, budget: limits, contract_scope: 'contract_less', contract_path: null, campaign: { campaign_id: 'campaign-1', group_count: groupCount, issues_per_group: 10, allowed_issue_kinds: ['bugfix', 'test_gap'], max_parallel_tasks: 2, transient_retry: { max_consecutive_failures: 3, initial_backoff_ms: 1, maximum_backoff_ms: 4 }, issue_author: 'gpt_pro', local_parent_host: 'codex', chrome_profile_directory: 'Profile 13', max_authoring_rounds_per_group: authoringRounds, max_controller_steps: 100, max_provider_calls: 100, require_fresh_main_audit: true }, issued_by: 'owner', issued_at: observedAt, expires_at: '2027-09-05T00:00:00.000Z' });
  const env = { ...process.env, REPO_HARNESS_HOME: home };
  mintProgramAuthorization({ repo_root: root, authorization, env });
  const campaign = buildDevelopmentCampaignDefinition({ campaign_id: 'campaign-1', authorization_id: authorization.authorization_id, authorization_sha256: authorization.authorization_sha256, repository_id: authorization.repository_id, target_ref: authorization.target_ref, target_revision: authorization.target_revision, created_at: observedAt });
  const created = createDevelopmentCampaign({ repo_root: root, campaign, idempotency_key: 'start', env });
  appendDevelopmentCampaignEvent({ repo_root: root, campaign_id: 'campaign-1', expected_current_sha256: created.current.current_sha256, idempotency_key: 'prepare', operation: 'prepare_group', observed_at: observedAt, env });
  return { root, env, revision };
}

function result(input: BrowserConsultInput, sessionId: string, status: BrowserConsultResult['status'] = 'completed', verified = false): BrowserConsultResult {
  return {
    sessionId, status, paths: { sessionDir: sessionId, prompt: 'prompt.md', transcript: 'transcript.md', output: 'output.md', events: 'events.jsonl', artifactsDir: 'artifacts' },
    meta: { version: 1, sessionId, engine: 'chatgpt-browser', provider: 'oracle', status, repo: input.repoRoot, createdAt: observedAt, updatedAt: observedAt, model: { requested: input.model, verified }, browser: { mode: 'manual-login', transport: 'copy_profile', chatgptUrl: 'https://chatgpt.com/', profileDir: input.profileDir, profileDirectory: input.profileDirectory }, input: { promptPath: 'prompt.md', files: [], followups: 0 }, output: { outputPath: 'output.md', transcriptPath: 'transcript.md', artifactsDir: 'artifacts', artifacts: [] }, diagnostics: { dryRun: false, reattachable: true, lastCaptureAt: observedAt } },
  };
}

describe('GPT Pro issue batch authoring effect', () => {
  test('dry-run leaves no automation budget ledger', async () => {
    const f = fixture();
    const before = readdirSync(join(f.root, '.git', 'repo-harness')).sort();
    const started = await startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env, dry_run: true }, {
      readBinding: readBrowserBinding, now: () => observedAt,
      consult: async (input) => { expect(input.dryRun).toBe(true); return result(input, 'dry-run', 'dry_run'); },
    });
    expect(started.session.browser_status).toBe('dry_run');
    expect(readdirSync(join(f.root, '.git', 'repo-harness')).sort()).toEqual(before);
  });

  test('does not repeat a completed provider call when its budget request key replays', async () => {
    const f = fixture(); let calls = 0;
    const input = { repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env };
    const deps = { readBinding: readBrowserBinding, now: () => observedAt,
      consult: async (browserInput: BrowserConsultInput) => { calls += 1; return result(browserInput, 'replay-session'); } };
    await startIssueBatchAuthoring(input, deps);
    await expect(startIssueBatchAuthoring(input, deps)).rejects.toMatchObject({ code: 'issue_authoring_reconciliation_required' });
    expect(calls).toBe(1);
  });

  test('refuses another authoring call after the single authorized round is settled', async () => {
    const f = fixture(1, 1); let followups = 0;
    const started = await startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, {
      readBinding: readBrowserBinding, now: () => observedAt, consult: async (input) => result(input, 'last-round'),
    });
    await expect(continueIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1,
      intent_sha256: started.intent.intent_sha256, source_session_ref: started.session.session_ref,
      operation: 'fill_missing', requested_slots: ['01'], env: f.env }, {
      readBinding: readBrowserBinding, followup: async (input) => { followups += 1; return result(input, 'must-not-run'); },
    })).rejects.toThrow();
    expect(followups).toBe(0);
  });

  test('keeps recoverable browser work reserved and rejects another provider call', async () => {
    const f = fixture(); let followups = 0;
    const started = await startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, {
      readBinding: readBrowserBinding, now: () => observedAt, consult: async (input) => result(input, 'unknown-round', 'recoverable'),
    });
    await expect(continueIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1,
      intent_sha256: started.intent.intent_sha256, source_session_ref: started.session.session_ref,
      operation: 'fill_missing', requested_slots: ['01'], env: f.env }, {
      readBinding: readBrowserBinding, followup: async (input) => { followups += 1; return result(input, 'must-not-run'); },
    })).rejects.toThrow();
    expect(followups).toBe(0);
  });

  test('uses the injected browser binding authority before persisting and dispatching', async () => {
    const f = fixture();
    const binding = readBrowserBinding(f.root);
    rmSync(join(f.root, '.repo-harness', 'chatgpt-browser.local.json'));
    let bindingReads = 0;
    const started = await startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, {
      readBinding: (repoRoot) => { expect(repoRoot).toBe(f.root); bindingReads += 1; return binding; },
      now: () => observedAt,
      consult: async (input) => {
        expect(bindingReads).toBe(1);
        expect(input.profileDir).toBe(binding.binding!.profileDir);
        expect(input.profileDirectory).toBe('Profile 13');
        expect(existsSync(join(issueBatchGroupStoreRoot(f.root, 'campaign-1', 1), 'intent.json'))).toBe(true);
        return result(input, 'injected-binding-session', 'completed', true);
      },
    });
    expect(started.session.session_ref).toBe('injected-binding-session');
    expect(started.browser.paths.output).toBe('output.md');
  });

  test('rejects a continuation source session owned by another intent before browser execution', async () => {
    const f = fixture(2);
    const first = await startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, {
      readBinding: readBrowserBinding,
      now: () => observedAt,
      consult: async (input) => result(input, 'session-group-1'),
    });
    let skippedCalls = 0;
    await expect(startIssueBatchAuthoring({repo_root:f.root,campaign_id:'campaign-1',group_number:2,env:f.env}, {
      readBinding:readBrowserBinding,consult:async input=>{skippedCalls++;return result(input,'skipped');},
    })).rejects.toThrow('current lifecycle group');
    expect(skippedCalls).toBe(0);
    expect(existsSync(join(issueBatchGroupStoreRoot(f.root,'campaign-1',2),'intent.json'))).toBe(false);
    const other = fixture(2);
    const second = await startIssueBatchAuthoring({ repo_root: other.root, campaign_id: 'campaign-1', group_number: 1, env: other.env }, {
      readBinding: readBrowserBinding,
      now: () => observedAt,
      consult: async (input) => result(input, 'session-group-2'),
    });
    let browserCalls = 0;
    await expect(continueIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, intent_sha256: first.intent.intent_sha256, source_session_ref: second.session.session_ref, operation: 'fill_missing', requested_slots: ['01'], env: f.env }, {
      readBinding: readBrowserBinding,
      followup: async (input) => { browserCalls += 1; return result(input, 'must-not-run'); },
    })).rejects.toThrow('source session does not belong to the issue batch intent');
    expect(browserCalls).toBe(0);
  });

  test('rejects stale or expired authority before start persistence or browser execution', async () => {
    for (const condition of ['moved', 'expired'] as const) {
      const f = fixture();
      if (condition === 'moved') {
        writeFileSync(join(f.root, 'README.md'), '# moved target\n');
        execFileSync('git', ['add', 'README.md'], { cwd: f.root });
        execFileSync('git', ['commit', '-qm', 'move target'], { cwd: f.root });
      }
      const originalNow = Date.now;
      if (condition === 'expired') Date.now = () => Date.parse('2028-09-05T00:00:00.000Z');
      let browserCalls = 0;
      try {
        await expect(startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, {
      readBinding: readBrowserBinding,
          consult: async (input) => { browserCalls += 1; return result(input, 'must-not-run'); },
        })).rejects.toThrow(condition === 'moved' ? 'authorized target ref moved' : 'campaign authorization expired');
        expect(browserCalls).toBe(0);
        expect(existsSync(join(issueBatchGroupStoreRoot(f.root, 'campaign-1', 1), 'intent.json'))).toBe(false);
      } finally {
        Date.now = originalNow;
      }
    }
  });

  test('rejects stale or expired authority before continuation browser execution', async () => {
    for (const condition of ['moved', 'expired'] as const) {
      const f = fixture();
      const started = await startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, {
      readBinding: readBrowserBinding,
        now: () => observedAt,
        consult: async (input) => result(input, `session-${condition}`),
      });
      if (condition === 'moved') {
        writeFileSync(join(f.root, 'README.md'), '# moved target\n');
        execFileSync('git', ['add', 'README.md'], { cwd: f.root });
        execFileSync('git', ['commit', '-qm', 'move target'], { cwd: f.root });
      }
      const originalNow = Date.now;
      if (condition === 'expired') Date.now = () => Date.parse('2028-09-05T00:00:00.000Z');
      let browserCalls = 0;
      try {
        await expect(continueIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, intent_sha256: started.intent.intent_sha256, source_session_ref: started.session.session_ref, operation: 'fill_missing', requested_slots: ['01'], env: f.env }, {
      readBinding: readBrowserBinding,
          followup: async (input) => { browserCalls += 1; return result(input, 'must-not-run'); },
        })).rejects.toThrow(condition === 'moved' ? 'authorized target ref moved' : 'campaign authorization expired');
        expect(browserCalls).toBe(0);
      } finally {
        Date.now = originalNow;
      }
    }
  });

  test('persists the exact intent before browser, forces secret scan, and has no local Issue-create surface', async () => {
    const f = fixture();
    const effectSource = readFileSync(join(import.meta.dir, '..', '..', 'src', 'effects', 'automation', 'gpt-pro-issue-authoring.ts'), 'utf8');
    expect(effectSource).not.toContain('createIssue');
    expect(effectSource).not.toContain('gh issue create');
    let captured: BrowserConsultInput | null = null;
    const started = await startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, {
      readBinding: readBrowserBinding,
      now: () => observedAt,
      consult: async (input) => {
        captured = input;
        const groupEntries = readdirSync(issueBatchGroupStoreRoot(f.root, 'campaign-1', 1));
        expect(groupEntries).toContain('intent.json');
        return result(input, 'session-initial');
      },
    });
    expect(captured).toMatchObject({ provider: 'oracle', chatgptApp: 'GitHub', requireSecretScan: true, profileDirectory: 'Profile 13' });
    expect(captured).not.toHaveProperty('model');
    expect(captured).not.toHaveProperty('thinking');
    expect(started.intent).toMatchObject({ repository_id: 'repo-1', provider_repository: 'acme/widgets', target_ref: 'refs/heads/main', base_main_sha: f.revision });
    expect(started.intent.slots).toHaveLength(10);
    expect(captured!.prompt).toContain('slot=10');
    expect(started.session.verification).toBe('unverified');
    expect(readDevelopmentCampaignStatus(f.root, 'campaign-1', f.env).current.state).toBe('group_preparing');
  });

  test('reattaches for missing-slot fill and exact Issue edit without creating a local Issue', async () => {
    const f = fixture();
    const started = await startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, { readBinding: readBrowserBinding, now: () => observedAt, consult: async (input) => result(input, 'session-initial', 'completed', true) });
    const calls: Array<{ sessionId: string; prompt: string; secretScan?: boolean }> = [];
    const followup = async (input: Omit<BrowserConsultInput, 'sourceSessionId'> & { sessionId: string }) => {
      expect(input).toMatchObject({ chatgptApp: 'GitHub' });
      expect(input).not.toHaveProperty('model');
      expect(input).not.toHaveProperty('thinking');
      calls.push({ sessionId: input.sessionId, prompt: input.prompt, secretScan: input.requireSecretScan });
      return result(input, `session-${calls.length + 1}`, 'completed', true);
    };
    const filled = await continueIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, intent_sha256: started.intent.intent_sha256, source_session_ref: started.session.session_ref, operation: 'fill_missing', requested_slots: ['08', '09', '10'], env: f.env }, { readBinding: readBrowserBinding, now: () => '2026-09-05T00:10:00.000Z', followup });
    expect(filled.session).toMatchObject({ operation: 'fill_missing', requested_slots: ['08', '09', '10'], source_session_ref: 'session-initial' });
    expect(calls[0]!.prompt).not.toContain('slot=07');
    expect(calls[0]!.secretScan).toBe(true);
    const edited = await continueIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, intent_sha256: started.intent.intent_sha256, source_session_ref: filled.session.session_ref, operation: 'edit_issue', requested_slots: ['03'], provider_issue_id: '201', provider_issue_url: 'https://github.com/acme/widgets/issues/7', env: f.env }, { readBinding: readBrowserBinding, now: () => '2026-09-05T00:20:00.000Z', followup });
    expect(edited.session).toMatchObject({ operation: 'edit_issue', requested_slots: ['03'], provider_issue_id: '201' });
    expect(calls[1]!.prompt).toContain('https://github.com/acme/widgets/issues/7');
    expect(calls[1]!.prompt).toContain('database ID is exactly 201');
    expect(calls[1]!.prompt).toContain('Do not create a new Issue');
    for (const call of calls) {
      expect(call.prompt).toContain('capability.runtime-harness.authoring');
      expect(call.prompt).toContain('"type":"integer"');
      expect(call.prompt).toContain('sorted');
    }
  });

  test('rejects an edit locator that cannot name one exact repository Issue before browser follow-up', async () => {
    const f = fixture();
    const started = await startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, { readBinding: readBrowserBinding, now: () => observedAt, consult: async (input) => result(input, 'session-initial', 'completed', true) });
    let followups = 0;
    await expect(continueIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, intent_sha256: started.intent.intent_sha256, source_session_ref: started.session.session_ref, operation: 'edit_issue', requested_slots: ['03'], provider_issue_id: '201', provider_issue_url: 'https://github.com/acme/widgets/issues/7?redirect=1', env: f.env }, {
      readBinding: readBrowserBinding,
      followup: async (input) => { followups += 1; return result(input, 'must-not-run', 'completed', true); },
    })).rejects.toMatchObject({ code: 'issue_authoring_invalid' });
    expect(followups).toBe(0);
  });

  test('records browser timeout/failure as unverified and does not advance batch or campaign state', async () => {
    const f = fixture();
    const started = await startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, { readBinding: readBrowserBinding, now: () => observedAt, consult: async (input) => result(input, 'session-timeout', 'failed') });
    expect(started.session).toMatchObject({ browser_status: 'failed', verification: 'unverified' });
    expect(readDevelopmentCampaignStatus(f.root, 'campaign-1', f.env).current.state).toBe('group_preparing');
  });

  test('keeps one immutable intent per campaign group and rejects a conflicting second dispatch before browser', async () => {
    const f = fixture();
    let browserCalls = 0;
    const consult = async (input: BrowserConsultInput) => { browserCalls += 1; return result(input, `session-${browserCalls}`); };
    await startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, { readBinding: readBrowserBinding, now: () => observedAt, consult });
    await expect(startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, { readBinding: readBrowserBinding, now: () => '2026-09-05T00:01:00.000Z', consult })).rejects.toThrow('different immutable bytes');
    expect(browserCalls).toBe(1);
  });
});

 test('authoring carries consumer metadata types and the exact revision capability catalog', async () => {
  const f = fixture();
  // Working bytes are not the authority for a frozen campaign.
  writeFileSync(join(f.root, '.archcontext/model/nodes/capability.yaml'), '{}');
  await startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, {
    readBinding: readBrowserBinding, now: () => observedAt,
    consult: async input => {
      expect(input.prompt).toContain('"minimum":0');
      expect(input.prompt).toContain('"maximum":100');
      expect(input.prompt).toContain('"type":"integer"');
      expect(input.prompt).toContain('capability.runtime-harness.authoring');
      expect(input.prompt).toContain('sorted');
      return result(input, 'contract-proof');
    },
  });
 });

 test('missing frozen capability authority refuses before intent or provider reservation', async () => {
   const f = fixture(1, 5, false);
   const before = readdirSync(join(f.root, '.git', 'repo-harness')).sort();
   let calls = 0;
   await expect(startIssueBatchAuthoring({ repo_root: f.root, campaign_id: 'campaign-1', group_number: 1, env: f.env }, {
     readBinding: readBrowserBinding, now: () => observedAt,
     consult: async input => { calls += 1; return result(input, 'must-not-run'); },
   })).rejects.toThrow('capability registry is unavailable');
   expect(calls).toBe(0);
   expect(existsSync(join(issueBatchGroupStoreRoot(f.root, 'campaign-1', 1), 'intent.json'))).toBe(false);
   expect(readdirSync(join(f.root, '.git', 'repo-harness')).sort()).toEqual(before);
 });

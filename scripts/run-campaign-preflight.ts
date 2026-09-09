#!/usr/bin/env bun
import { Command } from 'commander';
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { campaignContainerDirectory, prepareCampaignContainer, runCampaignContainer } from '../src/effects/automation/campaign-container';

// Explicit operator command, no campaign state, provider identity or credential mount.
const cli = new Command().name('run-campaign-preflight')
  .requiredOption('--worktree <path>').requiredOption('--image <sha256>')
  .option('--timeout-ms <milliseconds>', 'single preparation and execution deadline', '120000')
  .option('--writable', 'allow target dependency preparation and verification outputs', false)
  .argument('<command...>', 'absolute executable and arguments after --');
cli.parse();
const opts = cli.opts();
const timeout = Number(opts.timeoutMs);
if (!Number.isSafeInteger(timeout) || timeout <= 0 || timeout > 1800000) throw new Error('timeout must be 1..1800000 milliseconds');
const worktree = realpathSync(opts.worktree);
const common = realpathSync(resolve(worktree, execFileSync('git', ['rev-parse', '--git-common-dir'],
  { cwd: worktree, encoding: 'utf8', timeout: 5000 }).trim()));
const deadline = Date.now() + timeout;
const identity = { kind: 'repo-harness-operator-preflight', id: randomUUID() };
console.error(JSON.stringify({ identity, worktree, deadline_ms: deadline, journal: campaignContainerDirectory(common, identity) }));
const controller = new AbortController();
const cancel = () => controller.abort();
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const) process.on(signal, cancel);
try {
  const container = await prepareCampaignContainer({ root: worktree, worktree, common_git_dir: common,
    image: opts.image, identity,
    argv: cli.args, deadline_ms: deadline, writable: opts.writable, probe: !opts.writable });
  const result = await runCampaignContainer(container, deadline, controller.signal);
  console.log(JSON.stringify(result));
  process.exitCode = result.exit_code === 0 && result.output_complete && result.inactive
    && result.termination_cause === 'completed' ? 0 : 1;
} finally {
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const) process.off(signal, cancel);
}

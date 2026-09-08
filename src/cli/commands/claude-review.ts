import { Command } from 'commander';
import { claudeReviewStatus, closeClaudeReview, reviewSessionLocation, runClaudeReviewRound } from '../../effects/review/claude-review-session';
import { recordCircuitAttempt } from '../hook/circuit-breaker';

export function buildClaudeReviewCommand(): Command {
  const command = new Command('claude-review').description('Persistent read-only Claude acceptance review in an owned herdr session');
  for (const operation of ['round', 'status', 'close', 'cancel'] as const) {
    const child = command.command(operation)
      .description({ round: 'Review prepared evidence; reuse the same reviewer for up to three repair rounds',
        status: 'Inspect the owned reviewer, round evidence and terminal attach command',
        close: 'Verify current passing acceptance and shut down the owned reviewer',
        cancel: 'Cancel the session and shut down owned resources without granting acceptance' }[operation])
      .requiredOption('--contract <path>', 'Task contract under tasks/contracts/')
      .option('--repo <path>', 'Repository worktree (defaults to cwd)')
      .option('--json', 'Print structured result');
    if (operation === 'round') child.option('--verification <path>', 'Prepared verify-sprint report', '.ai/harness/checks/latest.json')
      .option('--timeout-ms <ms>', 'Round deadline, at most 1800000 ms');
    child.action(async (opts: { contract: string; repo?: string; verification?: string; timeoutMs?: string; json?: boolean }) => {
      try {
        const options = { repoRoot: opts.repo ?? process.cwd(), contract: opts.contract };
        let result: unknown;
        if (operation === 'round') {
          const location = reviewSessionLocation(options.repoRoot, options.contract);
          const round = await runClaudeReviewRound({ ...options, verification: opts.verification,
            timeoutMs: opts.timeoutMs === undefined ? undefined : Number(opts.timeoutMs),
            admitSession: () => {
              const decision = recordCircuitAttempt(location.root, { kind: 'semantic-review', guard: 'one-semantic-review-per-work-package',
                reason: 'persistent Claude acceptance session admission', pathOrAction: 'claude-review:session',
                progressToken: location.contract, fingerprint: location.contract, profile: 'standard', strongBoundary: true });
              if (!decision.allowed) throw new Error('claude_review_session_budget_exhausted; a new independent reviewer is not allowed');
            } });
          result = round;
          if (round.status === 'rejected') process.exitCode = 1;
        } else if (operation === 'status') result = claudeReviewStatus(options.repoRoot, options.contract);
        else result = await closeClaudeReview(options, operation === 'cancel');
        console.log(JSON.stringify(result, null, opts.json ? undefined : 2));
      } catch (error) {
        console.error(`claude-review: ${error instanceof Error ? error.message : String(error)}`);
        process.exitCode = 1;
      }
    });
  }
  return command;
}

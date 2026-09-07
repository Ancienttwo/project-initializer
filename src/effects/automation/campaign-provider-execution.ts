import { automationDigest } from '../../core/automation/budget';
import { GithubAdapterError, runGithubCommand, type GithubCommandResult, type GithubCommandRunner } from '../external-sources/github';
import {
  AutomationBudgetStoreError,
  recordCampaignProviderOutcome,
  runCampaignProviderRead,
  reserveCampaignProviderBudget,
  type ReserveCampaignProviderBudgetInput,
} from './budget-store';

type ProviderBinding = Omit<ReserveCampaignProviderBudgetInput, 'operation' | 'request_sha256'>;

/** Each adapter invocation owns a leaf; the surrounding heartbeat owns progress. */
export function createCampaignProviderExecutor(binding: ProviderBinding, runner: GithubCommandRunner = runGithubCommand, observationMode: 'replay' | 'refresh' = 'replay') {
  let invocation = 0;
  const admit = (operation: ReserveCampaignProviderBudgetInput['operation'], request: unknown) => {
    const requestDigest = automationDigest(request);
    const admission = reserveCampaignProviderBudget({
      ...binding, operation, request_sha256: requestDigest,
      idempotency_key: automationDigest({ admission: binding.step_admission_sha256, invocation: invocation++ }),
    });
    if (admission.disposition !== 'reserved') {
      throw new AutomationBudgetStoreError('automation_budget_refused', 'campaign provider invocation already admitted; reconcile its exact outcome before retrying');
    }
    return admission.reservation;
  };
  const read: GithubCommandRunner = (args, options) => {
    return runCampaignProviderRead({ ...binding, operation: 'github_read', observation_mode: observationMode,
      request_sha256: automationDigest({ args, max_buffer: options.max_buffer }),
      observation_request_sha256: automationDigest({ args, max_buffer: options.max_buffer }),
      idempotency_key: automationDigest({ admission: binding.step_admission_sha256, invocation: invocation++ }),
      invoke: timeout => runner(args, { ...options, timeout_ms: Math.min(options.timeout_ms, timeout) }),
      classify_failure: error => error instanceof GithubAdapterError
        ? ['network', 'deadline', 'rate_limit'].includes(error.failure_class) ? 'read_transient_failure' : 'read_failed'
        : null,
    });
  };
  const mutate = async (
    request: { readonly action: 'comment' | 'close'; readonly repository: string; readonly issue_number: number; readonly body: string | null },
    invoke: () => GithubCommandResult | Promise<GithubCommandResult>,
  ): Promise<GithubCommandResult> => {
    const reservation = admit(request.action === 'comment' ? 'github_comment' : 'github_close', request);
    const result = await invoke();
    recordCampaignProviderOutcome({ ...binding, reservation, outcome: 'returned', result_sha256: automationDigest(result) });
    return result;
  };
  return Object.freeze({ read, mutate });
}

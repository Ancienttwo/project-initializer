import { executeVerificationContract, type VerificationExecutionReport } from "../../src/effects/evidence/verification-execution";

export const EMPTY_VERIFICATION_PLAN_SECTION = [
  "## Verification Plan",
  "",
  "```json",
  '{"protocol":1,"checks":[]}',
  "```",
  "",
].join("\n");

export function withEmptyVerificationPlan(contractText: string): string {
  return `${contractText.replace(/\s*$/, "\n\n")}${EMPTY_VERIFICATION_PLAN_SECTION}`;
}

/** Produce receipt-consumable evidence through the real execution authority. */
export function emptyVerificationEvaluation(repoRoot: string, contractPath: string): VerificationExecutionReport {
  return executeVerificationContract({ repoRoot, contractPath });
}

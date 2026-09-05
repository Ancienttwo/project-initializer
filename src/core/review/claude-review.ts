import { createHash } from 'crypto';

export const CLAUDE_REVIEW_MAX_ROUNDS = 3;
export const CLAUDE_REVIEW_TIMEOUT_MS = 1_800_000;

export interface ClaudeReviewContext {
  contract_file: string;
  contract_sha256: string;
  goal_sha256: string;
  subject_sha256: string;
  verification_evidence_sha256: string;
  target_revision: string;
}

export interface ClaudeReviewFinding {
  id: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'new' | 'open' | 'resolved';
  message: string;
}

export interface ClaudeReviewOutput {
  round_id: string;
  session_id: string;
  subject_sha256: string;
  context_sha256: string;
  verdict: 'PASS' | 'FAIL';
  summary: string;
  findings: ClaudeReviewFinding[];
}

export interface ClaudeReviewRequest {
  round: number;
  round_id: string;
  session_id: string;
  context: ClaudeReviewContext;
  context_sha256: string;
  prompt: string;
  timeout_ms: number;
}

export const CLAUDE_REVIEW_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    round_id: { type: 'string' }, session_id: { type: 'string' },
    subject_sha256: { type: 'string' }, context_sha256: { type: 'string' },
    verdict: { type: 'string', enum: ['PASS', 'FAIL'] }, summary: { type: 'string' },
    findings: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      properties: {
        id: { type: 'string' }, severity: { type: 'string', enum: ['P0', 'P1', 'P2', 'P3'] },
        status: { type: 'string', enum: ['new', 'open', 'resolved'] }, message: { type: 'string' },
      }, required: ['id', 'severity', 'status', 'message'],
    } },
  }, required: ['round_id', 'session_id', 'subject_sha256', 'context_sha256', 'verdict', 'summary', 'findings'],
} as const;

export function reviewContextDigest(context: ClaudeReviewContext): string {
  return `sha256:${createHash('sha256').update(JSON.stringify([
    context.contract_file, context.contract_sha256, context.goal_sha256, context.subject_sha256,
    context.verification_evidence_sha256, context.target_revision,
  ])).digest('hex')}`;
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('claude_review_malformed_result');
  return value as Record<string, unknown>;
}

function keys(value: Record<string, unknown>, expected: readonly string[]): void {
  if (Object.keys(value).sort().join(',') !== [...expected].sort().join(',')) throw new Error('claude_review_malformed_result');
}

export function validateClaudeReviewResult(event: unknown, request: ClaudeReviewRequest): ClaudeReviewOutput {
  const envelope = object(event);
  if (envelope.type !== 'result' || envelope.subtype !== 'success' || envelope.is_error !== false) {
    throw new Error('claude_review_provider_failed');
  }
  if (envelope.session_id !== request.session_id) throw new Error('claude_review_session_mismatch');
  const output = object(envelope.structured_output);
  keys(output, CLAUDE_REVIEW_SCHEMA.required);
  for (const [key, expected] of Object.entries({
    round_id: request.round_id, session_id: request.session_id,
    subject_sha256: request.context.subject_sha256, context_sha256: request.context_sha256,
  })) {
    if (output[key] !== expected) throw new Error(`claude_review_${key}_mismatch`);
  }
  if (reviewContextDigest(request.context) !== request.context_sha256) throw new Error('claude_review_request_mismatch');
  if (!['PASS', 'FAIL'].includes(output.verdict as string) || typeof output.summary !== 'string' || !output.summary.trim()
    || !Array.isArray(output.findings)) throw new Error('claude_review_malformed_result');
  const ids = new Set<string>();
  for (const raw of output.findings) {
    const finding = object(raw);
    keys(finding, ['id', 'severity', 'status', 'message']);
    if (typeof finding.id !== 'string' || !finding.id.trim() || ids.has(finding.id)
      || typeof finding.message !== 'string' || !finding.message.trim()
      || !['P0', 'P1', 'P2', 'P3'].includes(finding.severity as string)
      || !['new', 'open', 'resolved'].includes(finding.status as string)) throw new Error('claude_review_malformed_finding');
    ids.add(finding.id);
    if (output.verdict === 'PASS' && finding.status !== 'resolved' && ['P0', 'P1'].includes(finding.severity as string)) {
      throw new Error('claude_review_conflicting_verdict');
    }
  }
  return output as unknown as ClaudeReviewOutput;
}

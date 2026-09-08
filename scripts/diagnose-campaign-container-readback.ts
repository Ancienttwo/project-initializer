/** Offline diagnosis only. This module never invokes Docker or admits a workload. */
import { canonicalMessageDigest } from '../src/core/messages/mechanics';

import { containmentDifferences, frozenConfiguration as currentConfiguration } from '../src/core/automation/campaign-containment';
export { containmentDifferences } from '../src/core/automation/campaign-containment';
type ObjectValue = Record<string, unknown>;
function object(value: unknown): ObjectValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('unsupported object shape');
  return value as ObjectValue;
}
const kind = (value: unknown) => value === undefined ? 'missing' : value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
const same = (a: unknown, b: unknown) => kind(a) === kind(b) && canonicalMessageDigest({ value: a ?? null }) === canonicalMessageDigest({ value: b ?? null });
function difference(path: string, expected: unknown, actual: unknown, classification: string, source: string) {
  return { path, expected, actual, expected_type: kind(expected), actual_type: kind(actual), classification, source, decision: 'reject_before_workload_start' };
}
export function frozenConfiguration(response: unknown, candidate: boolean): ObjectValue {
  const current = currentConfiguration(response);
  return candidate ? current : { ...current, Mounts: object(response).Mounts };
}
export function positionalDifferences(expected: unknown, actual: unknown, path = ''): ReturnType<typeof difference>[] {
  if (same(expected, actual)) return [];
  if (kind(expected) !== kind(actual) || !expected || !actual || typeof expected !== 'object') return [difference(path, expected, actual, 'unclassified', 'saved raw inspect pair')];
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) return [difference(path, expected, actual, 'unclassified', 'saved raw inspect pair')];
    return expected.flatMap((value, i) => positionalDifferences(value, actual[i], `${path}[${i}]`));
  }
  const a = object(expected), b = object(actual);
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key => positionalDifferences(a[key], b[key], path ? `${path}.${key}` : key));
}
if (import.meta.main) {
  const fixture = await Bun.file(process.argv[2]!).json();
  const raw = positionalDifferences(fixture.before, fixture.rejected);
  const semantics = containmentDifferences(fixture.expected, fixture.rejected);
  const candidateEqual = same(frozenConfiguration(fixture.before, true), frozenConfiguration(fixture.rejected, true));
  const classified = raw.map(d => candidateEqual && d.path.startsWith('Mounts[') && semantics.every(item => item.decision === 'equivalent_for_this_field')
    ? { ...d, classification: 'known_representation_difference', decision: 'equivalent_for_this_field', source: 'saved same-container readbacks; identical unique destination-keyed mount facts' } : d);
  console.log(JSON.stringify({ raw: classified, semantics, candidate_equal: candidateEqual, production_patch_applied: true }, null, 2));
}

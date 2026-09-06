#!/usr/bin/env bun
/**
 * One-shot operator migration for executable contract criteria.
 *
 * This intentionally understands the retired shape only here. Runtime readers
 * accept Verification Plan JSON exclusively; migration requires an author-made
 * typed mapping so it never infers cost, phase, evidence, or necessity.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  type VerificationCheck,
  type VerificationPlan,
  validateVerificationPlan,
} from "../src/core/evidence/verification-plan";

type LegacyCriterion =
  | { readonly kind: "command"; readonly command: string }
  | { readonly kind: "package_test"; readonly path: string };

type MappingEntry = { readonly legacy: LegacyCriterion; readonly check: VerificationCheck };

function fail(message: string): never {
  throw new Error(message);
}

function usage(): never {
  fail("Usage: bun scripts/migrate-verification-plan.ts --contract <path> --mapping <json> [--write]");
}

function args(argv: readonly string[]): { contract: string; mapping: string; write: boolean } {
  let contract: string | undefined;
  let mapping: string | undefined;
  let write = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--contract") contract = argv[++index];
    else if (arg === "--mapping") mapping = argv[++index];
    else if (arg === "--write") write = true;
    else usage();
  }
  if (!contract || !mapping) usage();
  return { contract: resolve(contract), mapping: resolve(mapping), write };
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail(`${label} must be an object`);
  return value as Record<string, unknown>;
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[], label: string): void {
  const unexpected = Object.keys(value).filter((key) => !keys.includes(key));
  if (unexpected.length > 0) fail(`${label} has unknown field(s): ${unexpected.join(", ")}`);
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) fail(`${label} must be a non-empty string`);
  return value;
}

function legacy(value: unknown, label: string): LegacyCriterion {
  const parsed = record(value, label);
  const kind = text(parsed.kind, `${label}.kind`);
  if (kind === "command") {
    exactKeys(parsed, ["kind", "command"], label);
    return { kind, command: text(parsed.command, `${label}.command`) };
  }
  if (kind === "package_test") {
    exactKeys(parsed, ["kind", "path"], label);
    return { kind, path: text(parsed.path, `${label}.path`) };
  }
  fail(`${label}.kind must be command or package_test`);
}

function parseMapping(path: string): MappingEntry[] {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf-8"));
  } catch (error) {
    fail(`invalid mapping JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
  const input = record(raw, "mapping");
  exactKeys(input, ["protocol", "checks"], "mapping");
  if (input.protocol !== 1 || !Array.isArray(input.checks)) fail("mapping must be protocol 1 with a checks array");
  const entries = input.checks.map((value, index) => {
    const entry = record(value, `mapping.checks[${index}]`);
    exactKeys(entry, ["legacy", "check"], `mapping.checks[${index}]`);
    return { legacy: legacy(entry.legacy, `mapping.checks[${index}].legacy`), check: entry.check as VerificationCheck };
  });
  return entries;
}

function blockForYaml(text: string): RegExpMatchArray {
  const blocks = [...text.matchAll(/```yaml\s*\n([\s\S]*?)\n```/g)].filter((match) => /^exit_criteria:\s*$/m.test(match[1]!));
  if (blocks.length !== 1) fail(`contract must contain exactly one YAML exit_criteria block (found ${blocks.length})`);
  return blocks[0]!;
}

function legacyScalar(value: string): string {
  const trimmed = value.trim();
  const quote = trimmed[0];
  return (quote === '"' || quote === "'") && trimmed.endsWith(quote)
    ? trimmed.slice(1, -1) : trimmed;
}

function legacyCriteria(yaml: string): LegacyCriterion[] {
  const criteria: LegacyCriterion[] = [];
  let section: "" | "tests" | "commands" = "";
  let inExitCriteria = false;
  for (const line of yaml.split("\n")) {
    const keyLine = line.replace(/\s+#.*$/, "").trimEnd();
    if (/^exit_criteria:\s*$/.test(keyLine)) {
      inExitCriteria = true;
      continue;
    }
    if (/^\S/.test(keyLine)) { inExitCriteria = false; section = ""; }
    if (!inExitCriteria) continue;
    const header = /^  (tests_pass|commands_succeed):\s*(.*)$/.exec(keyLine);
    if (header) {
      if (header[2] && header[2] !== "[]") fail("migration requires block-form legacy executable lists");
      section = header[2] ? "" : header[1] === "tests_pass" ? "tests" : "commands";
      continue;
    }
    if (/^  \S.*:/.test(keyLine)) section = "";
    if (section === "commands") {
      const item = /^    -\s+(.+?)\s*$/.exec(line)?.[1];
      if (item) criteria.push({ kind: "command", command: legacyScalar(item) });
    }
    if (section === "tests") {
      const path = /^    -\s+path:\s*(.+?)\s*$/.exec(line)?.[1];
      if (path) criteria.push({ kind: "package_test", path: legacyScalar(path) });
    }
  }
  return criteria;
}

function identity(value: LegacyCriterion): string {
  return value.kind === "command" ? `command:${value.command}` : `package_test:${value.path}`;
}

function verifyMapping(criteria: readonly LegacyCriterion[], entries: readonly MappingEntry[]): VerificationPlan {
  const expected = new Map<string, LegacyCriterion>();
  for (const criterion of criteria) {
    const key = identity(criterion);
    if (expected.has(key)) fail(`legacy executable criterion is duplicated and cannot be mapped unambiguously: ${key}`);
    expected.set(key, criterion);
  }
  const mapped = new Set<string>();
  for (const entry of entries) {
    const key = identity(entry.legacy);
    if (!expected.has(key)) fail(`mapping includes no matching legacy executable criterion: ${key}`);
    if (mapped.has(key)) fail(`mapping duplicates legacy executable criterion: ${key}`);
    const checkKey = entry.check.kind === "command" ? `command:${entry.check.command}` : `package_test:${entry.check.path}`;
    if (checkKey !== key) fail(`mapping check must preserve the exact legacy executable input: ${key}`);
    mapped.add(key);
  }
  for (const key of expected.keys()) {
    if (!mapped.has(key)) fail(`missing explicit mapping for legacy executable criterion: ${key}`);
  }
  return validateVerificationPlan({ protocol: 1, checks: entries.map((entry) => entry.check) });
}

function removeRetiredExecutableSections(yaml: string): string {
  const kept: string[] = [];
  let skippedIndent: number | null = null;
  for (const line of yaml.split("\n")) {
    const keyLine = line.replace(/\s+#.*$/, "").trimEnd();
    const indent = line.length - line.trimStart().length;
    if (skippedIndent !== null) {
      if (!keyLine.trim() || indent > skippedIndent) continue;
      skippedIndent = null;
    }
    if (/^(?:  (?:tests_pass|commands_succeed):|criterion_reuse:)/.test(keyLine)) {
      skippedIndent = indent;
      continue;
    }
    kept.push(line);
  }
  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
}

function planBlock(plan: VerificationPlan): string {
  return `## Verification Plan\n\n\`\`\`json\n${JSON.stringify(plan, null, 2)}\n\`\`\``;
}

function migrate(contractText: string, entries: readonly MappingEntry[]): string {
  const hasPlan = /^## Verification Plan\s*$/m.test(contractText);
  const yamlMatch = blockForYaml(contractText);
  const criteria = legacyCriteria(yamlMatch[1]!);
  if (hasPlan) {
    if (criteria.length > 0 || /(?:^|\n)criterion_reuse:\s*$/m.test(yamlMatch[1]!)) {
      fail("mixed executable schema: contract contains Verification Plan and retired executable criteria");
    }
    fail("contract already contains Verification Plan; migration only accepts retired executable criteria");
  }
  if (criteria.length === 0) fail("contract has no retired executable criteria to migrate");
  const plan = verifyMapping(criteria, entries);
  const yaml = removeRetiredExecutableSections(yamlMatch[1]!);
  const replaced = contractText.replace(yamlMatch[0], `\`\`\`yaml\n${yaml}\n\`\`\``);
  const block = planBlock(plan);
  return /\n## Acceptance Notes\b/.test(replaced)
    ? replaced.replace(/\n## Acceptance Notes\b/, `\n\n${block}\n\n## Acceptance Notes`)
    : `${replaced.trimEnd()}\n\n${block}\n`;
}

try {
  const input = args(process.argv.slice(2));
  const mapping = parseMapping(input.mapping);
  const source = readFileSync(input.contract, "utf-8");
  const result = migrate(source, mapping);
  if (!input.write) {
    process.stdout.write(result);
    process.exit(0);
  }
  writeFileSync(input.contract, result);
  console.log(`verification plan migrated: ${input.contract}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

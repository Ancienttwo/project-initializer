import { describe, test, expect } from "bun:test";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dir, "..");

function read(relPath: string): string {
  return readFileSync(join(ROOT, relPath), "utf-8");
}

describe("Hook contracts", () => {
  test("shared hook input parser should exist", () => {
    expect(existsSync(join(ROOT, "assets/hooks/hook-input.sh"))).toBe(true);
    expect(existsSync(join(ROOT, "assets/hooks/lib/memory-state.sh"))).toBe(true);
    expect(existsSync(join(ROOT, "assets/hooks/lib/workflow-state.sh"))).toBe(true);
    expect(existsSync(join(ROOT, "assets/hooks/lib/session-state.sh"))).toBe(true);
    expect(existsSync(join(ROOT, "assets/hooks/lib/skill-factory.sh"))).toBe(true);
  });

  test("shared hook dispatcher should exist", () => {
    const script = read("assets/hooks/run-hook.sh");
    expect(script).toContain("HOOK_REPO_ROOT");
    expect(script).toContain("HookRunner");
    expect(script).toContain(".ai/hooks");
  });

  test("hook input parser should support current Claude Code prompt and memory fields", () => {
    const script = read("assets/hooks/hook-input.sh");
    expect(script).toContain(".prompt");
    expect(script).toContain(".session_id");
    expect(script).toContain(".transcript_path");
    expect(script).toContain(".memory_type");
    expect(script).toContain(".load_reason");
  });

  test("pre-code-change should protect contracts/specs/tests paths", () => {
    const script = read("assets/hooks/pre-code-change.sh");
    expect(script).toContain("(contracts|specs|tests)");
    expect(script).toContain(".spec");
  });

  test("pre-edit guard should combine asset-layer and test reminders", () => {
    const script = read("assets/hooks/pre-edit-guard.sh");
    expect(script).toContain("[AssetLayer]");
    expect(script).toContain("[BDD Guard]");
    expect(script).toContain("[TDD Guard]");
    expect(script).toContain("PlanTransitionGuard");
  });

  test("worktree-guard should be warning-first with marker-based enforcement", () => {
    const script = read("assets/hooks/worktree-guard.sh");
    expect(script).toContain(".claude/.require-worktree");
    expect(script).toContain("Warning: primary working tree detected");
    expect(script).toContain("Mutation blocked");
    expect(script).toContain("hook-input.sh");
    expect(script).toContain("hook_structured_error");
  });

  test("context-pressure should use stable session-id file and one-time flags", () => {
    const script = read("assets/hooks/context-pressure-hook.sh");
    expect(script).toContain(".claude/.session-id");
    expect(script).toContain("WARN_FILE");
    expect(script).toContain("RED_FILE");
    expect(script).toContain(".tool-call-count");
  });

  test("prompt-guard should cover Chinese bug/feature keywords and avoid emoji", () => {
    const script = read("assets/hooks/prompt-guard.sh");
    expect(script).toContain("修复");
    expect(script).toContain("修bug");
    expect(script).toContain("新功能");
    expect(script).toContain("实现");
    expect(script).toContain("执行");
    expect(script).toContain("ResearchGuard");
    expect(script).toContain("AnnotationGuard");
    expect(script).toContain("PlanStatusGuard");
    expect(script).toContain("ContractGuard");
    expect(script).toContain("ResearchGate");
    expect(script).toContain("done");
    expect(script).toContain("完成");
    expect(script).toContain("scripts/verify-contract.sh");
    expect(script).toContain("SpaDay");
    expect(script).toContain("has_changes_glob");
    expect(script).not.toContain("📋");
    expect(script).not.toContain("🧠");
    expect(script).not.toContain("📎");
  });

  test("post-edit guard should retain doc-drift coverage for apps/*/src/** and wrangler*.toml", () => {
    const script = read("assets/hooks/post-edit-guard.sh");
    expect(script).toContain("apps/[^/]+/src/.+");
    expect(script).toContain("wrangler.*\\.toml");
  });

  test("post-edit guard should combine doc drift and task handoff", () => {
    const script = read("assets/hooks/post-edit-guard.sh");
    expect(script).toContain("[DocDrift]");
    expect(script).toContain("[TaskHandoff]");
    expect(script).toContain("tasks/todo.md");
    expect(script).toContain("--quiet");
    expect(script).toContain("contract_references_path");
  });

  test("tdd-guard should use extension-based BDD/TDD heuristic", () => {
    const script = read("assets/hooks/tdd-guard-hook.sh");
    expect(script).toContain("\\.(tsx|jsx)$");
    expect(script).not.toContain("packages/scoring");
    expect(script).not.toContain("packages/wallet");
    expect(script).toContain("is_pure_barrel_file");
  });

  test("anti-simplification should parse file path via shared hook input", () => {
    const script = read("assets/hooks/anti-simplification.sh");
    expect(script).toContain("hook-input.sh");
    expect(script).toContain("hook_get_file_path");
  });

  test("settings template should not inject TOOL_INPUT/PROMPT argv blobs", () => {
    const settings = read("assets/hooks/settings.template.json");
    expect(settings).toContain("memory-intake.sh");
    expect(settings).toContain("run-hook.sh");
    expect(settings).toContain(".ai/hooks/run-hook.sh");
    expect(settings).toContain("pre-edit-guard.sh");
    expect(settings).toContain("post-edit-guard.sh");
    expect(settings).toContain("trace-event.sh");
    expect(settings).toContain("skill-factory-session-end.sh");
    expect(settings).toContain("post-bash.sh");
    expect(settings).toContain("context-pressure-hook.sh");
    expect(settings).not.toContain("task-handoff.sh");
    expect(settings).not.toContain("atomic-commit.sh");
    expect(settings).not.toContain('"$TOOL_INPUT"');
    expect(settings).not.toContain('"$PROMPT"');
  });

  test("trace hook should record structured JSONL events", () => {
    const script = read("assets/hooks/trace-event.sh");
    expect(script).toContain(".trace.jsonl");
    expect(script).toContain('"event_type"');
    expect(script).toContain("session_state_resolve_key");
  });
});

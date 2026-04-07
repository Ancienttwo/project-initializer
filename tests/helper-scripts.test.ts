import { describe, test, expect } from "bun:test";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dir, "..");
const HELPER_DIR = join(ROOT, "assets/templates/helpers");
const TEMPLATE_DIR = join(ROOT, "assets/templates");

function tmpWorkspace(prefix: string): string {
  return mkdtempSync(join(tmpdir(), `${prefix}-`));
}

function run(cmd: string, args: string[], cwd: string, env?: NodeJS.ProcessEnv) {
  return spawnSync(cmd, args, { cwd, encoding: "utf-8", env: { ...process.env, ...env } });
}

function copyHelpers(cwd: string) {
  const scriptsDir = join(cwd, "scripts");
  mkdirSync(scriptsDir, { recursive: true });
  mkdirSync(join(cwd, ".ai", "harness"), { recursive: true });

  for (const file of readdirSync(HELPER_DIR).filter((name) => name.endsWith(".sh"))) {
    copyFileSync(join(HELPER_DIR, file), join(scriptsDir, file));
  }
  copyFileSync(join(ROOT, "assets/workflow-contract.v1.json"), join(cwd, ".ai/harness/workflow-contract.json"));

  expect(run("bash", ["-lc", "chmod +x scripts/*.sh"], cwd).status).toBe(0);
}

describe("Workflow helper scripts", () => {
  test("new-plan should create timestamped plan without compatibility pointer", () => {
    const cwd = tmpWorkspace("helper-new-plan");
    try {
      mkdirSync(join(cwd, "plans"), { recursive: true });
      mkdirSync(join(cwd, ".claude/templates"), { recursive: true });
      copyHelpers(cwd);

      copyFileSync(
        join(TEMPLATE_DIR, "plan.template.md"),
        join(cwd, ".claude/templates/plan.template.md")
      );

      const res = run("bash", ["scripts/new-plan.sh", "--slug", "my-feature", "--title", "My Feature"], cwd);
      expect(res.status).toBe(0);

      const plans = readdirSync(join(cwd, "plans")).filter((name) => /^plan-\d{8}-\d{4}-my-feature\.md$/.test(name));
      expect(plans.length).toBe(1);
      expect(existsSync(join(cwd, "docs/plan.md"))).toBe(false);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("plan-to-todo should archive previous todo and set plan to Executing", () => {
    const cwd = tmpWorkspace("helper-plan-to-todo");
    try {
      mkdirSync(join(cwd, "plans"), { recursive: true });
      mkdirSync(join(cwd, "tasks/archive"), { recursive: true });
      copyHelpers(cwd);

      const planFile = join(cwd, "plans/plan-20260304-1400-demo.md");
      writeFileSync(
        planFile,
        [
          "# Plan: demo",
          "",
          "> **Status**: Approved",
          "",
          "## Task Breakdown",
          "- [ ] Step one",
          "- [ ] Step two",
          "",
          "## Notes",
        ].join("\n")
      );
      writeFileSync(join(cwd, "tasks/todo.md"), "old todo content\n");

      const res = run("bash", ["scripts/plan-to-todo.sh", "--plan", "plans/plan-20260304-1400-demo.md"], cwd);
      expect(res.status).toBe(0);

      const archiveFiles = readdirSync(join(cwd, "tasks/archive")).filter((name) => name.startsWith("todo-"));
      expect(archiveFiles.length).toBeGreaterThanOrEqual(1);

      const todo = readFileSync(join(cwd, "tasks/todo.md"), "utf-8");
      expect(todo).toContain("**Source Plan**: plans/plan-20260304-1400-demo.md");
      expect(todo).toContain("**Status**: Executing");
      expect(todo).toContain("- [ ] Step one");
      expect(existsSync(join(cwd, "tasks/contracts/demo.contract.md"))).toBe(true);
      expect(existsSync(join(cwd, ".claude/.task-state.json"))).toBe(true);
      const taskState = readFileSync(join(cwd, ".claude/.task-state.json"), "utf-8");
      expect(taskState).toContain('"source_plan": "plans/plan-20260304-1400-demo.md"');
      expect(taskState).toContain('"status":"in_progress"');

      const updatedPlan = readFileSync(planFile, "utf-8");
      expect(updatedPlan).toContain("**Status**: Executing");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("plan-to-todo should reject non-Approved plan status", () => {
    const cwd = tmpWorkspace("helper-plan-status");
    try {
      mkdirSync(join(cwd, "plans"), { recursive: true });
      mkdirSync(join(cwd, "tasks/archive"), { recursive: true });
      copyHelpers(cwd);

      writeFileSync(
        join(cwd, "plans/plan-20260304-1410-draft.md"),
        ["# Plan: draft", "", "> **Status**: Draft", "", "## Task Breakdown", "- [ ] Step one"].join("\n")
      );

      const res = run("bash", ["scripts/plan-to-todo.sh", "--plan", "plans/plan-20260304-1410-draft.md"], cwd);
      expect(res.status).toBe(1);
      expect(res.stderr).toContain("Plan status must be Approved");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("plan-to-todo archive should include metadata header and original todo content", () => {
    const cwd = tmpWorkspace("helper-plan-archive-meta");
    try {
      mkdirSync(join(cwd, "plans"), { recursive: true });
      mkdirSync(join(cwd, "tasks/archive"), { recursive: true });
      copyHelpers(cwd);

      writeFileSync(
        join(cwd, "plans/plan-20260304-1420-meta.md"),
        [
          "# Plan: meta",
          "",
          "> **Status**: Approved",
          "",
          "## Task Breakdown",
          "- [ ] Step one",
          "- [ ] Step two",
        ].join("\n")
      );
      writeFileSync(join(cwd, "tasks/todo.md"), "# Existing Todo\n\n- [ ] legacy task\n");

      const res = run("bash", ["scripts/plan-to-todo.sh", "--plan", "plans/plan-20260304-1420-meta.md"], cwd);
      expect(res.status).toBe(0);

      const archiveFiles = readdirSync(join(cwd, "tasks/archive")).filter((name) => name.startsWith("todo-"));
      expect(archiveFiles.length).toBeGreaterThanOrEqual(1);

      const archive = readFileSync(join(cwd, "tasks/archive", archiveFiles[0]), "utf-8");
      expect(archive).toContain("> **Archived**:");
      expect(archive).toContain("> **Related Plan**: plans/plan-20260304-1420-meta.md");
      expect(archive).toContain("> **Outcome**: Superseded");
      expect(archive).toContain("# Existing Todo");
      expect(archive).toContain("- [ ] legacy task");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("new-plan should suffix filename with -v2 when same slug/timestamp already exists", () => {
    const cwd = tmpWorkspace("helper-plan-collision");
    try {
      mkdirSync(join(cwd, "plans"), { recursive: true });
      mkdirSync(join(cwd, ".claude/templates"), { recursive: true });
      copyHelpers(cwd);

      copyFileSync(
        join(TEMPLATE_DIR, "plan.template.md"),
        join(cwd, ".claude/templates/plan.template.md")
      );

      const fakeBin = join(cwd, "fakebin");
      mkdirSync(fakeBin, { recursive: true });
      writeFileSync(
        join(fakeBin, "date"),
        [
          "#!/bin/bash",
          "if [[ \"${1:-}\" == \"+%Y%m%d-%H%M\" ]]; then",
          "  echo \"20260304-1430\"",
          "else",
          "  /bin/date \"$@\"",
          "fi",
          "",
        ].join("\n")
      );
      expect(run("chmod", ["+x", "fakebin/date"], cwd).status).toBe(0);
      const env = { PATH: `${fakeBin}:${process.env.PATH ?? ""}` };

      const first = run("bash", ["scripts/new-plan.sh", "--slug", "collision"], cwd, env);
      expect(first.status).toBe(0);
      const second = run("bash", ["scripts/new-plan.sh", "--slug", "collision"], cwd, env);
      expect(second.status).toBe(0);

      const plans = readdirSync(join(cwd, "plans"));
      expect(plans).toContain("plan-20260304-1430-collision.md");
      expect(plans).toContain("plan-20260304-1430-collision-v2.md");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("archive-workflow should archive plan and todo with outcome metadata", () => {
    const cwd = tmpWorkspace("helper-archive");
    try {
      mkdirSync(join(cwd, "plans/archive"), { recursive: true });
      mkdirSync(join(cwd, "tasks/archive"), { recursive: true });
      copyHelpers(cwd);

      writeFileSync(
        join(cwd, "plans/plan-20260304-1500-demo.md"),
        "# Plan: demo\n\n> **Status**: Executing\n"
      );
      writeFileSync(join(cwd, "tasks/todo.md"), "# Task Execution Checklist (Primary)\n\n- [ ] task\n");

      const res = run(
        "bash",
        ["scripts/archive-workflow.sh", "--plan", "plans/plan-20260304-1500-demo.md", "--outcome", "Completed"],
        cwd
      );
      expect(res.status).toBe(0);

      const archivedPlan = join(cwd, "plans/archive/plan-20260304-1500-demo.md");
      expect(existsSync(archivedPlan)).toBe(true);
      expect(readFileSync(archivedPlan, "utf-8")).toContain("**Status**: Archived");

      const archivedTodos = readdirSync(join(cwd, "tasks/archive")).filter((name) => name.startsWith("todo-"));
      expect(archivedTodos.length).toBeGreaterThanOrEqual(1);
      const todoArchiveContent = readFileSync(join(cwd, "tasks/archive", archivedTodos[0]), "utf-8");
      expect(todoArchiveContent).toContain("**Outcome**: Completed");

      const resetTodo = readFileSync(join(cwd, "tasks/todo.md"), "utf-8");
      expect(resetTodo).toContain("# Task Execution Checklist (Primary)");
      expect(resetTodo).toContain("**Source Plan**: (none)");
      expect(resetTodo).toContain("**Status**: Idle");
      expect(resetTodo).toContain("## Execution");
      expect(resetTodo).toContain("- [ ] No active execution checklist");
      expect(resetTodo).toContain("## Review Section");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("archive-workflow should set plan status to Abandoned for abandoned outcome", () => {
    const cwd = tmpWorkspace("helper-archive-abandoned");
    try {
      mkdirSync(join(cwd, "plans/archive"), { recursive: true });
      mkdirSync(join(cwd, "tasks/archive"), { recursive: true });
      mkdirSync(join(cwd, "docs"), { recursive: true });
      copyHelpers(cwd);

      writeFileSync(
        join(cwd, "plans/plan-20260304-1510-demo.md"),
        "# Plan: demo\n\n> **Status**: Executing\n"
      );
      writeFileSync(join(cwd, "tasks/todo.md"), "# Task Execution Checklist (Primary)\n\n- [ ] task\n");

      const res = run(
        "bash",
        ["scripts/archive-workflow.sh", "--plan", "plans/plan-20260304-1510-demo.md", "--outcome", "Abandoned"],
        cwd
      );
      expect(res.status).toBe(0);

      const archivedPlan = join(cwd, "plans/archive/plan-20260304-1510-demo.md");
      expect(existsSync(archivedPlan)).toBe(true);
      expect(readFileSync(archivedPlan, "utf-8")).toContain("**Status**: Abandoned");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("verify-contract should pass strict mode and set status to Fulfilled", () => {
    const cwd = tmpWorkspace("helper-verify-contract-pass");
    try {
      mkdirSync(join(cwd, "scripts"), { recursive: true });
      mkdirSync(join(cwd, "tests/unit"), { recursive: true });
      mkdirSync(join(cwd, "src"), { recursive: true });
      copyHelpers(cwd);

      writeFileSync(join(cwd, "src/index.ts"), "export const value = 1;\n");
      writeFileSync(
        join(cwd, "tests/unit/contract-pass.test.ts"),
        'import { test, expect } from "bun:test";\n' +
          'test("contract pass", () => { expect(1).toBe(1); });\n'
      );

      const contractPath = join(cwd, "task.contract.md");
      writeFileSync(
        contractPath,
        [
          "# Task Contract: pass",
          "",
          "> **Status**: Pending",
          "",
          "```yaml",
          "exit_criteria:",
          "  files_exist:",
          "    - src/index.ts",
          "  tests_pass:",
          "    - path: tests/unit/contract-pass.test.ts",
          "  commands_succeed:",
          "    - test -f src/index.ts",
          "  files_contain:",
          "    - path: src/index.ts",
          "      pattern: \"export const value\"",
          "```",
          "",
        ].join("\n")
      );

      const res = run("bash", ["scripts/verify-contract.sh", "--contract", "task.contract.md", "--strict"], cwd);
      expect(res.status).toBe(0);
      const updated = readFileSync(contractPath, "utf-8");
      expect(updated).toContain("> **Status**: Fulfilled");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("verify-contract should fail strict mode and set status to Partial", () => {
    const cwd = tmpWorkspace("helper-verify-contract-fail");
    try {
      mkdirSync(join(cwd, "scripts"), { recursive: true });
      copyHelpers(cwd);

      const contractPath = join(cwd, "task.contract.md");
      writeFileSync(
        contractPath,
        [
          "# Task Contract: fail",
          "",
          "> **Status**: Pending",
          "",
          "```yaml",
          "exit_criteria:",
          "  files_exist:",
          "    - src/does-not-exist.ts",
          "  tests_pass:",
          "    - path: tests/unit/missing.test.ts",
          "  commands_succeed:",
          "    - false",
          "```",
          "",
        ].join("\n")
      );

      const res = run("bash", ["scripts/verify-contract.sh", "--contract", "task.contract.md", "--strict"], cwd);
      expect(res.status).toBe(1);
      const updated = readFileSync(contractPath, "utf-8");
      expect(updated).toContain("> **Status**: Partial");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("verify-contract quiet mode should emit only summary and report file", () => {
    const cwd = tmpWorkspace("helper-verify-contract-quiet");
    try {
      mkdirSync(join(cwd, "scripts"), { recursive: true });
      mkdirSync(join(cwd, "src"), { recursive: true });
      copyHelpers(cwd);

      writeFileSync(join(cwd, "src/index.ts"), "export const quiet = true;\n");
      writeFileSync(
        join(cwd, "task.contract.md"),
        [
          "# Task Contract: quiet",
          "",
          "> **Status**: Pending",
          "",
          "```yaml",
          "exit_criteria:",
          "  files_exist:",
          "    - src/index.ts",
          "  files_not_contain:",
          "    - path: src/index.ts",
          "      pattern: \"forbidden\"",
          "```",
          "",
        ].join("\n")
      );

      const res = run(
        "bash",
        [
          "scripts/verify-contract.sh",
          "--contract",
          "task.contract.md",
          "--strict",
          "--quiet",
          "--report-file",
          "report.json",
        ],
        cwd
      );

      expect(res.status).toBe(0);
      expect(res.stdout).toContain("[ContractVerify]");
      expect(res.stdout).not.toContain("[PASS]");
      expect(readFileSync(join(cwd, "report.json"), "utf-8")).toContain('"failed": 0');
      expect(readFileSync(join(cwd, "report.json"), "utf-8")).toContain('"kind":"files_not_contain"');
      expect(readFileSync(join(cwd, "report.json"), "utf-8")).toContain('"run_id": "run-');
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("verify-contract should ignore allowed_paths metadata before exit criteria", () => {
    const cwd = tmpWorkspace("helper-verify-contract-allowed-paths");
    try {
      mkdirSync(join(cwd, "scripts"), { recursive: true });
      mkdirSync(join(cwd, "src"), { recursive: true });
      copyHelpers(cwd);

      writeFileSync(join(cwd, "src/index.ts"), "export const value = 1;\n");
      writeFileSync(
        join(cwd, "task.contract.md"),
        [
          "# Task Contract: allowed-paths",
          "",
          "> **Status**: Pending",
          "> **Review File**: `tasks/reviews/allowed-paths.review.md`",
          "",
          "## Allowed Paths",
          "",
          "```yaml",
          "allowed_paths:",
          "  - src/",
          "  - tests/",
          "```",
          "",
          "## Exit Criteria",
          "",
          "```yaml",
          "exit_criteria:",
          "  files_exist:",
          "    - src/index.ts",
          "  commands_succeed:",
          "    - test -f src/index.ts",
          "```",
          "",
        ].join("\n")
      );

      const res = run("bash", ["scripts/verify-contract.sh", "--contract", "task.contract.md", "--strict"], cwd);
      expect(res.status).toBe(0);
      expect(readFileSync(join(cwd, "task.contract.md"), "utf-8")).toContain("> **Status**: Fulfilled");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("prepare-handoff should write harness handoff using workflow-state helpers", () => {
    const cwd = tmpWorkspace("helper-prepare-handoff");
    try {
      mkdirSync(join(cwd, ".claude"), { recursive: true });
      mkdirSync(join(cwd, ".ai/hooks/lib"), { recursive: true });
      mkdirSync(join(cwd, "plans"), { recursive: true });
      mkdirSync(join(cwd, "tasks/contracts"), { recursive: true });
      mkdirSync(join(cwd, "tasks"), { recursive: true });
      copyHelpers(cwd);

      copyFileSync(
        join(ROOT, "assets/hooks/lib/workflow-state.sh"),
        join(cwd, ".ai/hooks/lib/workflow-state.sh")
      );

      writeFileSync(
        join(cwd, "plans/plan-20260327-2200-alpha.md"),
        [
          "# Plan: alpha",
          "",
          "> **Status**: Executing",
          "",
          "## Task Breakdown",
          "- [ ] Finish handoff",
        ].join("\n")
      );
      writeFileSync(join(cwd, ".claude/.active-plan"), "plans/plan-20260327-2200-alpha.md");
      writeFileSync(join(cwd, "tasks/contracts/alpha.contract.md"), "# Task Contract: alpha\n");
      writeFileSync(join(cwd, "tasks/todo.md"), "# Task Execution Checklist (Primary)\n\n- [ ] Finish handoff\n");

      const res = run("bash", ["scripts/prepare-handoff.sh", "manual-checkpoint"], cwd);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain("Updated .ai/harness/handoff/current.md");

      const handoff = readFileSync(join(cwd, ".ai/harness/handoff/current.md"), "utf-8");
      expect(handoff).toContain("**Reason**: manual-checkpoint");
      expect(handoff).toContain("Plan: plans/plan-20260327-2200-alpha.md");
      expect(handoff).toContain("Contract: tasks/contracts/alpha.contract.md");
      expect(handoff).toContain("Checks: .ai/harness/checks/latest.json");
      expect(handoff).toContain("Next recommended action: Finish handoff");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("ensure-task-workflow should create a draft plan when none exists", () => {
    const cwd = tmpWorkspace("helper-ensure-workflow");
    try {
      copyHelpers(cwd);

      const res = run(
        "bash",
        ["scripts/ensure-task-workflow.sh", "--slug", "alpha-feature", "--title", "Alpha Feature"],
        cwd
      );

      expect(res.status).toBe(0);
      const plans = readdirSync(join(cwd, "plans")).filter((name) => /^plan-\d{8}-\d{4}-alpha-feature\.md$/.test(name));
      expect(plans.length).toBe(1);

      const todo = readFileSync(join(cwd, "tasks/todo.md"), "utf-8");
      expect(todo).toContain("**Source Plan**: (none)");
      expect(todo).toContain("**Status**: Idle");
      expect(existsSync(join(cwd, ".claude/templates/spec.template.md"))).toBe(true);
      expect(existsSync(join(cwd, ".claude/templates/review.template.md"))).toBe(true);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("check-task-workflow should fail strict mode for legacy todo content", () => {
    const cwd = tmpWorkspace("helper-check-workflow");
    try {
      copyHelpers(cwd);
      mkdirSync(join(cwd, "plans"), { recursive: true });
      mkdirSync(join(cwd, "plans/archive"), { recursive: true });
      mkdirSync(join(cwd, "tasks/archive"), { recursive: true });
      mkdirSync(join(cwd, "tasks/contracts"), { recursive: true });
      mkdirSync(join(cwd, ".claude/templates"), { recursive: true });
      mkdirSync(join(cwd, "docs"), { recursive: true });

      copyFileSync(join(TEMPLATE_DIR, "plan.template.md"), join(cwd, ".claude/templates/plan.template.md"));
      copyFileSync(join(TEMPLATE_DIR, "research.template.md"), join(cwd, ".claude/templates/research.template.md"));
      copyFileSync(join(TEMPLATE_DIR, "contract.template.md"), join(cwd, ".claude/templates/contract.template.md"));
      copyFileSync(join(TEMPLATE_DIR, "spec.template.md"), join(cwd, ".claude/templates/spec.template.md"));
      copyFileSync(join(TEMPLATE_DIR, "review.template.md"), join(cwd, ".claude/templates/review.template.md"));

      writeFileSync(join(cwd, "tasks/todo.md"), "# Legacy Todo\n\n- [ ] old item\n");
      writeFileSync(join(cwd, "tasks/lessons.md"), "# Lessons\n");
      writeFileSync(join(cwd, "tasks/research.md"), "# Research\n");
      writeFileSync(join(cwd, "docs/PROGRESS.md"), "# Project Milestones\n");

      const res = run("bash", ["scripts/check-task-workflow.sh", "--strict"], cwd);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain("Legacy tasks/todo.md detected");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("summarize-failures should aggregate failure_class and guard counts", () => {
    const cwd = tmpWorkspace("helper-summarize-failures");
    try {
      copyHelpers(cwd);
      mkdirSync(join(cwd, ".ai/harness/failures"), { recursive: true });
      writeFileSync(
        join(cwd, ".ai/harness/failures/latest.jsonl"),
        [
          '{"ts":"2026-03-29T12:00:00+0800","guard":"PlanStatusGuard","action":"block","reason":"missing plan","fix":"create plan","failure_class":"missing_artifact","run_id":"run-a"}',
          '{"ts":"2026-03-29T12:01:00+0800","guard":"ContractGuard","action":"block","reason":"bad contract","fix":"fix contract","failure_class":"contract_failure","run_id":"run-a"}',
          '{"ts":"2026-03-29T12:02:00+0800","guard":"ContractGuard","action":"block","reason":"bad contract","fix":"fix contract","failure_class":"contract_failure","run_id":"run-a"}',
        ].join("\n") + "\n"
      );

      const res = run("bash", ["scripts/summarize-failures.sh", "--run-id", "run-a"], cwd);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain("[FailureSummary] records=3 run_id=run-a");
      expect(res.stdout).toContain("- contract_failure: 2");
      expect(res.stdout).toContain("- missing_artifact: 1");
      expect(res.stdout).toContain("- ContractGuard: 2");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test("summarize-failures should fall back to node when bun is unavailable", () => {
    const cwd = tmpWorkspace("helper-summarize-failures-node");
    try {
      copyHelpers(cwd);
      mkdirSync(join(cwd, ".ai/harness/failures"), { recursive: true });
      writeFileSync(
        join(cwd, ".ai/harness/failures/latest.jsonl"),
        '{"ts":"2026-03-29T12:00:00+0800","guard":"PlanStatusGuard","action":"block","reason":"missing plan","fix":"create plan","failure_class":"missing_artifact","run_id":"run-b"}\n'
      );

      const nodePath = run("bash", ["-lc", "command -v node"], cwd).stdout.trim();
      expect(nodePath.length).toBeGreaterThan(0);

      const fakeBin = join(cwd, "fakebin");
      mkdirSync(fakeBin, { recursive: true });
      writeFileSync(
        join(fakeBin, "node"),
        [`#!/bin/bash`, `exec "${nodePath}" "$@"`, ""].join("\n")
      );
      expect(run("chmod", ["+x", "fakebin/node"], cwd).status).toBe(0);

      const res = run("bash", ["scripts/summarize-failures.sh", "--run-id", "run-b"], cwd, {
        PATH: `${fakeBin}:/usr/bin:/bin`,
      });
      expect(res.status).toBe(0);
      expect(res.stdout).toContain("[FailureSummary] records=1 run_id=run-b");
      expect(res.stdout).toContain("- missing_artifact: 1");
      expect(res.stdout).toContain("- PlanStatusGuard: 1");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});

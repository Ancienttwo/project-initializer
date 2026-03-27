import { describe, test, expect } from "bun:test";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dir, "..");

function setupSignalRepo() {
  const cwd = mkdtempSync(join(tmpdir(), "sf-signals-repo-"));
  const home = mkdtempSync(join(tmpdir(), "sf-signals-home-"));
  mkdirSync(join(home, ".claude"), { recursive: true });

  const bootstrap = spawnSync("bash", [join(ROOT, "scripts/create-project-dirs.sh")], {
    cwd,
    env: { ...process.env, HOME: home },
    encoding: "utf-8",
  });
  expect(bootstrap.status).toBe(0);

  return { cwd, home };
}

describe("Skill Factory signals", () => {
  test("workflow proposals still trigger at the session threshold without corrections", () => {
    const { cwd, home } = setupSignalRepo();
    try {
      mkdirSync(join(cwd, "plans"), { recursive: true });
      mkdirSync(join(cwd, "tasks/contracts"), { recursive: true });
      writeFileSync(join(cwd, "plans/plan-20260319-1800-fix-auth.md"), "# Plan: fix auth\n");
      writeFileSync(
        join(cwd, "tasks/todo.md"),
        [
          "# Task Execution Checklist (Primary)",
          "",
          "> **Source Plan**: plans/plan-20260319-1800-fix-auth.md",
          "> **Status**: Executing",
          "",
          "## Execution",
          "- [ ] Verify the fix",
          "",
        ].join("\n")
      );

      for (let i = 0; i < 3; i += 1) {
        const prompt = spawnSync("bash", [join(cwd, ".claude/hooks/prompt-guard.sh")], {
          cwd,
          env: { ...process.env, HOME: home },
          input: JSON.stringify({ user_message: "implement a bug fix for auth" }),
          encoding: "utf-8",
        });
        expect(prompt.status).toBe(0);

        const stop = spawnSync("bash", [join(cwd, ".claude/hooks/skill-factory-session-end.sh")], {
          cwd,
          env: { ...process.env, HOME: home },
          encoding: "utf-8",
        });
        expect(stop.status).toBe(0);
      }

      const proposals = JSON.parse(readFileSync(join(home, ".claude/.skill-proposals.json"), "utf-8"));
      const workflow = proposals.proposals.find(
        (proposal: { type: string; key: string; status: string }) =>
          proposal.type === "workflow" && proposal.key === "bug-fix" && proposal.status === "pending"
      );
      expect(workflow).toBeDefined();
      expect(workflow.source_patterns.correction_count).toBe(0);
      expect(workflow.source_patterns.evidence_score).toBe(3);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
      rmSync(home, { recursive: true, force: true });
    }
  });

  test("lesson themes generate a knowledge proposal after threshold", () => {
    const { cwd, home } = setupSignalRepo();
    try {
      mkdirSync(join(cwd, "plans"), { recursive: true });
      writeFileSync(
        join(cwd, "tasks/lessons.md"),
        [
          "# Lessons Learned (Self-Improvement Loop)",
          "",
          "- Date: 2026-03-19",
          "- Triggered by correction: test fixture rule",
          "- Mistake pattern: testing conventions",
          "- Prevention rule: Prefer shared fixtures over inline mocks",
          "",
          "- Date: 2026-03-19",
          "- Triggered by correction: test db rule",
          "- Mistake pattern: testing conventions",
          "- Prevention rule: Use the real DB helper in integration tests",
          "",
          "- Date: 2026-03-19",
          "- Triggered by correction: naming rule",
          "- Mistake pattern: testing conventions",
          "- Prevention rule: Name test files with *.test.ts",
          "",
        ].join("\n")
      );

      const feedback = spawnSync(
        "bash",
        [join(cwd, ".claude/hooks/post-edit-guard.sh")],
        {
          cwd,
          env: { ...process.env, HOME: home },
          input: JSON.stringify({ tool_input: { file_path: "tasks/lessons.md" } }),
          encoding: "utf-8",
        }
      );
      expect(feedback.status).toBe(0);

      const stop = spawnSync(
        "bash",
        [join(cwd, ".claude/hooks/skill-factory-session-end.sh")],
        { cwd, env: { ...process.env, HOME: home }, encoding: "utf-8" }
      );
      expect(stop.status).toBe(0);

      const proposalsPath = join(home, ".claude/.skill-proposals.json");
      expect(existsSync(proposalsPath)).toBe(true);
      const proposals = JSON.parse(readFileSync(proposalsPath, "utf-8"));
      const knowledge = proposals.proposals.find(
        (proposal: { type: string; key: string }) =>
          proposal.type === "knowledge" && proposal.key === "testing-conventions"
      );
      expect(knowledge).toBeDefined();

      const state = JSON.parse(readFileSync(join(cwd, ".claude/.skill-factory-state.json"), "utf-8"));
      expect(state.patterns.knowledge["testing-conventions"].count).toBe(3);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
      rmSync(home, { recursive: true, force: true });
    }
  });

  test("evidence scoring warns and falls back when jq is unavailable", () => {
    const { cwd, home } = setupSignalRepo();
    try {
      const res = spawnSync(
        "bash",
        [
          "-lc",
          `
            export PROJECT_INITIALIZER_JQ_BIN=missing-jq
            source "${join(cwd, ".claude/hooks/lib/skill-factory.sh")}"
            sf_compute_evidence_score "bug-fix"
          `,
        ],
        {
          cwd,
          env: { ...process.env, HOME: home },
          encoding: "utf-8",
        }
      );

      expect(res.status).toBe(0);
      expect(res.stdout.trim()).toBe("0\t0\t0");
      expect(res.stderr).toContain("count-only mode");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
      rmSync(home, { recursive: true, force: true });
    }
  });
});

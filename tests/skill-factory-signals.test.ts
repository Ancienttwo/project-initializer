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
});

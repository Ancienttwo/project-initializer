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

function setupProject(prefix: string) {
  const cwd = mkdtempSync(join(tmpdir(), `${prefix}-repo-`));
  const home = mkdtempSync(join(tmpdir(), `${prefix}-home-`));
  mkdirSync(join(home, ".claude"), { recursive: true });

  const bootstrap = spawnSync("bash", [join(ROOT, "scripts/create-project-dirs.sh")], {
    cwd,
    env: { ...process.env, HOME: home },
    encoding: "utf-8",
  });
  expect(bootstrap.status).toBe(0);

  mkdirSync(join(cwd, "plans"), { recursive: true });
  mkdirSync(join(cwd, "tasks/contracts"), { recursive: true });
  writeFileSync(
    join(cwd, "plans/plan-20260319-1800-fix-auth.md"),
    "# Plan: fix auth\n\n> **Status**: Approved\n"
  );
  writeFileSync(
    join(cwd, "tasks/todo.md"),
    [
      "# Task Execution Checklist (Primary)",
      "",
      "> **Source Plan**: plans/plan-20260319-1800-fix-auth.md",
      "> **Status**: Executing",
      "",
      "## Execution",
      "- [x] Reproduce the issue",
      "- [ ] Verify the fix",
      "",
    ].join("\n")
  );
  writeFileSync(join(cwd, "tasks/contracts/fix-auth.contract.md"), "# contract\n");

  return { cwd, home };
}

function runInRepo(
  cwd: string,
  home: string,
  relativeScript: string,
  args: string[] = [],
  input?: string
) {
  return spawnSync("bash", [join(cwd, relativeScript), ...args], {
    cwd,
    env: { ...process.env, HOME: home },
    input: input ?? "",
    encoding: "utf-8",
  });
}

describe("Skill Factory hooks", () => {
  test("three similar sessions create a pending workflow proposal", () => {
    const { cwd, home } = setupProject("sf-proposal");
    try {
      for (let i = 0; i < 3; i += 1) {
        const prompt = runInRepo(
          cwd,
          home,
          ".claude/hooks/prompt-guard.sh",
          [],
          JSON.stringify({ user_message: "implement a bug fix for auth" })
        );
        expect(prompt.status).toBe(0);

        const stop = runInRepo(cwd, home, ".claude/hooks/skill-factory-session-end.sh");
        expect(stop.status).toBe(0);
      }

      const proposalsPath = join(home, ".claude/.skill-proposals.json");
      expect(existsSync(proposalsPath)).toBe(true);
      const proposals = JSON.parse(readFileSync(proposalsPath, "utf-8"));
      const workflow = proposals.proposals.find(
        (proposal: { type: string; key: string; status: string }) =>
          proposal.type === "workflow" &&
          proposal.key === "bug-fix" &&
          proposal.status === "pending"
      );
      expect(workflow).toBeDefined();

      const state = JSON.parse(readFileSync(join(cwd, ".claude/.skill-factory-state.json"), "utf-8"));
      expect(state.patterns.workflow["bug-fix"].count).toBeGreaterThanOrEqual(3);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
      rmSync(home, { recursive: true, force: true });
    }
  });

  test("create script initializes skill sidecar, agent metadata, and explicit feedback flow", () => {
    const { cwd, home } = setupProject("sf-create");
    try {
      const proposalsPath = join(home, ".claude/.skill-proposals.json");
      writeFileSync(
        proposalsPath,
        JSON.stringify(
          {
            proposals: [
              {
                id: "workflow-bug-fix-1",
                type: "workflow",
                key: "bug-fix",
                title: "Create a workflow skill for bug-fix",
                repo_root: cwd,
                reason: "Detected repeated bug-fix sessions.",
                status: "pending",
                skill_slug: "bug-fix-workflow",
                source_patterns: { count: 3, plan_slugs: ["fix-auth"] },
                created_at: 1710000000,
              },
            ],
          },
          null,
          2
        )
      );

      const create = runInRepo(cwd, home, "scripts/skill-factory-create.sh", [
        "--proposal",
        "workflow-bug-fix-1",
        "--title",
        "Bug Fix Workflow",
        "--goal",
        "Capture the repeated bug fix workflow used in this project.",
        "--outputs",
        "- Updated code\n- Verification notes",
        "--boundaries",
        "- Do not skip a failing test reproduction step",
        "--inputs",
        "- Active plan\n- tasks/todo.md",
        "--test-prompt",
        "Fix a login bug using the project workflow.",
        "--question",
        '{"id":"q1","name":"Goal coverage","question":"Does the output follow the workflow?","pass":"The workflow steps are present.","fail":"The workflow steps are missing."}',
      ]);

      expect(create.status).toBe(0);
      expect(existsSync(join(home, ".claude/skills/bug-fix-workflow/SKILL.md"))).toBe(true);
      expect(existsSync(join(home, ".claude/skills/bug-fix-workflow/agents/openai.yaml"))).toBe(true);
      expect(existsSync(join(home, ".claude/skills/bug-fix-workflow/.factory/meta.json"))).toBe(true);
      expect(existsSync(join(home, ".claude/skills/bug-fix-workflow/.factory/rubric.json"))).toBe(true);
      expect(existsSync(join(cwd, ".claude/.skill-factory-session-marker.json"))).toBe(true);
      const marker = JSON.parse(
        readFileSync(join(cwd, ".claude/.skill-factory-session-marker.json"), "utf-8")
      );
      expect(marker.skill_slug).toBe("bug-fix-workflow");
      expect(marker.skill_type).toBe("workflow");
      const openaiYaml = readFileSync(
        join(home, ".claude/skills/bug-fix-workflow/agents/openai.yaml"),
        "utf-8"
      );
      expect(openaiYaml).toContain("display_name: 'Bug Fix Workflow'");
      expect(openaiYaml).toContain("short_description:");
      expect(openaiYaml).toContain("default_prompt:");

      for (let i = 0; i < 3; i += 1) {
        const activity = runInRepo(
          cwd,
          home,
          ".claude/hooks/post-edit-guard.sh",
          [],
          JSON.stringify({ tool_input: { file_path: "src/demo.ts" } })
        );
        expect(activity.status).toBe(0);
      }

      const historyLog = readFileSync(
        join(home, ".claude/skills/bug-fix-workflow/.factory/history.jsonl"),
        "utf-8"
      )
        .trim()
        .split("\n");
      expect(historyLog.length).toBe(3);

      const feedbackBefore = readFileSync(
        join(home, ".claude/skills/bug-fix-workflow/.factory/feedback.jsonl"),
        "utf-8"
      ).trim();
      expect(feedbackBefore).toBe("");

      const checkBefore = runInRepo(cwd, home, "scripts/skill-factory-check.sh");
      expect(checkBefore.status).toBe(0);
      expect(checkBefore.stdout).toContain("Optimization hints: none");

      for (let i = 0; i < 3; i += 1) {
        const feedback = runInRepo(cwd, home, "scripts/skill-factory-check.sh", [
          "--record-feedback",
          "bug-fix-workflow",
          "--type",
          "workflow",
          "--signal",
          "correction-needed",
          "--file-path",
          "src/demo.ts",
        ]);
        expect(feedback.status).toBe(0);
      }

      const feedbackLog = readFileSync(
        join(home, ".claude/skills/bug-fix-workflow/.factory/feedback.jsonl"),
        "utf-8"
      )
        .trim()
        .split("\n");
      expect(feedbackLog.length).toBe(3);

      const checkAfter = runInRepo(cwd, home, "scripts/skill-factory-check.sh");
      expect(checkAfter.status).toBe(0);
      expect(checkAfter.stdout).toContain("bug-fix-workflow:3");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
      rmSync(home, { recursive: true, force: true });
    }
  });
});

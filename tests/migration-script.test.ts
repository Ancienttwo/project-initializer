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

function read(relPath: string): string {
  return readFileSync(join(ROOT, relPath), "utf-8");
}

describe("Migration script contract", () => {
  test("should provide dry-run and apply modes", () => {
    const script = read("scripts/migrate-project-template.sh");
    expect(script).toContain("--dry-run");
    expect(script).toContain("--apply");
    expect(script).toContain("--repo");
  });

  test("should migrate team hooks to settings.json", () => {
    const script = read("scripts/migrate-project-template.sh");
    expect(script).toContain(".claude/settings.json");
    expect(script).toContain("settings.local.json");
    expect(script).toContain("migrate_workflow");
  });

  test("should remove legacy docs/TODO.md", () => {
    const script = read("scripts/migrate-project-template.sh");
    expect(script).toContain("docs/TODO.md");
    expect(script).toContain("rm -f");
  });

  test("should migrate workflow files and runtime ignore block", () => {
    const script = read("scripts/migrate-project-template.sh");
    const sharedLib = read("scripts/lib/project-init-lib.sh");
    expect(script).toContain("docs/spec.md");
    expect(script).toContain("plans/archive");
    expect(script).toContain("tasks/archive");
    expect(script).toContain("tasks/research.md");
    expect(script).toContain("tasks/todo.md");
    expect(script).toContain("tasks/lessons.md");
    expect(script).toContain("tasks/reviews");
    expect(script).toContain(".ai/harness/checks/latest.json");
    expect(script).toContain(".ai/harness/handoff/current.md");
    expect(script).toContain("new-spec.sh");
    expect(script).toContain("new-sprint.sh");
    expect(script).toContain("new-plan.sh");
    expect(script).toContain("plan-to-todo.sh");
    expect(script).toContain("archive-workflow.sh");
    expect(script).toContain("prepare-handoff.sh");
    expect(script).toContain("verify-contract.sh");
    expect(script).toContain("verify-sprint.sh");
    expect(script).toContain("check-task-sync.sh");
    expect(script).toContain("ensure-task-workflow.sh");
    expect(script).toContain("check-task-workflow.sh");
    expect(script).toContain("pi_ensure_task_sync");
    expect(sharedLib).toContain("check:task-sync");
    expect(sharedLib).toContain("check:task-workflow");
    expect(script).toContain("tasks/contracts");
    expect(script).toContain("spa-day-protocol.md");
    expect(sharedLib).toContain("claude-runtime-temp");
    expect(script).toContain("docs/reference-configs");
  });

  test("should apply migration and create workflow artifacts with single-source plan workflow", () => {
    const repo = mkdtempSync(join(tmpdir(), "migration-apply-"));
    try {
      mkdirSync(join(repo, "docs"), { recursive: true });
      mkdirSync(join(repo, "plans"), { recursive: true });
      mkdirSync(join(repo, ".claude"), { recursive: true });
      writeFileSync(join(repo, "package.json"), JSON.stringify({ name: "demo", scripts: {} }, null, 2));

      writeFileSync(join(repo, "docs/TODO.md"), "legacy todo\n");
      writeFileSync(join(repo, "docs/plan.md"), "legacy pointer\n");
      writeFileSync(join(repo, ".gitignore"), "# base\n");
      writeFileSync(
        join(repo, ".claude/settings.local.json"),
        JSON.stringify({ hooks: { PostToolUse: [{ matcher: "Bash", hooks: [] }] } }, null, 2)
      );

      writeFileSync(join(repo, "plans/plan-20260304-0900-alpha.md"), "# Plan alpha\n");
      writeFileSync(join(repo, "plans/plan-20260304-1000-beta.md"), "# Plan beta\n");

      const res = spawnSync(
        "bash",
        ["scripts/migrate-project-template.sh", "--repo", repo, "--apply"],
        { cwd: ROOT, encoding: "utf-8" }
      );

      expect(res.status).toBe(0);
      expect(existsSync(join(repo, "plans/archive"))).toBe(true);
      expect(existsSync(join(repo, "tasks/archive"))).toBe(true);
      expect(existsSync(join(repo, ".claude/templates/research.template.md"))).toBe(true);
      expect(existsSync(join(repo, ".claude/templates/spec.template.md"))).toBe(true);
      expect(existsSync(join(repo, ".claude/templates/plan.template.md"))).toBe(true);
      expect(existsSync(join(repo, ".claude/templates/contract.template.md"))).toBe(true);
      expect(existsSync(join(repo, ".claude/templates/review.template.md"))).toBe(true);
      expect(existsSync(join(repo, "docs/spec.md"))).toBe(true);
      expect(existsSync(join(repo, "tasks/reviews"))).toBe(true);
      expect(existsSync(join(repo, ".ai/harness/checks/latest.json"))).toBe(true);
      expect(existsSync(join(repo, ".ai/harness/handoff/current.md"))).toBe(true);
      expect(existsSync(join(repo, "scripts/new-spec.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/new-sprint.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/new-plan.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/plan-to-todo.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/archive-workflow.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/prepare-handoff.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/verify-contract.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/verify-sprint.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/check-task-sync.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/ensure-task-workflow.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/check-task-workflow.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/skill-factory-create.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/skill-factory-check.sh"))).toBe(true);
      expect(existsSync(join(repo, ".ai/hooks/run-hook.sh"))).toBe(true);
      expect(existsSync(join(repo, ".ai/hooks/lib/skill-factory.sh"))).toBe(true);
      expect(existsSync(join(repo, ".ai/hooks/lib/memory-state.sh"))).toBe(true);
      expect(existsSync(join(repo, ".ai/hooks/memory-intake.sh"))).toBe(true);
      expect(existsSync(join(repo, ".claude/hooks/run-hook.sh"))).toBe(true);
      expect(existsSync(join(repo, "tasks/research.md"))).toBe(true);
      expect(existsSync(join(repo, "tasks/todo.md"))).toBe(true);
      expect(existsSync(join(repo, "tasks/lessons.md"))).toBe(true);
      expect(existsSync(join(repo, "tasks/contracts"))).toBe(true);
      expect(existsSync(join(repo, "docs/reference-configs/spa-day-protocol.md"))).toBe(true);
      expect(existsSync(join(repo, "docs/reference-configs/handoff-protocol.md"))).toBe(true);
      expect(existsSync(join(repo, "docs/reference-configs/harness-overview.md"))).toBe(true);
      expect(existsSync(join(repo, "docs/reference-configs/evaluator-rubric.md"))).toBe(true);
      expect(existsSync(join(repo, "docs/reference-configs/sprint-contracts.md"))).toBe(true);
      expect(existsSync(join(repo, ".claude/hooks/lib/skill-factory.sh"))).toBe(true);
      expect(existsSync(join(repo, ".claude/hooks/lib/memory-state.sh"))).toBe(true);
      expect(existsSync(join(repo, ".claude/hooks/memory-intake.sh"))).toBe(true);
      expect(existsSync(join(repo, ".claude/skill-factory/rubric.template.json"))).toBe(true);

      expect(existsSync(join(repo, "docs/TODO.md"))).toBe(false);
      expect(existsSync(join(repo, "docs/plan.md"))).toBe(false);

      const progress = readFileSync(join(repo, "docs/PROGRESS.md"), "utf-8");
      expect(progress).toContain("milestone checkpoints only");
      const spec = readFileSync(join(repo, "docs/spec.md"), "utf-8");
      expect(spec).toContain("# Product Spec:");

      const settings = readFileSync(join(repo, ".claude/settings.json"), "utf-8");
      expect(settings).toContain(".ai/hooks/run-hook.sh");
      expect(settings).toContain("trace-event.sh");

      const handoff = readFileSync(join(repo, ".ai/harness/handoff/current.md"), "utf-8");
      expect(handoff).toContain("# Harness Handoff");

      const pkg = JSON.parse(readFileSync(join(repo, "package.json"), "utf-8"));
      expect(pkg.scripts["check:task-sync"]).toBe("bash scripts/check-task-sync.sh");
      expect(pkg.scripts["check:task-workflow"]).toBe("bash scripts/check-task-workflow.sh --strict");

      const gitignore = readFileSync(join(repo, ".gitignore"), "utf-8");
      expect(gitignore).toContain("# BEGIN: claude-runtime-temp (managed by project-initializer)");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  test("should support self-migration when skill factory scripts already live in target scripts directory", () => {
    const repo = mkdtempSync(join(tmpdir(), "migration-self-"));
    try {
      mkdirSync(join(repo, "scripts"), { recursive: true });
      mkdirSync(join(repo, "assets/skill-factory"), { recursive: true });
      writeFileSync(join(repo, "scripts/skill-factory-create.sh"), "#!/bin/bash\necho create\n");
      writeFileSync(join(repo, "scripts/skill-factory-check.sh"), "#!/bin/bash\necho check\n");

      const res = spawnSync(
        "bash",
        [
          "-lc",
          [
            "source scripts/lib/project-init-lib.sh",
            `pi_install_skill_factory "${repo}" "${join(repo, "assets/skill-factory")}" "${join(repo, "scripts")}" "apply"`,
          ].join("\n"),
        ],
        { cwd: ROOT, encoding: "utf-8" }
      );

      expect(res.status).toBe(0);
      expect(readFileSync(join(repo, "scripts/skill-factory-create.sh"), "utf-8")).toContain("echo create");
      expect(readFileSync(join(repo, "scripts/skill-factory-check.sh"), "utf-8")).toContain("echo check");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  test("should reapply migration when .gitignore already contains a managed runtime block", () => {
    const repo = mkdtempSync(join(tmpdir(), "migration-gitignore-"));
    try {
      mkdirSync(join(repo, ".claude"), { recursive: true });
      writeFileSync(join(repo, "package.json"), JSON.stringify({ name: "demo", scripts: {} }, null, 2));
      writeFileSync(
        join(repo, ".gitignore"),
        [
          "# base",
          "# BEGIN: claude-runtime-temp (managed by project-initializer)",
          ".claude/settings.local.json",
          "# END: claude-runtime-temp",
        ].join("\n") + "\n"
      );

      const res = spawnSync(
        "bash",
        ["scripts/migrate-project-template.sh", "--repo", repo, "--apply"],
        { cwd: ROOT, encoding: "utf-8" }
      );

      expect(res.status).toBe(0);
      const gitignore = readFileSync(join(repo, ".gitignore"), "utf-8");
      expect(gitignore).toContain("# BEGIN: claude-runtime-temp (managed by project-initializer)");
      expect(gitignore).toContain(".claude/.task-state.json");
      expect(gitignore).toContain(".claude/.memory-context.json");
      expect(gitignore).toContain("# END: claude-runtime-temp");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  test("should preserve custom settings hooks while appending missing defaults", () => {
    const repo = mkdtempSync(join(tmpdir(), "migration-merge-"));
    try {
      mkdirSync(join(repo, ".claude"), { recursive: true });
      writeFileSync(join(repo, "package.json"), JSON.stringify({ name: "demo", scripts: {} }, null, 2));
      writeFileSync(
        join(repo, ".claude/settings.json"),
        JSON.stringify(
          {
            permissions: { allow: ["Bash(git status)"] },
            hooks: {
              PostToolUse: [
                {
                  matcher: "Bash",
                  hooks: [{ type: "command", command: "bash .claude/hooks/custom-bash.sh" }],
                },
              ],
            },
          },
          null,
          2
        )
      );

      const res = spawnSync(
        "bash",
        ["scripts/migrate-project-template.sh", "--repo", repo, "--apply"],
        { cwd: ROOT, encoding: "utf-8" }
      );

      expect(res.status).toBe(0);
      const settings = JSON.parse(readFileSync(join(repo, ".claude/settings.json"), "utf-8"));
      expect(settings.permissions.allow).toContain("Bash(git status)");
      const postToolUse = settings.hooks.PostToolUse.flatMap((entry: any) => entry.hooks ?? []);
      const commands = postToolUse.map((entry: any) => entry.command);
      expect(commands).toContain("bash .claude/hooks/custom-bash.sh");
      expect(commands.some((command: string) => command.includes("post-bash.sh"))).toBe(true);
      expect(commands.some((command: string) => command.includes("trace-event.sh"))).toBe(true);
      expect(commands.some((command: string) => command.includes("context-pressure-hook.sh"))).toBe(true);
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  test("should move hooks from settings.local.json without overwriting existing arrays", () => {
    const repo = mkdtempSync(join(tmpdir(), "migration-local-hooks-"));
    try {
      mkdirSync(join(repo, ".claude"), { recursive: true });
      writeFileSync(join(repo, "package.json"), JSON.stringify({ name: "demo", scripts: {} }, null, 2));
      writeFileSync(
        join(repo, ".claude/settings.json"),
        JSON.stringify(
          {
            hooks: {
              PostToolUse: [
                {
                  matcher: "Bash",
                  hooks: [{ type: "command", command: "bash .claude/hooks/custom-existing.sh" }],
                },
              ],
            },
          },
          null,
          2
        )
      );
      writeFileSync(
        join(repo, ".claude/settings.local.json"),
        JSON.stringify(
          {
            theme: "local-only",
            hooks: {
              PostToolUse: [
                {
                  matcher: "Bash",
                  hooks: [{ type: "command", command: "bash .claude/hooks/local-only.sh" }],
                },
              ],
            },
          },
          null,
          2
        )
      );

      const res = spawnSync(
        "bash",
        ["scripts/migrate-project-template.sh", "--repo", repo, "--apply"],
        { cwd: ROOT, encoding: "utf-8" }
      );

      expect(res.status).toBe(0);
      const settings = JSON.parse(readFileSync(join(repo, ".claude/settings.json"), "utf-8"));
      const commands = settings.hooks.PostToolUse.flatMap((entry: any) => entry.hooks ?? []).map((entry: any) => entry.command);
      expect(commands).toContain("bash .claude/hooks/custom-existing.sh");
      expect(commands).toContain("bash .claude/hooks/local-only.sh");

      const settingsLocal = JSON.parse(readFileSync(join(repo, ".claude/settings.local.json"), "utf-8"));
      expect(settingsLocal.hooks).toBeUndefined();
      expect(settingsLocal.theme).toBe("local-only");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  test("should not overwrite existing settings when jq is unavailable", () => {
    const repo = mkdtempSync(join(tmpdir(), "migration-no-jq-"));
    try {
      mkdirSync(join(repo, ".claude"), { recursive: true });
      writeFileSync(join(repo, "package.json"), JSON.stringify({ name: "demo", scripts: {} }, null, 2));
      const originalSettings = JSON.stringify(
        {
          permissions: { allow: ["Bash(git status)"] },
          hooks: {
            UserPromptSubmit: [
              {
                hooks: [{ type: "command", command: "bash .claude/hooks/custom-only.sh" }],
              },
            ],
          },
        },
        null,
        2
      );
      writeFileSync(join(repo, ".claude/settings.json"), originalSettings + "\n");

      const res = spawnSync(
        "/bin/bash",
        ["scripts/migrate-project-template.sh", "--repo", repo, "--apply"],
        {
          cwd: ROOT,
          encoding: "utf-8",
          env: {
            ...process.env,
            PROJECT_INITIALIZER_JQ_BIN: "/nonexistent/jq",
          },
        }
      );

      expect(res.status).toBe(0);
      expect(res.stdout).toContain("leaving existing file unchanged");
      const settings = readFileSync(join(repo, ".claude/settings.json"), "utf-8");
      expect(settings).toBe(originalSettings + "\n");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });
});

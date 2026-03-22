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
    expect(script).toContain("plans/archive");
    expect(script).toContain("tasks/archive");
    expect(script).toContain("tasks/research.md");
    expect(script).toContain("tasks/todo.md");
    expect(script).toContain("tasks/lessons.md");
    expect(script).toContain("new-plan.sh");
    expect(script).toContain("plan-to-todo.sh");
    expect(script).toContain("archive-workflow.sh");
    expect(script).toContain("verify-contract.sh");
    expect(script).toContain("check-task-sync.sh");
    expect(script).toContain("ensure-task-workflow.sh");
    expect(script).toContain("check-task-workflow.sh");
    expect(script).toContain("check:task-sync");
    expect(script).toContain("check:task-workflow");
    expect(script).toContain("tasks/contracts");
    expect(script).toContain("spa-day-protocol.md");
    expect(script).toContain("claude-runtime-temp");
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
      expect(existsSync(join(repo, ".claude/templates/plan.template.md"))).toBe(true);
      expect(existsSync(join(repo, ".claude/templates/contract.template.md"))).toBe(true);
      expect(existsSync(join(repo, "scripts/new-plan.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/plan-to-todo.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/archive-workflow.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/verify-contract.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/check-task-sync.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/ensure-task-workflow.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/check-task-workflow.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/skill-factory-create.sh"))).toBe(true);
      expect(existsSync(join(repo, "scripts/skill-factory-check.sh"))).toBe(true);
      expect(existsSync(join(repo, ".ai/hooks/run-hook.sh"))).toBe(true);
      expect(existsSync(join(repo, ".ai/hooks/lib/skill-factory.sh"))).toBe(true);
      expect(existsSync(join(repo, ".claude/hooks/run-hook.sh"))).toBe(true);
      expect(existsSync(join(repo, "tasks/research.md"))).toBe(true);
      expect(existsSync(join(repo, "tasks/todo.md"))).toBe(true);
      expect(existsSync(join(repo, "tasks/lessons.md"))).toBe(true);
      expect(existsSync(join(repo, "tasks/contracts"))).toBe(true);
      expect(existsSync(join(repo, "docs/reference-configs/spa-day-protocol.md"))).toBe(true);
      expect(existsSync(join(repo, ".claude/hooks/lib/skill-factory.sh"))).toBe(true);
      expect(existsSync(join(repo, ".claude/skill-factory/rubric.template.json"))).toBe(true);

      expect(existsSync(join(repo, "docs/TODO.md"))).toBe(false);
      expect(existsSync(join(repo, "docs/plan.md"))).toBe(false);

      const progress = readFileSync(join(repo, "docs/PROGRESS.md"), "utf-8");
      expect(progress).toContain("milestone checkpoints only");

      const settings = readFileSync(join(repo, ".claude/settings.json"), "utf-8");
      expect(settings).toContain(".ai/hooks/run-hook.sh");
      expect(settings).toContain("trace-event.sh");

      const pkg = JSON.parse(readFileSync(join(repo, "package.json"), "utf-8"));
      expect(pkg.scripts["check:task-sync"]).toBe("bash scripts/check-task-sync.sh");
      expect(pkg.scripts["check:task-workflow"]).toBe("bash scripts/check-task-workflow.sh --strict");

      const gitignore = readFileSync(join(repo, ".gitignore"), "utf-8");
      expect(gitignore).toContain("# BEGIN: claude-runtime-temp (managed by project-initializer)");
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

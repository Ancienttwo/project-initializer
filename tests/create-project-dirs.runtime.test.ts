import { describe, test, expect } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dir, "..");

describe("create-project-dirs runtime smoke", () => {
  test("should scaffold contracts/template/spa-day artifacts", () => {
    const cwd = mkdtempSync(join(tmpdir(), "create-project-dirs-"));
    try {
      const res = spawnSync("bash", [join(ROOT, "scripts/create-project-dirs.sh")], {
        cwd,
        encoding: "utf-8",
      });
      expect(res.status).toBe(0);

      expect(existsSync(join(cwd, "tasks/contracts"))).toBe(true);
      expect(existsSync(join(cwd, ".claude/templates/contract.template.md"))).toBe(true);
      expect(existsSync(join(cwd, "docs/reference-configs/spa-day-protocol.md"))).toBe(true);
      expect(existsSync(join(cwd, "scripts/verify-contract.sh"))).toBe(true);
      expect(existsSync(join(cwd, "scripts/check-task-sync.sh"))).toBe(true);
      expect(existsSync(join(cwd, "scripts/ensure-task-workflow.sh"))).toBe(true);
      expect(existsSync(join(cwd, "scripts/check-task-workflow.sh"))).toBe(true);
      expect(existsSync(join(cwd, "scripts/skill-factory-create.sh"))).toBe(true);
      expect(existsSync(join(cwd, "scripts/skill-factory-check.sh"))).toBe(true);
      expect(existsSync(join(cwd, ".ai/hooks/run-hook.sh"))).toBe(true);
      expect(existsSync(join(cwd, ".ai/hooks/lib/skill-factory.sh"))).toBe(true);
      expect(existsSync(join(cwd, ".claude/hooks/run-hook.sh"))).toBe(true);
      expect(existsSync(join(cwd, ".claude/hooks/lib/skill-factory.sh"))).toBe(true);
      expect(existsSync(join(cwd, ".claude/skill-factory/rubric.template.json"))).toBe(true);

      const settings = readFileSync(join(cwd, ".claude/settings.json"), "utf-8");
      expect(settings).toContain(".ai/hooks/run-hook.sh");
      expect(settings).toContain("pre-edit-guard.sh");
      expect(settings).toContain("post-edit-guard.sh");
      expect(settings).toContain("skill-factory-session-end.sh");
      expect(settings).toContain("post-bash.sh");
      expect(settings).toContain("context-pressure-hook.sh");
      expect(settings).not.toContain("task-handoff.sh");

      const progress = readFileSync(join(cwd, "docs/PROGRESS.md"), "utf-8");
      expect(progress).toContain("milestone checkpoints only");

      const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf-8"));
      expect(pkg.scripts["check:task-sync"]).toBe("bash scripts/check-task-sync.sh");
      expect(pkg.scripts["check:task-workflow"]).toBe("bash scripts/check-task-workflow.sh --strict");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});

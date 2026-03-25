import { describe, test, expect } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dir, "..");

describe("create-project-dirs runtime smoke", () => {
  test("should scaffold 3.0 harness artifacts", () => {
    const cwd = mkdtempSync(join(tmpdir(), "create-project-dirs-"));
    try {
      const res = spawnSync("bash", [join(ROOT, "scripts/create-project-dirs.sh")], {
        cwd,
        encoding: "utf-8",
      });
      expect(res.status).toBe(0);

      expect(existsSync(join(cwd, "tasks/contracts"))).toBe(true);
      expect(existsSync(join(cwd, ".claude/templates/contract.template.md"))).toBe(true);
      expect(existsSync(join(cwd, "docs/reference-configs/harness-overview.md"))).toBe(true);
      expect(existsSync(join(cwd, "docs/spec.md"))).toBe(true);
      expect(existsSync(join(cwd, "tasks/reviews"))).toBe(true);
      expect(existsSync(join(cwd, ".ai/harness/checks/latest.json"))).toBe(true);
      expect(existsSync(join(cwd, ".ai/harness/handoff/current.md"))).toBe(true);
      expect(existsSync(join(cwd, "scripts/verify-contract.sh"))).toBe(true);
      expect(existsSync(join(cwd, "scripts/new-spec.sh"))).toBe(true);
      expect(existsSync(join(cwd, "scripts/new-sprint.sh"))).toBe(true);
      expect(existsSync(join(cwd, "scripts/prepare-handoff.sh"))).toBe(true);
      expect(existsSync(join(cwd, "scripts/verify-sprint.sh"))).toBe(true);
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
      const settingsTemplate = readFileSync(join(ROOT, "assets/hooks/settings.template.json"), "utf-8");
      expect(settings).toBe(settingsTemplate);
      expect(settings).toContain("trace-event.sh");
      expect(settings).toContain("finalize-handoff.sh");

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

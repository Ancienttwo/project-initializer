import { describe, test, expect } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dir, "..");

describe("init-project settings runtime", () => {
  test("create_structure should materialize the canonical hook settings template", () => {
    const cwd = mkdtempSync(join(tmpdir(), "init-project-settings-"));
    try {
      const res = spawnSync(
        "/bin/bash",
        [
          "-lc",
          `
            export PROJECT_INITIALIZER_SOURCE_ONLY=1
            source "${join(ROOT, "scripts/init-project.sh")}" demo vite-tanstack bun >/dev/null
            create_structure
          `,
        ],
        {
          cwd,
          encoding: "utf-8",
        }
      );

      expect(res.status).toBe(0);
      const settings = readFileSync(join(cwd, ".claude/settings.json"), "utf-8");
      const template = readFileSync(join(ROOT, "assets/hooks/settings.template.json"), "utf-8");
      expect(settings).toBe(template);
      expect(settings).toContain("memory-intake.sh");
      expect(settings).toContain("trace-event.sh");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});

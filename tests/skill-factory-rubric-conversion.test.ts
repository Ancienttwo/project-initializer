import { describe, test, expect } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dir, "..");

describe("skill-factory rubric conversion", () => {
  test("converts rubric questions into autoresearch eval blocks", () => {
    const cwd = mkdtempSync(join(tmpdir(), "sf-rubric-"));
    try {
      const rubricPath = join(cwd, "rubric.json");
      writeFileSync(
        rubricPath,
        JSON.stringify(
          {
            questions: [
              {
                id: "q1",
                name: "Goal coverage",
                question: "Does the output satisfy the goal?",
                pass: "The output clearly satisfies the goal.",
                fail: "The output misses the goal.",
              },
            ],
          },
          null,
          2
        )
      );

      const res = spawnSync(
        "bash",
        [join(ROOT, "assets/skill-factory/rubric-to-eval.sh"), rubricPath],
        { encoding: "utf-8" }
      );

      expect(res.status).toBe(0);
      expect(res.stdout).toContain("EVAL 1: Goal coverage");
      expect(res.stdout).toContain("Question: Does the output satisfy the goal?");
      expect(res.stdout).toContain("Pass condition: The output clearly satisfies the goal.");
      expect(res.stdout).toContain("Fail condition: The output misses the goal.");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});

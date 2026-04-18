import { describe, test, expect } from "bun:test";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dir, "..");

describe("Hook dedup", () => {
  test("legacy duplicate hook assets are removed", () => {
    expect(existsSync(join(ROOT, "assets/hooks/doc-drift-guard.sh"))).toBe(false);
    expect(existsSync(join(ROOT, "assets/hooks/task-handoff.sh"))).toBe(false);
  });

  test("post-edit guard remains the single home for doc drift and task handoff behavior", () => {
    const content = readFileSync(join(ROOT, "assets/hooks/post-edit-guard.sh"), "utf-8");
    expect(content).toContain("[DocDrift]");
    expect(content).toContain("[TaskHandoff]");
    expect(content).not.toContain("run_skill_factory_activity");
  });
});

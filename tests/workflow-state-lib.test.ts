import { describe, test, expect } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dir, "..");

describe("workflow-state shared library", () => {
  test("exports the shared workflow helper functions", () => {
    const content = readFileSync(
      join(ROOT, "assets/hooks/lib/workflow-state.sh"),
      "utf-8"
    );

    expect(content).toContain("is_git_repo()");
    expect(content).toContain("load_changed_paths()");
    expect(content).toContain("has_changes()");
    expect(content).toContain("has_changes_glob()");
    expect(content).toContain("get_active_plan()");
    expect(content).toContain("derive_contract_path()");
    expect(content).toContain("workflow_todo_total()");
    expect(content).toContain("workflow_todo_done()");
  });
});

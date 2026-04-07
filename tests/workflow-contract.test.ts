import { describe, test, expect } from "bun:test";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join, relative } from "path";
import { inspectRepo } from "../scripts/inspect-project-state";
import { migrate } from "../scripts/migrate-workflow-docs";
import { loadWorkflowContract } from "../scripts/workflow-contract";

const ROOT = join(import.meta.dir, "..");

function collectFiles(root: string, current = root): string[] {
  const entries = readdirSync(current).sort();
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(current, entry);
    const relPath = `./${relative(root, fullPath)}`.replaceAll("\\", "/");
    if (statSync(fullPath).isDirectory()) {
      files.push(...collectFiles(root, fullPath));
      continue;
    }
    files.push(relPath);
  }

  return files;
}

describe("workflow contract manifest", () => {
  test("self-hosted runtime manifest should match the asset contract", () => {
    const asset = readFileSync(join(ROOT, "assets/workflow-contract.v1.json"), "utf-8");
    const runtime = readFileSync(join(ROOT, ".ai/harness/workflow-contract.json"), "utf-8");
    expect(runtime).toBe(asset);
  });

  test("hook asset files should stay in parity with self-hosted .ai/hooks", () => {
    const assetFiles = collectFiles(join(ROOT, "assets/hooks")).filter((file) => file !== "./settings.template.json");
    const runtimeFiles = collectFiles(join(ROOT, ".ai/hooks"));

    expect(runtimeFiles).toEqual(assetFiles);

    for (const relPath of runtimeFiles) {
      const assetContent = readFileSync(join(ROOT, "assets/hooks", relPath.slice(2)), "utf-8");
      const runtimeContent = readFileSync(join(ROOT, ".ai/hooks", relPath.slice(2)), "utf-8");
      expect(runtimeContent).toBe(assetContent);
    }
  });

  test("helper inventory should come from the workflow contract", () => {
    const contract = loadWorkflowContract(join(ROOT, "assets/workflow-contract.v1.json"));
    expect(contract.helpers.scripts).toContain("switch-plan.sh");
    expect(contract.artifacts.requiredFiles).toContain(".ai/harness/workflow-contract.json");
  });
});

describe("state inspection and legacy doc migration", () => {
  test("inspector should classify pre-tasks-first drift", () => {
    const repo = mkdtempSync(join(tmpdir(), "inspect-project-state-"));

    try {
      mkdirSync(join(repo, "docs"), { recursive: true });
      writeFileSync(join(repo, "docs/TODO.md"), "- [ ] legacy task\n");
      writeFileSync(join(repo, "docs/plan.md"), "# legacy plan\n");
      writeFileSync(join(repo, "docs/PROGRESS.md"), "# Session Notes\n- [ ] ship it\n");

      const result = inspectRepo(repo);
      expect(result.mode).toBe("migrate");
      expect(result.legacy_contract_version).toBe("pre-tasks-first");
      expect(result.drift_signals).toContain("legacy-docs-plan");
      expect(result.drift_signals).toContain("legacy-docs-todo");
      expect(result.drift_signals).toContain("progress-ledger-used-as-active-log");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  test("legacy doc migrator should preserve content while normalizing workflow files", () => {
    const repo = mkdtempSync(join(tmpdir(), "migrate-workflow-docs-"));

    try {
      mkdirSync(join(repo, "docs"), { recursive: true });
      writeFileSync(join(repo, "docs/TODO.md"), "- [ ] port old checklist\n");
      writeFileSync(join(repo, "docs/plan.md"), "# Old Plan\n\nKeep the useful parts.\n");
      writeFileSync(join(repo, "docs/PROGRESS.md"), "# Session Notes\n\n- [ ] investigate drift\n");

      const summary = migrate(repo, "apply");
      expect(summary.migrated.length).toBeGreaterThanOrEqual(3);
      expect(existsSync(join(repo, "tasks/todo.md"))).toBe(true);
      expect(existsSync(join(repo, "tasks/research.md"))).toBe(true);
      expect(existsSync(join(repo, "tasks/archive/legacy-docs-TODO.md"))).toBe(true);
      expect(existsSync(join(repo, "plans/archive/legacy-docs-plan.md"))).toBe(true);
      expect(existsSync(join(repo, "docs/TODO.md.migrated.bak"))).toBe(true);
      expect(existsSync(join(repo, "docs/plan.md.migrated.bak"))).toBe(true);

      const todo = readFileSync(join(repo, "tasks/todo.md"), "utf-8");
      expect(todo).toContain("**Source Plan**: (none)");
      expect(todo).toContain("Legacy Imported Tasks");
      expect(todo).toContain("port old checklist");

      const research = readFileSync(join(repo, "tasks/research.md"), "utf-8");
      expect(research).toContain("Legacy Progress Import");
      expect(research).toContain("investigate drift");

      const progress = readFileSync(join(repo, "docs/PROGRESS.md"), "utf-8");
      expect(progress).toContain("milestone checkpoints only");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });
});

import { describe, expect, test } from "bun:test";
import { spawnSync } from "child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import {
  GITIGNORE_MANAGED_BLOCK_CONTENT,
  gitignoreManagedBlockOperation,
} from "../../src/core/adoption/gitignore-plan";

describe("gitignore managed block .repo-harness rule", () => {
  test("relocated package readers share the asset and missing asset cannot write a fallback", () => {
    const root = join(import.meta.dir, "../..");
    const cwd = mkdtempSync(join(tmpdir(), "gitignore-package-"));
    try {
      for (const directory of ["scripts/lib", "src/core/adoption", "assets/templates"]) mkdirSync(join(cwd, directory), { recursive: true });
      for (const path of ["scripts/lib/project-init-lib.sh", "src/core/adoption/gitignore-plan.ts", "src/core/adoption/operations.ts", "assets/templates/runtime.gitignore"]) cpSync(join(root, path), join(cwd, path));
      const emitted = spawnSync(process.execPath, ["-e", 'import { GITIGNORE_MANAGED_BLOCK_CONTENT } from "./src/core/adoption/gitignore-plan.ts"; process.stdout.write(GITIGNORE_MANAGED_BLOCK_CONTENT)'], { cwd, encoding: "utf8" });
      expect(emitted.status).toBe(0);
      expect(emitted.stdout).toBe(GITIGNORE_MANAGED_BLOCK_CONTENT);
      rmSync(join(cwd, "assets/templates/runtime.gitignore"));
      writeFileSync(join(cwd, ".gitignore"), "private-notes/\n");
      const shell = spawnSync("bash", ["-c", 'source scripts/lib/project-init-lib.sh; pi_ensure_gitignore_block .gitignore'], { cwd, encoding: "utf8" });
      expect(shell.status).not.toBe(0);
      expect(shell.stderr).toContain("runtime.gitignore");
      expect(readFileSync(join(cwd, ".gitignore"), "utf8")).toBe("private-notes/\n");
      const missing = spawnSync(process.execPath, ["-e", 'import "./src/core/adoption/gitignore-plan.ts"'], { cwd, encoding: "utf8" });
      expect(missing.status).not.toBe(0);
      expect(missing.stderr).toContain("runtime.gitignore");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
  test("shell bootstrap and init emit identical rules and preserve user entries on reapply", () => {
    const root = join(import.meta.dir, "../..");
    const cwd = mkdtempSync(join(tmpdir(), "gitignore-authority-"));
    try {
      writeFileSync(join(cwd, ".gitignore"), "# user rules\nprivate-notes/\n");
      const result = spawnSync("bash", ["-euc", 'source "$1/scripts/lib/project-init-lib.sh"; pi_ensure_gitignore_block .gitignore "" "custom-local/"; pi_ensure_gitignore_block .gitignore "" "custom-local/"', "gitignore-test", root], { cwd, encoding: "utf8" });
      expect(result.status).toBe(0);
      const output = readFileSync(join(cwd, ".gitignore"), "utf8");
      expect(output.startsWith("# user rules\nprivate-notes/\n")).toBe(true);
      const body = output.split("# BEGIN: claude-runtime-temp (managed by repo-harness)\n")[1]!.split("# END: claude-runtime-temp")[0]!.trimEnd();
      expect(body).toBe(`${GITIGNORE_MANAGED_BLOCK_CONTENT}\ncustom-local/`);
      expect(output.match(/^custom-local\/$/gm)).toHaveLength(1);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
  test("managed block content ignores the whole .repo-harness directory", () => {
    const lines = GITIGNORE_MANAGED_BLOCK_CONTENT.split("\n");
    expect(lines).toContain(".repo-harness/");
  });

  test("managed block content no longer carries per-file .repo-harness entries", () => {
    const lines = GITIGNORE_MANAGED_BLOCK_CONTENT.split("\n");
    const perFile = lines.filter((line) => line.startsWith(".repo-harness/") && line !== ".repo-harness/");
    expect(perFile).toEqual([]);
    expect(GITIGNORE_MANAGED_BLOCK_CONTENT).not.toContain(".repo-harness/chatgpt-browser.local.json");
    expect(GITIGNORE_MANAGED_BLOCK_CONTENT).not.toContain(".repo-harness/chatgpt-browser.tokens.json");
  });

  test("the emitted operation carries the directory-level rule", () => {
    const operation = gitignoreManagedBlockOperation("planned");
    expect(operation.path).toBe(".gitignore");
    expect(operation.content.split("\n")).toContain(".repo-harness/");
    expect(operation.content).not.toContain(".repo-harness/chatgpt-browser.tokens.json");
  });

  test("extra content is appended without disturbing the directory rule", () => {
    const operation = gitignoreManagedBlockOperation("planned", "custom-local/\n");
    expect(operation.content.split("\n")).toContain(".repo-harness/");
    expect(operation.content).toContain("custom-local/");
  });
});

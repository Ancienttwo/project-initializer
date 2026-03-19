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
import {
  buildBenchmarkSummary,
  captureGitArtifacts,
  formatIterationName,
  initBenchmarkGitRepo,
  runSkillEvals,
} from "../scripts/run-skill-evals";

const ROOT = join(import.meta.dir, "..");

function tempPath(prefix: string): string {
  return mkdtempSync(join(tmpdir(), `${prefix}-`));
}

function writeExecutable(path: string, contents: string): void {
  writeFileSync(path, contents, "utf-8");
  spawnSync("chmod", ["+x", path], { encoding: "utf-8" });
}

function createStubCommands(dir: string): { claude: string; codex: string; fail: string } {
  const claudePath = join(dir, "claude-stub.sh");
  const codexPath = join(dir, "codex-stub.sh");
  const failPath = join(dir, "fail-stub.sh");

  writeExecutable(
    claudePath,
    `#!/usr/bin/env bash
set -euo pipefail
disable=0
prompt=""
for arg in "$@"; do
  if [[ "$arg" == "--disable-slash-commands" ]]; then
    disable=1
  fi
  prompt="$arg"
done
if [[ "$disable" -eq 0 && -L ".claude/skills/project-initializer" ]]; then
  printf "\\n- claude with skill\\n" >> AGENTS.md
  echo "claude with skill: $prompt"
else
  printf "\\n- claude baseline\\n" >> AGENTS.md
  echo "claude without skill: $prompt"
fi
`
  );

  writeExecutable(
    codexPath,
    `#!/usr/bin/env bash
set -euo pipefail
output=""
prompt=""
prev=""
for arg in "$@"; do
  if [[ "$prev" == "-o" ]]; then
    output="$arg"
  fi
  prompt="$arg"
  prev="$arg"
done
if grep -q "Benchmark Skill Wrapper" AGENTS.md 2>/dev/null; then
  printf "\\n- codex with skill\\n" >> tasks/todo.md
  echo "codex with skill: $prompt" > "$output"
else
  printf "\\n- codex baseline\\n" >> tasks/todo.md
  echo "codex without skill: $prompt" > "$output"
fi
echo "codex executed"
`
  );

  writeExecutable(
    failPath,
    `#!/usr/bin/env bash
set -euo pipefail
echo "simulated failure" >&2
exit 7
`
  );

  return { claude: claudePath, codex: codexPath, fail: failPath };
}

describe("run-skill-evals helpers", () => {
  test("formatIterationName builds a stable timestamped label", () => {
    const value = formatIterationName(new Date("2026-03-06T01:02:03Z"), "Bench Smoke");
    expect(value).toBe("iteration-20260306-010203-bench-smoke");
  });

  test("initBenchmarkGitRepo and captureGitArtifacts capture tracked and new files", () => {
    const cwd = tempPath("benchmark-git");
    try {
      writeFileSync(join(cwd, "README.md"), "# Fixture\n", "utf-8");
      initBenchmarkGitRepo(cwd);

      writeFileSync(join(cwd, "README.md"), "# Fixture changed\n", "utf-8");
      writeFileSync(join(cwd, "new-file.txt"), "new\n", "utf-8");

      const artifacts = captureGitArtifacts(cwd);
      expect(artifacts.changedFiles).toContain("README.md");
      expect(artifacts.changedFiles).toContain("new-file.txt");
      expect(artifacts.diffPatch).toContain("new-file.txt");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});

describe("run-skill-evals execution", () => {
  test("runs a filtered benchmark matrix with stubbed claude and codex commands", () => {
    const tempDir = tempPath("benchmark-run");
    const stubDir = join(tempDir, "bin");
    mkdirSync(stubDir, { recursive: true });
    const summaryPath = join(tempDir, "benchmark.md");
    const workspaceRoot = join(tempDir, "workspace");
    const configPath = join(tempDir, "benchmark.config.json");
    const stubs = createStubCommands(stubDir);

    writeFileSync(
      configPath,
      JSON.stringify(
        {
          workspaceRoot,
          summaryPath,
          agents: {
            claude: { command: stubs.claude, args: [] },
            codex: { command: stubs.codex, args: [] },
          },
          profiles: {
            with_skill: { skillPath: ROOT },
            without_skill: {},
          },
        },
        null,
        2
      ) + "\n",
      "utf-8"
    );

    try {
      const report = runSkillEvals({
        repoRoot: ROOT,
        configPath,
        evalFilters: ["repair-agents-task-sync"],
        now: new Date("2026-03-06T01:02:03Z"),
      });

      expect(report.records.length).toBe(4);
      expect(existsSync(summaryPath)).toBe(true);
      expect(existsSync(report.manifestPath)).toBe(true);

      const summary = readFileSync(summaryPath, "utf-8");
      expect(summary).toContain("## claude / with_skill");
      expect(summary).toContain("## codex / without_skill");
      expect(summary).toContain("repair-agents-task-sync");

      const claudeWithSkill = report.records.find(
        (record) => record.agent === "claude" && record.profile === "with_skill"
      );
      expect(claudeWithSkill).toBeDefined();
      expect(claudeWithSkill?.changedFiles.length).toBeGreaterThan(0);
      expect(existsSync(join(claudeWithSkill!.workspacePath, ".claude/skills/project-initializer"))).toBe(
        true
      );

      const codexWithSkill = report.records.find(
        (record) => record.agent === "codex" && record.profile === "with_skill"
      );
      expect(codexWithSkill).toBeDefined();
      expect(readFileSync(join(codexWithSkill!.workspacePath, "AGENTS.md"), "utf-8")).toContain(
        "Benchmark Skill Wrapper"
      );
      expect(readFileSync(codexWithSkill!.finalResponsePath, "utf-8")).toContain("codex with skill");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("records failures without crashing the full report generation", () => {
    const tempDir = tempPath("benchmark-fail");
    const stubDir = join(tempDir, "bin");
    mkdirSync(stubDir, { recursive: true });
    const summaryPath = join(tempDir, "benchmark.md");
    const workspaceRoot = join(tempDir, "workspace");
    const configPath = join(tempDir, "benchmark.config.json");
    const stubs = createStubCommands(stubDir);

    writeFileSync(
      configPath,
      JSON.stringify(
        {
          workspaceRoot,
          summaryPath,
          agents: {
            claude: { command: stubs.fail, args: [] },
            codex: { command: stubs.codex, args: [] },
          },
          profiles: {
            with_skill: { skillPath: ROOT },
            without_skill: {},
          },
        },
        null,
        2
      ) + "\n",
      "utf-8"
    );

    try {
      const report = runSkillEvals({
        repoRoot: ROOT,
        configPath,
        agent: "claude",
        profile: "with_skill",
        evalFilters: ["repair-agents-task-sync"],
        now: new Date("2026-03-06T01:02:03Z"),
      });

      expect(report.records).toHaveLength(1);
      expect(report.records[0].status).toBe("failed");
      expect(report.records[0].exitCode).toBe(7);
      expect(readFileSync(report.records[0].stderrPath, "utf-8")).toContain("simulated failure");

      const rendered = buildBenchmarkSummary(report, ROOT);
      expect(rendered).toContain("failed");
      expect(rendered).toContain("repair-agents-task-sync");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

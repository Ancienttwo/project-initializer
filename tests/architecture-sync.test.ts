import { describe, expect, test } from "bun:test";
import { copyFileSync, symlinkSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dir, "..");

function run(cmd: string, args: string[], cwd: string) {
  return spawnSync(cmd, args, { cwd, encoding: "utf-8", env: { ...process.env, REPO_HARNESS_CLI_BIN: join(cwd, "projection-cli"), HOME: join(cwd, "home") } });
}

function tmpRepo(fn: (cwd: string) => void): void {
  const cwd = mkdtempSync(join(tmpdir(), "architecture-sync-"));
  try {
    mkdirSync(join(cwd, "scripts"), { recursive: true });
    mkdirSync(join(cwd, "home"), { recursive: true });
    writeFileSync(join(cwd, "projection-cli"), `#!/bin/sh\nexec '${process.execPath}' '${join(ROOT, 'src/cli/index.ts')}' "$@"\n`, { mode: 0o755 });
    mkdirSync(join(cwd, ".ai/context"), { recursive: true });
    mkdirSync(join(cwd, ".ai/harness"), { recursive: true });
    mkdirSync(join(cwd, "apps/web"), { recursive: true });
    mkdirSync(join(cwd, "docs/architecture/requests"), { recursive: true });
    for (const file of [
      "check-architecture-sync.sh",
      "architecture-queue.sh",
      "architecture-event.ts",
      "capability-resolver.ts",
    ]) {
      const source = file === "capability-resolver.ts"
        ? join(ROOT, "assets/templates/helpers", file)
        : join(ROOT, "scripts", file);
      copyFileSync(source, join(cwd, "scripts", file));
    }
    expect(run("chmod", ["+x", "scripts/check-architecture-sync.sh", "scripts/architecture-queue.sh"], cwd).status).toBe(0);
    writeFileSync(
      join(cwd, ".ai/context/capabilities.json"),
      JSON.stringify(
        {
          version: 1,
          capabilities: [
            {
              id: "apps-web",
              domain: "apps-web",
              name: "web",
              prefixes: ["apps/web"],
              contract_files: {
                agents: "apps/web/AGENTS.md",
                claude: "apps/web/CLAUDE.md",
              },
              architecture_module: "docs/architecture/modules/apps-web/web.md",
              workstream_dir: "tasks/workstreams/apps-web/web",
              lsp_profile: "typescript-lsp",
              verification_hints: ["web checks"],
            },
          ],
        },
        null,
        2,
      ) + "\n",
    );
    writeFileSync(
      join(cwd, "docs/architecture/index.md"),
      ["# Architecture Index", "", "## Pending Requests", "", "- (none)", ""].join("\n"),
    );
    fn(cwd);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

function writePolicy(cwd: string, mode: "off" | "advisory" | "strict") {
  writeFileSync(
    join(cwd, ".ai/harness/policy.json"),
    JSON.stringify({ architecture: { freshness_gate: mode, gate_min_severity: "medium" } }, null, 2) + "\n",
  );
}

function writePendingCard(cwd: string, capabilityId = "apps-web", severity = "high") {
  const requestFile = `docs/architecture/requests/${capabilityId}.md`;
  const event = {
    ts: "2026-06-01T12:00:00+0800",
    file_path: "apps/web/src/routes/account.tsx",
    severity,
    functional_block: "apps/web",
    capability_id: capabilityId,
    matched_prefix: "apps/web",
    architecture_domain: "apps-web",
    architecture_capability: "web",
    architecture_module: "docs/architecture/modules/apps-web/web.md",
    workstream_dir: "tasks/workstreams/apps-web/web",
    contract_agents: "apps/web/AGENTS.md",
    contract_claude: "apps/web/CLAUDE.md",
    change_type: "workflow-surface",
    request_file: requestFile,
    spawn_recommended: false,
    contract_sync_required: false,
  };
  expect(run("bun", ["scripts/architecture-event.ts", "upsert-request", "--request-file", requestFile, "--event-json", JSON.stringify(event)], cwd).status).toBe(0);
  expect(run("bash", ["scripts/architecture-queue.sh", "reindex"], cwd).status).toBe(0);
}

function writeChangedFiles(cwd: string, paths: string[]) {
  writeFileSync(join(cwd, "changed.txt"), paths.join("\n") + "\n");
}

describe("architecture sync gate", () => {
  test("capability resolver batches match results from stdin", () => {
    tmpRepo((cwd) => {
      const res = run(
        "bash",
        ["-lc", "printf '%s\\n' apps/web/src/routes/account.tsx package.json | bun scripts/capability-resolver.ts match --paths-from - --format json"],
        cwd,
      );
      expect(res.status).toBe(0);
      const parsed = JSON.parse(res.stdout);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].capability_id).toBe("apps-web");
      expect(parsed[1].capability_id).toBe("root");
    });
  }, 30_000);

  test("strict blocks when a changed capability has a pending request at the threshold", () => {
    tmpRepo((cwd) => {
      writePolicy(cwd, "strict");
      writePendingCard(cwd);
      writeChangedFiles(cwd, ["apps/web/src/routes/account.tsx"]);

      const res = run("bash", ["scripts/check-architecture-sync.sh", "--changed-files", "changed.txt"], cwd);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain("blocking=1");
      expect(res.stderr).toContain("strict gate failed");
    });
  }, 30_000);

  test("advisory warns but exits zero for matching pending requests", () => {
    tmpRepo((cwd) => {
      writePolicy(cwd, "advisory");
      writePendingCard(cwd);
      writeChangedFiles(cwd, ["apps/web/src/routes/account.tsx"]);

      const res = run("bash", ["scripts/check-architecture-sync.sh", "--changed-files", "changed.txt"], cwd);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain("blocking=1");
      expect(res.stderr).toContain("WARN");
    });
  }, 30_000);

  test("off mode still checks index integrity but ignores freshness blocking", () => {
    tmpRepo((cwd) => {
      writePolicy(cwd, "off");
      writePendingCard(cwd);
      writeChangedFiles(cwd, ["apps/web/src/routes/account.tsx"]);

      const res = run("bash", ["scripts/check-architecture-sync.sh", "--changed-files", "changed.txt"], cwd);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain("mode=off");

      const json = run("bash", ["scripts/check-architecture-sync.sh", "--changed-files", "changed.txt", "--format", "json"], cwd);
      expect(json.status).toBe(0);
      expect(JSON.parse(json.stdout).projection).toMatchObject({
        provider: "disabled",
        apply: "disabled",
        state: "disabled",
        pending: 0,
        running: 0,
        dead_letters: 0,
        human_actions: 0,
        adoption_required: 0,
        blocking: 0,
      });
    });
  }, 30_000);

  test("stale architecture index fails in every mode", () => {
    tmpRepo((cwd) => {
      writePolicy(cwd, "off");
      writePendingCard(cwd);
      writeFileSync(
        join(cwd, "docs/architecture/index.md"),
        `${readFileSync(join(cwd, "docs/architecture/index.md"), "utf-8")}\n- [ ] stale -> [duplicate](requests/duplicate.md)\n`,
      );
      writeChangedFiles(cwd, ["apps/web/src/routes/account.tsx"]);

      const res = run("bash", ["scripts/check-architecture-sync.sh", "--changed-files", "changed.txt"], cwd);
      expect(res.status).toBe(1);
      expect(res.stderr).toContain("architecture request index is stale");
    });
  }, 30_000);

  test("strict projection gate reads unresolved acceptance candidates from CLI receipt state", () => {
    tmpRepo((cwd) => {
      writeFileSync(
        join(cwd, ".ai/harness/policy.json"),
        JSON.stringify({
          context: { capability_source: "registry" },
          architecture: {
            freshness_gate: "strict",
            gate_min_severity: "medium",
            projection_provider: "archctx",
            projection_apply: "automatic",
          },
        }, null, 2) + "\n",
      );
      mkdirSync(join(cwd, "src/cli"), { recursive: true });
      const statusFile = join(cwd, ".ai/harness/projection-status.json");
      const writeStatus = (unresolvedCandidates: number, invalidArtifacts = 0) => writeFileSync(statusFile, JSON.stringify({
        projectionProvider: { provider: "archctx", state: "ready", reason: "fixture provider ready" },
        apply: { mode: "automatic", enabled: true },
        acceptance: { unresolvedCandidates, invalidArtifacts },
      }));
      writeFileSync(join(cwd, "src/cli/index.ts"), `process.stdout.write(process.argv[3] === "policy" ? JSON.stringify({ provider: "archctx", applyMode: "automatic" }) : await Bun.file(${JSON.stringify(statusFile)}).text());\n`);
      writeChangedFiles(cwd, ["apps/web/src/routes/account.tsx"]);
      expect(run("bash", ["scripts/architecture-queue.sh", "reindex"], cwd).status).toBe(0);

      writeStatus(1);
      const blocked = run("bash", ["scripts/check-architecture-sync.sh", "--changed-files", "changed.txt"], cwd);
      expect(blocked.status).toBe(1);
      expect(blocked.stdout).toContain("human_actions=1");
      expect(blocked.stderr).toContain("strict gate failed");

      writeStatus(0);
      const resolved = run("bash", ["scripts/check-architecture-sync.sh", "--changed-files", "changed.txt"], cwd);
      expect(resolved.status).toBe(0);
      expect(resolved.stdout).toContain("human_actions=0");
    });
  }, 30_000);

  test("missing resolver is advisory in advisory mode and fail-closed in strict mode", () => {
    tmpRepo((cwd) => {
      writePendingCard(cwd);
      writeChangedFiles(cwd, ["apps/web/src/routes/account.tsx"]);
      rmSync(join(cwd, "scripts/capability-resolver.ts"), { force: true });

      writePolicy(cwd, "advisory");
      const advisory = run("bash", ["scripts/check-architecture-sync.sh", "--changed-files", "changed.txt"], cwd);
      expect(advisory.status).toBe(0);
      expect(advisory.stderr).toContain("WARN");

      writePolicy(cwd, "strict");
      const strict = run("bash", ["scripts/check-architecture-sync.sh", "--changed-files", "changed.txt"], cwd);
      expect(strict.status).toBe(1);
      expect(strict.stderr).toContain("strict gate failed");
    });
  }, 30_000);
});


test("global projection policy remains readable with Node and no jq", () => {
  tmpRepo((cwd) => {
    const bin = join(cwd, "bin");
    mkdirSync(bin);
    symlinkSync(process.execPath, join(bin, "bun"));
    const node = spawnSync("which", ["node"], { encoding: "utf8" }).stdout.trim();
    symlinkSync(node, join(bin, "node"));
    expect(run("bash", ["scripts/architecture-queue.sh", "reindex"], cwd).status).toBe(0);
    writePolicy(cwd, "advisory");
    const result = spawnSync("/bin/bash", ["scripts/check-architecture-sync.sh", "--mode", "off", "--format", "json"], {
      cwd, encoding: "utf8", env: { ...process.env, HOME: join(cwd, "home"), PATH: `${bin}:/usr/bin:/bin`, REPO_HARNESS_CLI_BIN: join(cwd, "projection-cli") },
    });
    if (result.status !== 0) throw new Error(result.stderr + result.stdout);
    expect(result.stderr).not.toContain("jq: command not found");
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).projection.provider).toBe("disabled");
    writeFileSync(join(cwd, "projection-cli"), `#!/bin/sh
if [ "$2" = policy ]; then
  printf '%s\\n' '{"provider":"archctx","applyMode":"automatic"}'
else
  printf '%s\\n' 'not-json'
fi
`, { mode: 0o755 });
    const malformed = spawnSync("/bin/bash", ["scripts/check-architecture-sync.sh", "--mode", "off", "--format", "json"], {
      cwd, encoding: "utf8", env: { ...process.env, HOME: join(cwd, "home"), PATH: `${bin}:/usr/bin:/bin`, REPO_HARNESS_CLI_BIN: join(cwd, "projection-cli") },
    });
    expect(malformed.status).toBe(1);
    expect(malformed.stderr).toContain("invalid global projection readiness");
  });
}, 60000);

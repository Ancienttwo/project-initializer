import { describe, expect, test } from "bun:test";
import {
  chmodSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dir, "..");
const SCRIPT = join(ROOT, "scripts/check-agent-tooling.sh");

function writeExecutable(filePath: string, content: string) {
  writeFileSync(filePath, content);
  chmodSync(filePath, 0o755);
}

function setupFakeEnvironment(prefix: string) {
  const root = mkdtempSync(join(tmpdir(), `${prefix}-`));
  const home = join(root, "home");
  const fakeBin = join(root, "fakebin");

  mkdirSync(home, { recursive: true });
  mkdirSync(fakeBin, { recursive: true });

  return { root, home, fakeBin };
}

describe("check-agent-tooling", () => {
  test("reports gstack and Waza presence while keeping gbrain manual-only when MCP is disabled", () => {
    const envRoot = setupFakeEnvironment("check-agent-tooling");
    try {
      mkdirSync(join(envRoot.home, ".claude", "skills", "gstack"), { recursive: true });
      mkdirSync(join(envRoot.home, ".codex", "skills", "gstack"), { recursive: true });
      mkdirSync(join(envRoot.home, ".agents"), { recursive: true });
      writeFileSync(join(envRoot.home, ".claude", "skills", "gstack", "VERSION"), "1.2.3\n");
      writeFileSync(join(envRoot.home, ".claude", "settings.json"), "{}\n");
      writeFileSync(join(envRoot.home, ".codex", "config.toml"), "# no gbrain mcp\n");
      writeFileSync(
        join(envRoot.home, ".agents", ".skill-lock.json"),
        JSON.stringify(
          {
            skills: {
              check: { source: "tw93/Waza" },
              read: { source: "tw93/Waza" },
            },
          },
          null,
          2
        )
      );

      writeExecutable(
        join(envRoot.fakeBin, "npx"),
        [
          "#!/bin/bash",
          "set -euo pipefail",
          "if [[ \"$*\" == *\"skills ls -g --json\"* ]]; then",
          "  cat <<'EOF'",
          '[{"name":"check","agents":["Claude Code","Codex"]},{"name":"read","agents":["Claude Code","Codex"]}]',
          "EOF",
          "  exit 0",
          "fi",
          "if [[ \"$*\" == *\"skills check\"* ]]; then",
          "  echo 'all skills are up to date'",
          "  exit 0",
          "fi",
          "exit 1",
          "",
        ].join("\n")
      );

      writeExecutable(
        join(envRoot.fakeBin, "gbrain"),
        [
          "#!/bin/bash",
          "set -euo pipefail",
          "case \"$1 ${2:-}\" in",
          "  \"--version \")",
          "    echo 'gbrain 0.12.0'",
          "    ;;",
          "  \"doctor --json\")",
          "    echo '{\"status\":\"warnings\",\"health_score\":90}'",
          "    ;;",
          "  \"integrations list\")",
          "    echo '{\"local\":[\"repo-sync\"]}'",
          "    ;;",
          "  \"check-update --json\")",
          "    echo '{\"update_available\":false}'",
          "    ;;",
          "  *)",
          "    exit 1",
          "    ;;",
          "esac",
          "",
        ].join("\n")
      );

      const res = spawnSync("bash", [SCRIPT, "--json", "--host", "both"], {
        cwd: ROOT,
        encoding: "utf-8",
        env: {
          ...process.env,
          HOME: envRoot.home,
          PATH: `${envRoot.fakeBin}:${process.env.PATH ?? ""}`,
        },
      });

      expect(res.status).toBe(0);
      const report = JSON.parse(res.stdout);
      expect(report.tools.gstack.status).toBe("present");
      expect(report.tools.gstack.hosts.claude.version).toBe("1.2.3");
      expect(report.tools.waza.status).toBe("present");
      expect(report.tools.waza.source_repo).toBe("tw93/Waza");
      expect(report.tools.waza.hosts.claude.installed_skills).toEqual(["check", "read"]);
      expect(report.tools.gbrain.status).toBe("warning");
      expect(report.tools.gbrain.mcp_hosts.claude.status).toBe("disabled");
      expect(report.tools.gbrain.mcp_hosts.codex.status).toBe("disabled");
      expect(report.tools.gbrain.impact.knowledge_tasks).toBe("manual-only");
    } finally {
      rmSync(envRoot.root, { recursive: true, force: true });
    }
  });

  test("uses only read-only probes during update checks", () => {
    const envRoot = setupFakeEnvironment("check-agent-tooling-updates");
    const logFile = join(envRoot.root, "tool.log");
    try {
      mkdirSync(join(envRoot.home, ".claude", "skills", "gstack", ".git"), { recursive: true });
      mkdirSync(join(envRoot.home, ".codex", "skills", "gstack", ".git"), { recursive: true });
      mkdirSync(join(envRoot.home, ".agents"), { recursive: true });
      writeFileSync(join(envRoot.home, ".claude", "skills", "gstack", "VERSION"), "1.2.3\n");
      writeFileSync(
        join(envRoot.home, ".agents", ".skill-lock.json"),
        JSON.stringify({ skills: { check: { source: "tw93/Waza" } } }, null, 2)
      );
      writeFileSync(join(envRoot.home, ".claude", "settings.json"), "{}\n");
      writeFileSync(join(envRoot.home, ".codex", "config.toml"), "# no gbrain mcp\n");

      writeExecutable(
        join(envRoot.fakeBin, "git"),
        [
          "#!/bin/bash",
          "set -euo pipefail",
          `echo "git $*" >> "${logFile}"`,
          "case \"$*\" in",
          "  *\"remote get-url origin\"*) echo 'https://github.com/garrytan/gstack.git' ;;",
          "  *\"rev-parse HEAD\"*) echo 'abc123' ;;",
          "  *\"ls-remote --symref origin HEAD\"*) printf 'ref: refs/heads/main\\tHEAD\\nabc123\\tHEAD\\n' ;;",
          "  *) exit 1 ;;",
          "esac",
          "",
        ].join("\n")
      );

      writeExecutable(
        join(envRoot.fakeBin, "npx"),
        [
          "#!/bin/bash",
          "set -euo pipefail",
          `echo "npx $*" >> "${logFile}"`,
          "if [[ \"$*\" == *\"skills ls -g --json\"* ]]; then",
          "  echo '[{\"name\":\"check\",\"agents\":[\"Claude Code\",\"Codex\"]}]'",
          "  exit 0",
          "fi",
          "if [[ \"$*\" == *\"skills check\"* ]]; then",
          "  echo 'all skills are up to date'",
          "  exit 0",
          "fi",
          "exit 1",
          "",
        ].join("\n")
      );

      writeExecutable(
        join(envRoot.fakeBin, "gbrain"),
        [
          "#!/bin/bash",
          "set -euo pipefail",
          `echo "gbrain $*" >> "${logFile}"`,
          "case \"$1 ${2:-}\" in",
          "  \"--version \")",
          "    echo 'gbrain 0.12.0'",
          "    ;;",
          "  \"doctor --json\")",
          "    echo '{\"status\":\"ok\",\"health_score\":100}'",
          "    ;;",
          "  \"check-update --json\")",
          "    echo '{\"update_available\":false}'",
          "    ;;",
          "  \"integrations list\")",
          "    echo '{\"local\":[\"repo-sync\"]}'",
          "    ;;",
          "  *)",
          "    exit 1",
          "    ;;",
          "esac",
          "",
        ].join("\n")
      );

      const res = spawnSync("bash", [SCRIPT, "--json", "--check-updates", "--host", "both"], {
        cwd: ROOT,
        encoding: "utf-8",
        env: {
          ...process.env,
          HOME: envRoot.home,
          PATH: `${envRoot.fakeBin}:${process.env.PATH ?? ""}`,
        },
      });

      expect(res.status).toBe(0);
      const log = readFileSync(logFile, "utf-8");
      expect(log).toContain("git -C");
      expect(log).toContain("remote get-url origin");
      expect(log).toContain("rev-parse HEAD");
      expect(log).toContain("ls-remote --symref origin HEAD");
      expect(log).toContain("npx -y skills ls -g --json");
      expect(log).toContain("npx -y skills check");
      expect(log).toContain("gbrain doctor --json");
      expect(log).toContain("gbrain check-update --json");
      expect(log).toContain("gbrain integrations list --json");
      expect(log).not.toContain("setup");
      expect(log).not.toContain("skills update");
      expect(log).not.toContain("gbrain serve");
      expect(log).not.toContain("gbrain sync");
      expect(log).not.toContain("gbrain upgrade");
    } finally {
      rmSync(envRoot.root, { recursive: true, force: true });
    }
  });
});

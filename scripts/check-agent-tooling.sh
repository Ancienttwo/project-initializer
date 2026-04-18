#!/bin/bash
set -euo pipefail

if command -v node >/dev/null 2>&1; then
  RUNTIME_BIN="$(command -v node)"
elif command -v bun >/dev/null 2>&1; then
  RUNTIME_BIN="$(command -v bun)"
elif [[ -x "${HOME}/.bun/bin/bun" ]]; then
  RUNTIME_BIN="${HOME}/.bun/bin/bun"
else
  echo "check-agent-tooling.sh requires node or bun" >&2
  exit 1
fi

exec "$RUNTIME_BIN" - "$@" <<'NODE_EOF'
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const argv = process.argv.slice(2);
let jsonOutput = false;
let checkUpdates = false;
let hostMode = "both";

function usage() {
  console.log(`Usage: scripts/check-agent-tooling.sh [--json] [--check-updates] [--host claude|codex|both]`);
}

for (let index = 0; index < argv.length; index += 1) {
  const arg = argv[index];
  if (arg === "--json") {
    jsonOutput = true;
    continue;
  }
  if (arg === "--check-updates") {
    checkUpdates = true;
    continue;
  }
  if (arg === "--host") {
    const next = argv[index + 1];
    if (!next) {
      console.error("--host requires claude, codex, or both");
      process.exit(1);
    }
    hostMode = next;
    index += 1;
    continue;
  }
  if (arg === "--help" || arg === "-h") {
    usage();
    process.exit(0);
  }
  console.error(`Unknown argument: ${arg}`);
  usage();
  process.exit(1);
}

if (!["claude", "codex", "both"].includes(hostMode)) {
  console.error(`Unsupported host: ${hostMode}`);
  process.exit(1);
}

const HOME = os.homedir();
const REPO_ROOT = process.cwd();
const SELECTED_HOSTS = hostMode === "both" ? ["claude", "codex"] : [hostMode];
const HOSTS = {
  claude: {
    label: "Claude Code",
    agentLabel: "Claude Code",
    gstackDir: path.join(HOME, ".claude", "skills", "gstack"),
    configPath: path.join(HOME, ".claude", "settings.json"),
  },
  codex: {
    label: "Codex",
    agentLabel: "Codex",
    gstackDir: path.join(HOME, ".codex", "skills", "gstack"),
    configPath: path.join(HOME, ".codex", "config.toml"),
  },
};

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (_error) {
    return "";
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_error) {
    return null;
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? REPO_ROOT,
    encoding: "utf8",
    env: { ...process.env, ...(options.env ?? {}) },
    timeout: options.timeoutMs ?? 0,
  });

  return {
    ok: result.status === 0 && !result.error,
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    error: result.error ? String(result.error.message || result.error) : "",
    timed_out: result.error?.code === "ETIMEDOUT",
  };
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch (_error) {
    return null;
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function summarizeStatus(hostStatuses) {
  const values = Object.values(hostStatuses);
  const presentCount = values.filter((entry) => entry.present).length;
  if (presentCount === 0) return "missing";
  if (presentCount === values.length) return "present";
  return "partial";
}

function detectRepoGstackTeamMode() {
  const claudeMd = readText(path.join(REPO_ROOT, "CLAUDE.md"));
  const settings = readText(path.join(REPO_ROOT, ".claude", "settings.json"));
  const hookPath = path.join(REPO_ROOT, ".claude", "hooks", "check-gstack.sh");

  if (settings.includes("check-gstack.sh") || fs.existsSync(hookPath) || claudeMd.includes("## gstack (REQUIRED")) {
    return {
      status: "required",
      reason: "Repo has gstack enforcement traces (required CLAUDE.md section or check-gstack hook).",
    };
  }

  if (claudeMd.includes("## gstack")) {
    return {
      status: "optional",
      reason: "Repo has a gstack guidance section in CLAUDE.md but no enforcement hook.",
    };
  }

  return {
    status: "not-detected",
    reason: "No repo-local gstack team-mode traces detected in CLAUDE.md or .claude/hooks/.",
  };
}

function detectGstack() {
  const hostStatuses = {};

  for (const host of SELECTED_HOSTS) {
    const meta = HOSTS[host];
    const present = fs.existsSync(meta.gstackDir);
    const versionFile = path.join(meta.gstackDir, "VERSION");
    const gitDir = path.join(meta.gstackDir, ".git");
    const version = present && fs.existsSync(versionFile) ? readText(versionFile).trim() : "";
    let updateStatus = checkUpdates ? "unknown" : "not-checked";
    let origin = "";
    let head = "";
    let remoteHead = "";
    let updateReason = "";

    if (present && checkUpdates && fs.existsSync(gitDir)) {
      const originResult = run("git", ["-C", meta.gstackDir, "remote", "get-url", "origin"], { timeoutMs: 1000 });
      if (originResult.ok) {
        origin = originResult.stdout.trim();
      }

      const headResult = run("git", ["-C", meta.gstackDir, "rev-parse", "HEAD"], { timeoutMs: 1000 });
      if (headResult.ok) {
        head = headResult.stdout.trim();
      }

      const remoteResult = run("git", ["-C", meta.gstackDir, "ls-remote", "--symref", "origin", "HEAD"], { timeoutMs: 1500 });
      if (remoteResult.ok) {
        const match = remoteResult.stdout.match(/^([0-9a-f]+)\s+HEAD$/m);
        remoteHead = match ? match[1] : "";
      }

      if (head && remoteHead) {
        updateStatus = head === remoteHead ? "up-to-date" : "update-available";
        updateReason = head === remoteHead
          ? "Local gstack matches origin/HEAD."
          : "Local gstack HEAD differs from origin/HEAD."
      } else if (origin || head) {
        updateStatus = "unknown";
        updateReason = remoteResult.timed_out
          ? "Timed out while checking gstack origin/HEAD."
          : "Unable to resolve both local and remote HEAD for gstack."
      }
    } else if (present) {
      updateStatus = checkUpdates ? "unknown" : "not-checked";
      updateReason = fs.existsSync(gitDir)
        ? "Update checks were skipped."
        : "gstack install is present but not a full git checkout in this host path.";
    }

    hostStatuses[host] = {
      label: meta.label,
      present,
      path: meta.gstackDir,
      version: version || null,
      origin: origin || null,
      head: head || null,
      remote_head: remoteHead || null,
      update_status: updateStatus,
      reason: present
        ? (updateReason || `Detected gstack at ${meta.gstackDir}.`)
        : `Missing gstack at ${meta.gstackDir}.`,
      install_command: host === "claude"
        ? "git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup"
        : `${fs.existsSync(HOSTS.claude.gstackDir) ? "cd ~/.claude/skills/gstack" : "git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack"} && ./setup --host codex`,
      upgrade_command: host === "claude"
        ? "cd ~/.claude/skills/gstack && git pull && ./setup"
        : "cd ~/.claude/skills/gstack && git pull && ./setup --host codex",
    };
  }

  const repoTeamMode = detectRepoGstackTeamMode();
  const status = summarizeStatus(hostStatuses);
  const selectedMeta = Object.values(hostStatuses);
  const installCommand = SELECTED_HOSTS.length === 2
    ? "git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup && ./setup --host codex"
    : selectedMeta[0].install_command;
  const upgradeCommand = SELECTED_HOSTS.length === 2
    ? "cd ~/.claude/skills/gstack && git pull && ./setup && ./setup --host codex"
    : selectedMeta[0].upgrade_command;

  return {
    name: "gstack",
    status,
    reason: status === "present"
      ? `Detected gstack in all requested hosts (${SELECTED_HOSTS.join(", ")}).`
      : status === "partial"
        ? `Detected gstack in ${selectedMeta.filter((entry) => entry.present).length}/${selectedMeta.length} requested hosts.`
        : "gstack is missing from all requested hosts.",
    hosts: hostStatuses,
    repo_team_mode: repoTeamMode,
    install_command: installCommand,
    upgrade_command: upgradeCommand,
    impact: {
      complex_tasks: status === "present" ? "full" : status === "partial" ? "degraded" : "missing",
      simple_tasks: "unaffected",
      knowledge_tasks: "unaffected",
    },
  };
}

function detectWaza() {
  const skillLockPath = path.join(HOME, ".agents", ".skill-lock.json");
  const skillLock = readJson(skillLockPath);
  const skillsResult = run("npx", ["-y", "skills", "ls", "-g", "--json"], { timeoutMs: 1500 });
  const skillItems = skillsResult.ok ? parseJson(skillsResult.stdout) || [] : [];
  const wazaEntries = Object.entries(skillLock?.skills || {}).filter(([, meta]) => meta?.source === "tw93/Waza");
  const wazaNames = new Set(wazaEntries.map(([name]) => name));
  const hostStatuses = {};

  for (const host of SELECTED_HOSTS) {
    const meta = HOSTS[host];
    const installedSkills = skillItems
      .filter((item) => wazaNames.has(item.name) && Array.isArray(item.agents) && item.agents.includes(meta.agentLabel))
      .map((item) => item.name)
      .sort();
    hostStatuses[host] = {
      label: meta.label,
      present: installedSkills.length > 0,
      installed_skills: installedSkills,
      reason: installedSkills.length > 0
        ? `Detected ${installedSkills.length} tw93/Waza skills for ${meta.label} via skills ls + ~/.agents/.skill-lock.json.`
        : `No tw93/Waza skills detected for ${meta.label}.`,
    };
  }

  let updateStatus = checkUpdates ? "unknown" : "not-checked";
  let updateReason = checkUpdates ? "skills check did not run." : "Update checks were skipped.";
  if (checkUpdates) {
    const checkResult = run("npx", ["-y", "skills", "check"], { timeoutMs: 1500 });
    const combined = `${checkResult.stdout}\n${checkResult.stderr}`.trim();
    const installedNames = [...wazaNames];
    if (checkResult.ok && /all skills are up to date/i.test(combined)) {
      updateStatus = "up-to-date";
      updateReason = "skills check reports that all installed skills are up to date.";
    } else if (checkResult.ok && (/(tw93\/Waza)/i.test(combined) || installedNames.some((name) => new RegExp(`\\b${escapeRegex(name)}\\b`, "i").test(combined)))) {
      updateStatus = "update-available";
      updateReason = "skills check reported updates for tw93/Waza skills.";
    } else if (combined) {
      updateStatus = "unknown";
      updateReason = "skills check returned output, but it could not be attributed to tw93/Waza only.";
    } else if (checkResult.timed_out) {
      updateStatus = "unknown";
      updateReason = "skills check timed out before Waza updates could be determined.";
    } else if (!checkResult.ok) {
      updateStatus = "unknown";
      updateReason = "skills check failed or the skills CLI is unavailable.";
    }
  }

  const status = summarizeStatus(hostStatuses);
  const installCommand = `npx -y skills add tw93/Waza -g -a ${
    hostMode === "both" ? "claude-code codex" : hostMode === "claude" ? "claude-code" : "codex"
  } -s check design health hunt learn read think write -y`;

  return {
    name: "waza",
    status: skillsResult.ok ? status : "missing",
    reason: skillsResult.ok
      ? (status === "present"
        ? `Source-aware Waza detection succeeded via ~/.agents/.skill-lock.json (${wazaEntries.length} skills).`
        : status === "partial"
          ? "Waza skills are only installed for some requested hosts."
          : "No tw93/Waza skills matched the requested hosts.")
      : skillsResult.timed_out
        ? "npx skills ls -g --json timed out, so Waza could not be detected."
        : "npx skills ls -g --json is unavailable, so Waza could not be detected.",
    source_lock_file: fs.existsSync(skillLockPath) ? skillLockPath : null,
    source_repo: wazaEntries.length > 0 ? "tw93/Waza" : null,
    hosts: hostStatuses,
    update_status: updateStatus,
    update_reason: updateReason,
    install_command: installCommand,
    upgrade_command: "npx -y skills update",
    impact: {
      complex_tasks: "unaffected",
      simple_tasks: skillsResult.ok
        ? (status === "present" ? "full" : status === "partial" ? "degraded" : "missing")
        : "missing",
      knowledge_tasks: "unaffected",
    },
  };
}

function detectGbrainMcp(host) {
  const meta = HOSTS[host];
  const content = readText(meta.configPath);
  if (!content) {
    return {
      status: "disabled",
      reason: `No ${meta.label} config found at ${meta.configPath}.`,
    };
  }

  if (host === "codex") {
    if (/\[mcp_servers\.(gbrain|gbrain_http)\]/.test(content)) {
      return {
        status: "configured",
        reason: "Codex config contains a gbrain MCP server entry.",
      };
    }

    return {
      status: "disabled",
      reason: "Codex config does not contain a gbrain MCP server entry.",
    };
  }

  if (/gbrain/i.test(content)) {
    return {
      status: "configured",
      reason: "Claude settings contain a gbrain reference.",
    };
  }

  return {
    status: "disabled",
    reason: "Claude settings do not contain a gbrain MCP configuration.",
  };
}

function detectGbrain() {
  const versionResult = run("gbrain", ["--version"], { timeoutMs: 1000 });
  const present = versionResult.ok;
  const version = present ? versionResult.stdout.trim().replace(/^gbrain\s+/i, "") : null;
  const doctorResult = present ? run("gbrain", ["doctor", "--json"], { timeoutMs: 1500 }) : null;
  const doctorJson = doctorResult?.ok ? parseJson(doctorResult.stdout) : null;
  const checkUpdateResult = present && checkUpdates ? run("gbrain", ["check-update", "--json"], { timeoutMs: 1500 }) : null;
  const checkUpdateJson = checkUpdateResult?.ok ? parseJson(checkUpdateResult.stdout) : null;
  const integrationsResult = present ? run("gbrain", ["integrations", "list", "--json"], { timeoutMs: 1500 }) : null;
  const integrationsJson = integrationsResult?.ok ? parseJson(integrationsResult.stdout) : null;
  const integrationsAvailable = integrationsJson
    ? Object.values(integrationsJson).reduce((count, value) => count + (Array.isArray(value) ? value.length : 0), 0)
    : 0;
  const mcpHosts = {};

  for (const host of SELECTED_HOSTS) {
    mcpHosts[host] = {
      label: HOSTS[host].label,
      ...detectGbrainMcp(host),
    };
  }

  const mcpConfigured = Object.values(mcpHosts).some((entry) => entry.status === "configured");
  const status = !present
    ? "missing"
    : (doctorJson?.status === "ok" ? "present" : doctorJson?.status === "warnings" ? "warning" : "warning");
  const updateStatus = !checkUpdates
    ? "not-checked"
    : checkUpdateJson?.update_available
      ? "update-available"
      : checkUpdateJson
        ? "up-to-date"
        : "unknown";

  return {
    name: "gbrain",
    status,
    reason: !present
      ? "gbrain CLI is not installed."
      : doctorJson
        ? `gbrain CLI is present; doctor status is ${doctorJson.status}.`
        : "gbrain CLI is present, but doctor output could not be parsed.",
    cli_present: present,
    version,
    doctor: doctorJson,
    update_status: updateStatus,
    update_reason: checkUpdateJson?.error
      ? `gbrain check-update returned ${checkUpdateJson.error}.`
      : checkUpdateResult?.timed_out
        ? "gbrain check-update timed out before update status could be determined."
      : updateStatus === "update-available"
        ? "gbrain check-update reports a newer version."
        : updateStatus === "up-to-date"
          ? "gbrain check-update did not find a newer version."
          : "gbrain update status is unknown.",
    integrations_available: integrationsAvailable,
    mcp_hosts: mcpHosts,
    install_command: "bun add -g gbrain",
    upgrade_command: checkUpdateJson?.upgrade_command || "gbrain upgrade",
    sync_command: "gbrain sync --repo <path>",
    impact: {
      complex_tasks: "unaffected",
      simple_tasks: "unaffected",
      knowledge_tasks: !present
        ? "missing"
        : mcpConfigured
          ? "full"
          : "manual-only",
    },
  };
}

const report = {
  generated_at: new Date().toISOString(),
  repo_root: REPO_ROOT,
  hosts: SELECTED_HOSTS,
  check_updates: checkUpdates,
  tools: {
    gstack: detectGstack(),
    waza: detectWaza(),
    gbrain: detectGbrain(),
  },
};

function printText(result) {
  console.log("External Tooling Report");
  console.log(`Hosts: ${result.hosts.join(", ")}`);
  console.log("");

  const gstack = result.tools.gstack;
  console.log(`gstack [${gstack.status}]`);
  for (const host of SELECTED_HOSTS) {
    const entry = gstack.hosts[host];
    const versionBits = entry.version ? ` v${entry.version}` : "";
    const updateBits = entry.update_status && entry.update_status !== "not-checked" ? `, ${entry.update_status}` : "";
    console.log(`  - ${entry.label}: ${entry.present ? "present" : "missing"}${versionBits}${updateBits}`);
  }
  console.log(`  - Team mode: ${gstack.repo_team_mode.status} (${gstack.repo_team_mode.reason})`);
  console.log(`  - Impact: complex=${gstack.impact.complex_tasks}`);
  console.log(`  - Install: ${gstack.install_command}`);
  console.log(`  - Upgrade: ${gstack.upgrade_command}`);
  console.log("");

  const waza = result.tools.waza;
  console.log(`Waza [${waza.status}]`);
  console.log(`  - Source lock: ${waza.source_lock_file || "not found"}`);
  for (const host of SELECTED_HOSTS) {
    const entry = waza.hosts[host];
    console.log(`  - ${entry.label}: ${entry.present ? `${entry.installed_skills.length} skills` : "missing"}${entry.installed_skills.length ? ` (${entry.installed_skills.join(", ")})` : ""}`);
  }
  console.log(`  - Updates: ${waza.update_status} (${waza.update_reason})`);
  console.log(`  - Impact: simple=${waza.impact.simple_tasks}`);
  console.log(`  - Install: ${waza.install_command}`);
  console.log(`  - Upgrade: ${waza.upgrade_command}`);
  console.log("");

  const gbrain = result.tools.gbrain;
  console.log(`gbrain [${gbrain.status}]`);
  console.log(`  - CLI: ${gbrain.cli_present ? `present${gbrain.version ? ` (v${gbrain.version})` : ""}` : "missing"}`);
  if (gbrain.doctor?.status) {
    console.log(`  - Doctor: ${gbrain.doctor.status} (score ${gbrain.doctor.health_score ?? "n/a"})`);
  }
  for (const host of SELECTED_HOSTS) {
    const entry = gbrain.mcp_hosts[host];
    console.log(`  - ${entry.label} MCP: ${entry.status}`);
  }
  if (gbrain.integrations_available) {
    console.log(`  - Integrations available: ${gbrain.integrations_available}`);
  }
  console.log(`  - Updates: ${gbrain.update_status} (${gbrain.update_reason})`);
  console.log(`  - Impact: knowledge=${gbrain.impact.knowledge_tasks}`);
  console.log(`  - Install: ${gbrain.install_command}`);
  console.log(`  - Upgrade: ${gbrain.upgrade_command}`);
  console.log(`  - Manual sync: ${gbrain.sync_command}`);
}

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  printText(report);
}
NODE_EOF

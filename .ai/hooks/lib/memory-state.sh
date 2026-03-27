#!/bin/bash
# Shared Claude auto memory discovery and snapshot helpers.

memory_state_now_epoch() {
  date +%s
}

memory_state_sha256_string() {
  local value="${1:-}"

  if command -v shasum >/dev/null 2>&1; then
    printf '%s' "$value" | shasum -a 256 | awk '{print $1}'
    return
  fi

  if command -v sha256sum >/dev/null 2>&1; then
    printf '%s' "$value" | sha256sum | awk '{print $1}'
    return
  fi

  if command -v openssl >/dev/null 2>&1; then
    printf '%s' "$value" | openssl dgst -sha256 -r | awk '{print $1}'
    return
  fi

  printf '%s' "$value" | cksum | awk '{print $1}'
}

memory_state_read_json_file_field() {
  local file_path="$1"
  local path="$2"

  [[ -f "$file_path" ]] || return 1

  if command -v jq >/dev/null 2>&1; then
    jq -r "$path // empty" "$file_path" 2>/dev/null || true
    return 0
  fi

  if command -v bun >/dev/null 2>&1; then
    JSON_FILE="$file_path" JSON_PATH="$path" bun -e '
      const fs = require("fs");
      const raw = fs.readFileSync(process.env.JSON_FILE, "utf8");
      const path = (process.env.JSON_PATH ?? "").split(".").filter(Boolean);
      if (!raw) process.exit(1);
      let value = JSON.parse(raw);
      for (const key of path) {
        if (value == null || !(key in value)) process.exit(1);
        value = value[key];
      }
      if (value == null) process.exit(1);
      process.stdout.write(typeof value === "object" ? JSON.stringify(value) : String(value));
    ' 2>/dev/null || true
  fi
}

memory_state_setting_from_scope() {
  local file_path="$1"
  local key="$2"
  local value

  value="$(memory_state_read_json_file_field "$file_path" ".$key")"
  if [[ -n "$value" ]]; then
    printf '%s' "$value"
    return 0
  fi

  return 1
}

memory_state_auto_memory_enabled() {
  local project_settings="${HOOK_REPO_ROOT:-$(pwd)}/.claude/settings.json"
  local local_settings="${HOOK_REPO_ROOT:-$(pwd)}/.claude/settings.local.json"
  local user_settings="${HOME}/.claude/settings.json"
  local user_local_settings="${HOME}/.claude/settings.local.json"
  local value

  for file_path in "$local_settings" "$project_settings" "$user_local_settings" "$user_settings"; do
    value="$(memory_state_setting_from_scope "$file_path" "autoMemoryEnabled" || true)"
    case "$value" in
      false|FALSE|0) printf '0'; return 0 ;;
      true|TRUE|1) printf '1'; return 0 ;;
    esac
  done

  if [[ "${CLAUDE_CODE_DISABLE_AUTO_MEMORY:-0}" == "1" ]]; then
    printf '0'
    return 0
  fi

  printf '1'
}

memory_state_auto_memory_base_dir() {
  local local_settings="${HOOK_REPO_ROOT:-$(pwd)}/.claude/settings.local.json"
  local user_settings="${HOME}/.claude/settings.json"
  local user_local_settings="${HOME}/.claude/settings.local.json"
  local value

  for file_path in "$local_settings" "$user_local_settings" "$user_settings"; do
    value="$(memory_state_setting_from_scope "$file_path" "autoMemoryDirectory" || true)"
    if [[ -n "$value" ]]; then
      value="${value/#\~/$HOME}"
      printf '%s' "$value"
      return 0
    fi
  done

  printf '%s' "${HOME}/.claude/projects"
}

memory_state_project_key_from_repo() {
  local repo_root="${HOOK_REPO_ROOT:-$(pwd)}"
  printf '%s' "$repo_root" | sed -E 's#^/##; s#[^A-Za-z0-9._-]+#-#g; s#-+#-#g; s#^-+##; s#-+$##'
}

memory_state_project_dir_from_transcript() {
  local transcript_path="$1"

  [[ -n "$transcript_path" ]] || return 1
  [[ "$transcript_path" == */.claude/projects/* ]] || return 1

  dirname "$transcript_path"
}

memory_state_resolve_memory_dir() {
  local transcript_path="$1"
  local memory_base default_base project_dir project_key project_name

  if [[ "$(memory_state_auto_memory_enabled)" != "1" ]]; then
    return 1
  fi

  memory_base="$(memory_state_auto_memory_base_dir)"
  default_base="${HOME}/.claude/projects"
  project_dir="$(memory_state_project_dir_from_transcript "$transcript_path" || true)"
  if [[ -n "$project_dir" ]]; then
    project_name="$(basename "$project_dir")"
    if [[ -n "$memory_base" && "$memory_base" != "$default_base" ]]; then
      printf '%s/%s/memory' "$memory_base" "$project_name"
      return 0
    fi
    printf '%s/memory' "$project_dir"
    return 0
  fi

  project_key="$(memory_state_project_key_from_repo)"
  if [[ -n "$memory_base" && -n "$project_key" ]]; then
    printf '%s/%s/memory' "$memory_base" "$project_key"
    return 0
  fi

  return 1
}

memory_state_scan_dir() {
  local memory_dir="$1"

  [[ -d "$memory_dir" ]] || return 1

  MEMORY_DIR="$memory_dir" bun -e '
    const fs = require("fs");
    const path = require("path");
    const crypto = require("crypto");

    const memoryDir = process.env.MEMORY_DIR;
    if (!memoryDir || !fs.existsSync(memoryDir)) process.exit(1);

    function normalizeSlug(value) {
      return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    function humanizeSlug(value) {
      return String(value || "")
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }

    function themeLabelToSlug(label) {
      const raw = String(label || "").trim();
      if (!raw) return "";
      return normalizeSlug(raw.replace(/^(always|prefer|remember|use)\s+/i, "").split(":")[0]);
    }

    const entries = fs
      .readdirSync(memoryDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name)
      .sort();

    const files = [];
    const themes = new Map();
    let totalLines = 0;
    let memoryMdHash = "";

    for (const name of entries) {
      const fullPath = path.join(memoryDir, name);
      const content = fs.readFileSync(fullPath, "utf8");
      const sha256 = crypto.createHash("sha256").update(content).digest("hex");
      const lineCount = content === "" ? 0 : content.split(/\r?\n/).length;
      totalLines += lineCount;
      files.push({ name, sha256, line_count: lineCount });

      if (name === "MEMORY.md") {
        memoryMdHash = sha256;
      } else {
        const baseSlug = normalizeSlug(name.replace(/\.md$/i, ""));
        if (baseSlug) {
          const existing = themes.get(baseSlug) ?? { slug: baseSlug, label: humanizeSlug(baseSlug), count: 0, files: [] };
          existing.count += 1;
          existing.files = [...new Set([...existing.files, name])];
          themes.set(baseSlug, existing);
        }
      }

      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (!trimmed.startsWith("#")) continue;
        const label = trimmed.replace(/^#+\s*/, "").trim();
        const slug = themeLabelToSlug(label);
        if (!slug || slug === "memory") continue;
        const existing = themes.get(slug) ?? { slug, label, count: 0, files: [] };
        existing.count += 1;
        existing.files = [...new Set([...existing.files, name])];
        themes.set(slug, existing);
      }
    }

    const themeList = [...themes.values()]
      .sort((a, b) => (b.count - a.count) || a.slug.localeCompare(b.slug))
      .slice(0, 16);

    const payload = {
      scanned_at: Math.floor(Date.now() / 1000),
      memory_dir: memoryDir,
      file_count: files.length,
      total_lines: totalLines,
      memory_md_hash: memoryMdHash,
      files,
      themes: themeList,
    };

    payload.snapshot_hash = crypto
      .createHash("sha256")
      .update(JSON.stringify({ files, themes: themeList, total_lines: totalLines }))
      .digest("hex");

    process.stdout.write(JSON.stringify(payload));
  ' 2>/dev/null
}

memory_state_compare_snapshots() {
  local previous_file="$1"
  local current_json="$2"

  if [[ ! -f "$previous_file" ]]; then
    bun -e '
      const current = JSON.parse(process.env.CURRENT_JSON || "{}");
      process.stdout.write(JSON.stringify({
        detected: current.file_count > 0,
        type: "initial",
        changed_files: current.file_count || 0,
        added_files: current.file_count || 0,
        removed_files: 0,
        line_delta: current.total_lines || 0,
        summary: current.file_count > 0 ? "Initial auto memory snapshot captured." : "No auto memory files found."
      }));
    ' 2>/dev/null
    return 0
  fi

  PREVIOUS_FILE="$previous_file" CURRENT_JSON="$current_json" bun -e '
    const fs = require("fs");

    const previous = JSON.parse(fs.readFileSync(process.env.PREVIOUS_FILE, "utf8"));
    const current = JSON.parse(process.env.CURRENT_JSON || "{}");
    const prevFiles = new Map((previous.files || []).map((file) => [file.name, file.sha256]));
    const nextFiles = new Map((current.files || []).map((file) => [file.name, file.sha256]));

    let added = 0;
    let removed = 0;
    let changed = 0;
    for (const [name, sha] of nextFiles.entries()) {
      if (!prevFiles.has(name)) {
        added += 1;
        changed += 1;
        continue;
      }
      if (prevFiles.get(name) !== sha) {
        changed += 1;
      }
    }
    for (const name of prevFiles.keys()) {
      if (!nextFiles.has(name)) {
        removed += 1;
      }
    }

    const lineDelta = (current.total_lines || 0) - (previous.total_lines || 0);
    const memoryMdChanged = (current.memory_md_hash || "") !== (previous.memory_md_hash || "");
    let type = "unchanged";
    if (changed > 0 || removed > 0) type = "updated";
    if (memoryMdChanged && (Math.abs(lineDelta) >= 20 || (changed + removed) >= 3 || removed >= 1)) {
      type = "autodream-like";
    }

    const summary = (() => {
      if (type === "autodream-like") {
        return `Detected ${changed} changed files, ${removed} removed files, and ${lineDelta} total-line delta across auto memory.`;
      }
      if (type === "updated") {
        return `Detected ${changed} changed auto memory files since the previous session.`;
      }
      return "Auto memory unchanged since the previous snapshot.";
    })();

    process.stdout.write(JSON.stringify({
      detected: type !== "unchanged",
      type,
      changed_files: changed,
      added_files: added,
      removed_files: removed,
      line_delta: lineDelta,
      memory_md_changed: memoryMdChanged,
      summary
    }));
  ' 2>/dev/null
}

memory_state_write_file() {
  local file_path="$1"
  local payload="$2"

  mkdir -p "$(dirname "$file_path")"
  printf '%s\n' "$payload" > "$file_path"
}

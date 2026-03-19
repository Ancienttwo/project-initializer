import { describe, test, expect } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dir, "..");
const SCRIPT_PATH = join(ROOT, "scripts/setup-plugins.sh");

function readSetup(): string {
  return readFileSync(SCRIPT_PATH, "utf-8");
}

describe("setup-plugins structure", () => {
  test("passes shell syntax check", () => {
    const res = spawnSync("bash", ["-n", SCRIPT_PATH], {
      cwd: ROOT,
      encoding: "utf-8",
    });

    expect(res.status).toBe(0);
    expect(res.stderr).toBe("");
  });

  test("settings heredoc should close before any function body is embedded", () => {
    const setup = readSetup();
    const start = setup.indexOf('cat > "$settings_file" << SETTINGS_EOF');
    const end = setup.indexOf("\nSETTINGS_EOF", start);

    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);

    const heredocBody = setup.slice(start, end);
    expect(heredocBody).not.toContain("install_permissionless_policy_hooks()");
  });

  test("defines policy-hook installer as a real shell function", () => {
    const setup = readSetup();
    expect(setup).toContain("install_permissionless_policy_hooks() {");
    expect(setup).toContain("cat > \"$HOOKS_DIR/hook-input.sh\" << 'EOF'");
    expect(setup).toContain("chmod +x \"$HOOKS_DIR/worktree-guard.sh\"");
    expect(setup).toContain("\"$HOOKS_DIR/hook-input.sh\"");
  });

  test("embedded hook-input.sh should include all shared functions", () => {
    const setup = readSetup();
    expect(setup).toContain("hook_read_stdin_once");
    expect(setup).toContain("hook_json_get");
    expect(setup).toContain("hook_parse_json_arg");
    expect(setup).toContain("hook_get_file_path");
    expect(setup).toContain("hook_get_prompt");
  });

  test("configure_hooks should use nested hooks schema and no argv blob injection", () => {
    const setup = readSetup();

    expect(setup).toMatch(/"matcher":\s*"Edit\|Write"[\s\S]*?"hooks":\s*\[/);
    expect(setup).not.toMatch(/"matcher":\s*"[^"]+"\s*,\s*"command":/);
    expect(setup).not.toContain('atomic-commit.sh "$TOOL_OUTPUT" "$EXIT_CODE" "$TOOL_INPUT"');
    expect(setup).not.toContain('prompt-guard.sh "$PROMPT"');
    expect(setup).toContain('"command": "bash ~/.claude/hooks/atomic-commit.sh"');
    expect(setup).toContain('. "$SCRIPT_DIR/hook-input.sh"');
  });
});

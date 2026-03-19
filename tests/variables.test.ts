import { describe, test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import {
  loadVersions,
  replaceVariables,
  isValidVersionString,
} from "../scripts/assemble-template";

describe("Variable Substitution", () => {
  test("should replace single variable", () => {
    const result = replaceVariables("Hello {{NAME}}", { NAME: "World" });
    expect(result).toBe("Hello World");
  });

  test("should replace multiple variables", () => {
    const result = replaceVariables("{{A}} and {{B}}", { A: "First", B: "Second" });
    expect(result).toBe("First and Second");
  });

  test("should replace same variable multiple times", () => {
    const result = replaceVariables("{{X}} + {{X}} = 2{{X}}", { X: "1" });
    expect(result).toBe("1 + 1 = 21");
  });

  test("should leave unknown variables unchanged", () => {
    const result = replaceVariables("{{KNOWN}} {{UNKNOWN}}", { KNOWN: "value" });
    expect(result).toBe("value {{UNKNOWN}}");
  });

  test("should handle empty variables object", () => {
    const result = replaceVariables("{{A}} {{B}}", {});
    expect(result).toBe("{{A}} {{B}}");
  });

  test("should handle multiline content", () => {
    const content = `Line 1: {{VAR}}
Line 2: {{VAR}}
Line 3: end`;
    const result = replaceVariables(content, { VAR: "value" });
    expect(result).toBe(`Line 1: value
Line 2: value
Line 3: end`);
  });

  test("should not infinite loop on circular references", () => {
    const result = replaceVariables("{{A}}", { A: "{{B}}", B: "{{A}}" });
    expect(result).toBeDefined();
  });
});

describe("versions.json Integration", () => {
  test("should load versions from assets/versions.json", () => {
    const versions = loadVersions();
    expect(versions).toBeDefined();
    expect(typeof versions).toBe("object");
  });

  test("should have VERSION_ prefixed keys", () => {
    const versions = loadVersions();
    const keys = Object.keys(versions);

    for (const key of keys) {
      expect(key.startsWith("VERSION_")).toBe(true);
    }
  });

  test("should include core versions", () => {
    const versions = loadVersions();

    expect(versions.VERSION_VITE).toBeDefined();
    expect(versions.VERSION_REACT).toBeDefined();
    expect(versions.VERSION_TYPESCRIPT).toBeDefined();
  });

  test("should convert kebab-case to UPPER_SNAKE_CASE", () => {
    const versions = loadVersions();

    expect(versions.VERSION_TANSTACK_ROUTER).toBeDefined();
    expect(versions.VERSION_TANSTACK_QUERY).toBeDefined();
  });

  test("should validate version format", () => {
    const versions = loadVersions();

    for (const value of Object.values(versions)) {
      expect(isValidVersionString(value)).toBe(true);
    }

    expect(isValidVersionString("latest")).toBe(true);
    expect(isValidVersionString("5.x")).toBe(true);
    expect(isValidVersionString("1.0.0-beta")).toBe(true);
    expect(isValidVersionString("0.84+")).toBe(true);
    expect(isValidVersionString("invalid version")).toBe(false);
  });

  test("should error on invalid versions.json", () => {
    const dir = mkdtempSync(join(tmpdir(), "versions-invalid-"));
    const path = join(dir, "versions.json");

    try {
      writeFileSync(path, JSON.stringify({ core: { vite: "bad@version" } }), "utf-8");
      expect(() => loadVersions(path)).toThrow("Invalid version format");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

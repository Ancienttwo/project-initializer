import { describe, test, expect } from "bun:test";

describe("Smoke Test", () => {
  test("test framework is working", () => {
    expect(1 + 1).toBe(2);
  });

  test("can import from project root", () => {
    // Verify test environment can access project files
    const fs = require("fs");
    const skillPath = "./SKILL.md";
    expect(fs.existsSync(skillPath)).toBe(true);
  });
});

import { describe, test, expect } from "bun:test";
import {
  getPartials,
  readPartial,
  processConditionals,
  assembleTemplate,
  shouldIncludeCloudflare,
  loadPlanMap,
  resolvePlanType,
} from "../scripts/assemble-template";

describe("Template Assembly", () => {
  test("should read partials in correct order", () => {
    const partials = getPartials("claude");
    expect(partials.length).toBeGreaterThanOrEqual(8);

    for (let i = 1; i < partials.length; i++) {
      expect(partials[i].order).toBeGreaterThan(partials[i - 1].order);
    }
  });

  test("should have expected partial names", () => {
    const partials = getPartials("claude");
    const names = partials.map((p) => p.name);

    expect(names).toContain("01-header");
    expect(names).toContain("02-iron-rules");
    expect(names).toContain("03-philosophy");
    expect(names).toContain("04-project-structure");
    expect(names).toContain("05-workflow");
    expect(names).toContain("06-cloudflare");
    expect(names).toContain("07-footer");
    expect(names).toContain("08-orchestration");
  });

  test("should read partial content", () => {
    const partials = getPartials("claude");
    const firstPartial = partials[0];

    const content = readPartial(firstPartial.path);
    expect(content).toBeDefined();
    expect(content.length).toBeGreaterThan(0);
  });

  test("should mark cloudflare partial as conditional", () => {
    const partials = getPartials("claude");
    const cloudflarePartial = partials.find((p) => p.name === "06-cloudflare");

    expect(cloudflarePartial).toBeDefined();
    expect(cloudflarePartial?.conditional).toBe("CLOUDFLARE_NATIVE");
  });

  test("should concatenate partials in sequence", () => {
    const output = assembleTemplate({
      planType: "C",
      variables: { PROJECT_NAME: "TestProject" },
    });

    const sections = [
      "## Iron Rules",
      "## Project Structure",
      "### Plan Annotation Protocol",
      "## Context Loading Rules",
      "## Workflow Orchestration",
    ];

    let lastIndex = -1;
    for (const section of sections) {
      const idx = output.indexOf(section);
      expect(idx).toBeGreaterThan(lastIndex);
      lastIndex = idx;
    }
  });

  test("should preserve blank line separators between major sections", () => {
    const output = assembleTemplate({
      planType: "C",
      variables: { PROJECT_NAME: "TestProject" },
    });

    expect(output).toMatch(/---\n{2,}## Iron Rules/);
    expect(output).toMatch(/---\n{2,}## Project Structure/);
  });
});

describe("Conditional Sections", () => {
  test("should include section when condition is true", () => {
    const content = "Before {{#IF TEST}}included{{/IF}} After";
    const result = processConditionals(content, { TEST: true });
    expect(result).toBe("Before included After");
  });

  test("should exclude section when condition is false", () => {
    const content = "Before {{#IF TEST}}excluded{{/IF}} After";
    const result = processConditionals(content, { TEST: false });
    expect(result).toBe("Before  After");
  });

  test("should handle multiline conditional blocks", () => {
    const content = `Start
{{#IF CLOUDFLARE_NATIVE}}
Line 1
Line 2
{{/IF}}
End`;
    const result = processConditionals(content, { CLOUDFLARE_NATIVE: true });
    expect(result).toContain("Line 1");
    expect(result).toContain("Line 2");
  });

  test("should handle multiple conditional blocks", () => {
    const content = "{{#IF A}}a{{/IF}} {{#IF B}}b{{/IF}}";
    const result = processConditionals(content, { A: true, B: false });
    expect(result).toBe("a ");
  });

  test("should handle nested conditionals", () => {
    const content = "{{#IF OUTER}}outer {{#IF INNER}}inner{{/IF}}{{/IF}}";

    const includeBoth = processConditionals(content, { OUTER: true, INNER: true });
    expect(includeBoth).toBe("outer inner");

    const includeOuterOnly = processConditionals(content, { OUTER: true, INNER: false });
    expect(includeOuterOnly).toBe("outer ");

    const includeNone = processConditionals(content, { OUTER: false, INNER: true });
    expect(includeNone).toBe("");
  });

  test("should error on malformed conditional syntax", () => {
    expect(() => processConditionals("{{#IF A}}missing close", { A: true })).toThrow(
      "Malformed conditional block"
    );

    expect(() => processConditionals("unexpected {{/IF}}", {})).toThrow(
      "Malformed conditional block"
    );
  });
});

describe("Cloudflare Plan Detection", () => {
  test("should include cloudflare for Plan C", () => {
    expect(shouldIncludeCloudflare("C")).toBe(true);
  });

  test("should include cloudflare for Plan A (Remix)", () => {
    expect(shouldIncludeCloudflare("A")).toBe(true);
  });

  test("should exclude cloudflare for Plan B (UmiJS)", () => {
    expect(shouldIncludeCloudflare("B")).toBe(false);
  });

  test("should exclude cloudflare for Plan F (Mobile)", () => {
    expect(shouldIncludeCloudflare("F")).toBe(false);
  });

  test("should exclude cloudflare for Plan J (TUI)", () => {
    expect(shouldIncludeCloudflare("J")).toBe(false);
  });

  test("should exclude cloudflare for Plan K (Custom)", () => {
    expect(shouldIncludeCloudflare("K")).toBe(false);
  });

  test("should respect explicit flag over plan type", () => {
    expect(shouldIncludeCloudflare("C", false)).toBe(false);
    expect(shouldIncludeCloudflare("B", true)).toBe(true);
  });
});

describe("Plan Map", () => {
  test("should resolve legacy aliases via plan-map", () => {
    const planMap = loadPlanMap();
    expect(resolvePlanType("C+", planMap)).toBe("C");
  });

  test("should include canonical plans A..K", () => {
    const planMap = loadPlanMap();
    const planCodes = Object.keys(planMap.plans).sort();
    expect(planCodes).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]);
  });
});

describe("Full Assembly", () => {
  test("should assemble template with variables", () => {
    const result = assembleTemplate({
      planType: "C",
      variables: {
        PROJECT_NAME: "TestProject",
      },
    });

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  test("should handle missing partials gracefully", () => {
    expect(() => readPartial("/tmp/this-file-does-not-exist.partial.md")).toThrow(
      "Partial not found"
    );
  });
});

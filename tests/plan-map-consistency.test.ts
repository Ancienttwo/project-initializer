import { describe, test, expect } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";
import { getPlanTier, isCorePlan, loadPlanMap } from "../scripts/assemble-template";

const ROOT = join(import.meta.dir, "..");

function read(relPath: string): string {
  return readFileSync(join(ROOT, relPath), "utf-8");
}

describe("Plan map consistency", () => {
  test("plan-map should define canonical A..K plans", () => {
    const planMap = loadPlanMap();
    const planCodes = Object.keys(planMap.plans).sort();
    expect(planCodes).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]);
  });

  test("plan tiers should enforce core A-F and preset/custom G-K model", () => {
    const planMap = loadPlanMap();

    expect(planMap.planTiers?.core).toEqual(["A", "B", "C", "D", "E", "F"]);
    expect(planMap.planTiers?.presets).toEqual(["G", "H", "I", "J"]);
    expect(planMap.planTiers?.custom).toEqual(["K"]);

    expect(getPlanTier("A", planMap)).toBe("core");
    expect(getPlanTier("F", planMap)).toBe("core");
    expect(getPlanTier("G", planMap)).toBe("preset");
    expect(getPlanTier("J", planMap)).toBe("preset");
    expect(getPlanTier("K", planMap)).toBe("custom");
    expect(isCorePlan("C", planMap)).toBe(true);
    expect(isCorePlan("H", planMap)).toBe(false);
  });

  test("docs should not reference deprecated plan labels", () => {
    const skill = read("SKILL.md");
    const techStacks = read("references/tech-stacks.md");

    expect(skill).not.toContain("Plan C+");
    expect(skill).not.toContain("Plan L");
    expect(techStacks).not.toContain("Plan C+");
    expect(techStacks).not.toContain("Plan L");
  });

  test("canonical plan labels should appear in docs", () => {
    const skill = read("SKILL.md");
    const techStacks = read("references/tech-stacks.md");

    for (const plan of ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]) {
      expect(skill).toContain(`Plan ${plan}`);
      expect(techStacks).toContain(`Plan ${plan}`);
    }

    expect(skill).toContain("Core Plans (A-F)");
    expect(skill).toContain("Custom Presets (G-K)");
    expect(techStacks).toContain("Core Plans (A-F)");
    expect(techStacks).toContain("Custom Presets (G-K)");
  });
});

import { describe, expect, test } from "bun:test";
import { join } from "path";
import {
  getDecisionPointsByBatch,
  getQuestionFlowSummary,
  inferPreferredPackageManager,
  loadQuestionPack,
} from "../scripts/initializer-question-pack";

describe("Initializer question pack", () => {
  test("should load v3 question pack by default", () => {
    const pack = loadQuestionPack();
    expect(pack.version).toBe("initializer-question-pack.v3");
    expect(pack.decisionPoints.length).toBe(10);
    expect(pack.planTiers.core).toEqual(["A", "B", "C", "D", "E", "F"]);
    expect(pack.planTiers.presets).toEqual(["G", "H", "I", "J", "K"]);
  });

  test("should still load the legacy v2 question pack when requested explicitly", () => {
    const pack = loadQuestionPack(join(import.meta.dir, "..", "assets", "initializer-question-pack.v2.json"));
    expect(pack.version).toBe("initializer-question-pack.v2");
    expect(pack.decisionPoints.length).toBe(9);
  });

  test("should group questions by batch", () => {
    const grouped = getDecisionPointsByBatch();
    expect(Object.keys(grouped).sort()).toEqual(["1", "2", "3", "4", "5"]);
    expect(grouped[1].length).toBe(2);
    expect(grouped[4].length).toBe(3);
    expect(grouped[5].length).toBe(1);
  });

  test("should infer package manager defaults by plan", () => {
    expect(inferPreferredPackageManager("C")).toBe("bun");
    expect(inferPreferredPackageManager("G")).toBe("uv");
    expect(inferPreferredPackageManager("B")).toBe("pnpm");
  });

  test("should expose question flow summary", () => {
    const summary = getQuestionFlowSummary("H");
    expect(summary.planType).toBe("H");
    expect(summary.planTier).toBe("preset");
    expect(summary.decisionCount).toBe(10);
    expect(summary.requiredDecisionCount).toBeGreaterThan(0);
  });
});

#!/usr/bin/env bun

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getPlanTier, resolvePlanType } from "./assemble-template";

export interface DecisionPoint {
  id: string;
  title: string;
  batch: number;
  questions: string[];
  required: boolean;
}

export interface RuntimeProfile {
  label: string;
  claudePolicy: string;
  codexPolicy: string;
}

export interface InitializerQuestionPackV1 {
  version: "initializer-question-pack.v1";
  goal: string;
  decisionPoints: DecisionPoint[];
  planTiers: {
    core: string[];
    presets: string[];
  };
  inferredDefaults: {
    packageManagerPriority: string[];
    runtimeProfile: string;
  };
  runtimeProfiles: Record<string, RuntimeProfile>;
}

const PACK_PATH = join(import.meta.dir, "..", "assets", "initializer-question-pack.v1.json");

export function loadQuestionPack(path: string = PACK_PATH): InitializerQuestionPackV1 {
  if (!existsSync(path)) {
    throw new Error(`initializer-question-pack not found: ${path}`);
  }

  const parsed = JSON.parse(readFileSync(path, "utf-8")) as InitializerQuestionPackV1;
  if (parsed.version !== "initializer-question-pack.v1") {
    throw new Error(`Unsupported question pack version: ${parsed.version}`);
  }

  return parsed;
}

export function inferPreferredPackageManager(
  planType: string,
  pack: InitializerQuestionPackV1 = loadQuestionPack()
): string {
  const resolved = resolvePlanType(planType);
  const tier = getPlanTier(resolved);
  const [firstChoice, secondChoice] = pack.inferredDefaults.packageManagerPriority;

  // Python-centric plans (G=AI Quant, H=FIX/RFQ) use uv for Python deps.
  // JS tooling in these plans still uses bun/pnpm, but the primary PM is uv.
  if (resolved === "G" || resolved === "H") {
    return "uv";
  }

  // Enterprise preset can still use bun tooling but keeps npm-compatible fallback.
  if ((resolved === "B" || tier === "custom") && secondChoice) {
    return secondChoice;
  }

  return firstChoice;
}

export function getDecisionPointsByBatch(
  pack: InitializerQuestionPackV1 = loadQuestionPack()
): Record<number, DecisionPoint[]> {
  return pack.decisionPoints.reduce<Record<number, DecisionPoint[]>>((acc, decision) => {
    if (!acc[decision.batch]) acc[decision.batch] = [];
    acc[decision.batch].push(decision);
    return acc;
  }, {});
}

export function getQuestionFlowSummary(planType: string): {
  planType: string;
  planTier: "core" | "preset" | "custom";
  preferredPackageManager: string;
  decisionCount: number;
  requiredDecisionCount: number;
} {
  const pack = loadQuestionPack();
  const resolvedPlan = resolvePlanType(planType);
  const planTier = getPlanTier(resolvedPlan);

  return {
    planType: resolvedPlan,
    planTier,
    preferredPackageManager: inferPreferredPackageManager(resolvedPlan, pack),
    decisionCount: pack.decisionPoints.length,
    requiredDecisionCount: pack.decisionPoints.filter((point) => point.required).length,
  };
}

if (import.meta.main) {
  const requestedPlan = process.argv[2] ?? "C";
  const summary = getQuestionFlowSummary(requestedPlan);
  console.log(JSON.stringify(summary, null, 2));
}

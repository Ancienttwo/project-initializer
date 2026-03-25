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

export interface ProfileChoice {
  label: string;
  description: string;
}

export interface InitializerQuestionPackV2 {
  version: "initializer-question-pack.v2";
  goal: string;
  decisionPoints: DecisionPoint[];
  planTiers: {
    core: string[];
    presets: string[];
  };
  inferredDefaults: {
    packageManagerPriority: string[];
    runtimeProfile: string;
    orchestrationProfile: string;
    evaluationProfile: string;
    handoffProfile: string;
  };
  runtimeProfiles: Record<string, RuntimeProfile>;
  orchestrationProfiles: Record<string, ProfileChoice>;
  evaluationProfiles: Record<string, ProfileChoice>;
  handoffProfiles: Record<string, ProfileChoice>;
}

const PACK_PATH = join(import.meta.dir, "..", "assets", "initializer-question-pack.v2.json");

export function loadQuestionPack(path: string = PACK_PATH): InitializerQuestionPackV2 {
  if (!existsSync(path)) {
    throw new Error(`initializer-question-pack not found: ${path}`);
  }

  const parsed = JSON.parse(readFileSync(path, "utf-8")) as InitializerQuestionPackV2;
  if (parsed.version !== "initializer-question-pack.v2") {
    throw new Error(`Unsupported question pack version: ${parsed.version}`);
  }

  return parsed;
}

export function inferPreferredPackageManager(
  planType: string,
  pack: InitializerQuestionPackV2 = loadQuestionPack()
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
  pack: InitializerQuestionPackV2 = loadQuestionPack()
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

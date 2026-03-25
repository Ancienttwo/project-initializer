import { describe, test, expect } from "bun:test";
import {
  assembleTemplate,
  getPartials,
  parseTarget,
} from "../scripts/assemble-template";

describe("AGENTS Target Assembly", () => {
  test("should read agents partials in correct order", () => {
    const partials = getPartials("agents");
    expect(partials.length).toBeGreaterThanOrEqual(8);

    for (let i = 1; i < partials.length; i++) {
      expect(partials[i].order).toBeGreaterThan(partials[i - 1].order);
    }
  });

  test("should include required AGENTS sections", () => {
    const output = assembleTemplate({
      target: "agents",
      planType: "C",
      variables: { PROJECT_NAME: "TestProject" },
    });

    expect(output).toContain("## Operating Mode");
    expect(output).toContain("## Workflow Orchestration");
    expect(output).toContain("## Task Management Protocol");
    expect(output).toContain("## Coding Constraints");
    expect(output).toContain("## Quality & Safety");
    expect(output).toContain("## Deep Docs Index");
    expect(output).toContain("### First Principles");
    expect(output).toContain("### Single Source of Truth");
    expect(output).toContain("Self-Improvement Loop");
    expect(output).toContain("tasks/todo.md");
    expect(output).toContain("tasks/lessons.md");
    expect(output).toContain("sync tasks/");
    expect(output).toContain("Default to **Plan-only**.");
    expect(output).toContain("Runtime profile: Plan-only (recommended).");
    expect(output).toContain("Codex runtime expectation: `sandbox_mode=platform-default, approval_policy=on-failure`.");
    expect(output).toContain(".claude/.require-worktree");
    expect(output).toContain("single source of truth for the current active plan");
    expect(output).toContain("new-spec.sh");
    expect(output).toContain("new-sprint.sh");
    expect(output).toContain("bash scripts/check-task-sync.sh");
    expect(output).toContain("bash scripts/check-task-workflow.sh --strict");
    expect(output).toContain("bash scripts/verify-contract.sh --contract <active-plan-contract> --strict");
    expect(output).toContain("Which workflow artifacts were updated");
  });

  test("should preserve core governance semantics between CLAUDE and AGENTS", () => {
    const claude = assembleTemplate({
      target: "claude",
      planType: "C",
      variables: { PROJECT_NAME: "TestProject" },
    });

    const agents = assembleTemplate({
      target: "agents",
      planType: "C",
      variables: { PROJECT_NAME: "TestProject" },
    });

    expect(claude.toLowerCase()).toContain("verification");
    expect(agents.toLowerCase()).toContain("verification");
    expect(claude.toLowerCase()).toContain("plan");
    expect(agents.toLowerCase()).toContain("plan");
    expect(claude.toLowerCase()).toContain("product truth");
    expect(agents.toLowerCase()).toContain("product truth");
    expect(claude.toLowerCase()).toContain("execution truth");
    expect(agents.toLowerCase()).toContain("single source of truth");
  });

  test("should render cloudflare section for both targets when enabled by plan", () => {
    const claude = assembleTemplate({
      target: "claude",
      planType: "C",
      variables: { PROJECT_NAME: "TestProject" },
    });

    const agents = assembleTemplate({
      target: "agents",
      planType: "C",
      variables: { PROJECT_NAME: "TestProject" },
    });

    expect(claude).toContain("Cloudflare Deployment");
    expect(agents).toContain("Cloudflare Deployment Notes");
  });

  test("should omit cloudflare section for both targets when excluded by plan", () => {
    const claude = assembleTemplate({
      target: "claude",
      planType: "B",
      variables: { PROJECT_NAME: "TestProject" },
    });

    const agents = assembleTemplate({
      target: "agents",
      planType: "B",
      variables: { PROJECT_NAME: "TestProject" },
    });

    expect(claude).not.toContain("Cloudflare Deployment");
    expect(agents).not.toContain("Cloudflare Deployment Notes");
  });

  test("should reject invalid target values", () => {
    expect(() => parseTarget("invalid-target")).toThrow("Invalid target");
  });
});

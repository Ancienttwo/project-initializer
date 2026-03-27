# Sprint Contracts

Sprint contracts are the repo-local agreement between planner, generator, and evaluator.

## Required Sections

- Goal
- Scope and non-goals
- Allowed paths
- Exit criteria
- Verification commands
- Risks and rollback point

## Status Rules

- `Pending`: drafted but not approved for execution
- `Active`: approved for implementation
- `Blocked`: waiting on a missing dependency or decision
- `Verified`: all machine checks passed; awaiting or holding review
- `Archived`: sprint is complete or superseded

## Review Coupling

- A contract is not truly done until the matching review file records a passing recommendation.
- `tasks/reviews/<slug>.review.md` should cite the contract, checks file, and any manual observations.

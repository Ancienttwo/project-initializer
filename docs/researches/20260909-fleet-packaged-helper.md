# Fleet worktree helper ownership

Fleet acquisition must resolve contract-worktree and plan-to-todo from the same trusted package runtime used by the CLI. Installed downstream repositories do not carry helper implementations in scripts/. Requiring those paths prevents a valid execution-ready offer from becoming a bound worktree.

The CLI acquisition regression deliberately omits repository-local helper scripts. It creates a real worktree and verifies the bound lease, claim token and repeated-acquire refusal. Existing effect and concurrency tests cover compensation and ownership. Campaign admission and frozen grants remain independent; a helper fix does not retroactively validate a failed canary.

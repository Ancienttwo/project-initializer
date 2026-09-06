# Hook telemetry retention decisions

- Reuse the existing owner-fenced lock for maintenance and snapshot opening; do not add a lock protocol or serialize every append.
- Canonicalize the lock's directory with realpath because macOS /var aliases /private/var. The lock itself still rejects symlink ancestors inside its canonical root.
- Development root cause is the unbounded append and single-file reader; old writer failed the 8 MiB rotation regression (/tmp/release-todo-telemetry-red.log).
- Early benchmark artifact tests rejected this worktree's symlinked node_modules as outside its source authority. Replaced only this task's symlink with a frozen local dependency install; no test assertion or package lockfile changed.
- Named final group: 63 pass / 0 fail / 437 assertions across six files in 40.33s. Typecheck passes. Logs /tmp/release-todo-telemetry-final.log and /tmp/release-todo-telemetry-type.log.
- No live runtime telemetry file was rotated or deleted by this implementation task.

- Focused security correction canonicalizes the repo root and every telemetry path; maintenance rechecks owner identity and archive dev/ino before rename/delete/open. Symlink ancestor regression preserves external data. Local processes with permission to replace directories between individual filesystem syscalls remain outside this cooperative-cache threat model; Node path APIs do not offer an atomic openat boundary.
- Corrected storage delta: 10 passing tests. No native dependency or platform-specific filesystem shim was added.

# Removing stale repository registrations

The Kanban enumerates the account registry, including unavailable repositories.
It must not silently hide missing authority. Deleting a test repository or
worktree does not itself unregister its path.

Preview explicitly:

```sh
repo-harness fleet prune
```

The JSON contains `registry_revision`, `candidates`, `skipped` and
`remaining_count`. Only paths whose `lstat` returns `ENOENT` are candidates.
Existing files/directories and all other errors remain registered. Check that
missing paths are obsolete rather than temporarily unmounted or moved.

Apply using the revision from that preview:

```sh
repo-harness fleet prune --apply --expected-revision sha256:REPLACE_WITH_PREVIEW_DIGEST
```

Use `--repo-id <id...>` on preview and apply to select specific registrations.
Apply rejects changed registry bytes or unknown IDs, rechecks paths while
holding the existing registry mutation lock, and atomically removes only the
selected absent entries. It increments authorizationRevision once for an actual
change; a no-op preserves the registry bytes and revision. The returned
`registry_revision` identifies the input snapshot; preview again after a change.

This command removes registry rows only. It neither deletes repository files
nor writes a backup. Cleanup is never automatic on startup or board refresh.
An unavailable board in a directory that still exists requires separate
diagnosis and must not be removed by treating every UI error as stale state.

Historical init test leaks have a producer-side guard in
`tests/cli/init.test.ts` (`npx cache sources keep process.env as the constructed
command env base`). The current `initCommandEnv` preserves caller isolation.
This command handles old residue and repositories removed after valid
registration without introducing test-name heuristics into product logic.

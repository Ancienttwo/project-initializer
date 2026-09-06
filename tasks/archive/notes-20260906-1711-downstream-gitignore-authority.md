# Downstream gitignore authority decisions

- The canonical text asset owns ignore semantics; the shell retains its existing managed-block markers and preserves any pre-existing unmanaged prelude. Init already knows those legacy markers and upgrades them through its transaction.
- Load the asset lazily in the shell rendering function. Sourcing the shared library must remain usable by the existing Python-only policy merge path, which has no cat or dirname on PATH.
- No new dependencies or public commands. One packaged text asset replaces two literal sources and serves both real consumers.
- Red evidence: /tmp/release-todo-gitignore-red.log, unit shell/init body comparison failed on old literals. Development suite: 49 pass and one Python-only sourcing failure; corrected lazy read passes its focused retry. Final gitignore unit: 6 pass, including relocated package and missing-asset rejection.

> **Substantive Change SHA256**: `sha256:4b71c08e7b2969546630099c0a9bfd81d325990e08e9cfe4182eab12ddce1b6f`

- Normal npm pack includes runtime.gitignore; extracted package shell bootstrap and default CLI init apply succeed in a fresh HOME with source overrides removed. Smoke: /var/folders/_6/dkz7p7251y1gqntnk0ll5n380000gn/T/release-todo-install-dffz47au.
- Architecture specialist PASS, no findings; no redundant tests requested.

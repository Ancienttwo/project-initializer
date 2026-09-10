# Operator repository selection

The operator board displays one repository at a time. Its top-bar selector uses
the server-projected directory basename as the display name and the canonical
repository ID as the selection/request identity. Duplicate names include their
IDs in the selector. Full filesystem paths remain outside the browser payload.

The operator transport is protocol 5 with a required `display_name`; the source
Fleet transport is unchanged. Deploy the UI bundle and operator server together.
The decoder rejects older or nameless payloads rather than guessing names.

The worklist, filter counts, stage matrix and repository health use only the
selected repository. The full Fleet snapshot remains authoritative: filtering
does not manufacture another snapshot/digest or relax the existing write gates.
Top-bar Fleet health and notices still describe the full collection.

The first repository is selected initially. Browser storage remembers the
selection; refresh preserves a surviving ID. If that repository disappears,
the board requests an explicit new selection instead of showing another repo's
tasks automatically. An empty registry retains its existing empty-state view.

Changing repository resets worklist filters, closes the task pane and unmounts
its composer/diff, aborts the obsolete collaboration read, and returns the
collaboration pane to idle. Existing per-task draft recovery stays keyed by
repository and task; a draft is never retargeted to the newly selected repo.

Verification covers projection/decoder contracts, per-repo counts, persistence,
refresh/removal, duplicate-name disambiguation, collaboration cancellation and
late response isolation, composer fences, desktop/mobile rendering and the
actual operator server route. No registry or task execution state is changed by
selecting a repository.

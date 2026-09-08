# Cleanup integration decisions

Keep #361 preparation authority and deterministic journals intact. The superseded #362 preparing marker is intentionally excluded. Cleanup is the sole production delta. Docker SIGKILL cases now reconcile and clean the reconstructed handle, then consume identical proof after deletion; missing request-only objects remain refused.

Baseline: PR #361 491ff094. Prior #362 f1c14080 cleanup review and tests informed the port but are not current integrated acceptance. PR #361 passed all five CI checks and independent preparation/cleanup security review, then merged as ba09b548. Its merged tree equals 491ff094; only this cleanup delta proceeds to new acceptance.

Initial integration run vx-9f7ed717614f4b8f9140: 21 passed, four Docker deadline failures. New cleanup tests no longer assume version execution leaves time before expiry; refusal is checked first, and preparation deadlines allow 10 seconds. Existing watchdog failures are retained for serial re-verification without concurrent projection work. Architecture bootstrap generated a projection file during verification, invalidating snapshot equality; subsequent apply is a stable noop. No production deadline or validation relaxed.

> **Substantive Change SHA256**: `sha256:f4f82c666e8b3912df3f0de30e12ba79bc687635e74d2bb9ee523ce85e7de52e`

Independent security delta review found no actionable issue in #361 request/name reconstruction composed with cleanup. Architecture review retained #361's whole preparation authority; no conflicting marker was ported.

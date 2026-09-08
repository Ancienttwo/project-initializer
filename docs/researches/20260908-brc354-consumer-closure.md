# BRC354 protected consumer closure evidence

Status: superseded execution branch, preserved unsubmitted WIP; not #354 acceptance. PR #360 is the Owner-designated delivery candidate. Active remains disabled. BRC6a/BRC15a Owner closeouts remain unchanged; BRC14/BRC15 live acceptance and package release are outside this package.

## Source and external authority

Integration uses accepted main d4852017f6fc5d9a5167bdf5b64eaf48f9b442c1 and preserved containment candidate 1d0c65a787883b682a85ecb195f5cef85d884606. GitHub workflow 34204022868 was re-read as completed/success for the accepted main. Candidate CI must be recorded separately.

Docker's [daemon security guidance](https://docs.docker.com/engine/security/) establishes daemon access as a host-control capability; it is never supplied to the workload. Linux [PID namespace documentation](https://man7.org/linux/man-pages/man7/pid_namespaces.7.html) describes namespace-init exit terminating remaining namespace processes. Model-free local tests exercise these constraints; the documentation alone is not runtime acceptance.

## Reproduced gaps

- `campaign-container-live.test.ts` protected-control regression failed on the integration candidate before the storage fix: a declared workload mount contained the journal. The fix moves authority outside Git/workspace mounts and rejects overlap/aliasing.
- Both actual finish(fail) regressions initially failed before reaching finish because the old host-PATH setup did not satisfy the new image contract. Their deterministic fixture now models the producer explicitly; separate real Docker tests exercise the consumer and actual finish without a model.
- Preparation/controller-death recovery remains under development. Do not extend running-child watchdog evidence to an unpublished invocation.

Raw development logs are in the ignored `.ai/harness/runs/brc354-consumer/` evidence cache. Final frozen candidate, commands, results and limitations are to be recorded before submission. Existing historical failed batches remain in the preserved plan and notes.

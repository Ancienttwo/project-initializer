# Docker containment readback: confirmed mount-order false rejection

## Result and scope

This is an offline diagnosis, not campaign acceptance. The candidate adapter rejects a legitimate permutation of the top-level `Mounts` response array because `configuration()` includes that array in an order-sensitive digest. No requested mount fact changed in the captured failure. The runtime adapter remains byte-for-byte unchanged during this diagnosis; no provider, container start, production admission, merge or issue closure occurred.

The last failed attempt's complete inspect response had been removed by its disposable fixture cleanup. Only an older request/created/start journal remained; it had no raw inspect pair. One new bounded collection therefore created **one** credential-free container, saved the initial inspect plus three subsequent pre-start reads, and removed that exact container. The adapter's own readback function returned `accepted`, `accepted`, then `container identity or configuration changed`. Every response reported `created`, `Running=false`, `Pid=0`. This reproduces the defect on the same adapter code, but does not retroactively prove that every historical failure had this sole cause.

Environment: Docker CLI and Engine 28.3.2; client/server API fields both 1.51, server minimum 1.24. The adapter uses its sanitized PATH/HOME environment without an API override. No HTTP wire trace was collected; these are recorded version fields, not a fabricated wire-level receipt. Image ID: `sha256:72270cb098680b4e5e9e34f3ed7da6d861551bf946813a485069554055e08523`. The collection shared one 60-second absolute deadline; no deadline was renewed. No auth mount was supplied.

## Exact field differences

The two destinations below are pseudonyms consistently substituted in the saved fixture. Host inputs passed through the adapter's existing `realpathSync` before create; expected mount paths come from those frozen pre-create arguments. An initial fixture-construction mistake used the uncanonicalized input path for expected values; it was corrected from the saved request, not by changing runtime path comparison or rewriting observed values.

| Path | First read | Rejected read | Types | Classification |
| --- | --- | --- | --- | --- |
| `Mounts[0].Destination` | `/private/fixture/work` | `/private/fixture/common` | string/string | known representation difference |
| `Mounts[0].Source` | `/private/fixture/work` | `/private/fixture/common` | string/string | known representation difference |
| `Mounts[1].Destination` | `/private/fixture/common` | `/private/fixture/work` | string/string | known representation difference |
| `Mounts[1].Source` | `/private/fixture/common` | `/private/fixture/work` | string/string | known representation difference |

These are **all** differences in the complete initial/rejected response pair. Pairing unique entries by `Destination` yields identical `Type`, `Source`, `Destination`, `Mode`, `RW=false`, and `Propagation=rprivate`. The arrays contain exactly the two requested bind mounts. `HostConfig.Mounts` did not reorder. The decision is equivalence only for this top-level mount ordering; changed source, access, type, propagation, extra mount or duplicate destination remains rejection.

The captured `Entrypoint`, `Cmd`, `Path`, ordered arguments, immutable image identity, inherited image environment, `SecurityOpt`, capability configuration, namespace configuration, restart policy, resource limits and tmpfs inventory match the offline expectations derived from the frozen input/create request and pre-create image inspect. They did not change between reads. This is configuration readback, not evidence that all isolation requirements have been exercised at runtime.

## Cause and smallest candidate

- **Pressure point:** `src/effects/automation/campaign-container.ts`, `configuration()` and `inspect()`: raw `Mounts` ordering influences `configuration_sha256`.
- **Trigger/evidence:** the same created container's third read exchanged two complete mount entries; no state transition or workload occurred. The legacy projection rejects the saved response deterministically offline.
- **Candidate:** validate the supported mount shape and unique destinations, then key/sort only the top-level observed `Mounts` by exact `Destination`, retaining every field. Do not sort `Cmd`, `Args`, `Entrypoint` or Env, globally rewrite null, or drop unknown mount fields. The candidate lives only in the offline diagnostic module; it has not replaced the runtime validator.
- **Safety guard:** expected mount inventory is derived before inspect, from the approved exact paths/access and encoded request. Both extra and missing entries reject. The initial observed configuration is not an authorization source. Production integration still needs to replace the prototype's incomplete pre-start checks with the complete expected-spec check; merely fixing the drift digest is insufficient for admission.

Docker's create operation deliberately stops before workload start. Its API exposes inspect mounts as mount facts, and the pinned daemon returns the result of `GetMountPoints()` as the response `Mounts`. The saved same-container permutation is direct evidence that this response order is not stable on this Engine. Sources: [Docker create](https://docs.docker.com/reference/cli/docker/container/create/), [Moby v28.3.2 inspect](https://github.com/moby/moby/blob/v28.3.2/daemon/inspect.go), [Docker bind-mount inspection](https://docs.docker.com/engine/storage/bind-mounts/).

## Reproducible evidence

- Restricted local raw bundle: `.ai/harness/runs/brc-host-diagnosis/` (directory 0700, files 0600). It includes original adapter source, input, actual CLI create arguments, context/image/version responses, complete inspect responses, per-call outcomes, cleanup output and SHA-256 manifest. It is an ignored evidence cache, not a second state store.
- Shareable sanitized fixture: `tests/fixtures/campaign-container-readback/mount-order.json`; full before/rejected structures retain field names, types and ordering. Host paths, container/daemon identity and storage paths are pseudonymized. No real credentials were collected.
- Field report: `tests/fixtures/campaign-container-readback/field-differences.json` contains expected/actual values and types, source, classification and rejection/equivalence decision.
- Pure offline candidate and reporter: `scripts/diagnose-campaign-container-readback.ts`. It cannot call Docker or launch a workload. Its partial supported schema is a diagnostic proposal, not a production general-purpose Docker decoder.

```bash
bun scripts/diagnose-campaign-container-readback.ts tests/fixtures/campaign-container-readback/mount-order.json
bun test tests/effects/campaign-container-readback-diagnostic.test.ts
```

The focused suite passed **12 tests, 30 assertions**. It reproduces the original positional rejection, accepts the captured ordering-only change, and rejects extra/missing mounts, duplicate destinations, unknown mount fields, RO→RW, source/type/propagation changes, watchdog bypass, command reordering, image replacement, privilege/security-option weakening, environment injection, missing booleans and null mount arrays. Running state is separately rejected at the pre-start lifecycle boundary even with an unchanged configuration digest. This does not establish complete Engine-schema coverage, real campaign recovery or host termination acceptance.

## Rule provenance and continuation boundary

The three-round rule is in the local user-level `/Users/ancienttwo/.codex/AGENTS.md:44`, under Sufficiency and Stop Boundaries: `Cap fail -> fix -> reverify loops at three rounds per issue; then stop and report findings.` It was also included in the user's earlier instruction packet. It is **not** attributed to remote root `AGENTS.md`. The original three-round count and paused integration state remain intact; this diagnostic stage was explicitly authorized by the user.

The user subsequently reports **BRC6a has been verified feasible**. Record that update separately from old baseline findings. This diagnosis has not read its new admission receipt and makes no claim that its formal admission integration is accepted or still impossible. Before closing #346, consume the current BRC6a evidence and verify the remaining combined criterion; do not remove the fence based on a feasibility statement.

Existing detached-kill and read-only mount canaries remain evidence for their original subjects. Watchdog compilation and direct version invocation likewise retain their original scope; they do not alone prove the controller-death deadline matrix. No full BRC run, paid provider call, repository-wide acceptance, production source fix or merge was performed in this diagnosis.

## Repository integrity readout (not repaired in this diagnostic stage)

Deploy SQL order, project-state inspection and init dry-run passed. Architecture sync failed because durable projection readiness is missing in this isolated worktree. Task sync failed workflow-profile resolution. Strict task workflow failed because the existing paused Approved work-package plan lacks its required Evidence Contract/Promotion Gate fields and projected task contract. These workflow prerequisites were not repaired or projected during the diagnosis-only authorization. No canonical acceptance is claimed. `git diff --check` produced no tracked whitespace errors; new artifacts remain untracked and uncommitted.

## Approved implementation follow-up

After the user approved implementation, the mount decoder and strict field comparisons moved to `src/core/automation/campaign-containment.ts`. The diagnostic now consumes the runtime comparator, retaining an offline historical ordered projection only to reproduce the old failure. `buildContainmentSpec` freezes expected facts before create; `encodeContainmentCreate` derives the CLI request from that same spec. The immutable request journal binds the spec digest, and readback compares against it both after create and before start. The observed configuration is a drift baseline only, not an authorization source.

Admission checks exact mount inventory, sources, destinations and access, watchdog entrypoint/ordered arguments, pinned image/environment, non-interactive configuration, disabled image healthcheck, rootfs mode, capability/security options, namespaces, runtime, resource bounds, devices/ports, tmpfs inventory and protected system paths. Mount destinations cannot overlap trusted executables or special filesystems. Duplicate environment keys and loader injection variables reject. A changed configuration is saved with its raw readback in the restricted journal and rejected before start. This slice explicitly supports Engine 28.3.2 with builtin seccomp and pins Docker API 1.51; other environments are not silently accepted.

A real writable-mount case exposed one additional representation rule, now covered by a focused counterexample: `HostConfig.Mounts[].ReadOnly` is declared a boolean with `omitempty`, so false may be absent. Only this exact request-side field receives that interpretation. Null/non-boolean values reject, and the actual observed `Mounts[].RW` must remain an explicit boolean. Authority: [Moby v28.3.2 mount type](https://github.com/moby/moby/blob/v28.3.2/api/types/mount/mount.go#L31).

Frozen adapter verification passed **19 tests / 59 assertions** across the offline regression and real credential-free Docker suites. Real cases cover Codex 0.153.4 `--version`, readonly write rejection, non-root workload credentials with no effective capabilities, inability to SIGSTOP namespace init, detached writer termination, absolute deadline, cancellation preserving failure, and a real Docker resource update rejected before any start record. TypeScript checking passed. The image was reused, not rebuilt for this follow-up. No paid provider, campaign consumer wiring, BRC6a admission change, merge or issue closure occurred.

Evidence: `.ai/harness/runs/brc-host-diagnosis/approved-adapter-frozen.log`. The earlier failed blind iteration count remains historical; this follow-up was separately authorized after a field-level diagnosis. Complete controller-crash reconciliation and integration with the campaign lifecycle still require their own evidence; these adapter passes do not close #342/#346.

The approved implementation's final integrity checks subsequently passed: deploy SQL order, architecture sync, task sync with substantive digest `sha256:9b53a37f5e6698f1f16d51841da81086172f2ac44647e588979a7f0172a7ade7`, strict task workflow, project-state inspection and init dry-run. Typecheck also passed. The failed unstarted writable-mount fixture was removed by exact container ID after matching its owned source path; all successful live fixtures removed their own containers. The package remains uncommitted and the broader campaign integration contract remains active; no formal campaign acceptance or issue closure is implied.

## Consumer integration boundary (2026-09-08)

The subsequent approved WIP switches the version probe and managed contract-run child to the Docker carrier, binds invocation v2 to protected host request/terminal journals, and retains exact output/outcome validation. A model-free derivative image executed actual Git commands through the worker/verifier path; writes succeeded for the worker and were denied for the verifier, and both obtained terminal inactivity receipts. This is narrow host evidence, not normal campaign admission.

Consumer integration acceptance is paused after three failed verification batches. The latest combined run had 20 passing cases, two outer test timeouts and one associated error. Two newly added tests were accidentally nested and did not execute. Controller-crash terminal reconstruction remains unfinished. Current code is uncommitted WIP; prior adapter acceptance cannot be relabeled as consumer acceptance. Detailed evidence and next slice live in the active plan notes.

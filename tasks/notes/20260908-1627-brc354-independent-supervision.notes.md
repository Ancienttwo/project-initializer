# Independent supervision integration decisions

- Reuse `1d0c65a7` production containment components, not its old workflow state. Integrate on `d4852017` and retain the later finalization/FIFO/cancellation fixes.
- Controller authority uses the existing account-level process configuration, never a worker-selected Git path. Canonicalize the test home because macOS temporary paths may alias `/private`; explicitly inherit this configuration in spawned recovery tests because Bun snapshots child environments.
- Historical lifecycle tests model protected producer records for finalization; real Docker tests independently exercise actual producer/consumer boundaries. Neither is a real model canary.
- The Docker handoff recovery test uses a real version probe and a never-started worker container. Its observed result is reconciliation-required, charged once with no new lease owner.
- Development evidence: `/tmp/brc354-docker3.log` has 15 passes; `/tmp/brc354-spec.log` has 12 passes. The lifecycle baseline had one child-home mismatch; `/tmp/brc354-recovery-delta.log` verifies that fix and real never-started Docker recovery (2 passes). Final canonical verification owns acceptance.
- No runtime active admission change. No dependencies added. New containment core/effect own exact Docker configuration and host producer authority; the image/PID1 supplies the independent process boundary; new tests and the saved fixture exercise those actual boundaries.

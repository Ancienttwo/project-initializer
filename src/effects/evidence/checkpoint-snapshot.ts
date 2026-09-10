/**
 * Read immutable checkpoint bytes selected by the published marker. Collection
 * may unlink a superseded directory between those two reads. Only an observed
 * marker replacement permits reacquisition; an unchanged dangling/corrupt
 * marker remains an error. Both packaged and standalone readers use this code.
 */
export function readCheckpointSnapshot<T>(
  readMarker: () => string | null,
  readSnapshot: (marker: string) => T,
): T | null {
  let marker = readMarker();
  for (let attempt = 0; attempt < 3; attempt++) {
    if (marker === null) return null;
    try {
      return readSnapshot(marker);
    } catch (error) {
      const current = readMarker();
      if (current === marker || current === null) throw error;
      marker = current;
    }
  }
  throw new Error("checkpoint publication changed repeatedly while acquiring a snapshot");
}

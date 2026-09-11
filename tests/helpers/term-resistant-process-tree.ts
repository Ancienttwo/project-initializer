import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Integration deadlines must allow the real runtime and launcher to start.
// A short timeout can legitimately expire before the descendant exists.
export const PROCESS_TREE_TIMEOUT_MS = 5_000;

export function termResistantProcessTree(root: string) {
  const descendantPidPath = join(root, 'descendant.pid');
  const termReceivedPath = join(root, 'descendant.term');
  const childScript = join(root, 'term-resistant-child.cjs');
  writeFileSync(childScript, [
    "const { writeFileSync } = require('node:fs');",
    // Exercise non-instant startup instead of depending on a warm runtime.
    'Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250);',
    `process.on('SIGTERM', () => writeFileSync(${JSON.stringify(termReceivedPath)}, String(process.pid)));`,
    // The child owns readiness: its handler is installed before publishing PID.
    `writeFileSync(${JSON.stringify(descendantPidPath)}, String(process.pid));`,
    'setInterval(() => {}, 1000);',
    '',
  ].join('\n'));
  const parentScript = [
    "const { spawn } = require('node:child_process');",
    "process.on('SIGTERM', () => {});",
    `spawn(process.execPath, [${JSON.stringify(childScript)}], { stdio: ['ignore', 'inherit', 'inherit'] });`,
    'setInterval(() => {}, 1000);',
    '',
  ].join('\n');
  return { descendantPidPath, termReceivedPath, parentScript };
}

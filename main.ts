import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line, the robot vacuum's own deadpan excuse for missing a spot.
// Fixed string — no Date, no random, no time — so every run writes identical bytes.
const ENTRY =
  "I skipped that corner on purpose — my sensors detected a dust-bunny union meeting, and I respect organised labour.";

const MAX_CHARS = 200;

function codePointCount(text: string): number {
  return [...text].length;
}

function validateEntry(text: string): void {
  const count = codePointCount(text);
  if (count < 1 || count > MAX_CHARS) {
    throw new Error(
      `entry must be 1 to ${MAX_CHARS} characters, got ${count}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validateEntry(ENTRY);
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outputDir, { recursive: true });
  const target = join(outputDir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");
  verifyWrittenEntry(target);
}

main();

function verifyWrittenEntry(target: string): void {
  const written = readFileSync(target, "utf8");
  if (written !== ENTRY) {
    throw new Error("read-back mismatch: entry.txt does not match the expected line");
  }
  const count = codePointCount(written);
  if (count < 1 || count > MAX_CHARS) {
    throw new Error(`read-back length out of range: ${count} characters`);
  }
}

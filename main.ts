import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const line =
  "It worked in staging — which, in hindsight, is just production with fewer witnesses, better lighting, and no actual users.";

// Gate: the sealed scorer needs 1-200 UTF-8 characters, one line, nothing
// but the excuse itself. Fail loudly instead of shipping an invalid entry.
const size = [...line].length;
if (size < 1 || size > 200) {
  throw new Error(`entry line must be 1-200 characters, got ${size}`);
}
if (line.trim() !== line || line.includes("\n") || /[\u0000-\u001f]/.test(line)) {
  throw new Error("entry line must be a single unpadded line with no control characters");
}

writeFileSync(`${outDir}/entry.txt`, line, "utf8");

// Read the file back and confirm what landed on disk is exactly the line.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== line) {
  throw new Error("entry.txt on disk does not match the entry line");
}

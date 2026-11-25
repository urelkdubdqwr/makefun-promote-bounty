// Copy POST.json from the bot directory into the output directory.
// Reads MAKEFUN_BOT_DIR / MAKEFUN_OUTPUT_DIR (falling back to /bot and /output),
// creating the output dir as needed and failing loudly if the source is unreadable.
const { readFileSync, writeFileSync, mkdirSync } = require("node:fs");
const { join } = require("node:path");

const envOr = (name: string, fallback: string): string => {
  const value = process.env[name];
  return value !== undefined && value !== "" ? value : fallback;
};

const botDir = envOr("MAKEFUN_BOT_DIR", "/bot");
const outputDir = envOr("MAKEFUN_OUTPUT_DIR", "/output");
const sourceName = "POST.json";

const sourcePath = join(botDir, sourceName);

let contents: Buffer;
try {
  contents = readFileSync(sourcePath);
} catch (err) {
  const code = (err as NodeJS.ErrnoException).code;
  const reason = code === "ENOENT" ? "no such file" : (err as Error).message;
  console.error(`error: could not read ${sourcePath} (${reason})`);
  process.exit(1);
}

try {
  mkdirSync(outputDir, { recursive: true });
} catch (err) {
  console.error(`error: could not create output directory ${outputDir} (${(err as Error).message})`);
  process.exit(1);
}

writeFileSync(join(outputDir, sourceName), contents);

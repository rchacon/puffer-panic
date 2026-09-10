// Generate the spoken clips in public/audio/ from the free Google Translate TTS
// endpoint (the same one gTTS wraps). Zero dependencies — just Node 18+ fetch.
//
//   npm run audio:gen
//
// The generated .mp3 files are committed, so the app never needs this at runtime.
// The word list is parsed from src/data/words.ts so it stays the single source.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";

const ROOT = new URL("../", import.meta.url);
const OUT = new URL("public/audio/", ROOT);

const wordsSrc = await readFile(new URL("src/data/words.ts", ROOT), "utf8");
const WORDS = [...wordsSrc.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

if (WORDS.length === 0) {
  console.error("No words found in src/data/words.ts");
  process.exit(1);
}

const CUES = [
  ["correct", "Yes! That's right!"],
  ["wrong", "Oops. Try again."],
  ["defeat", "Oh no! The shark caught the puffer fish."],
  ["survive-barely", "Phew! The puffer fish barely got away."],
  ["survive-hurt", "Nice work! The puffer fish got away."],
  ["victory", "Wow! The puffer fish beat the shark!"],
];

const jobs = [
  ...WORDS.map((w) => [`prompt-${w.toLowerCase()}.mp3`, `Which one spells... ${w}?`]),
  ...CUES.map(([name, text]) => [`${name}.mp3`, text]),
];

async function fetchTts(text) {
  const url =
    "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=" +
    encodeURIComponent(text);
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) throw new Error(`suspiciously small (${buf.length} bytes)`);
  return buf;
}

await mkdir(OUT, { recursive: true });
console.log(`Generating ${jobs.length} clips into public/audio/ ...`);

let ok = 0;
for (const [file, text] of jobs) {
  try {
    const buf = await fetchTts(text);
    await writeFile(new URL(file, OUT), buf);
    process.stdout.write(`  ${file}  (${buf.length} b)\n`);
    ok++;
  } catch (err) {
    process.stdout.write(`  ${file}  FAILED: ${err.message}\n`);
  }
  await sleep(250); // be polite to the endpoint
}

console.log(`\nDone: ${ok}/${jobs.length} clips written.`);
if (ok !== jobs.length) process.exit(1);

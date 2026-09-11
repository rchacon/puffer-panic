// Generate the spoken clips in public/audio/ from the free Google Translate TTS
// endpoint (the same one gTTS wraps). Zero dependencies — just Node 18+ fetch.
//
//   npm run audio:gen
//
// The generated .mp3 files are committed, so the app never needs this at runtime.
// The word list is parsed from src/data/words.ts, and the predator labels from
// src/game/predators.ts, so both stay a single source of truth.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";
import { toMidSentence } from "../src/shared/textUtils.mjs";

const ROOT = new URL("../", import.meta.url);
const OUT = new URL("public/audio/", ROOT);

const wordsSrc = await readFile(new URL("src/data/words.ts", ROOT), "utf8");
const WORDS = [...wordsSrc.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

if (WORDS.length === 0) {
  console.error("No words found in src/data/words.ts");
  process.exit(1);
}

// One label per level, in order (level 1 first) -- mirrors PREDATOR_LEVELS.
const predatorsSrc = await readFile(new URL("src/game/predators.ts", ROOT), "utf8");
const PREDATOR_LABELS = [...predatorsSrc.matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1]);

if (PREDATOR_LABELS.length === 0) {
  console.error("No predator labels found in src/game/predators.ts");
  process.exit(1);
}

// defeat-<level>.mp3 / victory-<level>.mp3 -- text matches outcomeText() in
// src/game/outcome.ts so the voice says what the screen says.
const outcomeCues = PREDATOR_LABELS.flatMap((label, i) => {
  const level = i + 1;
  return [
    [`defeat-${level}`, `${label} caught the puffer fish this time. Try again!`],
    [`victory-${level}`, `The puffer fish puffed up huge and sent ${toMidSentence(label)} packing!`],
  ];
});

const CUES = [
  ["correct", "Yes! That's right!"],
  ["wrong", "Oops."],
  ["survive-barely", "Phew! The puffer fish barely got away."],
  ["survive-hurt", "Nice work! The puffer fish got away."],
  ["release-the-kraken", "Release the Kraken!"],
  ...outcomeCues,
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

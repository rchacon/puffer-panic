# Puffer Panic

A small sight-words reading game for early-elementary kids. A female voice asks
"Which one spells &lt;word&gt;?", three flash cards show 1&ndash;4 letter Dolch sight
words, and picking the right one over 5 rounds decides whether a puffer fish
survives a shark -- or, on a replay, something worse.

Vite + React + TypeScript. No CSS framework, no animation library, no state
library &mdash; a `useReducer` state machine and hand-written inline SVG.

## Layout

- `src/game/` &mdash; all logic, browser-free and unit-tested:
  - `rounds.ts` &mdash; `buildRounds(count, pool)` picks targets + 2 distractors
    each; also `MIN_WORDS`.
  - `outcome.ts` &mdash; `getOutcome(score)`, `pufferScale(score)`,
    `outcomeText(outcome, predatorLabel)`, `TOTAL_ROUNDS`.
  - `useGame.ts` &mdash; the `start | playing | reveal | result` state machine.
    `start(pool?)` takes the chosen word list.
  - `predators.ts` &mdash; `PREDATOR_LEVELS` (10 rows) and
    `getPredatorLevel(playCount)`; see "Predator escalation" below.
- `src/components/` &mdash; presentational. `BattleScene` owns the `<svg>` and
  renders whichever creature(s) `predators.ts` resolved, via
  `predators/index.ts`'s `PREDATOR_COMPONENTS` map, plus `Puffer`;
  `CardRow` / `FlashCard` are the answers; `WordPicker` is the start-screen
  word chooser.
- `src/components/predators/` &mdash; one illustration per creature (same
  flat-SVG technique as `Shark.tsx`/`Puffer.tsx`). `Megalodon` reuses `Shark`
  recolored/rescaled rather than new art. `Kraken` and `SharkPrincess` are
  the two exceptions, both vendored/user-provided raster or vector art
  rather than hand-drawn -- see "Predator escalation" below.
- `src/audio/player.ts` &mdash; plays clips from `public/audio/`, degrades to
  silence if a file is missing or autoplay is blocked.
- `src/shared/` &mdash; plain `.mjs` (not `.ts`) helpers needed by both the app
  and a `scripts/*.mjs` tool, e.g. `textUtils.mjs`'s `toMidSentence` (used by
  `outcome.ts` and `generate-audio.mjs`) &mdash; a `.d.mts` alongside gives
  TypeScript its types. Avoids a hand-duplicated copy in the script that only
  a comment keeps in sync.
- `src/data/words.ts` &mdash; the word bank (one double-quoted literal per word).
- `src/data/wordSelection.ts` &mdash; load/save the chosen words in
  `localStorage["puffer-panic:selected-words"]`, falling back to the full bank.
- `public/audio/*.mp3` &mdash; committed voice clips.
- `public/favicon.svg` &mdash; synced by hand from `puffer-website`
  (`../puffer-website/public/favicon.svg`, the marketing site repo) so the
  game and the site share a mark. Re-copy it if that file changes there.
- `scripts/*.mjs` &mdash; zero-dependency Node tools (see Conventions).

## Commands

```bash
npm run dev         # http://localhost:5173
npm test            # vitest: game logic + one App render smoke, ~1s, no browser
npm run build       # tsc -b && vite build (+ postbuild writes dist/version.json)
npm run audio:gen   # regenerate public/audio/ (needs network)
npm run screenshot  # drive the running dev server, save screenshots/*.png
```

`?debug=1` on the URL adds an overlay that jumps straight to each ending.

## Checking what's deployed

`npm run build` writes `dist/version.json` (`{ commit, builtAt }`) via the
`postbuild` hook (`scripts/write-version.mjs`), deployed alongside `index.html`
at the site root, so a running copy can be identified with
`curl <site>/version.json`. The commit is a CI-injected SHA (`GITHUB_SHA` /
`AWS_COMMIT_ID`) when set, else `git rev-parse`, else `"unknown"`.

## Game rules (don't reverse-engineer these &mdash; change them here + in `outcome.ts`)

- Always 5 rounds. The shark advances one step every round regardless of the answer.
- Correct answer &rarr; puffer grows in place (`pufferScale = 1 + 0.24 * score`).
  Wrong answer &rarr; short "Oops.", correct card highlighted, no growth.
- Final score &rarr; ending: **0&ndash;2** eaten &middot; **3** survives, barely &middot;
  **4** survives, scratched &middot; **5** puffer defeats the shark.
- The start screen `WordPicker` chooses which words are in play (min `MIN_WORDS`
  = 3, default all). Still 5 rounds always: with a small pool `buildRounds`
  repeats target words but never twice in a row.

## Predator escalation

Each game actually *started* this session (including the very first) bumps a
`playCount` in `App.tsx` and advances one step through `PREDATOR_LEVELS` in
`src/game/predators.ts` -- level 1 is one shark, level 10 is the Kraken, then
it wraps back to level 1. **Visual/thematic only**: every level still plays
the same 5 rounds with the same scoring thresholds above; only what
`BattleScene` draws, the `ResultScreen` wording, and the defeat/victory voice
line change. The counter is **session-only** (a plain `useState`, not
persisted) -- unlike the word selection, reloading the page resets it to
level 1.

The defeat/victory voice cue names the actual predator: `useGame.start(pool,
predatorLevel)` stashes the level in a ref purely so `outcomeAudioCue()` in
`outcome.ts` can pick `defeat-<level>.mp3` / `victory-<level>.mp3` at the end
(text matches `outcomeText()`, generated by `scripts/generate-audio.mjs` from
`PREDATOR_LEVELS`'s labels -- one pair of clips per level, 20 total). The
survive outcomes stay generic (`survive-barely.mp3`/`survive-hurt.mp3`) since
their text never mentions the predator either.

The Kraken (level 10, and every time the cycle wraps back to it) gets an
extra title-card flourish -- `App.tsx`'s `handleStart` detects it via
`nextPredator.kind`, shows `KrakenIntro`, and plays both
`release-the-kraken.mp3` (the voice line) and `src/assets/kraken-music.wav`
(a quieter background sting, via the generic `playUrl()` in
`audio/player.ts`) for ~2.1s before the round actually begins (`beginGame`).
The Kraken's own artwork (`src/components/predators/Kraken.tsx`) is a
vendored illustration, not hand-drawn like the others -- see that file's
header comment for why it isn't mirrored/rotated like you'd expect.

`kraken-music.wav` is trimmed (with a baked-in fade-out, no real cut point
existed in the source -- see the RMS-envelope analysis this was picked from)
from "Heavy Concept A Bass Master" by cynicmusic, CC0, via OpenGameArt:
https://opengameart.org/content/dramatic-boss-encounter -- unlike the Kraken
SVG this lives in `src/assets/` and is played through a Vite asset import
(`import krakenMusic from "./assets/kraken-music.wav"`), not `public/audio/`,
since it isn't part of the TTS pipeline `generate-audio.mjs` covers.

`KrakenIntro` also shows a big black kraken emblem behind the text
(`.kraken-intro__icon`, `src/assets/kraken-icon.svg`) -- "Mode Standard
Kraken" from SVG Repo (svgrepo.com/svg/355417/mode-standard-kraken). SVG Repo
blocks automated fetches with a bot-detection checkpoint, so this was
downloaded by hand and its exact license wasn't independently re-verified --
check that page before reusing this icon anywhere beyond this one spot.

Level 3's `SharkPrincess` (`src/components/predators/SharkPrincess.tsx`) is a
cheerful crowned whale shark, user-provided (not sourced/licensed the way the
Kraken assets were -- verify provenance before reusing it anywhere else).
`src/assets/shark-princess.png` is a processed derivative, not whatever file
was last provided -- check git history before assuming the current one is
the original. Two things this asset has swung between are worth knowing if
it changes again:
- A true hand-authored vector redraw (small, infinitely crisp, embedded
  `?raw` like the Kraken) doesn't reliably look like a provided reference
  image -- it's a fresh illustration in the same spirit, not a trace of it.
- A "vector" that's actually a per-pixel trace of a raster source (every
  pixel/run of pixels encoded as its own tiny filled path,
  `shape-rendering="crispEdges"`) looks identical to the source but is
  *worse* than a plain raster on every axis: bigger file (a 768x512 trace
  ran 1.4MB, next to ~330KB for the equivalent PNG), no real vector benefit
  (doesn't scale cleanly -- hard pixel edges, no antialiasing), and it's
  still not really vector art despite the `.svg` extension.

  If a provided "SVG" balloons past a few hundred KB, it's almost certainly
  one of these two raster-in-disguise cases (this one, or the earlier
  base64-PNG-in-an-`<image>` wrapper) -- open it and check before assuming
  it's cheap to embed like the Kraken's real vector art.

Current version (restored from the first raster attempt, see git history --
the pixel-traced-then-rerasterized one above lost a little gradient detail
in the round trip and isn't what's in the repo): background flood-filled to
transparent from the original's image border inward (safe there since the
art never touched the canvas edge -- a naive "make white pixels transparent"
would have also punched holes in the shark's own legitimate white
belly/spots), cropped to content, and downscaled to 700px wide (~320KB,
comfortably covers the scene's realistic on-screen size at up to 3x device
pixel ratio; `.scene__svg` renders at `width: 100%` of a 720px-max-width
container). Imported as a URL, not `?raw`, so Vite emits it as its own
cacheable file instead of inlining a base64 string into the JS bundle.

## Conventions

- **Scripts stay dependency-free.** `scripts/generate-audio.mjs` and
  `scripts/screenshot.mjs` use only Node built-ins (`fetch`, `WebSocket`,
  `child_process`) plus plain-JS files under `src/shared/` (no build step
  needed to run either directly with `node`). Don't add npm deps for tooling.
- **Audio.** Clips are committed so the app runs offline. Regenerate with
  `npm run audio:gen` after editing `src/data/words.ts` (the script parses the
  quoted string literals). The Google TTS endpoint returns slightly different
  bytes every fetch, so a full regen shows every clip as modified &mdash; commit
  only the clips you actually meant to add or remove, `git restore` the rest.
  PyPI is unreachable in this environment; that's why audio is a Node script
  hitting Google Translate TTS rather than Python/gTTS.
- **SVG animation.** Put `transform-box: fill-box; transform-origin: center` on
  any group that CSS scales or rotates, or it pivots about the viewBox origin
  and flies off screen. Keyframe `transform` on an element also overrides its
  positioning `transform` attribute &mdash; nest a positioned outer `<g>` around
  an animated inner `<g>`.
- **Tests** are pure logic tests (`rounds`/`outcome`/`predators`/`wordSelection`)
  plus interaction tests over `<App>` with Testing Library + fake timers --
  not pure render smoke tests. Reach for a full playthrough (`fireEvent`
  through real rounds via `answerAllRounds`/`playThroughOneGame` in
  `App.test.tsx`) when the thing being verified is state-machine/timing
  behavior across real user interactions (predator escalation, the Kraken
  intro's timer/re-entrancy guard) -- there's no shortcut to that state
  other than actually playing it; `?debug=1`'s `debugOutcome` bypasses
  `handleStart`/`beginGame` entirely, so it tests something else, not a
  lighter version of the same thing. Keep it to a single light render check
  otherwise. Either way: no real browser, no real timers (`vi.useFakeTimers`),
  stay fast. `npm run screenshot` is a manual "does it look right" check,
  never CI.
- Short single-letter / `a`-initial sight words tend to be mispronounced by the
  TTS voice; check a new word actually sounds right before adding it.

## Git conventions

PRs are merged with a merge commit (`gh pr merge --merge`), not squash or
rebase &mdash; preserves the individual commit history from the PR branch.
After merging, delete the branch both locally and remotely
(`gh pr merge --merge --delete-branch` does both in one step).

When addressing review comments on an open PR, break the fixes up into
separate commits along logical lines (one commit per distinct issue/fix,
not one commit for everything) rather than a single catch-all commit, and
reply to each review comment on GitHub referencing the specific commit
hash that addressed it, formatted as a hyperlink to the commit rather than
just backticked text (e.g. "Fixed in
[abc1234](https://github.com/rchacon/puffer-panic/commit/abc1234).") -- keeps
the review thread traceable to the exact change that resolved it, one
click away, rather than a generic "addressed" reply pointing at the whole
PR.

When *submitting* a code review on a PR, post each finding as its own
separate inline review comment (anchored to the specific file/line via
`gh api repos/{owner}/{repo}/pulls/{number}/comments`, not a single bundled
`gh pr comment`) -- a combined comment listing every finding only supports
one flat reply thread, making it impossible to reply to (or resolve)
individual findings separately later.

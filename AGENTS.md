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
  flat-SVG technique as `Puffer.tsx`). `Megalodon` reuses `Shark` rescaled
  and darkened via CSS filter rather than new art. `Shark.tsx` (one level
  up, in `src/components/`), `Kraken`, `SharkPrincess`, `Piranha` and
  `Mosasaurus` are vendored/user-provided raster or vector art rather than
  hand-drawn -- see "Predator escalation" below.
  `scopeIds.ts` is the shared id-uniquing helper `Shark`/`Piranha` both need
  (see there).
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

Level 4's `Piranha` (school of 4, see `getSchoolOffsets`) is vendored real
vector art -- "piranha" by liakad on OpenClipart
(openclipart.org/detail/4631/piranha-by-liakad), public domain
(`src/assets/piranha.svg`'s own `<metadata>` carries the CC0-equivalent
license block; keep it if this file is ever re-saved by a tool that strips
metadata). Recolored by hand from its original teal palette to a grey body
with a red belly (a red-bellied piranha, *Pygocentrus nattereri*): the
original's gradient/fill hex values were swapped for grey equivalents at the
same luminance stops (preserves the existing rounded-body shading, just
desaturated), and a new belly-patch `<path>` + gradient (`#piranha-belly`)
was added, hand-traced from the body outline's own bottom-edge bezier
segments (see `path10475` in the source) so it actually follows the body's
silhouette rather than being an approximate blob, then closed with a
freehand return curve back up into the body interior and filled
red-fading-to-transparent so it blends into the grey above it rather than
having a hard seam.

Level 1/2's `Shark` (reused unmodified for level 2's two-shark school, and
by `Megalodon`, see below) is also vendored real vector art -- recolored to
a great white: swapped its original two teal shades for grey (back/fins)
and near-white (belly), same "swap the hex values" approach as the
Piranha. Its black outline wasn't a plain `stroke` to just dial down --
the source is a single filled black path (an "outline stroke" already
converted to a filled shape, likely by whatever tool exported it), so
there's no `stroke-width` to edit. Thinned instead with an SVG
`<feMorphology operator="erode">` filter baked into `shark.svg` itself
(`radius="2"`) applied to that path. Trade-off worth knowing: eroding a
uniformly-filled outline shrinks thin details (the gill-slit lines, the
lateral line) much more aggressively than the thick outer border, since
erosion removes the same absolute width from every edge regardless of the
shape's local thickness -- a bigger radius reads as a "cleaner" thinner
outer border but starts eating the thin lines down to a ragged, gap-y
sliver (visible at full native resolution, but not at the tiny size this
actually renders at in-game -- check any radius change at gameplay scale,
not just the source file). Provenance/license not verified for this one
(user-provided, like SharkPrincess) -- check before reusing elsewhere.

Both `Piranha` and `Shark` render `count` times at once (schools of 4 and
2 respectively, see `getSchoolOffsets`) -- the same vendored markup, ids
and all, gets injected into the DOM several times simultaneously via
`dangerouslySetInnerHTML`. Unlike Kraken/SharkPrincess (always rendered
once), a static id prefix baked into the file (like the Kraken's
`kraken-`) doesn't help there, since every instance would still carry the
*same* prefix. Both instead go through `useScopedSvg()`
(`src/components/scopeIds.ts`, shared rather than duplicated) which
rewrites every `id="..."` (and matching `url(#...)`/`xlink:href="#..."`)
to a per-instance-unique suffix at render time (`useId()` + a small regex
pass, memoized), so no two instances on screen ever share a gradient/
filter id. Any future vendored asset that can render more than once at a
time needs the same treatment -- a static prefix alone only solves
collisions *between* different creatures, not against copies of itself.
That said, `scopeIds()`'s pattern-matching only covers the double-quoted
`id="..."`, `url(#...)` and `(xlink:)href="#..."` forms an Inkscape/
Illustrator export actually uses -- it won't catch single-quoted
attributes, an id referenced from a `<style>` block, or a SMIL
`begin="other.click"`-style reference. Fine for piranha.svg/shark.svg/
kraken.svg as they stand; check for those before reusing it on a
differently-authored source file.

Megalodon (level 8) reuses `Shark`'s vendored art scaled up, darkened via
the `.megalodon` CSS filter (`brightness(0.62)`) rather than the fill-prop
overrides the old hand-drawn Shark took -- there's no per-shape fill to
override any more, just one baked-in image. A lone `brightness()` doesn't
have the chained sepia/saturate/hue-rotate fragility that bit the Kraken's
filter on iOS (see that section) -- it's simple, well-defined, linear math,
not several functions composed on top of each other.

Level 9's `Mosasaurus` is a raster illustration, user-provided (not
sourced/licensed the way the Kraken/PhyloPic assets were -- verify
provenance before reusing it elsewhere). Went through two other approaches
first (a hand-authored vector redraw, then a recolored PhyloPic silhouette
-- see git history) before landing here on "just use the PNG the user
actually likes the look of." `src/assets/mosasaurus.png` is a processed
derivative of that PNG, not the original file itself: the source had **no
real alpha transparency** despite looking like it had a transparent
checkerboard background -- every pixel's alpha was 255, and the
"checkerboard" was literally baked into the pixels as opaque light-grey/
white squares (confirmed by checking the alpha channel's histogram, not by
eyeballing the preview). Background flood-filled to transparent from the
image border inward, matching *either* of the checkerboard's two
near-white/grey tones (safe here since the art's own outline never touches
the canvas edge, and its own light colors -- belly, teeth -- are clearly
blue/cream-tinted rather than neutral grey, so they don't get caught by a
strict near-grey color test even before connectivity is considered), then
cropped to content and downscaled to 300px wide (~51KB) -- deliberately
small since file size was the priority for this one, at some cost to
crispness on very large/high-DPI displays. Imported as a URL like
SharkPrincess.tsx, not `?raw`, so Vite emits it as its own cacheable file.

Deliberately drawn much bigger in `Mosasaurus.tsx` than every other
predator (width 200 vs. Shark's 159) -- it's meant to look imposing. That
size, plus starting much farther off-screen (`startX` 460 vs. everyone
else's 350 in `BattleScene.tsx`) for a longer runway, means a plain linear
approach (what every other predator uses) makes each round-to-round step a
big, fast jump: the same handful of progress fractions now span a much
larger pixel range. Two earlier fixes were tried and abandoned before
landing on the current one (see git history): shrinking the sprite down to
a normal-sized footprint (worked, but the user preferred it big), and a
7-point hand-tuned checkpoint table (worked, but its uneven segment slopes
made consecutive steps move at wildly different effective speeds, which
read as janky on mobile). The current fix is a single continuous easing
formula -- `sharkProgress ** 3` -- applied only to the Mosasaurus's
progress before the shared linear `sharkX` math: no seams between
differently-sloped segments for steps to look inconsistent across, just
one smooth curve that keeps every round's step small and reserves most of
the closing distance for the very last one (round 5's reveal), which then
reads as a dramatic final lunge rather than a steady creep. Tuned/verified
by actually playing through 5 rounds (clicking real cards, not the
`?debug=1` outcome-jump buttons) and screenshotting every `playing` *and*
`reveal` phase -- the debug buttons skip the `reveal` phase entirely, which
turned out to hide a real jump (sharkProgress advances by a full 1/5th of
the way there, not the smaller step within-round answering causes) that
earlier verification passes never accounted for.

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

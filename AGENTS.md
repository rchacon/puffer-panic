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
  flat-SVG technique as `Eel.tsx`/`Anglerfish.tsx`/`TapahCatfish.tsx`).
  `Megalodon` reuses `Shark` rescaled and darkened via CSS filter rather
  than new art. `Shark.tsx` (one level up, in `src/components/`), `Kraken`,
  `SharkPrincess`, `Piranha` and `Mosasaurus` are vendored/user-provided
  raster or vector art rather than hand-drawn -- see "Predator escalation"
  below. `Puffer.tsx` (also one level up -- the protagonist, not a
  `predators/` entry) is likewise now vendored vector art, not hand-drawn.
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

Level 4 (the Shark Princess's escort) is the one level that mixes
creatures instead of rendering `count` copies of one `kind` -- two
`PredatorLevel` fields exist just for this: `kinds` (per-instance kind,
same length as `count`) and `offsets` (per-instance position/scale,
overriding the generic same-size `getSchoolOffsets(count)` formation).
Both are read by index in lockstep in `BattleScene.tsx`
(`getInstanceKinds(predator)` for the kind, `predator.offsets ??
getSchoolOffsets(predator.count)` for the position), and array order is
also *draw* order -- later entries render on top. Level 4 uses that to
give the Princess the exact same `{dx: 0, dy: 0, scale: 1}` position/size
her solo level-3 appearance uses (not just "full size" in the abstract --
matching level 3's own numbers directly), drawn last (in front), with her
two brother sharks small (`scale: 0.4`) and spread well apart from her
(drawn first, behind her). Tucking them in low next to her at a bigger
scale, the first attempt at this, looked wrong once actually rendered
two different ways: reusing the generic 3-slot school formation
(`getSchoolOffsets(3)`) as-is made all three read as the same size; a
custom formation that still kept the brothers large and close (`scale:
0.55`, tight spacing) fixed that but let them visually overlap/crowd the
Princess enough that she read as smaller than her level-3 self, even
though her own `scale` was already `1` both times -- the occlusion was
the actual problem, not her size. `predators.test.ts` pins both the kind
order and the relative scale so a future edit to either can't silently
swap who's in front.

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
formula -- `0.2 * t + 0.8 * t ** 3` (`PREDATOR_APPROACH.mosasaurus.ease` in
`BattleScene.tsx`) -- applied only to the Mosasaurus's progress before the
shared linear `sharkX` math: no seams between differently-sloped segments
for steps to look inconsistent across, just one smooth curve that keeps
every round's step small and reserves most of the closing distance for the
very last one (round 5's reveal), which then reads as a dramatic final
lunge rather than a steady creep. The pure cube this started as
(`t ** 3`) has a slope of exactly zero at t=0, which made round 1's move a
couple of imperceptible pixels; blending in 20% linear gives it a nonzero
slope at the start so that first move actually reads as movement, without
the cube's dominance over the rest of the curve. Tuned/verified by actually
playing through 5 rounds (clicking real cards, not the `?debug=1`
outcome-jump buttons) and screenshotting every `playing` *and* `reveal`
phase -- the debug buttons skip the `reveal` phase entirely, which turned
out to hide a real jump (sharkProgress advances by a full 1/5th of the way
there, not the smaller step within-round answering causes) that earlier
verification passes never accounted for.

Its `<image>` x offset centers it on the local origin (`-width/2`), same
convention as Shark/Piranha/SharkPrincess -- each one's art is cropped
tight to its own content, so centering the box lines up roughly the right
amount of open jaw with the shared final-contact position (`sharkX=150`)
for a believable bite. An earlier revision had this off-center by 30
units (`x={-130}` for a 200-wide box, instead of `-100`), which put the
puffer under the Mosasaurus's mid-body/flippers at that position instead
of near its mouth -- caught by `/code-review` actually rendering the final
frame and comparing bounding boxes against the Shark's, not by inspecting
the numbers alone.

`Puffer` (the protagonist, not a `predators/` entry -- always rendered via
`BattleScene`'s own `<Puffer />`, not the `PREDATOR_COMPONENTS` map) was
originally the one hand-drawn creature left (a ring of 12 `<line>` spikes
around two circles); it's now `src/assets/pufferfish.svg`, vendored real
vector art from SVG Repo (the file's own header comment says so, but SVG
Repo blocks automated fetches with a bot-detection checkpoint like the
kraken-icon -- downloaded by hand, exact page/license not independently
verified, check before reusing elsewhere). A flat cartoon "polka-dot"
style rather than the old spiky silhouette; already drawn facing right
(toward the predator) in its native orientation, no mirroring needed.

Its source `<svg>` root carried `height="800px" width="800px"` alongside
its `viewBox="0 0 512.001 512.001"` -- the same class of bug as the
Mosasaurus PhyloPic silhouette's pt-unit clipping (see above), just with
`px` instead of `pt`: nested inside the wrapper via
`dangerouslySetInnerHTML`, those absolute pixel dimensions scale
independently of the outer wrapper's own viewBox, rendering content
~1.56x oversized and silently clipped by the nested `<svg>`'s default
`overflow: hidden`. This had already bitten twice by hand-deleting the
attributes from the vendored file itself (Mosasaurus, then this one), with
nothing but a comment telling the next person to remember to check --
`src/components/vendoredSvg.ts`'s `stripRootSvgDimensions()` now does this
automatically at import time instead, applied to every real vendored SVG
with a root `<svg>` tag (`Puffer`, `Shark`, `Piranha` -- not `Kraken`/
`KrakenIntro`'s icon, whose source files are markup *fragments* with no
root `<svg>` tag at all, so they're structurally immune). Safe to apply
unconditionally even where it's a no-op (Shark.svg's `width`/`height`
already equal its own `viewBox` numbers in the same unitless units, so
removing them changes nothing) -- do this for any new vendored SVG too,
rather than hand-checking whether it needs it first.

`Puffer.tsx` also adds a white eye glint and replaces the source's own
neutral/frown mouth with a smile, string-appended into its own markup
(right before its closing `</svg>`, so the new shapes share its
`0 0 512.001 512.001` viewBox directly) rather than edited into the
source file or drawn as a separate positioned overlay. The source's
outline -- pupil and mouth included -- is one giant compound path (three
subpaths total for the whole file: the main silhouette, one small detail
near a fin, and everything else -- pupil, mouth, gill lines -- fused into
a single ~4800-character path via connecting bridges, not cleanly
separable sub-shapes), so there's no "mouth path" to delete or redraw in
place; instead an opaque ellipse in the source's own flat local fill
color (`#FFD77D`, confirmed solid -- not part of a gradient -- by
sampling a rendered preview, so a flat patch leaves no visible seam)
covers the original mouth first, then the smile draws on top of that
patch. (A first attempt drew the smile *next to* the original mouth
instead of replacing it, which read as a mustache-and-mouth combo, not a
smile -- covering the original first and drawing on top is what actually
gets a replacement rather than an addition.)

Coordinates for all of this were found by rendering the source with a
temporary labeled coordinate grid overlaid (10-unit spacing, drawn the
same string-append way) and reading the pupil/mouth positions directly
off of it, at a large (~550px) rendered size -- not the tiny in-game
size, and not by pixel-measuring a plain screenshot and converting back
to viewBox units, which turned out unreliable twice over (a polka dot
sat close enough to the true pupil to be mistaken for it, and the mouth
patch sized from that same estimate missed the actual mouth shape
entirely on the first attempt). The coordinate grid technique is the one
worth reusing for any future tweak here -- render with grid lines and
read the numbers, don't estimate from an unlabeled screenshot.

`BattleScene`'s seabed `<path>` and the `Rocks` component next to it
(`src/components/Rocks.tsx`, same absolute-scene-coordinates technique as
`ShipWreck`) are the one piece of scenery that isn't per-predator --
sand-colored rather than the original dark green, present at every level.
`Rocks` went through two versions (see git history): a hand-drawn pair of
flat-color ellipses (dropped after a highlight shape that touched the
silhouette's own edge read as a separate cap sitting on top, a hard seam,
not a soft sheen -- worth remembering if scenery ever goes back to
hand-drawn shapes), then the current one, vendored real vector art (a
detailed shaded boulder, "🪨" Rock from the Noto Emoji set via SVG Repo,
same bot-detection-checkpoint provenance caveat as the Puffer/kraken-icon)
rendered twice at different sizes side by side. Its root `<svg>` also
carried the same `width`/`height`-vs-`viewBox` mismatch Puffer's did,
handled the same way via `stripRootSvgDimensions()`; since it renders more
than once at a time, its gradient ids also need `useScopedSvg()` like
Piranha/Shark's schools -- called twice here (once per rock instance)
rather than once, since each call consumes its own `useId()` slot and so
already returns two independently-suffixed results.

Both rocks are kept on the left half (under/around the Puffer) so they
never compete for space with the Kraken's `ShipWreck`, which occupies
roughly x=250-390 on the right. Sized to sit tall and prominent on the
sand rather than shrunk down -- the big rock's top edge (y=148) is well
within the Puffer's own reach at high score (`pufferScale(score)` maxes
out at 2.2 at score 5, and `Puffer.tsx`'s local box extends to y=+18, so
at `PUFFER_Y=116` its bottom edge can reach 116+18*2.2=155.6, plus the
idle `bob` keyframe's +3px, for 158.6), so it's kept clear *horizontally*
instead: pinned to the left edge (x=0-52), safely left of the Puffer's own
widest reach at that same high score (56.4-135.6). Shrinking/lowering the
rocks to dodge the Puffer vertically was tried first and technically
worked, but looked worse -- small and half-buried instead of resting on
top of the sand. The small rock, further right and lower, doesn't need to
dodge anything -- its y-range (166-200) is already below the Puffer's max
reach, so it can't overlap regardless of x. (The overlap itself was caught
by `/code-review` actually rendering the victory screen at max score, not
by inspecting the numbers -- worth re-checking with the same technique if
these ever move again.)

`Coral` (`src/components/Coral.tsx`) and `Kelp` (`src/components/Kelp.tsx`)
round out the same seabed cluster, both also always rendered (not
per-predator). `Coral` is vendored real vector art from SVG Repo, same
bot-detection-checkpoint provenance caveat as the Puffer/Rock/kraken-icon;
its source id was the same generic `Layer_1` the Puffer and Shark SVGs
also happen to use (an SVG Repo "Mixer Tools" default, apparently) --
harmless in practice since none of the three ever reference their own id
via `url(...)`, but renamed to `coral-layer` by hand anyway rather than
adding a third literal duplicate id to the DOM. `Kelp` is vendored real
vector art too, but from OpenClipart (`kelpforest.svg`, public domain per
its own `<cc:license>` metadata block -- an actually-verifiable license,
unlike the SVG Repo assets). Both run through `stripRootSvgDimensions()`
regardless of whether it's a no-op for that particular source, the same
"don't hand-check, just always apply it" reasoning as Shark/Piranha --
Coral's actually needs it (the same `width`/`height`-vs-`viewBox`
mismatch as Puffer's, just as `height="..." width="..."`, the opposite
attribute order, which the shared helper doesn't care about), Kelp's
doesn't (no `width`/`height` on its root tag at all).

Positioned like a continuous cluster reading left to right -- Rocks, then
Coral, then Kelp -- rather than scattered independently, so it reads as
one seabed garden. Both Coral and Kelp are kept past the Puffer's own
widest reach at high score horizontally (see Rocks.tsx for that reach's
math), same as the big Rock -- an earlier version tucked Coral in low
next to the small Rock instead (dodging the Puffer vertically, the same
trick the small Rock uses), but unlike that rock, Coral's own artwork
fills almost all the way to its box's bottom edge with no empty margin to
spare, so sitting it low enough to duck under the Puffer's reach buried
most of it in the sand -- looked sunk/cut off by the frame rather than
resting on top of it. Both are positioned relative to the seabed
`<path>`'s own curve at their respective x position, using the curve's own
quadratic-bezier parameterization (it simplifies to a linear `x(t)`, since
each segment's control point sits at the exact horizontal midpoint of its
endpoints) rather than eyeballing it -- worth redoing that math, not
guessing, if either ever moves again. First tuned to land exactly *on*
that curve, which read as too precise/flat once actually seen -- like the
Rocks (sunk in well past their own local sand line, not merely touching
it), Coral and Kelp are each sunk a bit further in past the curve too,
and *not* by the same amount as each other, for a bit of natural
variation rather than a uniform planting depth. The two needed different
handling to get there despite the same underlying technique: Kelp's own
artwork has a fair amount of empty viewBox space below its drawn shadow
(unlike Coral's or the Rocks', which each fill almost their entire box),
so it's its *shadow*, not its box's bottom edge, that actually needs to
sit past the curve -- worked out by rendering the scene with the seabed
curve's own y=160/180/200 values drawn in as temporary reference
gridlines (`Runtime.evaluate` appending `<line>` elements directly into
the live `.scene__svg`) and reading off the pixel gap, rather than
assuming the box-bottom math that works for the other, tightly-cropped
assets also holds here.

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

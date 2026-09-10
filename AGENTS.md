# Puffer Panic

A small sight-words reading game for early-elementary kids. A female voice asks
"Which one spells &lt;word&gt;?", three flash cards show 1&ndash;4 letter Dolch sight
words, and picking the right one over 5 rounds decides whether a puffer fish
survives a shark.

Vite + React + TypeScript. No CSS framework, no animation library, no state
library &mdash; a `useReducer` state machine and hand-written inline SVG.

## Layout

- `src/game/` &mdash; all logic, browser-free and unit-tested:
  - `rounds.ts` &mdash; `buildRounds(count, pool)` picks targets + 2 distractors
    each; also `MIN_WORDS`.
  - `outcome.ts` &mdash; `getOutcome(score)`, `pufferScale(score)`, `OUTCOME_TEXT`, `TOTAL_ROUNDS`.
  - `useGame.ts` &mdash; the `start | playing | reveal | result` state machine.
    `start(pool?)` takes the chosen word list.
- `src/components/` &mdash; presentational. `BattleScene` owns the `<svg>` and
  places `Shark` / `Puffer`; `CardRow` / `FlashCard` are the answers;
  `WordPicker` is the start-screen word chooser.
- `src/audio/player.ts` &mdash; plays clips from `public/audio/`, degrades to
  silence if a file is missing or autoplay is blocked.
- `src/data/words.ts` &mdash; the word bank (one double-quoted literal per word).
- `src/data/wordSelection.ts` &mdash; load/save the chosen words in
  `localStorage["puffer-panic:selected-words"]`, falling back to the full bank.
- `public/audio/*.mp3` &mdash; committed voice clips.
- `scripts/*.mjs` &mdash; zero-dependency Node tools (see Conventions).

## Commands

```bash
npm run dev         # http://localhost:5173
npm test            # vitest: game logic + one App render smoke, ~1s, no browser
npm run build       # tsc -b && vite build
npm run audio:gen   # regenerate public/audio/ (needs network)
npm run screenshot  # drive the running dev server, save screenshots/*.png
```

`?debug=1` on the URL adds an overlay that jumps straight to each ending.

## Game rules (don't reverse-engineer these &mdash; change them here + in `outcome.ts`)

- Always 5 rounds. The shark advances one step every round regardless of the answer.
- Correct answer &rarr; puffer grows in place (`pufferScale = 1 + 0.24 * score`).
  Wrong answer &rarr; short "Oops.", correct card highlighted, no growth.
- Final score &rarr; ending: **0&ndash;2** eaten &middot; **3** survives, barely &middot;
  **4** survives, scratched &middot; **5** puffer defeats the shark.
- The start screen `WordPicker` chooses which words are in play (min `MIN_WORDS`
  = 3, default all). Still 5 rounds always: with a small pool `buildRounds`
  repeats target words but never twice in a row.

## Conventions

- **Scripts stay dependency-free.** `scripts/generate-audio.mjs` and
  `scripts/screenshot.mjs` use only Node built-ins (`fetch`, `WebSocket`,
  `child_process`). Don't add npm deps for tooling.
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
- **Tests** cover pure logic + a render smoke only; keep them browser-free and
  fast. `npm run screenshot` is a manual "does it look right" check, never CI.
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

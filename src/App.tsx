import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { useGame } from "./game/useGame";
import { TOTAL_ROUNDS } from "./game/outcome";
import { getPredatorLevel } from "./game/predators";
import type { PredatorKind } from "./game/predators";
import { WORDS } from "./data/words";
import { loadSelection, saveSelection } from "./data/wordSelection";
import { loadMode, saveMode, type Mode } from "./data/modeSelection";
import { playCue, playUrl } from "./audio/player";
import krakenMusic from "./assets/kraken-music.wav";
import megalodonMusic from "./assets/megalodon-music.wav";
import bloopSound from "./assets/bloop-sound.wav";
import amargasaurusMusic from "./assets/amargasaurus-music.wav";
import { StartScreen } from "./components/StartScreen";
import { BattleScene } from "./components/BattleScene";
import { PromptBar } from "./components/PromptBar";
import { CardRow } from "./components/CardRow";
import { SpellInput } from "./components/SpellInput";
import { ResultScreen } from "./components/ResultScreen";
import { DebugPanel } from "./components/DebugPanel";
import { KrakenIntro } from "./components/KrakenIntro";
import { MegalodonIntro } from "./components/MegalodonIntro";
import { BloopIntro } from "./components/BloopIntro";
import { AmargasaurusIntro } from "./components/AmargasaurusIntro";

const DEBUG =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("debug");

interface BossIntro {
  Component: ComponentType;
  /** Omitted for a boss whose intro doesn't need a spoken line -- the
   *  Bloop plays its own real recording instead (see `music` there). */
  voiceCue?: string;
  music?: { url: string; volume: number };
  durationMs: number;
}

// Title-card flourish played before round 1 of a "boss" game -- currently
// the Megalodon (level 5), the Bloop (level 10), the Amargasaurus
// (level 11) and the Kraken (level 12), and every time the cycle comes
// back around to any of them. A lookup keyed by kind instead of one
// hardcoded `if` per boss so a future boss just adds a row here, not
// another copy of the whole intro/timer/guard flow in handleStart below.
const BOSS_INTROS: Partial<Record<PredatorKind, BossIntro>> = {
  kraken: {
    Component: KrakenIntro,
    voiceCue: "release-the-kraken",
    // Trimmed to 2s with a fade-out baked in (see src/assets/kraken-music.wav's
    // provenance in AGENTS.md) -- quieter than full volume so the voice line
    // stays clear on top of it.
    music: { url: krakenMusic, volume: 0.55 },
    durationMs: 2100,
  },
  megalodon: {
    Component: MegalodonIntro,
    voiceCue: "bigger-boat",
    // See src/assets/megalodon-music.wav's provenance in AGENTS.md --
    // same "quieter than full volume, voice line stays clear on top"
    // reasoning as the Kraken's own music.
    music: { url: megalodonMusic, volume: 0.6 },
    durationMs: 2400,
  },
  bloop: {
    Component: BloopIntro,
    // No voiceCue -- the actual NOAA recording (see AGENTS.md for
    // provenance) plays instead of a synthesized line, at full volume
    // since it's the point of this boss, not background ambience under
    // one. durationMs covers its own ~4.7s (trimmed, fades baked in) plus
    // a beat of margin after the fade-out finishes.
    music: { url: bloopSound, volume: 0.9 },
    durationMs: 4900,
  },
  amargasaurus: {
    Component: AmargasaurusIntro,
    voiceCue: "move-in-herds",
    // See src/assets/amargasaurus-music.wav's provenance in AGENTS.md --
    // same "quieter than full volume, voice line stays clear on top"
    // reasoning as the Kraken's/Megalodon's own music. durationMs covers
    // its own trimmed ~2.6s (fades baked in) rather than the voice
    // line's shorter ~2s, so the music's own fade-out finishes instead
    // of getting cut off mid-swell.
    music: { url: amargasaurusMusic, volume: 0.55 },
    durationMs: 2700,
  },
};

export default function App() {
  const game = useGame();
  const { state } = game;
  const round = state.rounds[state.roundIndex];

  const [selectedWords, setSelectedWords] = useState(() => loadSelection(WORDS));
  const updateSelectedWords = (next: string[]) => {
    setSelectedWords(next);
    saveSelection(next);
  };

  // Persisted per-player preference (like word selection), not session-only
  // like predator escalation -- how someone wants to play, not part of any
  // one game's own escalating difficulty.
  const [mode, setMode] = useState<Mode>(() => loadMode());
  const updateMode = (next: Mode) => {
    setMode(next);
    saveMode(next);
  };

  // Session-only: escalates the antagonist each time a game is actually
  // started (including the very first), then cycles back after the Kraken.
  // Not persisted -- reloading the page resets it, unlike the word selection.
  const [playCount, setPlayCount] = useState(0);
  const predator = getPredatorLevel(playCount || 1);
  const nextPredator = getPredatorLevel(playCount + 1);

  // The currently-showing boss intro, if any -- see BOSS_INTROS above.
  const [activeBossIntro, setActiveBossIntro] = useState<BossIntro | null>(null);
  const introTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(introTimer.current), []);

  const beginGame = () => {
    setPlayCount((c) => c + 1);
    game.start(selectedWords, nextPredator.level);
  };

  const handleStart = () => {
    // Guards against a second activation landing while a boss intro is
    // still showing -- the Start button stays mounted underneath it for
    // the whole multi-second duration, and a focused button can still
    // receive a keyboard activation regardless of the overlay's z-index.
    // Without this, the stray call would overwrite introTimer.current
    // (leaking the first timer) and eventually double-fire beginGame():
    // playCount incremented twice for one logical start, the just-begun
    // round reset back to 0, and both the voice line and music restarting
    // on top of themselves. Disabling the button (see StartScreen's
    // `disabled` prop) covers the common case; this is the actual guard.
    if (activeBossIntro) return;
    const bossIntro = BOSS_INTROS[nextPredator.kind];
    if (bossIntro) {
      setActiveBossIntro(bossIntro);
      if (bossIntro.voiceCue) void playCue(bossIntro.voiceCue);
      if (bossIntro.music) void playUrl(bossIntro.music.url, bossIntro.music.volume);
      introTimer.current = setTimeout(() => {
        setActiveBossIntro(null);
        beginGame();
      }, bossIntro.durationMs);
    } else {
      beginGame();
    }
  };

  return (
    <div className="app">
      <h1 className="app__title">Puffer Panic</h1>

      {state.phase === "start" ? (
        <StartScreen
          onStart={handleStart}
          allWords={WORDS}
          selected={selectedWords}
          onSelectedChange={updateSelectedWords}
          mode={mode}
          onModeChange={updateMode}
          disabled={activeBossIntro !== null}
        />
      ) : (
        <>
          <BattleScene
            sharkProgress={game.sharkProgress}
            pufferScale={game.pufferScale}
            outcome={game.outcome}
            predator={predator}
          />

          {state.phase === "result" && game.outcome ? (
            <ResultScreen
              score={state.score}
              total={TOTAL_ROUNDS}
              outcome={game.outcome}
              predatorLabel={predator.label}
              nextPredatorLabel={nextPredator.label}
              onRestart={game.restart}
            />
          ) : (
            <>
              <PromptBar
                round={state.roundIndex + 1}
                total={TOTAL_ROUNDS}
                onReplay={game.replay}
              />
              {mode === "easy" ? (
                <CardRow
                  options={round.options}
                  phase={state.phase}
                  pickedIndex={state.pickedIndex}
                  correctIndex={round.correctIndex}
                  onPick={game.answer}
                />
              ) : (
                <SpellInput
                  key={state.roundIndex}
                  target={round.target}
                  phase={state.phase}
                  onSubmit={game.answerTyped}
                />
              )}
            </>
          )}
        </>
      )}

      {activeBossIntro && <activeBossIntro.Component />}
      {DEBUG && <DebugPanel game={game} predatorLevel={predator.level} />}
    </div>
  );
}

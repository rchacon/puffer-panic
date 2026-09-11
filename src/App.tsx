import { useState } from "react";
import { useGame } from "./game/useGame";
import { TOTAL_ROUNDS } from "./game/outcome";
import { getPredatorLevel } from "./game/predators";
import { WORDS } from "./data/words";
import { loadSelection, saveSelection } from "./data/wordSelection";
import { StartScreen } from "./components/StartScreen";
import { BattleScene } from "./components/BattleScene";
import { PromptBar } from "./components/PromptBar";
import { CardRow } from "./components/CardRow";
import { ResultScreen } from "./components/ResultScreen";
import { DebugPanel } from "./components/DebugPanel";

const DEBUG =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("debug");

export default function App() {
  const game = useGame();
  const { state } = game;
  const round = state.rounds[state.roundIndex];

  const [selectedWords, setSelectedWords] = useState(() => loadSelection(WORDS));
  const updateSelectedWords = (next: string[]) => {
    setSelectedWords(next);
    saveSelection(next);
  };

  // Session-only: escalates the antagonist each time a game is actually
  // started (including the very first), then cycles back after the Kraken.
  // Not persisted -- reloading the page resets it, unlike the word selection.
  const [playCount, setPlayCount] = useState(0);
  const predator = getPredatorLevel(playCount || 1);
  const nextPredator = getPredatorLevel(playCount + 1);
  const handleStart = () => {
    setPlayCount((c) => c + 1);
    game.start(selectedWords);
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
              <CardRow
                options={round.options}
                phase={state.phase}
                pickedIndex={state.pickedIndex}
                correctIndex={round.correctIndex}
                onPick={game.answer}
              />
            </>
          )}
        </>
      )}

      {DEBUG && <DebugPanel game={game} />}
    </div>
  );
}

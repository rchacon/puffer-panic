import { useGame } from "./game/useGame";
import { TOTAL_ROUNDS } from "./game/outcome";
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

  return (
    <div className="app">
      <h1 className="app__title">Xtreme Sight Words</h1>

      {state.phase === "start" ? (
        <StartScreen onStart={game.start} />
      ) : (
        <>
          <BattleScene
            sharkProgress={game.sharkProgress}
            pufferScale={game.pufferScale}
            outcome={game.outcome}
            justGrew={state.phase === "reveal" && state.lastCorrect === true}
          />

          {state.phase === "result" && game.outcome ? (
            <ResultScreen
              score={state.score}
              total={TOTAL_ROUNDS}
              outcome={game.outcome}
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

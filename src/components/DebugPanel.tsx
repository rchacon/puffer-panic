import type { Game } from "../game/useGame";

export function DebugPanel({ game }: { game: Game }) {
  const { state } = game;
  return (
    <div className="debug">
      <span className="debug__status">
        phase <b>{state.phase}</b> &middot; round <b>{state.roundIndex + 1}</b>{" "}
        &middot; score <b>{state.score}</b>
      </span>
      <div className="debug__buttons">
        <button type="button" onClick={() => game.debugOutcome(2)}>2 defeat</button>
        <button type="button" onClick={() => game.debugOutcome(3)}>3 barely</button>
        <button type="button" onClick={() => game.debugOutcome(4)}>4 hurt</button>
        <button type="button" onClick={() => game.debugOutcome(5)}>5 victory</button>
        <button type="button" onClick={game.restart}>reset</button>
      </div>
    </div>
  );
}

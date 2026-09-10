export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="start">
      <p className="start__hint">
        Listen to the voice, then tap the card that spells the word. Help the
        puffer fish survive the shark!
      </p>
      <button className="start__button" type="button" onClick={onStart}>
        &#9654; Start
      </button>
    </div>
  );
}

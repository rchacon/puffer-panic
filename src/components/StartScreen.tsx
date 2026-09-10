import { WordPicker } from "./WordPicker";

interface Props {
  onStart: () => void;
  allWords: string[];
  selected: string[];
  onSelectedChange: (next: string[]) => void;
  minWords: number;
}

export function StartScreen({
  onStart,
  allWords,
  selected,
  onSelectedChange,
  minWords,
}: Props) {
  const ready = selected.length >= minWords;
  return (
    <div className="start">
      <p className="start__hint">
        Listen to the voice, then tap the card that spells the word. Help the
        puffer fish survive the shark!
      </p>

      <WordPicker
        allWords={allWords}
        selected={selected}
        onChange={onSelectedChange}
      />

      <button
        className="start__button"
        type="button"
        onClick={onStart}
        disabled={!ready}
      >
        &#9654; Start
      </button>
      {!ready && (
        <p className="start__warn">Pick at least {minWords} words to play.</p>
      )}
    </div>
  );
}

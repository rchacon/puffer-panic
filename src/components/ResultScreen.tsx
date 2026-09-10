import { OUTCOME_TEXT, type Outcome } from "../game/outcome";

interface Props {
  score: number;
  total: number;
  outcome: Outcome;
  onRestart: () => void;
}

export function ResultScreen({ score, total, outcome, onRestart }: Props) {
  const { title, body } = OUTCOME_TEXT[outcome];
  return (
    <div className={`result result--${outcome}`}>
      <h2 className="result__title">{title}</h2>
      <p className="result__score">
        You got {score} of {total} right
      </p>
      <p className="result__body">{body}</p>
      <button className="result__button" type="button" onClick={onRestart}>
        Play again
      </button>
    </div>
  );
}

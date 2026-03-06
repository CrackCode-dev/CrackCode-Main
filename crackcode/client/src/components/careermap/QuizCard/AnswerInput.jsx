
const inputState = (revealed, isCorrect) => {
  if (!revealed)  return "border-(--border) text-(--textSec) focus:border-(--brand) placeholder:text-(--muted)";
  if (isCorrect)  return "border-green-500 text-green-400 bg-green-950/60 cursor-default";
  return                 "border-red-500 text-(--text) bg-red-950/60 cursor-default";
};

export default function AnswerInput({ value, onChange, revealed, isCorrect, correctAnswer }) {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => !revealed && onChange(e.target.value)}
        disabled={revealed}
        placeholder="Type your answer here..."
        spellCheck={false}
        className={`w-full px-5 py-4 rounded-2xl border text-sm font-medium bg-(--surface2) outline-none caret-(--brand) transition-all duration-200 ${inputState(revealed, isCorrect)}`}
      />
      {revealed && !isCorrect && (
        <p className="text-sm text-(--muted) px-1">
          Correct answer: <span className="text-(--brand) font-semibold">{correctAnswer}</span>
        </p>
      )}
    </div>
  );
}
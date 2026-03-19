
// style of each option based on MCQ quiz state
const optionState = (idx, selected, revealed, correct) => {
  if (!revealed)        return "bg-(--surface2) border-(--border) text-(--textSec) hover:border-(--brand) cursor-pointer";
  if (idx === correct)  return "bg-green-950/60 border-green-500 text-white cursor-default";
  if (idx === selected) return "bg-red-950/60 border-red-500 text-(--text) cursor-default";
  return                       "bg-(--surface2) border-(--border) text-(--muted) cursor-default";
};

// Component that renders all answer options
export default function AnswerOptions({ question, selected, revealed, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Create a button for each option */}
      {question.options.map((opt, idx) => (
        <button
          key={idx}
          // Handle option selection
          onClick={() => onSelect(idx)}
          className={`w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium transition-all duration-200 ${optionState(idx, selected, revealed, question.correct)}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
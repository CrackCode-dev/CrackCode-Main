import { useState, useEffect, useRef } from "react";
import ContentCard from "../../ui/Card";
import Button from "../../ui/Button";
import AnswerOptions from "./AnswerOptions";
import AnswerInput from "./AnswerInput";

// State for selected MCQ option, fill input value, and reveal status
export default function QuizCard({ variant = "mcq", question, index, isLast = false, onNext }) {
  const [selected, setSelected] = useState(null);
  const [fillValue, setFillValue] = useState("");
  const [revealed, setRevealed] = useState(false);

  const latestRef = useRef({});
  latestRef.current = { revealed, selected, question, onNext, variant, fillValue };

  // Handle Enter key for both MCQ and fill-in-the-blank questions
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "Enter") return;
      const { revealed, selected, question, onNext, variant, fillValue } = latestRef.current;

      if (variant === "mcq" && revealed && question) {
        const correct = selected === question.correct;
        onNext?.({ correct });
      }

      if (variant === "fill" && !revealed && fillValue.trim()) {
        document.querySelector("[data-check-btn]")?.click();
      }

      if (variant === "fill" && revealed) {
        const answers = question.answer?.split(",").map(a => a.trim().toLowerCase()) || [];
        const normalized = fillValue.trim().toLowerCase();
        const correct = answers.some(ans =>
          ans === normalized ||
          (ans.split(/\s+/).length === 2 && ans.split(/\s+/).includes(normalized))
        );
        onNext?.({ correct });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!question) return null;

  // Check if fill-in answer is correct
  const checkFill = (val) => {
    const normalized = val.trim().toLowerCase();
    const answers = question.answer?.split(",").map(a => a.trim().toLowerCase()) || [];

    return answers.some(ans => {
      // Exact match
      if (ans === normalized) return true;

      // If correct answer is two words, accept either word
      const words = ans.split(/\s+/);
      if (words.length === 2 && words.includes(normalized)) return true;

      return false;
    });
  };
  const fillIsCorrect = revealed && checkFill(fillValue);
  const canReveal = fillValue.trim().length > 0;

  // Handle MCQ option selection
  const handleSelectMCQ = (idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  };

  // Handle checking fill-in answer
  const handleRevealFill = () => {
    if (revealed || !fillValue.trim()) return;
    setRevealed(true);
  };

  // Move to next question and report correctness
  const handleNext = () => {
    const correct = variant === "mcq"
      ? selected === question.correct
      : checkFill(fillValue);
    onNext?.({ correct });
  };

  // Renders question text and formats blank (___) if present
  const renderQuestion = (text) => {
    if (!text?.includes("___")) return text;
    const [before, after] = text.split("___");
    return (
      <>
        {before}
        <span className="inline-block px-3 py-0.5 mx-1 rounded-lg border border-dashed border-(--border) text-(--muted) bg-(--surface2) font-mono text-sm">
          ___
        </span>
        {after}
      </>
    );
  };

  return (
    <ContentCard
      variant="flat"
      padding="lg"
      shadow="lg"
      bordered
      className="w-full"
      title={`Question ${index}`}
    >
      <p className="text-(--textSec) text-sm leading-relaxed mb-4">
        {renderQuestion(question.question)}
      </p>

      {/* Multiple Choice Options */}
      {variant === "mcq" && (
        <AnswerOptions
          question={question}
          selected={selected}
          revealed={revealed}
          onSelect={handleSelectMCQ}
        />
      )}

      {/* Fill-in-the-blank input */}
      {variant === "fill" && (
        <AnswerInput
          value={fillValue}
          onChange={setFillValue}
          revealed={revealed}
          isCorrect={fillIsCorrect}
          correctAnswer={question.answer}
          onReveal={handleRevealFill}
          onNext={handleNext}
        />
      )}

      <div className=" mt-10">
        {/* MCQ Next button */}
        {variant === "mcq" && (
          <Button variant="primary" size="lg" fullWidth disabled={!revealed} onClick={handleNext}>
            {isLast ? "Finish Quiz" : "Next Question >"}
          </Button>
        )}

        {/* Fill: Check answer */}
        {variant === "fill" && !revealed && (
          <Button data-check-btn variant="primary" size="lg" fullWidth disabled={!canReveal} onClick={handleRevealFill}>
            Check Answer
          </Button>
        )}

        {/* Fill: Next after reveal */}
        {variant === "fill" && revealed && (
          <Button variant="primary" size="lg" fullWidth onClick={handleNext}>

            {isLast ? "Finish Quiz" : "Next Question >"}
          </Button>
        )}
      </div>


    </ContentCard>
  );
}
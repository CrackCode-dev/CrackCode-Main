import { useState } from "react";
import ContentCard from "../../ui/Card";
import Button from "../../ui/Button";
import AnswerOptions from "./AnswerOptions";
import AnswerInput from "./AnswerInput";

export default function QuizCard({ variant = "mcq", question, index, isLast = false, onNext }) {
  const [selected, setSelected] = useState(null);
  const [fillValue, setFillValue] = useState("");
  const [revealed, setRevealed] = useState(false);

  if (!question) return null;

  const checkFill = (val) => {
    const answers = question.answer?.split(",").map(a => a.trim().toLowerCase()) || [];
    return answers.includes(val.trim().toLowerCase());
  };
  const fillIsCorrect = revealed && checkFill(fillValue);
  const canReveal = fillValue.trim().length > 0;

  const handleSelectMCQ = (idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  };

  const handleRevealFill = () => {
    if (revealed || !fillValue.trim()) return;
    setRevealed(true);
  };

  const handleNext = () => {
    const correct = variant === "mcq"
      ? selected === question.correct
      : checkFill(fillValue);
    onNext?.({ correct });
  };

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

      {variant === "mcq" && (
        <AnswerOptions
          question={question}
          selected={selected}
          revealed={revealed}
          onSelect={handleSelectMCQ}
        />
      )}

      {variant === "fill" && (
        <AnswerInput
          value={fillValue}
          onChange={setFillValue}
          revealed={revealed}
          isCorrect={fillIsCorrect}
          correctAnswer={question.answer}
        />
      )}

      <div className=" mt-10">
        {variant === "mcq" && (
          <Button variant="primary" size="lg" fullWidth disabled={!revealed} onClick={handleNext}>
            {isLast ? "Finish Quiz" : "Next Question >"}
          </Button>
        )}

        {variant === "fill" && !revealed && (
          <Button variant="primary" size="lg" fullWidth disabled={!canReveal} onClick={handleRevealFill}>
            Check Answer
          </Button>
        )}

        {variant === "fill" && revealed && (
          <Button variant="primary" size="lg" fullWidth onClick={handleNext}>

            {isLast ? "Finish Quiz" : "Next Question >"}
          </Button>
        )}
      </div>


    </ContentCard>
  );
}
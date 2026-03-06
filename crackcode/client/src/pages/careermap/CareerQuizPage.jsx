import { useState } from "react";
import { useLocation } from "react-router-dom";
import HQBtn from "../../components/common/HQBtn";
import QuizCard from "../../components/careermap/QuizCard";
import ResultsPage from "./Results";
import ProgressBar from "../../components/ui/ProgressBar";

export default function CareerQuizPage() {
    const { state } = useLocation();

    const title = state?.title || "Career Assessment";
    const subtitle = state?.subtitle || "HTML Fundamentals";
    const questions = state?.questions || [
        { type: "mcq", question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correct: 0 },
        { type: "fill", question: "The ___ tag defines the largest heading.", answer: "h1" },
        { type: "mcq", question: "Which attribute gives a unique identity?", options: ["class", "name", "id", "key"], correct: 2 },
    ];
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const total = questions.length;
    const current = questions[currentQ];

    const handleNext = ({ correct }) => {
        if (correct) setScore((s) => s + 1);

        if (currentQ + 1 >= total) {
            setFinished(true);
        } else {
            setCurrentQ((q) => q + 1);
        }
    };

    const handleRestart = () => {
        setCurrentQ(0);
        setScore(0);
        setFinished(false);
    };

    if (finished) {
        return (
            <ResultsPage
                score={score}
                total={total}
                title={title}
                subtitle={subtitle}
                onRestart={handleRestart}
            />
        );
    }

    return (
        <div className="min-h-screen bg-(--bg) flex flex-col items-center px-6 py-8">

            <div className="w-full max-w-5xl flex justify-between items-center mb-16">
                <HQBtn />

                <div className="flex flex-col items-end gap-2">
                    <span className="text-(--muted) text-sm font-mono">
                        Question {currentQ + 1} of {total}
                    </span>
                    <div className="w-44 h-1.5 bg-(--progressTrack) rounded-full overflow-hidden">
                    <ProgressBar
                        completed={currentQ}
                        total={total}
                        variant="default"
                        size="sm"
                        showLabel={false}
                   />
                    </div>
                </div>
            </div>

            <div className="w-full max-w-5xl mb-12">
                <h1 className="text-3xl font-extrabold text-(--text) tracking-tight leading-tight">
                    {title}
                </h1>
                <p className="text-(--muted) text-base mt-2 font-medium">
                    {subtitle} 
                </p>
            </div>

            <div className="w-full max-w-3xl">
                <QuizCard
                    key={currentQ}
                    variant={current.type}
                    question={current}
                    index={currentQ + 1}
                    isLast={currentQ + 1 === total}
                    onNext={handleNext}
                />
            </div>

        </div>
    );
}
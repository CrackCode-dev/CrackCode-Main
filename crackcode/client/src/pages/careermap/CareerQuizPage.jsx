import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import QuizCard from "../../components/careermap/QuizCard";
import ResultsPage from "./Results";
import Header from "../../components/common/Header";
import ProgressBar from "../../components/ui/ProgressBar";
import { fetchChapterQuestions } from "../../services/api/careermapService";

const mapQuestion = (q) => {

    if (q.type === "mcq") {
        return {
            ...q,
            type: "mcq",
            correct: q.options.findIndex(
                opt => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
            ),
        };
    }
    return {
        ...q,
        type: "fill",
        answer: q.correctAnswer,
    };
};

export default function CareerQuizPage() {
    const { state } = useLocation();

    const { careerId, chapterId } = useParams();
    const navigate = useNavigate();
    const title = state?.title || "Career Assessment";
    const subtitle = state?.subtitle || "Test your knowledge and track your progress on your career path.";
    const categories = state?.categories || [];
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const total = questions.length;
    const current = questions[currentQ];

    useEffect(() => {
        fetchChapterQuestions(careerId, categories)
            .then((qs) => setQuestions(qs.map(mapQuestion)))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [careerId, chapterId]);

    if (loading) return (
        <div className="min-h-screen bg-(--bg) flex items-center justify-center">
            <p className="text-(--muted) text-lg animate-pulse">Loading questions...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-(--bg) flex items-center justify-center flex-col gap-4">
            <p className="text-red-500">{error}</p>
            <button onClick={() => navigate(`/careermap/${careerId}`)} className="text-(--brand) hover:underline">
                ← Back to chapters
            </button>
        </div>
    );

    if (!questions.length) return (
        <div className="min-h-screen bg-(--bg) flex items-center justify-center">
            <p className="text-(--muted)">No questions found for this chapter.</p>
        </div>
    );

    const handleNext = ({ correct }) => {
        const newScore = correct ? score + 1 : score;
        if (correct) setScore((s) => s + 1);
        if (currentQ + 1 >= total) {
            if (newScore >= 8) {
                localStorage.setItem(`${careerId}_${chapterId}_passed`, "true");
            }
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
                careerId={careerId}
                currentChapterId={chapterId}
                onRestart={handleRestart}
            />
        );
    }

    return (
        <div className="min-h-screen bg-(--bg) flex flex-col items-center px-6 py-8">
            <Header variant="empty" />

            <div className="w-full max-w-5xl flex justify-end items-center mb-16 mt-20">
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
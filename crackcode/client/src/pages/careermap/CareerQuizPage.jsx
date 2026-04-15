import { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import QuizCard from "../../components/careermap/QuizCard";
import ResultsPage from "./Results";
import Header from "../../components/common/Header";
import ProgressBar from "../../components/ui/ProgressBar";
import { fetchChapterQuestions, updateProgress } from "../../services/api/careermapService";


// Convert raw API question to the format QuizCard expects
const mapQuestion = (q) => {

    if (q.type === "mcq") {
        return {
            ...q,
            type: "mcq",
            // Find index of correct option to use for answer checking
            correct: q.options.findIndex(
                opt => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
            ),
        };
    }
    return {
        ...q,
        type: "fill",
        answer: q.answer || q.correctAnswer || "",
    };
};

export default function CareerQuizPage() {
    const { state } = useLocation();

    const { careerId, chapterId } = useParams();
    const navigate = useNavigate();

    // Get quiz info passed from chapter selection page
    const title = state?.title || "Career Assessment";
    const subtitle = state?.subtitle || "Test your knowledge and track your progress on your career path.";
    const categories = state?.categories || [];
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    //Track correct answers per difficulty
    const progressSentRef = useRef(false);
    const [easyCorrect, setEasyCorrect] = useState(0);
    const [mediumCorrect, setMediumCorrect] = useState(0);
    const [hardCorrect, setHardCorrect] = useState(0);

    const total = questions.length;
    const current = questions[currentQ];

    // Fetch questions whenever career or chapter changes, and reset all state
    useEffect(() => {

        setCurrentQ(0);
        setScore(0);
        setFinished(false);
        setLoading(true);
        setQuestions([]);
        progressSentRef.current = false;
        setEasyCorrect(0);
        setMediumCorrect(0);
        setHardCorrect(0);
        fetchChapterQuestions(careerId, categories)
            .then((qs) => setQuestions(qs.map(mapQuestion)))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [careerId, chapterId]);

    // Show loading spinner while questions are being fetched
    if (loading) return (
        <div className="min-h-screen bg-(--bg) flex items-center justify-center">
            <p className="text-(--muted) text-lg animate-pulse">Loading questions...</p>
        </div>
    );

    // Show error message if fetch fails
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

    // Guard against current being undefined during chapter transition
    if (!current && !loading) return (
        <div className="min-h-screen bg-(--bg) flex items-center justify-center">
            <p className="text-(--muted) text-lg animate-pulse">Loading questions...</p>
        </div>
    );

    const handleNext = ({ correct }) => {
        if (correct) setScore((s) => s + 1);

        let newEasy = easyCorrect;
        let newMedium = mediumCorrect;
        let newHard = hardCorrect;

        if (correct) {
            if (current.difficulty === "Easy") { newEasy = easyCorrect + 1; setEasyCorrect(newEasy); }
            else if (current.difficulty === "Medium") { newMedium = mediumCorrect + 1; setMediumCorrect(newMedium); }
            else if (current.difficulty === "Hard") { newHard = hardCorrect + 1; setHardCorrect(newHard); }
        }

        if (currentQ + 1 >= total) {
            // Require more than 12 correct answers (at least 13) to pass and unlock next chapter
            const passed = (newEasy + newMedium + newHard) > 12;

            console.log("Quiz finished:", { careerId, chapterId, newEasy, newMedium, newHard, passed });

            // Keep chapter as passed even if user scores lower on a retry
            const alreadyPassed = localStorage.getItem(`${careerId}_${chapterId}_passed`) === "true";
            const finalPassed = passed || alreadyPassed; 

            if (!progressSentRef.current) {
                progressSentRef.current = true;
                updateProgress(careerId, chapterId, newEasy, newMedium, newHard, finalPassed)
                    .then((res) => console.log("✅ Progress saved:", res))
                    .catch((err) => console.error("❌ Progress update failed:", err));
            }

            if (passed) {
                localStorage.setItem(`${careerId}_${chapterId}_passed`, "true");
            }
            setFinished(true);
        } else {
            setCurrentQ((q) => q + 1);
        }
    };

    // Reset quiz to try again from the beginning
    const handleRestart = () => {
        setCurrentQ(0);
        setScore(0);
        setFinished(false);
        progressSentRef.current = false;
        setEasyCorrect(0);
        setMediumCorrect(0);
        setHardCorrect(0);
    };

    // Show results page when all questions are answered
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

            <div className="w-full max-w-5xl flex justify-end items-center mb-12 mt-20">
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

            {/* Chapter title and subtitle */}
            <div className="w-full max-w-5xl mb-12">
                <h1 className="text-3xl font-extrabold text-(--text) tracking-tight leading-tight">
                    {title}
                </h1>
                <p className="text-(--muted) text-base mt-2 font-medium">
                    {subtitle}
                </p>
            </div>

            {/* QuizCard re-mounts fresh on every new question, resetting all input state */}
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
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChapterByCareerId } from "./CareerChapters";

export default function ResultsPage({ score, total, title, subtitle, careerId, currentChapterId, onRestart }) {
  const navigate = useNavigate();
  const [nextChapter, setNextChapter] = useState(null);
  const [allChaptersDone, setAllChaptersDone] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Check if current chapter is passed and if a next chapter exists
  useEffect(() => {
    const chapters = getChapterByCareerId(careerId);
    const currentIndex = chapters.findIndex((c) => c.id === currentChapterId);
    const nextIndex = currentIndex + 1;
    const currentPassed = localStorage.getItem(`${careerId}_${currentChapterId}_passed`) === "true";

    // Only unlock next chapter if current is passed and next exists
    if (currentPassed && nextIndex < chapters.length) {
      setNextChapter(chapters[nextIndex]);
    } else {
      setNextChapter(null);
    }

    // Check if all chapters are completed
    const allDone = chapters.every(
      (ch) => localStorage.getItem(`${careerId}_${ch.id}_passed`) === "true"
    );

    // Update completion states
    setAllChaptersDone(allDone);
    setLoaded(true);

  }, [careerId, currentChapterId]);

  // Navigate to next chapter
  const handleNextClick = () => {
    navigate(`/careermap/${careerId}/quiz/${nextChapter.id}`, {
      state: {
        title,
        subtitle: nextChapter.title,
        categories: nextChapter.categories,
        careerId,
      },
    });
  };
  return (
    <div className="min-h-screen bg-(--bg) flex flex-col items-center px-6 py-8">



      <div className="w-full max-w-5xl text-center mb-4">
        <h1 className="text-4xl font-extrabold text-(--text) tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-(--muted) text-xl mt-2 font-medium">
          {subtitle}
        </p>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center gap-8 py-10 text-center">

        {/* Score circle */}
        <div className="w-40 h-40 rounded-full border-4 border-(--brand) bg-(--brandSoft) flex flex-col items-center justify-center">
          <span className="text-6xl font-black text-(--brand) font-mono leading-none">
            {score}
          </span>
        </div>

        {/* Result message based on score */}
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-extrabold text-(--text) tracking-tight">
            {score === total
              ? "Perfect Score ! 🎉"
              : score >= total / 2
                ? "Well Done!"
                : "Keep Practicing!"}
          </h2>
          <p className="text-(--muted) text-base">
            You answered{" "}
            <span className="text-(--text)">{score}</span> out of{" "}
            <span className="text-(--text)">{total}</span> correctly.
          </p>
        </div>

        {/* Stats breakdown — correct, wrong, percentage */}
        <div className="w-full grid grid-cols-3 gap-4">
          <div className="bg-(--surface) border border-(--border) rounded-2xl px-6 py-5 flex flex-col gap-1">
            <span className="text-2xl font-black text-(--brand)">{score}</span>
            <span className="text-xs text-(--muted) font-medium uppercase tracking-widest">Correct</span>
          </div>
          <div className="bg-(--surface) border border-(--border) rounded-2xl px-6 py-5 flex flex-col gap-1">
            <span className="text-2xl font-black text-(--brand)">{total - score}</span>
            <span className="text-xs text-(--muted) font-medium uppercase tracking-widest">Wrong</span>
          </div>
          <div className="bg-(--surface) border border-(--border) rounded-2xl px-6 py-5 flex flex-col gap-1">
            <span className="text-2xl font-black text-(--brand)">{Math.round((score / total) * 100)}%</span>
            <span className="text-xs text-(--muted) font-medium uppercase tracking-widest">Score</span>
          </div>
        </div>

        {/* Show unlock if next chapter is available */}
        {loaded && nextChapter && (
          <div className="w-full bg-green-100 border border-green-500 rounded-2xl px-6 py-4 text-center">
            <p className="text-green-500 font-semibold">Chapter unlocked !</p>
          </div>
        )}

        {/* Show completion message if last chapter is passed */}
        {loaded && allChaptersDone && !nextChapter && (
          <div className="w-full bg-green-100 border border-green-500 rounded-2xl px-6 py-6 flex flex-col items-center gap-2 text-center">
            <div className="text-4xl">🎉</div>
            <p className="text-green-500 text-xl font-extrabold">All Chapters Completed!</p>
            <p className="text-black text-sm">
              You've successfully completed all chapters in the{" "}
              <span className="text-green-500 font-semibold">{title}</span> career path.
            </p>
          </div>
        )}

        <div className="flex gap-4 w-full">
          <Button variant="outline" size="lg" fullWidth onClick={onRestart}>
            Try Again
          </Button>

          {!loaded || !localStorage.getItem(`${careerId}_${currentChapterId}_passed`) ? (
            <Button variant="outline" size="lg" fullWidth onClick={() => navigate(`/careermap/${careerId}`)}>
              Back to Chapters
            </Button>
          ) : nextChapter ? (
            // Passed + next chapter unlocked — show Next Chapter
            <Button variant="primary" size="lg" fullWidth onClick={handleNextClick}>
              Next
            </Button>
          ) : (
            // Last chapter passed — go back to career map
            <Button variant="primary" size="lg" fullWidth onClick={() => navigate(`/careermap`)}>
              Back to Career Map
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
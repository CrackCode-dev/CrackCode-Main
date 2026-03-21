import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { RoadmapNode } from "../../components/ui/Roadmap";
import RoadmapCard from "../../components/careermap/RoadmapCard";
import Header from '../../components/common/Header';
import { getChapterByCareerId } from "./CareerChapters";
import { fetchProgress, fetchChapterQuestionCount } from "../../services/api/careermapService";

//map of URL career IDs to readable career titles
const CAREER_TITLES = {
    'Software-Engineer': 'Software Engineer',
    'ML-Engineer': 'ML Engineer',
    'Data-Scientist': 'Data Scientist',
};

const CareerChapterSelectionPage = () => {
    const { careerId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();

    // If title is passed through navigation state, use it.
    // Otherwise fallback to title from CAREER_TITLES object.
    const title = state?.title || CAREER_TITLES[careerId];

    const baseChapters = getChapterByCareerId(careerId);

    const [passedChapters, setPassedChapters] = useState({});
    const [chapterScores, setChapterScores] = useState({});
    const [questionCounts, setQuestionCounts] = useState({});

    useEffect(() => {
        // Fetch progress from DB for this career
        fetchProgress(careerId)
            .then((progress) => {
                const passedMap = {};// chapterId → passed (bool)
                const scoreMap = {}; // chapterId → total score (number)

                // Map each chapter's passed status and total score from DB
                if (progress.chapters?.length > 0) {
                    progress.chapters.forEach((ch) => {
                        passedMap[ch.chapterId] = ch.passed;
                        scoreMap[ch.chapterId] = ch.easyScore + ch.mediumScore + ch.hardScore;
                    });
                } else {
                    // No DB data — fall back to localStorage
                    baseChapters.forEach((ch) => {
                        passedMap[ch.id] =
                            localStorage.getItem(`${careerId}_${ch.id}_passed`) === "true" ||
                            localStorage.getItem(`${careerId}_${ch.id}_completed`) === "true";
                    });
                }

                setPassedChapters(passedMap);
                setChapterScores(scoreMap);
            })
            .catch(() => {
                // DB fetch failed — fall back to localStorage for all chapters
                const fallback = {};
                baseChapters.forEach((ch) => {
                    fallback[ch.id] =
                        localStorage.getItem(`${careerId}_${ch.id}_passed`) === "true" ||
                        localStorage.getItem(`${careerId}_${ch.id}_completed`) === "true";
                });
                setPassedChapters(fallback);
            });

        // Fetch live question counts per chapter from the API
        // and update state as each resolves independently
        baseChapters.forEach((chapter) => {
            fetchChapterQuestionCount(careerId, chapter.categories)
                .then((count) => {
                    setQuestionCounts((prev) => ({ ...prev, [chapter.id]: count }));
                })
                .catch(() => { });
        });

    }, [careerId]);

    // Lock/unlock chapters based on previous chapter completion in localStorage
    const chapters = baseChapters.map((chapter, index) => ({
        ...chapter,
        isUnlocked: index === 0 ? true : !!passedChapters[baseChapters[index - 1].id],
    }));

    //If no chpater found for this carrerId
    if (!chapters.length) {
        return (
            <div className="min-h-screen bg-(--bg) flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-(--text) mb-4">
                        Career path not found: {careerId}
                    </h1>
                    {/* Button to navigate back to career maps main page */}
                    <button
                        onClick={() => navigate('/careermap')}
                        className="text-(--brand) hover:underline"
                    >
                        ← Back
                    </button>
                </div>
            </div>
        );
    }


    // Navigate to quiz only if chapter is unlocked
    const handleChapterClick = (chapter) => {
        if (!chapter.isUnlocked) return;

        navigate(`/careermap/${careerId}/quiz/${chapter.id}`, {
            state: {
                title,
                subtitle: chapter.title,
                categories: chapter.categories,
                careerId,
            },
        });
    };

    return (
        <div className="min-h-screen bg-(--bg)">
            <Header variant="empty" />

            <main className="pt-10 px-6 sm:px-10 py-6 pb-20 mt-20">
                <div className="max-w-4xl mx-auto">

                    {/* Header — title from career card */}
                    <div className="flex items-center gap-4 mb-12">

                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-(--text)">
                                {title}
                            </h1>
                            <p className="text-(--muted) mt-2">
                                Complete topics in order to progress
                            </p>
                        </div>
                    </div>

                    {/* Roadmap List */}
                    <div className="flex flex-col">
                        {chapters.map((chapter, index) => {
                            const totalQ = questionCounts[chapter.id] || 15;
                            const score = chapterScores[chapter.id] || 0;
                            const progress = passedChapters[chapter.id]
                                ? 100
                                : Math.round((score / totalQ) * 100);

                            return (
                                <div key={chapter.id} className="flex gap-6 md:gap-10">

                                    {/* Node + Line */}
                                    <div className="hidden md:flex flex-col pt-2 ">
                                        <RoadmapNode
                                            progress={progress}
                                            variant="career"
                                            isUnlocked={chapter.isUnlocked}
                                        />
                                    </div>

                                    {/* Card */}
                                    <div className="flex-1 pb-10">
                                        <RoadmapCard
                                            icon={chapter.icon}
                                            title={chapter.title}
                                            description={chapter.description}
                                            questionCount={questionCounts[chapter.id] ?? "..."}
                                            isUnlocked={chapter.isUnlocked}
                                            onClick={() => handleChapterClick(chapter)}
                                        />
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default CareerChapterSelectionPage;

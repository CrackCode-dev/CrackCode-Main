import { useParams, useNavigate, useLocation } from "react-router-dom";
import { RoadmapNode } from "../../components/ui/Roadmap";
import RoadmapCard from "../../components/careermap/RoadmapCard";
import Header from '../../components/common/Header';
import { getChapterByCareerId } from "./careerChapters";

//map of URL career IDs to readable career titles
const CAREER_TITLES = {
    'Software-Developer': 'Software Developer',
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

    const chapters = getChapterByCareerId(careerId);

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
                        onClick={() => navigate('/careermaps-Main')}
                        className="text-(--brand) hover:underline"
                    >
                        ← Back
                    </button>
                </div>
            </div>
        );
    }


    const handleChapterClick = (chapter) => {
        if (!chapter.isUnlocked) return;

        navigate(`/careermap/${careerId}/quiz/${chapter.id}`, {
            state: {
                title,
                subtitle: chapter.title,
                questions: chapter.questions,
            },
        });
    };

    return (
        <div className="min-h-screen bg-(--bg)">
            <Header variant="empty" />

            <main className="pt-30 px-6 sm:px-10 py-6 pb-20">
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
                            const progress = chapter.total > 0
                                ? (chapter.completed / chapter.total) * 100
                                : 0;

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
                                            questionCount={chapter.questionCount}
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

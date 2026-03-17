import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { fetchLearnQuestions } from '../../services/api/questionService';

const DIFFICULTY_CONFIG = {
  fundamentals: { title: 'Fundamentals', icon: '📚' },
  easy:         { title: 'Easy',         icon: '🌱' },
  intermediate: { title: 'Intermediate', icon: '⚡' },
  hard:         { title: 'Hard',         icon: '🔥' },
};

const QuestionListPage = () => {
  const { trackId, difficultyId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Persist completion state in localStorage per language+difficulty
  const storageKey = `completed-${trackId}-${difficultyId}`;
  const [completedIds, setCompletedIds] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLearnQuestions(trackId, difficultyId);
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Failed to load questions:', err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [trackId, difficultyId]);

  const toggleComplete = (qId, e) => {
    e.stopPropagation();
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const handleQuestionClick = (question) => {
    const problemId = question.problemId || question._id?.toString() || String(question.id);
    navigate(`/code-editor/${problemId}`, {
      state: { question, difficulty: difficultyId, language: trackId },
    });
  };

  const difficultyInfo = DIFFICULTY_CONFIG[difficultyId] || DIFFICULTY_CONFIG.easy;
  const completedCount = completedIds.size;
  const totalCount = questions.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header variant="empty" />

      <main className="flex-1 px-6 sm:px-10 py-10">
        <div className="max-w-2xl mx-auto pt-12">

          <button
            onClick={() => navigate(`/learn/${trackId}`)}
            className="text-sm font-semibold opacity-75 hover:opacity-100 transition mb-10 block"
          >
            ← Back to Difficulty Levels
          </button>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">{difficultyInfo.icon}</span>
              <h1 className="text-3xl md:text-4xl font-bold">{difficultyInfo.title}</h1>
            </div>

            {/* Progress bar */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-75">Progress</span>
                <span className="font-semibold">{completedCount}/{totalCount} completed</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(to right, var(--brand), var(--brandSoft))',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Roadmap */}
          {loading ? (
            <p className="text-center py-16 opacity-75">Loading problems...</p>
          ) : questions.length === 0 ? (
            <p className="text-center py-16 opacity-75">No problems available yet for this level.</p>
          ) : (
            <div>
              {questions.map((question, index) => {
                const qId = question.problemId || question._id?.toString() || String(index);
                const qTitle = question.original?.title || question.title || 'Untitled';
                const isCompleted = completedIds.has(qId);
                const isLast = index === questions.length - 1;

                return (
                  <div key={qId} className="flex gap-5">

                    {/* Timeline column: circle + connector line */}
                    <div className="flex flex-col items-center" style={{ width: 44, flexShrink: 0 }}>
                      <button
                        onClick={(e) => toggleComplete(qId, e)}
                        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 shrink-0 cursor-pointer"
                        style={{
                          backgroundColor: isCompleted ? 'var(--brand)' : 'var(--card-bg)',
                          borderColor:     isCompleted ? 'var(--brand)' : 'var(--border)',
                          color:           isCompleted ? 'var(--brandInk)' : 'var(--text)',
                        }}
                        title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {isCompleted ? '✓' : index + 1}
                      </button>

                      {!isLast && (
                        <div
                          className="w-0.5 flex-1 transition-colors duration-300"
                          style={{
                            backgroundColor: isCompleted ? 'var(--brand)' : 'var(--border)',
                            minHeight: '2rem',
                          }}
                        />
                      )}
                    </div>

                    {/* Question card */}
                    <div className={`flex-1 ${!isLast ? 'pb-6' : ''}`}>
                      <div
                        className="rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                        style={{
                          borderColor:     isCompleted ? 'var(--brand)' : 'var(--border)',
                          backgroundColor: 'var(--card-bg)',
                        }}
                        onClick={() => handleQuestionClick(question)}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs opacity-50 mb-0.5">Question {index + 1}</p>
                            <p className="font-semibold text-sm sm:text-base leading-snug">{qTitle}</p>
                          </div>
                          <span className="opacity-40 shrink-0 text-lg">→</span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default QuestionListPage;

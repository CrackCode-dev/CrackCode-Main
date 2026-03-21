import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Header from '../../components/common/Header';
import { fetchLearnQuestions } from '../../services/api/questionService';
import { AppContent } from '../../context/userauth/authenticationContext';
import axios from '../../api/axios.js';

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
  const { userData } = useContext(AppContent);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get completed questions from backend (user's actual progress)
  const [completedIds, setCompletedIds] = useState(new Set());

  // Helper function to refresh completed questions
  const refreshCompleted = async () => {
    try {
      console.log('🔄 Refreshing completed questions...');
      const response = await axios.get('/user/data');
      const completed = response.data?.data?.completedQuestionIds || [];
      console.log('✅ Refreshed completed IDs:', completed);
      console.log('   Completed IDs array:', JSON.stringify(completed));
      setCompletedIds(new Set(completed));
    } catch (err) {
      console.error('Failed to refresh completed questions:', err);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        console.log(`📖 Loading Learn page - trackId: "${trackId}", difficultyId: "${difficultyId}"`);
        
        // Fetch questions for this language+difficulty
        const data = await fetchLearnQuestions(trackId, difficultyId);
        setQuestions(Array.isArray(data) ? data : []);
        console.log(`📚 Loaded ${Array.isArray(data) ? data.length : 0} questions from ${trackId} ${difficultyId}`);
        if (Array.isArray(data) && data.length > 0) {
          console.log(`   First question: ${data[0].problemId}`);
        }

        // Always fetch user's completed questions
        await refreshCompleted();
      } catch (err) {
        console.error('❌ Failed to load questions:', err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [trackId, difficultyId]);

  // Refresh completed questions when page becomes visible or on custom event
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Page became visible, refreshing completed questions...');
        refreshCompleted();
      }
    };

    const handleCustomEvent = (event) => {
      console.log('🎉 Solution submitted - refreshing completed status:', event.detail);
      refreshCompleted();
    };

    // Listen for page visibility changes (tab focus, minimize/maximize)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also listen for window focus
    window.addEventListener('focus', refreshCompleted);

    // Listen for custom event from EditorToolbar when solution is submitted (use standard event name)
    window.addEventListener('solutionSubmitted', handleCustomEvent);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', refreshCompleted);
      window.removeEventListener('solutionSubmitted', handleCustomEvent);
    };
  }, []);

  const handleQuestionClick = (question) => {
    const problemId = question.problemId || question._id?.toString() || String(question.id);
    navigate(`/code-editor/${problemId}`, {
      state: { question, difficulty: difficultyId, language: trackId, sourceArea: 'learn_page' },
    });
  };

  const difficultyInfo = DIFFICULTY_CONFIG[difficultyId] || DIFFICULTY_CONFIG.easy;

  // Only count completions that belong to the currently visible question list
  const totalCount = questions.length;
  const completedCount = questions.reduce((acc, question) => {
    const qId = question.problemId || question._id?.toString() || String(question.id || '');
    return acc + (completedIds.has(qId) ? 1 : 0);
  }, 0);

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header variant="empty" />

      <main className="flex-1 px-6 sm:px-10 py-10">
        <div className="max-w-2xl mx-auto pt-10">

          <button
            onClick={() => navigate(`/learn/${trackId}`)}
            className="text-sm font-semibold opacity-75 hover:opacity-100 transition mb-10 block"
          >
            ← Back to Difficulty Levels
          </button>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{difficultyInfo.icon}</span>
                <h1 className="text-3xl md:text-4xl font-bold">{difficultyInfo.title}</h1>
              </div>
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

                if (index === 0 || index === 1) {
                  console.log(`🔍 Q${index + 1}: qId="${qId}", isCompleted=${isCompleted}`);
                  console.log(`   completedIds Set:`, completedIds);
                  console.log(`   completedIds contains qId?:`, completedIds.has(qId));
                }

                return (
                  <div key={qId} className="flex gap-5">

                    {/* Timeline column: circle + connector line */}
                    <div className="flex flex-col items-center" style={{ width: 44, flexShrink: 0 }}>
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 shrink-0"
                        style={{
                          backgroundColor: isCompleted ? 'var(--brand)' : 'var(--card-bg)',
                          borderColor:     isCompleted ? 'var(--brand)' : 'var(--border)',
                          color:           isCompleted ? 'var(--brandInk)' : 'var(--text)',
                        }}
                        title={isCompleted ? 'Completed ✓' : `Question ${index + 1}`}
                      >
                        {isCompleted ? '✓' : index + 1}
                      </div>

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

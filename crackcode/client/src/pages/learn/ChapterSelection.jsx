import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import PythonIcon from '../../assets/icons/learn/python.png';
import JavaScriptIcon from '../../assets/icons/learn/js.png';
import JavaIcon from '../../assets/icons/learn/java.png';
import CppIcon from '../../assets/icons/learn/cpp.png';

const LANGUAGE_META = {
  python: {
    icon: PythonIcon,
    title: 'The Legend of Python',
  },
  javascript: {
    icon: JavaScriptIcon,
    title: 'Voyage of JavaScript',
  },
  java: {
    icon: JavaIcon,
    title: 'Java: Classified Operations',
  },
  cpp: {
    icon: CppIcon,
    title: 'C++: Ghosts in the System',
  },
};

const PYTHON_LEVELS = [
  {
    id: 'fundamentals',
    title: 'Fundamentals',
    description: 'Learn to investigate basic clues and patterns. Master variables, loops, and detective basics.',
    icon: '🔍',
    color: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-400/30',
    badge: 'Rookie Detective',
    problemCount: '10-15',
  },
  {
    id: 'easy',
    title: 'Easy',
    description: 'Solve simple cases with basic detective techniques. String analysis and pattern recognition.',
    icon: '📝',
    color: 'from-emerald-500/10 to-green-500/10',
    borderColor: 'border-emerald-400/30',
    badge: 'Junior Detective',
    problemCount: '10-15',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Tackle complex investigations with advanced methods. Data structures and algorithm techniques.',
    icon: '🧩',
    color: 'from-yellow-500/10 to-orange-500/10',
    borderColor: 'border-yellow-400/30',
    badge: 'Senior Detective',
    problemCount: '10-15',
  },
  {
    id: 'hard',
    title: 'Hard',
    description: 'Master detective cases - the toughest mysteries to solve. Advanced algorithms and optimization.',
    icon: '🏆',
    color: 'from-red-500/10 to-pink-500/10',
    borderColor: 'border-red-400/30',
    badge: 'Master Detective',
    problemCount: '10-15',
  },
];

const JAVASCRIPT_LEVELS = [
  {
    id: 'fundamentals',
    title: 'Fundamentals',
    description: 'Learn to navigate the digital landscape. Master DOM basics and web fundamentals.',
    icon: '🌐',
    color: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-400/30',
    badge: 'Novice Hacker',
    problemCount: '10-15',
  },
  {
    id: 'easy',
    title: 'Easy',
    description: 'Execute simple web infiltration techniques. Array methods and basic event handling.',
    icon: '🔓',
    color: 'from-emerald-500/10 to-green-500/10',
    borderColor: 'border-emerald-400/30',
    badge: 'Code Runner',
    problemCount: '10-15',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Master complex digital penetration methods. Async operations and advanced JS patterns.',
    icon: '🎯',
    color: 'from-yellow-500/10 to-orange-500/10',
    borderColor: 'border-yellow-400/30',
    badge: 'Elite Hacker',
    problemCount: '10-15',
  },
  {
    id: 'hard',
    title: 'Hard',
    description: 'Execute the ultimate web heist - complete system takeover. Advanced optimizations and system design.',
    icon: '💣',
    color: 'from-red-500/10 to-pink-500/10',
    borderColor: 'border-red-400/30',
    badge: 'Cyber Legend',
    problemCount: '10-15',
  },
];

const JAVA_LEVELS = [
  {
    id: 'fundamentals',
    title: 'Fundamentals',
    description: 'Study the heist blueprint - understand your target. Master OOP foundations and class design.',
    icon: '📋',
    color: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-400/30',
    badge: 'Recruit',
    problemCount: '10-15',
  },
  {
    id: 'easy',
    title: 'Easy',
    description: 'Small jobs to build your criminal reputation. Collections and basic data structures.',
    icon: '💰',
    color: 'from-emerald-500/10 to-green-500/10',
    borderColor: 'border-emerald-400/30',
    badge: 'Apprentice Thief',
    problemCount: '10-15',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Complex heists requiring teamwork and planning. Design patterns and advanced structures.',
    icon: '👥',
    color: 'from-yellow-500/10 to-orange-500/10',
    borderColor: 'border-yellow-400/30',
    badge: 'Mastermind',
    problemCount: '10-15',
  },
  {
    id: 'hard',
    title: 'Hard',
    description: 'The ultimate score - the biggest heist of your career. System design and optimization mastery.',
    icon: '💎',
    color: 'from-red-500/10 to-pink-500/10',
    borderColor: 'border-red-400/30',
    badge: 'Crime Boss',
    problemCount: '10-15',
  },
];

const CPP_LEVELS = [
  {
    id: 'fundamentals',
    title: 'Fundamentals',
    description: 'Build your Fortress - Learn Defensive Coding. Master pointers and memory Fundamentals.',
    icon: '🛡️',
    color: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-400/30',
    badge: 'Recruit Sentinel',
    problemCount: '10-15',
  },
  {
    id: 'easy',
    title: 'Easy',
    description: 'Stop Basic Cyber Threats with Simple Protocols. String Handling and simple Data Structures.',
    icon: '🔒',
    color: 'from-emerald-500/10 to-green-500/10',
    borderColor: 'border-emerald-400/30',
    badge: 'Guard',
    problemCount: '10-15',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Intercept Advanced Attacks with Sophisticated Methods. Advanced Memory Management and Algorithms.',
    icon: '⚔️',
    color: 'from-yellow-500/10 to-orange-500/10',
    borderColor: 'border-yellow-400/30',
    badge: 'Elite Sentinel',
    problemCount: '10-15',
  },
  {
    id: 'hard',
    title: 'Hard',
    description: 'Become a Master Sentinel & Defend against Elite Hackers. Performance optimization and system mastery.',
    icon: '👑',
    color: 'from-red-500/10 to-pink-500/10',
    borderColor: 'border-red-400/30',
    badge: 'Master Sentinel',
    problemCount: '10-15',
  },
];

const LANGUAGE_LEVELS = {
  python: PYTHON_LEVELS,
  javascript: JAVASCRIPT_LEVELS,
  java: JAVA_LEVELS,
  cpp: CPP_LEVELS,
};

const ChapterSelectionPage = () => {
  const { trackId } = useParams();
  const navigate = useNavigate();

  const languageMeta = LANGUAGE_META[trackId];
  const levels = LANGUAGE_LEVELS[trackId];

  if (!languageMeta || !levels) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Language not found: {trackId}</h1>
          <p className="mb-6 opacity-75">Available: {Object.keys(LANGUAGE_LEVELS).join(', ')}</p>
          <button onClick={() => navigate('/learn')} className="font-semibold hover:opacity-75">
            ← Back to Learn
          </button>
        </div>
      </div>
    );
  }

  const handleDifficultyClick = (difficulty) => {
    navigate(`/learn/${trackId}/${difficulty.id}`, { state: { difficulty, language: trackId } });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header variant="empty" />

      <main className="flex-1 px-6 sm:px-10 py-10">
        <div className="max-w-5xl mx-auto pt-10">
          <div className="flex items-center gap-4 mb-12">
            <img src={languageMeta.icon} alt={trackId} className="w-14 h-14 object-contain" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{languageMeta.title}</h1>
              <p className="opacity-75">Choose your challenge level</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {levels.map((difficulty) => (
              <div
                key={difficulty.id}
                onClick={() => handleDifficultyClick(difficulty)}
                className={`group cursor-pointer rounded-xl border-2 ${difficulty.borderColor}
                  bg-linear-to-br ${difficulty.color} backdrop-blur-sm
                  p-8 transition-all duration-300 hover:shadow-lg hover:scale-105`}
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{difficulty.icon}</span>
                    <div>
                      <h3 className="text-2xl font-bold">{difficulty.title}</h3>
                      <p className="text-sm opacity-75">{difficulty.problemCount} problems</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm mb-6 opacity-90">{difficulty.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}>
                    {difficulty.badge}
                  </span>
                  <button className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Start →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <button
              onClick={() => navigate('/learn')}
              className="text-sm font-semibold opacity-75 hover:opacity-100 transition"
            >
              ← Back to Languages
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChapterSelectionPage;
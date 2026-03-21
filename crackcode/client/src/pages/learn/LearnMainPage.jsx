import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Header from '../../components/common/Header';
import { AppContent } from '../../context/userauth/authenticationContext';
import pythonIcon from '../../assets/icons/learn/python.png';
import jsIcon from '../../assets/icons/learn/js.png';
import javaIcon from '../../assets/icons/learn/java.png';
import cppIcon from '../../assets/icons/learn/cpp.png';

const LearnMainPage = () => {
  const navigate = useNavigate();

  const languagesData = [
    {
      id: 'python',
      icon: pythonIcon,
      title: 'Python',
      subtitle: 'The Legend of Python',
      description: 'Become a Python detective and crack cases: From rookie investigator to master code breaker.',
      chapterCount: 4,
      bgColor: 'from-blue-500/10 to-yellow-500/10',
      borderColor: 'border-blue-400/30',
      badge: '⭐ Beginner Friendly',
      route: '/learn/python',
    },
    {
      id: 'javascript',
      icon: jsIcon,
      title: 'JavaScript',
      subtitle: 'Classified Operations',
      description: 'Deploy classified applications as a Java spy: master OOP, Collections, and more to build unbreakable systems.',
      chapterCount: 4,
      bgColor: 'from-yellow-500/10 to-orange-500/10',
      borderColor: 'border-yellow-400/30',
      badge: '⚡ Frontend Power',
      route: '/learn/javascript',
    },
    {
      id: 'java',
      icon: javaIcon,
      title: 'Java',
      subtitle: 'Illegal Operations',
      description: 'Plan the ultimate heist: Master OOP, Collections, and more techniques as a criminal mastermind building bulletproof systems.',
      chapterCount: 3,
      bgColor: 'from-red-500/10 to-orange-500/10',
      borderColor: 'border-red-400/30',
      badge: '🏗️ Enterprise Level',
      route: '/learn/java',
    },
    {
      id: 'cpp',
      icon: cppIcon,
      title: 'C++',
      subtitle: 'Ghosts in the System',
      description: 'Become a cyber sentinel: master systems programming, memory management, and exploit high performance hacking techniques.',
      chapterCount: 1,
      bgColor: 'from-slate-500/10 to-cyan-500/10',
      borderColor: 'border-slate-400/30',
      badge: '⚙️ Advanced',
      route: '/learn/cpp',
    },
  ];

  const { userData } = useContext(AppContent);

  // Determine completed counts per language (assume problemId prefix: py_, js_, java_, cpp_)
  const completedByLang = { python: 0, javascript: 0, java: 0, cpp: 0 };
  const completedIds = Array.isArray(userData?.completedQuestionIds) ? userData.completedQuestionIds : [];

  // Deduplicate IDs and normalize
  const uniqueIds = Array.from(new Set(completedIds.map(id => (typeof id === 'string' ? id.trim() : id))));

  uniqueIds.forEach((id) => {
    if (typeof id !== 'string' || id.length === 0) return;
    const lower = id.toLowerCase();
    if (lower.startsWith('py_')) completedByLang.python += 1;
    else if (lower.startsWith('js_')) completedByLang.javascript += 1;
    else if (lower.startsWith('java_')) completedByLang.java += 1;
    else if (lower.startsWith('cpp_')) completedByLang.cpp += 1;
  });

  // Debug: log what we computed to help troubleshooting in the browser console
  console.log('LearnMainPage: unique completed IDs:', uniqueIds);
  console.log('LearnMainPage: completedByLang:', completedByLang);

  // Cap counts to the visible total (15) to avoid showing >15
  Object.keys(completedByLang).forEach(k => { if (completedByLang[k] > 15) completedByLang[k] = 15; });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header variant="empty" />

      <main className="flex-1 px-6 sm:px-10 py-10">
        <div className="max-w-5xl mx-auto pt-10">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Choose Your Learning Path
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Select a programming language and start solving interactive challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {languagesData.map((lang) => (
              <div
                key={lang.id}
                onClick={() => navigate(lang.route)}
                className={`group cursor-pointer rounded-xl border-2 ${lang.borderColor} 
                  bg-gradient-to-br ${lang.bgColor} backdrop-blur-sm
                  p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img src={lang.icon} alt={lang.title} className="w-12 h-12 object-contain" />
                    <div>
                      <h3 className="text-2xl font-bold">{lang.title}</h3>
                      <p className="text-sm opacity-75">{lang.subtitle}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm mb-4 line-clamp-2 opacity-90">{lang.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm opacity-75">
                    {/** Show per-language completed count (default total 15) **/}
                    {(() => {
                      const totals = 15;
                      const langKey = lang.id;
                      const completed = completedByLang[langKey] ?? 0;
                      return `${completed}/${totals} completed`;
                    })()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}>
                    {lang.badge}
                  </span>
                  <button className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Start →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearnMainPage;



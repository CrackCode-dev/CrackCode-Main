import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header variant="empty" />

      <main className="flex-1 px-6 sm:px-10 py-10">
        <div className="max-w-5xl mx-auto pt-12">
          <div className="mb-16 text-center">
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



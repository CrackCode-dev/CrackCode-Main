import Header from '../../components/common/Header';
import LangCard from '../../components/learn/LangCard';
import pythonIcon from '../../assets/icons/learn/python.png';
import jsIcon from '../../assets/icons/learn/js.png';
import javaIcon from '../../assets/icons/learn/java.png';
import cppIcon from '../../assets/icons/learn/cpp.png';

// Example usage: Creating language cards using ContentCard
const LearnMainPage = () => {
  
  const languagesData = [
    {
      id: 'python',
      icon: pythonIcon, 
      title: 'The Legend of Python',
      description: 'Join the Python Bureau and uncover hidden pattern in data! Learn to trace decode algorithms, and reveal the secrets behind every function. Perfect for rookie detective ready to master the art of Python sleuthing,',
      courseCount: 4,
      headerGradient: 'linear-gradient(to right, #1F3A5F, #FCD34D)',
    },
    {
      id: 'javascript',
      icon: jsIcon,
      title: 'The Quest of JavaScript',
      titleColor: 'text-black',
      description: 'Enter the JavaScript Division and infiltrate the digital web! Learn to track interactions, decode scripts, and reveal the logic behind dynamic pages. Perfect for sharp-minded agents mastering the art of front-end investigation.',
      courseCount: 4,
      headerGradient: 'linear-gradient(to right, #FFB800, #FFF200)',
    },
    {
      id: 'java',
      icon: javaIcon,
      title: 'The Java Chronicles',
      description: 'Join the Java Task Force and trace the roots of digital operations! Learn to structure logic, decode object mysteries, and reveal the secrets behind powerful backend systems. Perfect for agents mastering enterprise-level investigations.',
      courseCount: 3,
      headerGradient: 'linear-gradient(to right, #7F1D1D, #F87171)',
    },
    {
      id: 'cpp',
      icon: cppIcon,
      title: 'The C++ Saga',
      description: 'Enter the Forensic Systems Unit and uncover code buried deep in the machine! Learn to dissect memory clues, trace algorithms, and reconstruct high-performance evidence. Perfect for elite detectives mastering the art of precision coding.',
      courseCount: 1,
      headerGradient: 'linear-gradient(to right, #0F2027, #203A43, #2C5364)',
    },
  ];

  return (
    <div className="h-screen flex flex-col justify-between bg-[#050505] text-white px-6 sm:px-10 py-6">
        <Header variant='empty' />

        <main className='mt-20 pb-10'>
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-5">
                        Uncover the Mysteries of Programming
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Embark on your coding investigation with 200+ hours of interactive mystery cases and
                        programming puzzles paired with real-world missions.
                    </p>
                    <p className="text-gray-300 mt-4">
                        Crack the clues, uncover the logic, and solve the toughest code crimes — all for free!
                    </p>
                </div>

                {/* Language Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {languagesData.map(lang => (
                    <LangCard 
                    key={lang.id}
                    icon={<img src={lang.icon} className='w-10 h-10 object-contain' alt={lang.title} />}
                    title={lang.title}
                    titleColor={lang.titleColor}
                    description={lang.description}
                    courseCount={lang.courseCount}
                    headerGradient={lang.headerGradient}
                    onClick={() => Navigate(lang.route)}
                    />
                    ))}
                </div>

            </div>
      </main>
    </div>
        
      
  );
};

export default LearnMainPage;



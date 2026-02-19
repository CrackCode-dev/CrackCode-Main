import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChapterCard from '../../components/learn/ChapterCard';
// import Roadmap from '../../components/ui/Roadmap';
import Header from '../../components/common/Header';

// Import language icons
import PythonIcon from '../../assets/icons/learn/python.png';
import JavaScriptIcon from '../../assets/icons/learn/js.png';
import JavaIcon from '../../assets/icons/learn/java.png';
import CppIcon from '../../assets/icons/learn/cpp.png';

// Import chapter images (update paths as needed)
import PythonFundamentalsImg from '../../assets/icons/learn/chapters/python/py_ch1.png';
import IntermediatePythonImg from '../../assets/icons/learn/chapters/python/py_ch2.png';
import DataAnalysisImg from '../../assets/icons/learn/chapters/python/py_ch3.png';
import WebDevDjangoImg from '../../assets/icons/learn/chapters/python/py_ch4.png';

import JSFundamentalsImg from '../../assets/icons/learn/chapters/js/js_ch1.png';
import DOMManipulationImg from '../../assets/icons/learn/chapters/js/js_ch2.png';
import AsyncJSImg from '../../assets/icons/learn/chapters/js/js_ch3.png';
import ReactBasicsImg from '../../assets/icons/learn/chapters/js/js_ch4.png';

import JavaFundamentalsImg from '../../assets/icons/learn/chapters/java/java_ch1.png';
import OOPJavaImg from '../../assets/icons/learn/chapters/java/java_ch2.png';
import JavaCollectionsImg from '../../assets/icons/learn/chapters/java/java_ch3.png';
import SpringBootImg from '../../assets/icons/learn/chapters/java/java_ch4.png';

import CppFundamentalsImg from '../../assets/icons/learn/chapters/cpp/cpp_ch1.png';
import PointersMemoryImg from '../../assets/icons/learn/chapters/cpp/cpp_ch2.png';
import STLImg from '../../assets/icons/learn/chapters/cpp/cpp_ch3.png';
import SystemsProgrammingImg from '../../assets/icons/learn/chapters/cpp/cpp_ch4.png';
// ============================================
// LANGUAGE METADATA (matching LearnMainPage)
// ============================================
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

// ============================================
// CHAPTERS DATA - Hashmap by language
// ============================================
const CHAPTERS_DATA = {
  python: [
    {
      id: 'python-fundamentals',
      image: PythonFundamentalsImg,
      title: 'Python Fundamentals',
      description: 'Learn Programming fundamentals such as variables, control flow, and loops with basics of Python.',
      difficulty: 'easy',
      completed: 7,
      total: 10,
      status: 'In Progress',
      route: '/learn/python/fundamentals',
    },
    {
      id: 'intermediate-python',
      image: IntermediatePythonImg,
      title: 'Intermediate Python',
      description: 'Begin learning intermediate Python with data structures and object-oriented programming.',
      difficulty: 'medium',
      completed: 2,
      total: 12,
      status: 'To Begin',
      route: '/learn/python/intermediate',
    },
    {
      id: 'data-analysis',
      image: DataAnalysisImg,
      title: 'Data Analysis with Pandas',
      description: 'Master data manipulation and analysis using Pandas library for real-world data projects.',
      difficulty: 'medium',
      completed: 0,
      total: 8,
      status: 'To Begin',
      route: '/learn/python/data-analysis',
    },
    {
      id: 'web-dev-django',
      image: WebDevDjangoImg,
      title: 'Web Development with Django',
      description: 'Build full-stack web applications using Django framework and best practices.',
      difficulty: 'hard',
      completed: 0,
      total: 15,
      status: 'To Begin',
      route: '/learn/python/django',
    },
  ],
  
  javascript: [
    {
      id: 'js-fundamentals',
      image: JSFundamentalsImg,
      title: 'JavaScript Fundamentals',
      description: 'Learn the core concepts of JavaScript including variables, functions, and control structures.',
      difficulty: 'easy',
      completed: 10,
      total: 10,
      status: 'Completed',
      route: '/learn/javascript/fundamentals',
    },
    {
      id: 'dom-manipulation',
      image: DOMManipulationImg,
      title: 'DOM Manipulation',
      description: 'Master the Document Object Model and learn to create interactive web pages.',
      difficulty: 'easy',
      completed: 4,
      total: 10,
      status: 'In Progress',
      route: '/learn/javascript/dom',
    },
    {
      id: 'async-js',
      image: AsyncJSImg,
      title: 'Asynchronous JavaScript',
      description: 'Understand callbacks, promises, and async/await for handling asynchronous operations.',
      difficulty: 'medium',
      completed: 0,
      total: 8,
      status: 'To Begin',
      route: '/learn/javascript/async',
    },
    {
      id: 'react-basics',
      image: ReactBasicsImg,
      title: 'React Fundamentals',
      description: 'Build modern user interfaces with React components, hooks, and state management.',
      difficulty: 'hard',
      completed: 0,
      total: 12,
      status: 'To Begin',
      route: '/learn/javascript/react',
    },
  ],
  
  java: [
    {
      id: 'java-fundamentals',
      image: JavaFundamentalsImg,
      title: 'Java Fundamentals',
      description: 'Start your Java journey with syntax, data types, and basic programming concepts.',
      difficulty: 'easy',
      completed: 0,
      total: 10,
      status: 'To Begin',
      route: '/learn/java/fundamentals',
    },
    {
      id: 'oop-java',
      image: OOPJavaImg,
      title: 'Object-Oriented Programming',
      description: 'Master classes, objects, inheritance, polymorphism, and encapsulation in Java.',
      difficulty: 'medium',
      completed: 0,
      total: 12,
      status: 'To Begin',
      route: '/learn/java/oop',
    },
    {
      id: 'java-collections',
      image: JavaCollectionsImg,
      title: 'Java Collections Framework',
      description: 'Learn to work with Lists, Sets, Maps, and other data structures efficiently.',
      difficulty: 'medium',
      completed: 0,
      total: 8,
      status: 'To Begin',
      route: '/learn/java/collections',
    },
    {
      id: 'spring-boot',
      image: SpringBootImg,
      title: 'Spring Boot Development',
      description: 'Build enterprise-grade applications with Spring Boot framework and RESTful APIs.',
      difficulty: 'hard',
      completed: 0,
      total: 15,
      status: 'To Begin',
      route: '/learn/java/spring-boot',
    },
  ],
  
  cpp: [
    {
      id: 'cpp-fundamentals',
      image: CppFundamentalsImg,
      title: 'C++ Fundamentals',
      description: 'Learn C++ basics including syntax, variables, operators, and control structures.',
      difficulty: 'easy',
      completed: 0,
      total: 10,
      status: 'To Begin',
      route: '/learn/cpp/fundamentals',
    },
    {
      id: 'pointers-memory',
      image: PointersMemoryImg,
      title: 'Pointers & Memory Management',
      description: 'Master pointers, references, dynamic memory allocation, and memory safety.',
      difficulty: 'medium',
      completed: 0,
      total: 12,
      status: 'To Begin',
      route: '/learn/cpp/pointers',
    },
    {
      id: 'stl',
      image: STLImg,
      title: 'Standard Template Library',
      description: 'Explore STL containers, algorithms, and iterators for efficient programming.',
      difficulty: 'medium',
      completed: 0,
      total: 8,
      status: 'To Begin',
      route: '/learn/cpp/stl',
    },
    {
      id: 'systems-programming',
      image: SystemsProgrammingImg,
      title: 'Systems Programming',
      description: 'Build low-level applications with file I/O, multithreading, and system calls.',
      difficulty: 'hard',
      completed: 0,
      total: 15,
      status: 'To Begin',
      route: '/learn/cpp/systems',
    },
  ],
};

// ============================================
// CHAPTER SELECTION PAGE COMPONENT
// ============================================
const ChapterSelectionPage = () => {
  const { trackId } = useParams(); // e.g., 'python', 'javascript'
  const navigate = useNavigate();
  
  // Get data for current language
  const languageMeta = LANGUAGE_META[trackId];
  const chapters = CHAPTERS_DATA[trackId] || [];
  
  // Handle invalid trackId
  if (!languageMeta) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Language not found</h1>
          <button 
            onClick={() => navigate('/learn')}
            className="text-green-400 hover:underline"
          >
            ← Back to Learn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <Header variant='empty'/>

      <main className='mt-20 px-6 sm:px-10 py-6'>
        <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <img 
            src={languageMeta.icon} 
            alt={trackId} 
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {languageMeta.title}
          </h1>
        </div>

        {/* Roadmap + Chapters */}
        <div className="relative">
          {/* Connecting Line - Full height background line */}
          <div className="hidden md:block absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700 -translate-x-1/2" />
          
          {/* Chapters with nodes */}
          <div className="flex flex-col gap-6">
            {chapters.map((chapter, index) => {
              const progress = chapter.total > 0 ? (chapter.completed / chapter.total) * 100 : 0;
              const isCompleted = progress === 100;
              const isInProgress = progress > 0 && progress < 100;

              return (
                <div key={chapter.id} className="flex items-center gap-8 md:gap-12">

                  {/* Roadmap Node */}
                  <div className="hidden md:flex items-center justify-center relative z-10">
                    <div className="relative w-8 h-8 bg-[#0a0a0a]">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                        {/* Gray background circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          fill="#0a0a0a"
                          stroke="#374151"
                          strokeWidth="3"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${(progress / 100) * 75.4} 75.4`}
                          className="transition-all duration-500"
                        />
                      </svg>
                      {/* Inner dot */}
                      {(isCompleted || isInProgress) && (
                        <div 
                          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-green-500/50'}`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Chapter Card */}
                  <div className="flex-1">
                    <ChapterCard
                      image={chapter.image}
                      title={chapter.title}
                      description={chapter.description}
                      difficulty={chapter.difficulty}
                      completed={chapter.completed}
                      total={chapter.total}
                      status={chapter.status}
                      onClick={() => navigate(chapter.route)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </main>
      
    </div>
  );
};

export default ChapterSelectionPage;

// Export data for use in other components
export { CHAPTERS_DATA, LANGUAGE_META };
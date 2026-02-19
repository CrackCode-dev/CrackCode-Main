import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChapterCard from '../../components/learn/ChapterCard';
import { RoadmapNode } from '../../components/ui/Roadmap'; 
import Header from '../../components/common/Header';


import PythonIcon from '../../assets/icons/learn/python.png';
import JavaScriptIcon from '../../assets/icons/learn/js.png';
import JavaIcon from '../../assets/icons/learn/java.png';
import CppIcon from '../../assets/icons/learn/cpp.png';

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
      completed: 2,
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
      completed: 3,
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

const ChapterSelectionPage = () => {
  const { trackId } = useParams(); 
  const navigate = useNavigate();
  
  const languageMeta = LANGUAGE_META[trackId];
  const chapters = CHAPTERS_DATA[trackId] || [];
  
  if (!languageMeta) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Language not found</h1>
          <button onClick={() => navigate('/learn')} className="text-green-400 hover:underline">
            ← Back to Learn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050505]">
      <Header variant='empty'/>

      <main className='mt-40 px-6 sm:px-10 py-6'>
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-4 mb-12">
            <img src={languageMeta.icon} alt={trackId} className="w-12 h-12 object-contain" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {languageMeta.title}
            </h1>
          </div>

          {/* Roadmap + Chapters */}
          <div className="flex flex-col">
            {chapters.map((chapter, index) => {
              const progress = chapter.total > 0 ? (chapter.completed / chapter.total) * 100 : 0;

              return (
                <div key={chapter.id} className="flex gap-6 md:gap-10">
                  
                  {/* Roadmap Column */}
                  <div className="hidden md:flex flex-col pt-2"> 
                    {/* pt-2 ensures the circle aligns with the card's top section */}
                    <RoadmapNode 
                      progress={progress} 
                      isLast={index === chapters.length - 1} 
                    />
                  </div>

                  {/* Chapter Card Column */}
                  <div className="flex-1 pb-10"> 
                    {/* pb-10 controls the vertical distance between chapters */}
                    <ChapterCard
                      image={chapter.image}
                      title={chapter.title}
                      description={chapter.description}
                      difficulty={chapter.difficulty}
                      completed={chapter.completed}
                      total={chapter.total}
                      status={chapter.status}
                      onClick={() => navigate(chapter.route)}
                      showRoadmap={false} // Set to false since RoadmapNode is handled externally
                      isFirst={index === 0}
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

export default ChapterSelectionPage;
export { CHAPTERS_DATA, LANGUAGE_META };
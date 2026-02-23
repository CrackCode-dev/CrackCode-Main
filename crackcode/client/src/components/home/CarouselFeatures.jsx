import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/theme/ThemeContext';
import { Zap, Code, Trophy, Layers } from 'lucide-react';

export default function CarouselFeatures() {
  useTheme() // Subscribe to theme changes for CSS variables
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const features = [
    {
      icon: Code,
      title: 'Code Challenges',
      description: 'Solve real-world coding problems with varying difficulty levels',
      color: '#FF6B6B'
    },
    {
      icon: Trophy,
      title: 'Leaderboards',
      description: 'Compete with other developers and climb the global rankings',
      color: '#4ECDC4'
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get real-time feedback and suggestions on your solutions',
      color: '#FFE66D'
    },
    {
      icon: Layers,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics',
      color: '#95E1D3'
    }
  ];

  // Auto-shift carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length]);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir > 0 ? -500 : 500,
      opacity: 0
    })
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + features.length) % features.length);
  };

  const Feature = features[currentIndex];
  const IconComponent = Feature.icon;

  return (
    <div className='w-full'>
      {/* Title */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold mb-2'>Featured Today</h2>
          <p style={{ color: 'var(--textSec)' }} className='text-sm'>
            Explore what makes CrackCode special
          </p>
        </div>
        <div className='text-xs font-bold px-3 py-1 rounded-full' style={{ background: 'rgba(255, 165, 0, 0.15)', color: 'var(--brand)' }}>
          {currentIndex + 1} / {features.length}
        </div>
      </div>

      {/* Carousel Container - Enhanced */}
      <div
        className='relative rounded-lg overflow-hidden transition-all duration-300'
        style={{
          background: `linear-gradient(135deg, var(--surface) 0%, rgba(255, 165, 0, 0.02) 100%)`,
          border: '1px solid var(--border)',
          minHeight: '280px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Carousel Content */}
        <AnimatePresence initial={false} custom={direction} mode='sync'>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{
              x: { type: 'spring', stiffness: 400, damping: 40, duration: 0.3 },
              opacity: { duration: 0.25 }
            }}
            className='absolute inset-0 flex items-center justify-center p-8 pb-20'
          >
            <div className='flex flex-col items-center text-center gap-5 max-w-sm'>
              {/* Icon - Enhanced */}
              <motion.div
                className='p-4 rounded-full transition-all duration-300 shrink-0'
                style={{
                  background: `${Feature.color}20`,
                  color: Feature.color
                }}
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <IconComponent className='w-12 h-12' />
              </motion.div>

              {/* Content */}
              <div className='min-w-0'>
                <h3 className='text-2xl font-bold mb-2 break-words' style={{ color: 'var(--text)' }}>
                  {Feature.title}
                </h3>
                <p style={{ color: 'var(--textSec)' }} className='text-sm leading-relaxed break-words'>
                  {Feature.description}
                </p>
              </div>

              {/* CTA Button - Premium */}
              <motion.button
                className='mt-4 px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2 shrink-0'
                style={{
                  background: Feature.color,
                  color: '#fff'
                }}
                whileHover={{ scale: 1.05, boxShadow: `0 8px 20px ${Feature.color}40` }}
                whileTap={{ scale: 0.95 }}
              >
                Explore
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Enhanced */}
        <motion.button
          onClick={() => paginate(-1)}
          className='absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-300 hover:shadow-lg'
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'rgba(255, 165, 0, 0.25)',
            color: 'var(--text)',
            border: '1px solid rgba(255, 165, 0, 0.4)'
          }}
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2.5}
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </motion.button>
        <motion.button
          onClick={() => paginate(1)}
          className='absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-300 hover:shadow-lg'
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'rgba(255, 165, 0, 0.25)',
            color: 'var(--text)',
            border: '1px solid rgba(255, 165, 0, 0.4)'
          }}
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2.5}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </motion.button>

        {/* Dot Indicators - Enhanced */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5'>
          {features.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className='rounded-full cursor-pointer transition-all duration-300'
              animate={{
                width: index === currentIndex ? '28px' : '8px',
                backgroundColor: index === currentIndex ? 'var(--brand)' : 'rgba(255, 165, 0, 0.3)',
                boxShadow: index === currentIndex ? '0 2px 8px rgba(255, 165, 0, 0.3)' : 'none'
              }}
              transition={{ duration: 0.3 }}
              style={{
                height: '8px'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

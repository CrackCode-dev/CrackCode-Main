import { useState, useEffect } from 'react';
import { useTheme } from '../../context/theme/ThemeContext';
import { Clock, Zap, Target, Flame, AlertCircle, Info } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

// Utility function to format seconds to readable time format
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
};

export default function DailyChallenge() {
  const { theme } = useTheme();
  const [timeLeft, setTimeLeft] = useState(23 * 3600 + 45 * 60); // ~24 hours
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dailyChallenge = {
    title: 'The Binary Search Mystery',
    description: 'Find the hidden value in a sorted array using efficient binary search. Only 15 minutes allowed!',
    difficulty: 'medium',
    difficultyLabel: 'Medium',
    points: 250,
    completion: 0,
    timeLimit: 900, // 15 minutes
    attempts: 0,
    maxAttempts: 3,
    streak: 5,
    completedCount: 147
  };

  return (
    <div
      className='rounded-lg p-8 transition-all duration-300 relative overflow-hidden'
      style={{
        background: 'var(--surface)',
        color: 'var(--text)',
        border: '2px solid var(--border)',
        backgroundImage: `linear-gradient(135deg, rgba(255, 165, 0, 0.08) 0%, rgba(255, 165, 0, 0.02) 100%)`,
        boxShadow: isHovered ? '0 12px 32px rgba(255, 165, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderColor: isHovered ? 'var(--brand)' : 'var(--border)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Daily Badge */}
      <div className='absolute top-4 right-4'>
        <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold' style={{ background: 'rgba(255, 107, 107, 0.2)', color: '#FF6B6B' }}>
          <Flame className='w-3 h-3' />
          Daily
        </div>
      </div>

      {/* Header */}
      <div className='flex items-start justify-between mb-6'>
        <div className='flex-1'>
          <h3 className='text-3xl font-bold mb-3 transition-all duration-300' style={{ color: isHovered ? 'var(--brand)' : 'var(--text)' }}>
            {dailyChallenge.title}
          </h3>
          <p style={{ color: 'var(--textSec)' }} className='text-base mb-3 leading-relaxed max-w-xl'>
            {dailyChallenge.description}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className='flex flex-wrap gap-4 mb-6'>
        {/* Difficulty Badge */}
        <Badge
          type='difficulty'
          difficulty={dailyChallenge.difficulty}
          size='md'
        >
          {dailyChallenge.difficultyLabel}
        </Badge>

        {/* Points Badge */}
        <div className='px-4 py-2 rounded-md text-base font-bold' style={{ background: 'rgba(255, 165, 0, 0.15)', color: 'var(--brand)' }}>
          +{dailyChallenge.points} pts
        </div>

        {/* Streak */}
        <div
          className='flex items-center gap-2 px-4 py-2 rounded-md text-base font-medium'
          style={{
            background: 'rgba(255, 165, 0, 0.1)',
            color: 'var(--brand)'
          }}
        >
          <Flame className='w-5 h-5' />
          <span>{dailyChallenge.streak} Day Streak</span>
        </div>

        {/* Attempts */}
        <div
          className='flex items-center gap-2 px-4 py-2 rounded-md text-base font-medium'
          style={{
            background: 'rgba(255, 165, 0, 0.1)',
            color: 'var(--brand)'
          }}
        >
          <Zap className='w-5 h-5' />
          <span>
            {dailyChallenge.attempts}/{dailyChallenge.maxAttempts} Attempts
          </span>
        </div>
      </div>

      {/* Timer Section - Premium */}
      <div
        className='rounded-lg p-4 mb-5 flex items-center justify-between transition-all duration-300'
        style={{
          background: isHovered ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 107, 107, 0.08)',
          border: '1px solid rgba(255, 107, 107, 0.4)',
          backgroundColor: isHovered ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 107, 107, 0.08)'
        }}
      >
        <div className='flex items-center gap-3'>
          <Clock className='w-6 h-6 animate-spin flex-shrink-0' style={{ color: '#FF6B6B', animationDuration: '2s' }} />
          <div>
            <p className='text-xs font-semibold uppercase' style={{ color: 'var(--textSec)' }}>
              Time Remaining
            </p>
            <p className='font-bold text-2xl' style={{ color: '#FF6B6B' }}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
        <p className='text-xs font-semibold' style={{ color: 'var(--textSec)' }}>
          {dailyChallenge.completedCount} completed today
        </p>
      </div>

      {/* Progress Bar - Enhanced */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-xs font-bold uppercase' style={{ color: 'var(--textSec)' }}>
            Challenge Progress
          </span>
          <span className='text-sm font-bold' style={{ color: 'var(--brand)' }}>
            {dailyChallenge.completion}%
          </span>
        </div>
        <div
          className='w-full h-3 rounded-full overflow-hidden'
          style={{ background: 'rgba(255, 165, 0, 0.15)' }}
        >
          <div
            className='h-full rounded-full transition-all duration-500'
            style={{
              width: `${dailyChallenge.completion}%`,
              background: 'linear-gradient(90deg, var(--brand) 0%, #FF8C42 100%)'
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 mb-5'>
        {/* <button
          className='flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg'
          style={{
            background: 'var(--brand)',
            color: 'var(--surface)',
            transform: isHovered ? 'scale(1.02)' : 'scale(1)'
          }}
        >
          <Target className='w-6 h-6' />
          Start Challenge
        </button> */}
        <Button variant='primary' size='lg' icon={Target} fullWidth>
          Start Challenge
        </Button>
        {/* <button
          className='flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-md'
          style={{
            background: 'rgba(255, 165, 0, 0.1)',
            color: 'var(--brand)',
            border: '2px solid var(--brand)'
          }}
        >
          Details
        </button> */}
        <Button variant='secondary' size='lg' icon={Info} fullWidth>
          Details
        </Button>
      </div>

      {/* Info Tip */}
      <div className='flex gap-2 p-3 rounded-lg' style={{ background: 'rgba(82, 200, 130, 0.1)', borderLeft: '3px solid #52c882' }}>
        <AlertCircle className='w-4 h-4 flex-shrink-0 mt-0.5' style={{ color: '#52c882' }} />
        <p className='text-xs' style={{ color: '#52c882' }}>
          Complete 7 daily challenges this week to unlock a special achievement badge!
        </p>
      </div>
    </div>
  );
}

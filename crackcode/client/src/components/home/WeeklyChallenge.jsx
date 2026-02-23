import { useState, useEffect } from 'react';
import { useTheme } from '../../context/theme/ThemeContext';
import { Calendar, Zap, Target } from 'lucide-react';
import Badge from '../ui/Badge';

export default function WeeklyChallenge() {
  const { theme } = useTheme();
  const [daysLeft, setDaysLeft] = useState(5);

  const weeklyChallenge = {
    title: 'The Sorting Showdown',
    description: 'Solve 5 different sorting challenges this week to unlock the master badge!',
    difficulty: 'hard',
    difficultyLabel: 'Hard',
    points: '+500 pts',
    completed: 2,
    total: 5,
    daysLeft: 5
  };

  return (
    <div
      className='rounded-lg p-6 transition-all duration-300 hover:shadow-lg'
      style={{
        background: 'var(--surface)',
        color: 'var(--text)',
        border: '2px solid var(--brand)',
        backgroundImage: `linear-gradient(135deg, rgba(255, 165, 0, 0.05) 0%, rgba(255, 165, 0, 0.02) 100%)`
      }}
    >
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <h3 className='text-lg font-bold mb-2'>{weeklyChallenge.title}</h3>
          <p style={{ color: 'var(--textSec)' }} className='text-sm mb-4'>
            {weeklyChallenge.description}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className='flex flex-wrap gap-2 mb-4'>
        {/* Difficulty Badge */}
        <Badge
          type='difficulty'
          difficulty={weeklyChallenge.difficulty}
          size='md'
        >
          {weeklyChallenge.difficultyLabel}
        </Badge>

        {/* Points Badge */}
        <Badge type='default' size='md'>
          {weeklyChallenge.points}
        </Badge>

        {/* Days Left */}
        <div
          className='flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium'
          style={{
            background: 'rgba(255, 165, 0, 0.1)',
            color: 'var(--brand)'
          }}
        >
          <Calendar className='w-4 h-4' />
          <span>{weeklyChallenge.daysLeft} days left</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='mb-4'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-xs font-semibold' style={{ color: 'var(--textSec)' }}>
            Weekly Progress
          </span>
          <span className='text-xs font-bold' style={{ color: 'var(--brand)' }}>
            {weeklyChallenge.completed}/{weeklyChallenge.total}
          </span>
        </div>
        <div
          className='w-full h-2 rounded-full overflow-hidden'
          style={{ background: 'rgba(255, 165, 0, 0.1)' }}
        >
          <div
            className='h-full rounded-full transition-all duration-500'
            style={{
              width: `${(weeklyChallenge.completed / weeklyChallenge.total) * 100}%`,
              background: 'var(--brand)'
            }}
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        className='w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2'
        style={{
          background: 'var(--brand)',
          color: 'var(--surface)'
        }}
        onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.target.style.opacity = '1')}
      >
        <Target className='w-4 h-4' />
        View Weekly Challenges
      </button>
    </div>
  );
}

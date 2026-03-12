import { useState } from 'react';
import { useTheme } from '../../context/theme/ThemeContext';
import { Sparkles, TrendingUp, Zap, Lock, ArrowRight } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const RECOMMENDED_CHALLENGES = [
  {
    id: 'rec-1',
    title: 'Two Sum Problem',
    description: 'Find two numbers that add up to a target value. Perfect for mastering hash maps!',
    difficulty: 'easy',
    difficultyLabel: 'Easy',
    points: 100,
    category: 'Arrays',
    matchScore: 95,
    reason: 'You just solved a similar problem - keep momentum!',
    timeEstimate: '10 min',
    icon: '🎯'
  },
  {
    id: 'rec-2',
    title: 'Binary Tree Level Order Traversal',
    description: 'Traverse a binary tree and return values level by level.',
    difficulty: 'medium',
    difficultyLabel: 'Medium',
    points: 150,
    category: 'Trees',
    matchScore: 88,
    reason: 'Next logical step in your learning path',
    timeEstimate: '20 min',
    icon: '🌳'
  },
  {
    id: 'rec-3',
    title: 'Longest Common Subsequence',
    description: 'Dynamic programming classic - find LCS of two strings efficiently.',
    difficulty: 'hard',
    difficultyLabel: 'Hard',
    points: 250,
    category: 'Dynamic Programming',
    matchScore: 82,
    reason: 'Challenge recommended to improve weak areas',
    timeEstimate: '30 min',
    icon: '📈'
  }
];

export default function RecommendedChallenges() {
  const { theme } = useTheme();
  const [hoveredId, setHoveredId] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());

  const toggleSaved = (id, e) => {
    e.stopPropagation();
    const newSet = new Set(savedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSavedIds(newSet);
  };

  return (
    <div className='w-full' style={{ color: 'var(--text)' }}>
      <div className='mb-8 px-6 sm:px-10'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-3xl font-bold mb-2 flex items-center gap-2'>
              <Sparkles className='w-8 h-8' style={{ color: 'var(--brand)' }} />
              Recommended for You
            </h2>
            <p style={{ color: 'var(--textSec)' }} className='text-sm'>
              Personalized challenges based on your skills, progress, and learning path
            </p>
          </div>
          <div className='flex items-center gap-2 px-3 py-1 rounded-lg' style={{ background: 'rgba(255, 165, 0, 0.1)', color: 'var(--brand)' }}>
            <TrendingUp className='w-4 h-4' />
            <span className='text-sm font-semibold'>AI Curated</span>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {RECOMMENDED_CHALLENGES.map((challenge, index) => (
            <div
              key={challenge.id}
              onMouseEnter={() => setHoveredId(challenge.id)}
              onMouseLeave={() => setHoveredId(null)}
              className='relative rounded-lg transition-all duration-300 overflow-hidden group cursor-pointer'
              style={{
                background: 'var(--surface)',
                border: '2px solid var(--border)',
                boxShadow:
                  hoveredId === challenge.id
                    ? '0 12px 32px rgba(255, 165, 0, 0.2)'
                    : 'none',
                transform: hoveredId === challenge.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)'
              }}
            >
              {/* Match Score Badge */}
              <div
                className='absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1'
                style={{
                  background: challenge.matchScore >= 90 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                  color: challenge.matchScore >= 90 ? '#4CAF50' : '#FF9800'
                }}
              >
                {challenge.matchScore >= 90 ? '✨' : '⭐'} {challenge.matchScore}% match
              </div>

              <div className='p-6'>
                {/* Icon and Title */}
                <div className='flex items-start gap-3 mb-3'>
                  <span className='text-3xl'>{challenge.icon}</span>
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-lg font-bold mb-1'>{challenge.title}</h3>
                  </div>
                </div>

                {/* Description */}
                <p style={{ color: 'var(--textSec)' }} className='text-sm mb-4 line-clamp-2'>
                  {challenge.description}
                </p>

                {/* Reason Chip */}
                <div
                  className='px-3 py-2 rounded-md mb-4 text-xs font-medium flex items-start gap-2'
                  style={{
                    background: 'rgba(255, 165, 0, 0.08)',
                    color: 'var(--text)'
                  }}
                >
                  <Zap className='w-3 h-3 shrink-0 mt-0.5' style={{ color: 'var(--brand)' }} />
                  <span>{challenge.reason}</span>
                </div>

                {/* Badges */}
                <div className='flex flex-wrap gap-2 mb-5'>
                  <Badge
                    type='difficulty'
                    difficulty={challenge.difficulty}
                    size='sm'
                  >
                    {challenge.difficultyLabel}
                  </Badge>
                  <div
                    className='px-2 py-1 rounded text-xs font-bold'
                    style={{
                      background: 'rgba(255, 165, 0, 0.15)',
                      color: 'var(--brand)'
                    }}
                  >
                    +{challenge.points} pts
                  </div>
                  <div
                    className='px-2 py-1 rounded text-xs font-semibold'
                    style={{
                      background: 'rgba(255, 165, 0, 0.08)',
                      color: 'var(--textSec)'
                    }}
                  >
                    {challenge.category}
                  </div>
                </div>

                {/* Meta Info */}
                <div className='flex items-center justify-between pt-4 border-t' style={{ borderColor: 'var(--border)' }}>
                  <div className='flex items-center gap-2 text-xs' style={{ color: 'var(--textSec)' }}>
                    <Lock className='w-3 h-3' />
                    {challenge.timeEstimate}
                  </div>
                  {/* <button
                    onClick={(e) => toggleSaved(challenge.id, e)}
                    className='px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-2'
                    style={{
                      background: hoveredId === challenge.id ? 'var(--brand)' : 'rgba(255, 165, 0, 0.1)',
                      color: hoveredId === challenge.id ? 'white' : 'var(--brand)'
                    }}
                  >
                    Start
                    <ArrowRight className='w-3 h-3' />
                  </button> */}
                  <Button variant='secondary' size='sm' icon={ArrowRight} iconPosition='right'>
                    Start Challenge
                  </Button>
                </div>
              </div>

              {/* Saved Indicator */}
              {savedIds.has(challenge.id) && (
                <div
                  className='absolute top-0 left-0 w-1 h-full'
                  style={{ background: 'var(--brand)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className='mt-8 text-center'>
          {/* <button
            className='px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 mx-auto'
            style={{
              background: 'rgba(255, 165, 0, 0.1)',
              color: 'var(--brand)',
              border: '2px solid var(--brand)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--brand)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 165, 0, 0.1)';
              e.currentTarget.style.color = 'var(--brand)';
            }}
          >
            View All Recommendations
            <ArrowRight className='w-4 h-4' />
          </button> */}
          <Button variant='primary' size='md' icon={ArrowRight} iconPosition='right'>
            View All Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
}

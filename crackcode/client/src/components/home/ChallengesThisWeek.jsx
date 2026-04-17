import { useState, useEffect } from 'react';
import { useTheme } from '../../context/theme/ThemeContext';
import { Calendar, CheckCircle2, Clock, Flame, ArrowRight, ListTodo } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom'
import { fetchWeeklyChallenges, transformProblemData } from '../../services/api/questionService'

const PLACEHOLDER = [
  { id: 'wc-1', title: 'The Sorting Showdown', description: 'Solve 5 different sorting challenges this week', difficulty: 'Hard', points: 500, completed: 2, total: 5, icon: '📊', color: '#FF6B6B' },
  { id: 'wc-2', title: 'String Manipulation Master', description: 'Complete 4 string-based coding problems', difficulty: 'Medium', points: 350, completed: 1, total: 4, icon: '✂️', color: '#FFB33F' },
  { id: 'wc-3', title: 'Data Structure Domination', description: 'Solve problems using various data structures', difficulty: 'Hard', points: 400, completed: 2, total: 3, icon: '🏗️', color: '#FF6B6B' },
  { id: 'wc-4', title: 'Algorithm Mastery', description: 'Implement 6 fundamental algorithms', difficulty: 'Medium', points: 300, completed: 3, total: 6, icon: '⚙️', color: '#FFB33F' }
];

// Helper functions for progress calculation
const getProgressColor = (progress) => {
  if (progress === 0) return '#FF6B6B';
  if (progress < 50) return '#FFB84D';
  if (progress < 100) return '#95E1D3';
  return '#52C882';
};

const getProgressPercentage = (completed, total) => {
  return Math.round((completed / total) * 100);
};

export default function ChallengesThisWeek() {
  const { theme } = useTheme();
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [cards, setCards] = useState(PLACEHOLDER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true); setError(null);
        const items = await fetchWeeklyChallenges();
        console.log('weekly items', items);
        if (!items || items.length === 0) return;

        // select up to 4 distinct items and map to card shape
        const selected = [];
        const used = new Set();
        for (const it of items) {
          const id = it.problemId || it._id || JSON.stringify(it);
          if (used.has(id)) continue;
          used.add(id);
          const t = transformProblemData(it, 'javascript');
          const rawDiff = (it.difficulty || t.difficulty || 'medium').toString().toLowerCase();
          const difficultyLabel = rawDiff.charAt(0).toUpperCase() + rawDiff.slice(1);
          selected.push({
            id: t.problemId || id,
            title: t.title || it.original?.title || `Weekly ${used.size}`,
            description: t.description || it.original?.description || '',
            difficulty: difficultyLabel,
            difficultyLabel: difficultyLabel,
            points: t.variant?.points || t.points || 300,
            completed: it.completed || 0,
            total: it.total || 1,
            icon: <ListTodo />,
            color: '#FF6B6B',
            raw: it,
            transformed: t,
          });
          if (selected.length >= 4) break;
        }

        if (mounted && selected.length) setCards(selected);
      } catch (err) {
        console.error('Failed to fetch weekly challenges', err);
        setError(err.message || 'Failed to load weekly challenges');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => { mounted = false }
  }, [])

  return (
    <div className='w-full' style={{ color: 'var(--text)' }}>
      <div className='mb-8 px-6 sm:px-10'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-3xl font-bold mb-2 flex items-center gap-2'>
              <Calendar className='w-8 h-8' style={{ color: 'var(--brand)' }} />
              Weekly Challenges
            </h2>
            <p style={{ color: 'var(--textSec)' }} className='text-sm'>
              Complete challenges throughout the week to earn bonus points and unlock achievements
            </p>
          </div>
          <div className='text-right'>
            <p className='text-sm' style={{ color: 'var(--textSec)' }}>
              5 days remaining
            </p>
            <p className='text-2xl font-bold' style={{ color: 'var(--brand)' }}>
              {cards.reduce((acc, c) => acc + (c.completed || 0), 0)}/{cards.reduce((acc, c) => acc + (c.total || 0), 0)}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {loading && <div className='text-sm text-gray-300'>Loading challenges…</div>}
          {!loading && cards.map((challenge) => {
            const progress = getProgressPercentage(challenge.completed || 0, challenge.total || 1);
            const isExpanded = expandedId === challenge.id;

            return (
              <div
                key={challenge.id}
                onMouseEnter={() => setHoveredId(challenge.id)}
                onMouseLeave={() => setHoveredId(null)}
                className='rounded-lg transition-all duration-300 overflow-hidden cursor-pointer group'
                style={{
                  background: 'var(--surface)',
                  border: '2px solid var(--border)',
                  boxShadow:
                    hoveredId === challenge.id
                      ? `0 12px 32px ${challenge.color || '#FF6B6B'}30`
                      : 'none',
                  borderColor: hoveredId === challenge.id ? (challenge.color || '#FF6B6B') : 'var(--border)',
                  transform: hoveredId === challenge.id ? 'translateY(-4px)' : 'translateY(0)'
                }}
                onClick={() => {
                  if (challenge.raw) {
                    const targetId = challenge.transformed?.problemId || challenge.id
                    navigate(`/code-editor/${targetId}`, { state: { question: challenge.raw, language: 'javascript', sourceArea: 'weekly_challenge', collectionName: 'challengeJavascriptQ' } })
                  }
                }}
              >
                <div className='p-6'>
                  {/* Header */}
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-start gap-3 flex-1'>
                      <span className='text-3xl mt-1'>{challenge.icon}</span>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-lg font-bold mb-1'>{challenge.title}</h3>
                        {/* Only show minimal meta on card. Full problem visible in editor. */}
                        <p style={{ color: 'var(--textSec)' }} className='text-xs'>
                          {challenge.completed}/{challenge.total} progress
                        </p>
                      </div>
                    </div>
                    {progress === 100 && (
                      <CheckCircle2
                        className='w-6 h-6 shrink-0 animate-pulse'
                        style={{ color: '#52C882' }}
                      />
                    )}
                  </div>

                  {/* Badges */}
                  <div className='flex flex-wrap gap-2 mb-4'>
                    <Badge
                      type='difficulty'
                      difficulty={challenge.difficulty?.toLowerCase()}
                      size='sm'
                    >
                      {challenge.difficultyLabel || challenge.difficulty}
                    </Badge>
                    <div
                      className='px-2 py-1 rounded text-xs font-bold'
                      style={{
                        background: `${challenge.color || '#FF6B6B'}20`,
                        color: challenge.color || '#FF6B6B'
                      }}
                    >
                      +{challenge.points} pts
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className='mb-6'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-xs font-semibold uppercase' style={{ color: 'var(--textSec)' }}>
                        Progress
                      </span>
                      <span className='text-xs font-bold' style={{ color: getProgressColor(progress) }}>
                        {challenge.completed}/{challenge.total}
                      </span>
                    </div>
                    <div
                      className='w-full h-2.5 rounded-full overflow-hidden'
                      style={{ background: 'rgba(255, 165, 0, 0.1)' }}
                    >
                      <div
                        className='h-full rounded-full transition-all duration-500'
                        style={{
                          width: `${progress}%`,
                          background: getProgressColor(progress)
                        }}
                      />
                    </div>
                  </div>

                  <Button variant='primary' size='sm' icon={ArrowRight} iconPosition='right' fullWidth style={{
                                                                                                           background: getProgressColor(progress),
                                                                                                           borderColor: getProgressColor(progress)}}>
                    {progress === 100 ? 'Completed!' : 'View Challenge'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8'>
          <div
            className='rounded-lg p-5 text-center transition-all duration-300'
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)'
            }}
          >
            <p style={{ color: 'var(--textSec)' }} className='text-sm mb-2'>
              Total Points Available
            </p>
            <p
              className='text-3xl font-bold'
              style={{ color: 'var(--brand)' }}
            >
              +{cards.reduce((acc, c) => acc + (c.points || 0), 0)}
            </p>
          </div>

          <div
            className='rounded-lg p-5 text-center transition-all duration-300'
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)'
            }}
          >
            <p style={{ color: 'var(--textSec)' }} className='text-sm mb-2'>
              Completed Challenges
            </p>
            <p
              className='text-3xl font-bold'
              style={{ color: '#52C882' }}
            >
              {cards.filter((c) => (c.completed || 0) === (c.total || 0)).length}/{cards.length}
            </p>
          </div>

          <div
            className='rounded-lg p-5 text-center transition-all duration-300'
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)'
            }}
          >
            <p style={{ color: 'var(--textSec)' }} className='text-sm mb-2'>
              Time Remaining
            </p>
            <p
              className='text-3xl font-bold flex items-center justify-center gap-2'
              style={{ color: '#FF6B6B' }}
            >
              <Flame className='w-6 h-6' />5 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

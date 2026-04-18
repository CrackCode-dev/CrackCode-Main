import { useState, useEffect } from 'react';
import { useTheme } from '../../context/theme/ThemeContext';
import { Sparkles, TrendingUp, Zap, Lock, ArrowRight } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom'
import { fetchChallengeCollection, transformProblemData } from '../../services/api/questionService'

const PLACEHOLDER = [
  { id: 'rec-1', title: 'Loading…', difficulty: null, points: null, category: null, matchScore: null, timeEstimate: null, icon: '🎯' },
  { id: 'rec-2', title: 'Loading…', difficulty: null, points: null, category: null, matchScore: null, timeEstimate: null, icon: '🌳' },
  { id: 'rec-3', title: 'Loading…', difficulty: null, points: null, category: null, matchScore: null, timeEstimate: null, icon: '📈' }
];

export default function RecommendedChallenges() {
  const { theme } = useTheme();
  const [hoveredId, setHoveredId] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [cards, setCards] = useState(PLACEHOLDER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true); setError(null);
        const items = await fetchChallengeCollection('challengeCppQ');
        if (!items || items.length === 0) return;

        // pick up to 3 distinct items
        const selected = [];
        const used = new Set();
        for (const it of items) {
          const id = it.problemId || it._id || JSON.stringify(it);
          if (used.has(id)) continue;
          used.add(id);
          const t = transformProblemData(it, 'cpp');
          selected.push({
            id: t.problemId || id,
            title: t.title || it.original?.title || 'Challenge',
            // keep minimal meta on card only
            difficulty: (it.difficulty || t.difficulty || 'medium').toString(),
            points: t.variant?.points || t.points || 100,
            category: t.topic || it.topic || 'General',
            matchScore: it.matchScore || Math.max(70, 80 - selected.length * 4),
            timeEstimate: it.timeEstimate || '10-20 min',
            raw: it,
            transformed: t,
          });
          if (selected.length >= 3) break;
        }

        if (mounted && selected.length) setCards(selected);
      } catch (err) {
        console.error('Failed to load recommended challenges', err);
        setError(err.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => { mounted = false }
  }, [])

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
          {loading && <div className='text-sm text-gray-300'>Loading recommendations…</div>}
          {!loading && cards.map((challenge, index) => (
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
              {/* match score removed per request */}

              <div className='p-6'>
                {/* Icon and Title */}
                <div className='flex items-start gap-3 mb-3'>
                  <span className='text-3xl'>{challenge.icon}</span>
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-lg font-bold mb-1 line-clamp-1'>
                      {challenge.title}
                    </h3>
                  </div>
                </div>

                {/* Minimal meta only */}
                <div className='flex items-center gap-3 mb-3 text-xs' style={{ color: 'var(--textSec)' }}>
                  <div className='px-2 py-1 rounded text-xs font-semibold' style={{ background: 'rgba(255,255,255,0.03)' }}>{challenge.category}</div>
                  <div className='px-2 py-1 rounded text-xs' style={{ background: 'rgba(255,255,255,0.03)' }}>{challenge.timeEstimate}</div>
                </div>

                {/* Badges */}
                <div className='flex flex-wrap gap-2 mb-5'>
                  { (challenge.difficulty || challenge.transformed?.difficulty) ? (
                    <Badge
                      type='difficulty'
                      difficulty={(challenge.transformed?.difficulty || challenge.difficulty || '').toLowerCase()}
                      size='sm'
                    >
                      {challenge.transformed?.difficulty || challenge.difficulty}
                    </Badge>
                  ) : (
                    <div className='px-2 py-1 rounded text-xs font-bold' style={{ color: 'var(--textSec)' }}>Loading...</div>
                  )}

                  <div
                    className='px-2 py-1 rounded text-xs font-bold'
                    style={{
                      background: 'rgba(255, 165, 0, 0.15)',
                      color: 'var(--brand)'
                    }}
                  >
                    +{challenge.points ?? '—'} pts
                  </div>

                  <div
                    className='px-2 py-1 rounded text-xs font-semibold'
                    style={{
                      background: 'rgba(255, 165, 0, 0.08)',
                      color: 'var(--textSec)'
                    }}
                  >
                    {challenge.category ?? '—'}
                  </div>
                </div>

                {/* Meta Info + CTA */}
                <div className='flex items-center justify-between pt-4 border-t' style={{ borderColor: 'var(--border)' }}>
                  <div className='flex items-center gap-2 text-xs' style={{ color: 'var(--textSec)' }}>
                    <Lock className='w-3 h-3' />
                    {challenge.timeEstimate}
                  </div>
                  <Button variant='secondary' size='sm' icon={ArrowRight} iconPosition='right' onClick={(e) => { e.stopPropagation(); if (challenge.raw) navigate(`/code-editor/${challenge.id}`, { state: { question: challenge.raw, language: 'cpp', sourceArea: 'recommended_challenge', collectionName: 'challengeCppQ' } }) }}>
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
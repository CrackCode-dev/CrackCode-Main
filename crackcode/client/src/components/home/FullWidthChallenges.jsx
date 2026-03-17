import { useState, useEffect } from 'react'
import { useTheme } from '../../context/theme/ThemeContext'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import InviteCard from './InviteCard'
import { ArrowRight, Flame, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { fetchChallengeCollection, transformProblemData } from '../../services/api/questionService'

// initial placeholders until data loads
const initialCases = [
  { difficulty: 'easy', difficultyLabel: 'Easy' },
  { difficulty: 'medium', difficultyLabel: 'Medium' },
  { difficulty: 'hard', difficultyLabel: 'Hard' },
]

function FullWidthChallenges() {
  useTheme() // Subscribe to theme changes for CSS variables
  const [hoveredId, setHoveredId] = useState(null)
  const [cases, setCases] = useState(initialCases)
  const navigate = useNavigate()

  // Map UI difficulty to backend difficulty keys
  const difficultyMap = { easy: 'easy', medium: 'intermediate', hard: 'hard' }

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const items = await fetchChallengeCollection('challengePythonQ')

        // pick one distinct item per difficulty (easy, medium/intermediate, hard)
        const usedIds = new Set()

        const mapped = initialCases.map((c) => {
          const wanted = difficultyMap[c.difficulty]

          // find candidates matching the wanted difficulty and not used yet
          const candidates = items.filter((it) => {
            const d = (it.difficulty || '').toLowerCase()
            const matches = wanted === 'intermediate' ? (d === 'intermediate' || d === 'medium') : d === wanted
            const id = it.problemId || it._id || ''
            return matches && !usedIds.has(id)
          })

          // fallback: any unused item
          let found = candidates[0]
          if (!found) {
            found = items.find((it) => {
              const id = it.problemId || it._id || ''
              return !usedIds.has(id)
            })
          }

          // final fallback: first item
          if (!found) found = items[0]

          if (!found) return { ...c, title: c.difficultyLabel + ' Case', description: 'No case available', id: `local-${c.difficulty}` }

          const id = found.problemId || found._id || ''
          usedIds.add(id)

          const transformed = transformProblemData(found, 'python')
          return {
            id: transformed.problemId || transformed.id,
            title: transformed.title,
            description: transformed.description,
            difficulty: transformed.difficulty || c.difficulty,
            difficultyLabel: c.difficultyLabel,
            points: transformed.starterCode ? 100 : 50,
            solved: false,
            popularity: found.popularity || 0,
            category: transformed.topic || c.category,
            timeEstimate: transformed.timeEstimate || c.timeEstimate || '10-15 min',
            raw: found,
            transformed,
          }
        })

        if (mounted) setCases(mapped)
      } catch (err) {
        console.error('Failed to load challenge cards', err)
      }
    }

    load()
    return () => { mounted = false }
  }, [])
  
  return (
    <div className='w-full' style={{ color: 'var(--text)' }}>
      {/* Other Challenges Section - Full Width */}
      <div className='mb-14 px-6 sm:px-10'>
        <div className='flex items-center justify-between mb-10'>
          <div>
            <h2 className='text-4xl font-bold mb-3'>Explore Challenges</h2>
            <p style={{ color: 'var(--textSec)' }} className='text-base'>Master your coding skills with our curated challenges</p>
          </div>
          <Flame className='w-8 h-8' style={{ color: 'var(--brand)' }} />
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              onMouseEnter={() => setHoveredId(caseItem.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                // navigate to code editor and pre-load question data when available
                if (caseItem.raw && (caseItem.transformed?.problemId || caseItem.id)) {
                  const targetId = caseItem.transformed?.problemId || caseItem.id
                  // pass raw DB object so the editor hook can call transformProblemData
                  navigate(`/code-editor/${targetId}`, { state: { question: caseItem.raw, language: 'python' } })
                } else if (caseItem.transformed && caseItem.transformed.problemId) {
                  navigate(`/code-editor/${caseItem.transformed.problemId}`, { state: { question: caseItem.transformed, language: 'python' } })
                } else {
                  // fallback: open editor without preloaded question
                  navigate('/code-editor')
                }
              }}
              className='relative rounded-lg p-6 transition-all duration-300 cursor-pointer group overflow-hidden'
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                boxShadow: hoveredId === caseItem.id ? '0 10px 30px rgba(255, 165, 0, 0.15)' : 'none',
                transform: hoveredId === caseItem.id ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              {/* Background accent */}
              <div
                className='absolute top-0 left-0 w-1 h-full transition-all duration-300'
                style={{
                  background: 'var(--brand)',
                  width: hoveredId === caseItem.id ? '4px' : '1px'
                }}
              />
              
              {/* Top badge section */}
              <div className='flex justify-between items-start mb-4'>
                <Badge
                  type='difficulty'
                  difficulty={caseItem.difficulty}
                  size='sm'
                >
                  {caseItem.difficultyLabel}
                </Badge>
                {caseItem.solved && (
                  <div className='px-2 py-1 rounded text-xs font-bold' style={{ background: 'rgba(82, 200, 130, 0.2)', color: '#52c882' }}>
                    ✓ Solved
                  </div>
                )}
              </div>
              
              {/* Content - only show title on card; full description opens in editor */}
              <div className='mb-5'>
                <h3 className='text-xl font-bold mb-1 group-hover:text-opacity-90 transition-all break-words'>{caseItem.title}</h3>
                <p style={{ color: 'var(--textSec)' }} className='text-sm mb-4'>
                  {caseItem.timeEstimate} • {caseItem.popularity} attempts
                </p>
              </div>
              
              {/* Meta Info */}
              <div className='flex flex-wrap gap-2 mb-6 text-sm' style={{ color: 'var(--textSec)' }}>
                <span className='flex items-center gap-1'>
                  <Lock className='w-4 h-4' />
                  {caseItem.timeEstimate}
                </span>
                <span>•</span>
                <span>{caseItem.popularity} attempts</span>
              </div>
              
              {/* Footer with CTA */}
              <div className='flex items-center justify-between pt-5' style={{ borderTop: '1px solid var(--border)' }}>
                <div>
                  <p className='text-xs' style={{ color: 'var(--textSec)' }}>Earn Points</p>
                  <p className='text-2xl font-bold' style={{ color: 'var(--brand)' }}>+{caseItem.points}</p>
                </div>
                {/* <button 
                  className='px-6 py-3 rounded-lg font-bold text-base transition-all duration-300 flex items-center gap-2 group/btn'
                  style={{
                    background: hoveredId === caseItem.id ? 'var(--brand)' : 'rgba(255, 165, 0, 0.1)',
                    color: hoveredId === caseItem.id ? 'var(--surface)' : 'var(--brand)',
                    border: '1px solid var(--brand)'
                  }}
                >
                  Start
                  <ArrowRight className='w-5 h-5 transition-transform group-hover/btn:translate-x-1' />
                </button> */}
                <Button variant='secondary' size='md' icon={ArrowRight} iconPosition='right'>
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Card - Full Width - Compact */}
      <div className='mb-6 px-6 sm:px-10'>
        <InviteCard />
      </div>
    </div>
  )
}

export default FullWidthChallenges

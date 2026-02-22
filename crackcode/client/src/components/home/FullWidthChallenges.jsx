import { useState } from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import InviteCard from './InviteCard'
import { ArrowRight, Flame, Lock } from 'lucide-react'

// Backend-compatible Q card structure
const cases = [
    {
        id: 'q-001',
        title: 'The Sum Mystery', 
        description: 'A crucial set of data has been stolen and scattered through arrays. Track each piece and reconstruct what was taken.',
        difficulty: 'easy',
        difficultyLabel: 'Easy',
        points: 100,
        solved: false,
        popularity: 234,
        category: 'arrays',
        timeEstimate: '5-10 min'
    },
    {
        id: 'q-002',
        title: 'The Missing Evidence',
        description: 'Find the missing piece of evidence in a sequence of numbered items.',
        difficulty: 'medium',
        difficultyLabel: 'Medium',
        points: 150,
        solved: false,
        popularity: 189,
        category: 'sequences',
        timeEstimate: '10-15 min'
    },
    {
        id: 'q-003',
        title: 'Duplicate Case',
        description: 'Identify duplicate clues in the evidence collection.',
        difficulty: 'hard',
        difficultyLabel: 'Hard',
        points: 250,
        solved: false,
        popularity: 156,
        category: 'hashing',
        timeEstimate: '15-20 min'
    }    
];

function FullWidthChallenges() {
  const [hoveredId, setHoveredId] = useState(null)
  
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
              
              {/* Content */}
              <div className='mb-5'>
                <h3 className='text-xl font-bold mb-3 group-hover:text-opacity-90 transition-all break-words'>{caseItem.title}</h3>
                <p style={{ color: 'var(--textSec)' }} className='text-base mb-4 line-clamp-2 leading-relaxed'>
                  {caseItem.description}
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
                <button 
                  className='px-6 py-3 rounded-lg font-bold text-base transition-all duration-300 flex items-center gap-2 group/btn'
                  style={{
                    background: hoveredId === caseItem.id ? 'var(--brand)' : 'rgba(255, 165, 0, 0.1)',
                    color: hoveredId === caseItem.id ? 'var(--surface)' : 'var(--brand)',
                    border: '1px solid var(--brand)'
                  }}
                >
                  Start
                  <ArrowRight className='w-5 h-5 transition-transform group-hover/btn:translate-x-1' />
                </button>
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

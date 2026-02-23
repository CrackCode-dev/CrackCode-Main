import { useTheme } from '../../context/theme/ThemeContext'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import CarouselFeatures from './CarouselFeatures'
import DailyChallenge from './DailyChallenge'
import InviteCard from './InviteCard'

const cases = [
    {
        title: 'The Sum Mystery', 
        description: 'A crucial set of data has been stolen and scattered through arrays. Track each piece and reconstruct what was taken.',
        difficulty: 'easy',
        difficultyLabel: 'Easy',
        points: '+100 pts'
    },
    {
        title: 'The Missing Evidence',
        description: 'Find the missing piece of evidence in a sequence of numbered items.',
        difficulty: 'medium',
        difficultyLabel: 'Medium',
        points: '+150 pts'
    },
    {
        title: 'Duplicate Case',
        description: 'Identify duplicate clues in the evidence collection.',
        difficulty: 'hard',
        difficultyLabel: 'Hard',
        points: '+250 pts'
    }    
];

function ContentArea() {
  const { theme } = useTheme()
  
  return (
    <div className='grow px-5 min-w-0' style={{ color: 'var(--text)' }}>
      {/* Welcome Section */}
      <div className='mb-8'>
        <h1 className='text-4xl font-bold mb-2'>Welcome Back, Detective! 🔍</h1>
        <p style={{ color: 'var(--textSec)' }} className='text-base'>
          Ready to solve more mysteries and climb the leaderboard?
        </p>
      </div>

      {/* Carousel Features Section */}
      <div className='mb-10 min-w-0'>
        <CarouselFeatures />
      </div>

      {/* Daily Challenge Section */}
      <div className='mb-10'>
        <DailyChallenge />
      </div>

      {/* Other Challenges Section */}
      <div className='mb-10'>
        <h2 className='text-2xl font-bold text-left mb-6'>Other Challenges</h2>
        
        <div className='flex gap-6 overflow-x-auto pb-4'>
          {cases.map((caseItem, index) => (
            <div
              key={index}
              className='rounded-lg p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex-shrink-0'
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                minWidth: '300px'
              }}
            >
              <div className='flex justify-between items-start mb-4'>
                <div className='flex-1 min-w-0'>
                  <h3 className='text-xl font-bold mb-2 break-words'>{caseItem.title}</h3>
                  <p style={{ color: 'var(--textSec)' }} className='text-sm mb-4 break-words'>
                    {caseItem.description}
                  </p>
                </div>
              </div>
              
              <div className='flex items-center justify-between gap-4 flex-wrap'>
                <div className='flex gap-2'>
                  <Badge
                    type='difficulty'
                    difficulty={caseItem.difficulty}
                    size='md'
                  >
                    {caseItem.difficultyLabel}
                  </Badge>
                  <Badge type='default' size='md'>
                    {caseItem.points}
                  </Badge>
                </div>
                <Button 
                  variant='primary'
                  className='px-6 py-2 rounded-lg font-semibold transition-all duration-300'
                >
                  Investigate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Card at Footer */}
      <div className='mb-6'>
        <InviteCard />
      </div>
    </div>
  )
}

export default ContentArea

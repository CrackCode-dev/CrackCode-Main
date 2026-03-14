import { useTheme } from '../../context/theme/ThemeContext'
import CarouselFeatures from './CarouselFeatures'
import DailyChallenge from './DailyChallenge'
import { Sparkles } from 'lucide-react'

function TopContentArea() {
  useTheme() // Subscribe to theme changes for CSS variables
  
  return (
    <div className='grow px-6 min-w-0 flex flex-col' style={{ color: 'var(--text)' }}>
      {/* Welcome Section - Enhanced */}
      <div className='mb-12 p-8 rounded-lg transition-all duration-300' style={{ background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.08) 0%, rgba(255, 165, 0, 0.02) 100%)', border: '1px solid rgba(255, 165, 0, 0.2)' }}>
        <div className='flex items-start justify-between'>
          <div>
            <div className='flex items-center gap-3 mb-3'>
              <Sparkles className='w-6 h-6' style={{ color: 'var(--brand)' }} />
              <span className='text-sm font-bold uppercase tracking-wide' style={{ color: 'var(--brand)' }}>Welcome Back</span>
            </div>
            <h1 className='text-5xl font-bold mb-4'>Hello, Detective!</h1>
              <p style={{ color: 'var(--textSec)' }} className='text-lg max-w-2xl leading-relaxed text-justify'>
                Keep solving mysteries every case counts. Track your progress on the Activity Calendar or the Leaderboard and climb higher with each win.
              </p>
          </div>
        </div>
      </div>

      {/* Carousel Features Section */}
      <div className='mb-12 min-w-0'>
        <CarouselFeatures />
      </div>

      {/* Daily Challenge Section */}
      <div className='mb-8'>
        <DailyChallenge />
      </div>
    </div>
  )
}

export default TopContentArea

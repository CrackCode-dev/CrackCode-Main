/* react hooks imported below */
import HeroSection from '../../components/landing/HeroSection'
import AITechSection from '../../components/landing/AITechSection'
import CareerMapSection from '../../components/landing/CareerMapSection'
import WhyCrackCodeSection from '../../components/landing/WhyCrackCodeSection'
import LetterGlitch from '../../components/bgEffect/LetterGlitch'
import { LandingThemeProvider, useLandingTheme } from './LandingThemeContext'
import { useEffect } from 'react'

function LandingInner() {
  const { landingTheme, setLandingTheme } = useLandingTheme()

  useEffect(() => {
    // Ensure page starts at the very top
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='relative w-full overflow-x-hidden min-h-screen'>
      {/* Light/Dark toggle */}
      <div className='fixed top-5 right-5 z-100'>
        <button
          onClick={() => setLandingTheme(landingTheme === 'light' ? 'dark' : 'light')}
          aria-label='Toggle theme'
          title='Toggle light / dark'
          className='w-12 h-8 rounded-full flex items-center p-1 bg-white/10 text-white backdrop-blur-sm'
          style={{ color: landingTheme === 'light' ? '#000000' : '#FFFFFF' }}
        >
          {landingTheme === 'light' ? (
            <svg className='w-6 h-6 ml-1' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
              <path d='M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
              <circle cx='12' cy='12' r='3' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            ) : (
            <svg className='w-6 h-6 ml-1' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
              <path d='M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'/>
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      <div className='relative z-5'>
        <HeroSection />
        <AITechSection />
        <CareerMapSection />
        <WhyCrackCodeSection />
      </div>
    </div>
  )
}

function Landing() {
  return (
    <LandingThemeProvider>
      <LandingInner />
    </LandingThemeProvider>
  )
}

export default Landing
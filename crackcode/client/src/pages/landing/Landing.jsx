/* react hooks imported below */
import { motion } from 'framer-motion'
import HeroSection from '../../components/landing/HeroSection'
import AITechSection from '../../components/landing/AITechSection'
import CareerMapSection from '../../components/landing/CareerMapSection'
import WhyCrackCodeSection from '../../components/landing/WhyCrackCodeSection'
import { LandingThemeProvider, useLandingTheme, resolveLandingVars } from './LandingThemeContext'
import { useEffect } from 'react'
import LetterGlitch from '../../components/landing/LetterGlitch'

function LandingInner() {
  const { landingTheme, setLandingTheme } = useLandingTheme()
  const vars = resolveLandingVars(landingTheme)

  useEffect(() => {
    // Ensure page starts at the very top
    window.scrollTo(0, 0)
  }, [])

  const rootStyle = {
    background: `linear-gradient(180deg, ${vars.from}, ${vars.via}, ${vars.to})`,
    fontSize: 'clamp(16px, 1.6vw + 12px, 20px)'
  }

  const motionBg = {
    background: `linear-gradient(135deg, ${vars.from}, ${vars.via}, ${vars.to})`,
    backgroundSize: '200% 200%',
  }

  return (
    <div className='relative w-full overflow-x-hidden min-h-screen' style={rootStyle}>
      {/* Light/Dark toggle */}
      <div className='fixed top-5 right-5 z-50'>
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

      {/* Animated gradient background */}
      <motion.div
        className='fixed inset-0 -z-10'
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={motionBg}
      />

      {/* Ambient glowing orbs */}
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <motion.div
          className='absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-10'
          style={{ background: vars.orb }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute bottom-32 right-20 w-96 h-96 rounded-full blur-3xl opacity-5'
          style={{ background: vars.orb }}
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute top-1/2 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-5'
          style={{ background: vars.orb }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div className='relative z-10'>
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

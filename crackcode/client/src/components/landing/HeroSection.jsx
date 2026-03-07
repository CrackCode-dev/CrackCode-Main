import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Brain, Code, Zap, Users, ArrowDown } from 'lucide-react'
import { useLandingTheme, resolveLandingVars } from '../../pages/landing/LandingThemeContext'
import { cardHoverEffects, animationConfig } from './hoverEffects'
import Button from '../ui/Button'
import LetterGlitch from './LetterGlitch'

export default function HeroSection() {
    const navigate = useNavigate()
    const { landingTheme } = useLandingTheme()
    const vars = resolveLandingVars(landingTheme)

    const features = [
        { icon: Brain, label: 'AI-Powered' },
        { icon: Code, label: 'Real Cases' },
        { icon: Zap, label: 'Instant Feedback' },
        { icon: Users, label: 'Community' }
    ]

    // Theme-aware glitch colors
    const glitchColors = landingTheme === 'light'
        ? ['#ff6b35', '#f7c244', '#61b3dc', '#61dca3', '#e63946']
        : ['#ff6b35', '#f7c244', '#61b3dc', '#61dca3', '#2b4539']

    const panelBg = vars.from

    return (
        <section className='relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden'>

            {/* ===== LEFT — LetterGlitch background ===== */}
            <div className='relative w-full lg:w-1/3 min-h-[40vh] lg:min-h-screen'>
                <div className='absolute inset-0 z-0'>
                    <LetterGlitch
                        glitchColors={glitchColors}
                        glitchSpeed={100}
                        smooth={true}
                        outerVignette={false}
                        centerVignette={false}
                        backgroundColor={vars.from}
                    />
                </div>

                {/* Desktop: horizontal fade into the right panel */}
                <div
                    className='absolute top-0 right-0 w-24 h-full z-10 pointer-events-none hidden lg:block'
                    style={{
                        background: `linear-gradient(to right, transparent, ${panelBg})`
                    }}
                />

                {/* Mobile: bottom fade so glitch doesn't hard-cut into content below */}
                <div
                    className='absolute bottom-0 left-0 w-full h-24 z-10 pointer-events-none lg:hidden'
                    style={{
                        background: `linear-gradient(to bottom, transparent, ${panelBg})`
                    }}
                />
            </div>

            {/* ===== RIGHT — Solid content panel ===== */}
            <div
                className='relative w-full lg:w-2/3 min-h-screen flex items-center z-10'
                style={{ background: panelBg }}
            >
                <div className='w-full max-w-4xl mx-auto px-8 md:px-12 py-16 lg:py-0'>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight'
                        style={{ color: vars.text }}
                    >
                        Learn Code <br className='hidden sm:block' />
                        Through <br />
                        <span style={{ color: vars.brand }}>Detective Stories</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className='text-base md:text-lg mb-10 leading-relaxed'
                        style={{ color: landingTheme === 'light' ? '#334155' : 'rgba(255,255,255,0.85)' }}
                    >
                        Solve coding challenges, compete with others, and build your portfolio with real-world detective cases.
                    </motion.p>

                    {/* Feature Tags */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='flex flex-wrap gap-3 mb-10'
                    >
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <motion.div
                                    key={index}
                                    className='flex items-center gap-2 px-4 py-2 rounded-full border shadow-md backdrop-blur cursor-pointer transition-all duration-300'
                                    style={{
                                        background: landingTheme === 'light' ? vars.cardBgLight : vars.cardBgDark,
                                        borderColor: vars.rim
                                    }}
                                    whileHover={animationConfig.tagHover}
                                    transition={animationConfig.cardHover}
                                    onMouseEnter={(e) => cardHoverEffects.onTagHover(e.currentTarget, vars, landingTheme)}
                                    onMouseLeave={(e) => cardHoverEffects.onTagLeave(e.currentTarget, vars, landingTheme)}
                                >
                                    <Icon className='w-4 h-4 transition-transform duration-300' style={{ color: vars.brand }} />
                                    <span className='text-sm font-medium' style={{ color: vars.text }}>{feature.label}</span>
                                </motion.div>
                            )
                        })}
                    </motion.div>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className='flex flex-col sm:flex-row gap-4 mb-12'
                    >
                        <Button onClick={() => navigate('/login')} variant='primary' size='xl' icon={Zap} iconPosition='right'>
                            Get Started
                        </Button>

                        <Button variant='secondary' size='xl' onClick={() => navigate('/home')} icon={Users} iconPosition='right' className='text-black'>
                            Learn More
                        </Button>
                    </motion.div>

                    {/* Scroll indicator */}
                    {/* <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className='flex items-center gap-2 cursor-pointer group'
                    >
                        <ArrowDown className='w-5 h-5 transition-all duration-300 group-hover:scale-125' style={{ color: vars.via }} />
                        <span className='text-sm' style={{ color: landingTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)' }}>
                            Scroll to explore
                        </span>
                    </motion.div> */}
                </div>
            </div>
        </section>
    )
}
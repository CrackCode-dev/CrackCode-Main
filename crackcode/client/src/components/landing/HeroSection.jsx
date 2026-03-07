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

    // Use theme background color
    const sectionStyle = { background: vars.from }

    return (
        <section style={sectionStyle} className='relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-12'>
            {/* Simple background blobs */}
            
            

            <div className='relative z-10 w-full max-w-4xl mx-auto px-6'>
                {/* Main Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight text-center'
                    style={{ color: vars.text }}
                >
                    Learn Code Through <br />
                    <span style={{ color: vars.brand }}>{'Detective Stories'}</span>
                </motion.h1>

                {/* Brief Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className='text-lg max-w-2xl mx-auto mb-12 text-center'
                    style={{ color: landingTheme === 'light' ? '#334155' : 'rgba(255,255,255,0.9)' }}
                >
                    Solve coding challenges, compete with others, and build your portfolio with real-world detective cases.
                </motion.p>

                {/* Feature Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className='flex flex-wrap gap-3 justify-center mb-12'
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className='flex flex-col sm:flex-row gap-4 justify-center mb-16'
                >
                    {/* <motion.button
                        onClick={() => navigate('/login')}
                        className='px-8 py-3 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-2xl'
                        style={{
                            background: `linear-gradient(90deg, ${vars.btnStart}, ${vars.btnEnd})`,
                            color: vars.btnText
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        Get Started
                    </motion.button> */}

                    <Button onClick={() => navigate('/login')} variant='primary' size='xl' icon={Zap} iconPosition='right'>
                        Get Started
                    </Button>

                    {/* <motion.button
                        onClick={() => navigate('/home')}
                        className='px-8 py-3 border-2 font-semibold rounded-lg transition-all shadow-md hover:shadow-xl backdrop-blur'
                        style={{ 
                            borderColor: vars.rim, 
                            color: vars.text,
                            backgroundColor: `rgba(255,150,68,0.05)`
                        }}
                        whileHover={animationConfig.buttonHover}
                        whileTap={animationConfig.buttonTap}
                        transition={animationConfig.cardHover}
                        onMouseEnter={(e) => cardHoverEffects.onButtonHover(e.currentTarget, vars, landingTheme)}
                        onMouseLeave={(e) => cardHoverEffects.onButtonLeave(e.currentTarget, vars)}
                    >
                        Learn More
                    </motion.button> */}

                    <Button variant='secondary' size='xl' onClick={() => navigate('/home')} icon={Users} iconPosition='right' className='text-black'>
                        Learn More
                    </Button>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='flex justify-center gap-2 cursor-pointer group'
                    whileHover={{ scale: 1.1 }}
                >
                    <ArrowDown className='w-5 h-5 transition-all duration-300 group-hover:scale-125' style={{ color: vars.via }} />
                </motion.div>
            </div>
        </section>
    )
}

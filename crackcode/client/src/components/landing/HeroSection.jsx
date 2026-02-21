import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Brain, Code, Zap, Users, ArrowDown } from 'lucide-react'
import { useLandingTheme, resolveLandingVars } from '../../pages/landing/LandingThemeContext'

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

    // Use the app root background so landing matches other pages
    const sectionStyle = { background: 'var(--bg)' }

    return (
        <section style={sectionStyle} className='relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-12'>
            {/* Simple background blobs */}
            <div className='absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none' style={{ background: vars.via }} />
            <div className='absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none' style={{ background: vars.from }} />

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
                                <div
                                    key={index}
                                    className='flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm backdrop-blur'
                                    style={{
                                        background: landingTheme === 'light' ? vars.cardBgLight : vars.cardBgDark,
                                        borderColor: vars.rim
                                    }}
                                >
                                    <Icon className='w-4 h-4' style={{ color: vars.brand }} />
                                    <span className='text-sm font-medium' style={{ color: vars.text }}>{feature.label}</span>
                                </div>
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
                    <button
                        onClick={() => navigate('/login')}
                        className='px-8 py-3 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg'
                        style={{
                            background: `linear-gradient(90deg, ${vars.btnStart}, ${vars.btnEnd})`,
                            color: vars.btnText
                        }}
                    >
                        Get Started
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className='px-8 py-3 border-2 font-semibold rounded-lg hover:bg-white/5 transition-all shadow-md hover:shadow-lg'
                        style={{ borderColor: vars.rim, color: vars.text }}
                    >
                        Learn More
                    </button>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='flex justify-center gap-2'
                >
                    <ArrowDown className='w-5 h-5' style={{ color: vars.via }} />
                </motion.div>
            </div>
        </section>
    )
}

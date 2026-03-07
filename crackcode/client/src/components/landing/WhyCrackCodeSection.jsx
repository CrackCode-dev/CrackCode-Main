import { motion } from 'framer-motion'
import { Gamepad2, Brain, Globe, Trophy, Zap, Users } from 'lucide-react'
import { useLandingTheme, resolveLandingVars } from '../../pages/landing/LandingThemeContext'
import { cardHoverEffects, animationConfig } from './hoverEffects'
import Button from '../ui/Button'

export default function WhyCrackCodeSection() {
    const { landingTheme } = useLandingTheme()
    const vars = resolveLandingVars(landingTheme)

    const hexToRgba = (hex, alpha = 1) => {
        const h = hex.replace('#', '')
        const bigint = parseInt(h, 16)
        const r = (bigint >> 16) & 255
        const g = (bigint >> 8) & 255
        const b = bigint & 255
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    const features = [
        {
            icon: Gamepad2,
            title: 'Gamified Learning',
            description: 'Earn badges, climb ranks, and compete with peers. Turn coding challenges into an engaging detective mystery.'
        },
        {
            icon: Brain,
            title: 'AI-Powered Guidance',
            description: 'Get intelligent hints and explanations as you code. Our AI assistant helps you learn, not just solve.'
        },
        {
            icon: Globe,
            title: 'Real-World Scenarios',
            description: 'Solve problems inspired by actual bugs and challenges from production codebases.'
        },
        {
            icon: Trophy,
            title: 'Career Readiness',
            description: 'Build a portfolio of solved cases and skills that matter to top tech companies.'
        },
        {
            icon: Zap,
            title: 'Instant Feedback',
            description: 'Run tests on your code instantly and get detailed explanations of failures.'
        },
        {
            icon: Users,
            title: 'Community Support',
            description: 'Learn from discussions, share solutions, and grow with thousands of detectives worldwide.'
        }
    ]

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0
            }
        }
    }

    const featureVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    // Use theme background color
    const sectionStyle = { background: vars.from }

    // card background depends on theme but prefer resolved vars
    const cardBg = landingTheme === 'light' ? vars.cardBgLight : vars.cardBgDark
    const secondaryText = landingTheme === 'light' ? (vars.textSec || '#334155') : (vars.textSec || 'rgba(255,255,255,0.8)')

    return (
        <section style={sectionStyle} className='relative w-full py-20 md:py-32 overflow-hidden'>
            {/* Decorative background elements */}
            <div className='absolute top-0 left-0 w-96 h-96 rounded-full filter blur-3xl opacity-10' style={{ background: vars.via }} />
            <div className='absolute bottom-0 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-10' style={{ background: vars.from }} />

            <div className='relative z-10 container mx-auto px-6 md:px-10'>
                {/* Section Header */}
                <motion.div
                    className='text-center mb-16 md:mb-24'
                    variants={staggerContainer}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.span
                        variants={fadeInUp}
                        className='inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4'
                        style={{ background: hexToRgba(vars.via, 0.12), color: vars.text }}
                    >
                        Why Choose CrackCode?
                    </motion.span>

                    <motion.h2
                        variants={fadeInUp}
                        className='text-4xl md:text-6xl font-bold mb-6 leading-tight'
                        style={{ color: vars.text }}
                    >
                        A Smarter Way to <br />
                        <span>Master Coding</span>
                    </motion.h2>

                    <motion.p
                        variants={fadeInUp}
                        className='text-lg max-w-2xl mx-auto leading-relaxed'
                        style={{ color: secondaryText }}
                    >
                        We combine the thrill of detective work with practical coding education to create an unforgettable learning journey.
                    </motion.p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'
                    variants={staggerContainer}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={index}
                                variants={featureVariant}
                                className='relative h-full'
                                whileHover={{ y: -10, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-400' style={{ background: `linear-gradient(135deg, ${hexToRgba(vars.via, 0.15)}, ${hexToRgba(vars.from, 0.08)})` }} />

                                <div className='relative p-8 rounded-2xl border transition-all duration-300 h-full flex flex-col justify-between group shadow-md hover:shadow-2xl' style={{ background: cardBg, borderColor: vars.rim || (landingTheme === 'light' ? '#E6E6E6' : 'rgba(255,255,255,0.06)') }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = vars.brand; e.currentTarget.style.background = landingTheme === 'light' ? 'rgba(255,200,124,0.12)' : 'rgba(255,150,68,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = vars.rim || (landingTheme === 'light' ? '#E6E6E6' : 'rgba(255,255,255,0.06)'); e.currentTarget.style.background = cardBg; }}>
                                    {/* Icon container + Content */}
                                    <div>
                                        <div className='w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-xl transition-all duration-300' style={{ background: `linear-gradient(135deg, ${hexToRgba(vars.via, 0.15)}, ${hexToRgba(vars.from, 0.1)})` }}>
                                            <Icon className='w-8 h-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300' style={{ color: vars.brand }} />
                                        </div>

                                        <h3 className='text-xl font-bold mb-3' style={{ color: vars.text }}>
                                            {feature.title}
                                        </h3>
                                        <p className='leading-relaxed' style={{ color: secondaryText }}>
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Decorative accent */}
                                    <div className='absolute right-3 top-3 bottom-3 w-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300' style={{ background: `linear-gradient(to bottom, ${vars.btnStart}, ${vars.btnEnd})` }} />
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    className='mt-20 text-center'
                    variants={fadeInUp}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <p className='mb-8 text-lg' style={{ color: secondaryText }}>
                        Ready to become a Code Detective?
                    </p>
                    <Button onClick={() => navigate('/login')} variant='primary' size='xl' icon={Zap} iconPosition='right'>
                        Start Your Investigation
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}

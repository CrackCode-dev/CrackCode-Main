import { motion } from 'framer-motion'
import { MapPin, Compass, Target, Users, TrendingUp, Code2 } from 'lucide-react'
import { useLandingTheme, resolveLandingVars } from '../../pages/landing/LandingThemeContext'
import { cardHoverEffects, animationConfig } from './hoverEffects'
import CareerPath from '../../assets/videos/careerPath.mp4'

export default function CareerMapSection() {
    const careerPaths = [
        {
            icon: Code2,
            title: 'Frontend Detective',
            description: 'Master UI/UX and responsive design'
        },
        {
            icon: Compass,
            title: 'Backend Investigator',
            description: 'Build robust server architectures'
        },
        {
            icon: TrendingUp,
            title: 'Full-Stack Detective',
            description: 'Become a complete developer'
        },
        {
            icon: Target,
            title: 'Data Detective',
            description: 'Solve complex data challenges'
        }
    ]

    const features = [
        {
            icon: MapPin,
            title: 'Guided Career Paths',
            description: 'Follow structured learning roadmaps tailored to your goals.'
        },
        {
            icon: TrendingUp,
            title: 'Interview Patterns',
            description: 'Practice with real interview questions from top companies.'
        },
        {
            icon: Target,
            title: 'Portfolio Building',
            description: 'Build a portfolio that impresses hiring managers.'
        },
        {
            icon: Users,
            title: 'Community Support',
            description: 'Connect with mentors and peers on your journey.'
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
                delayChildren: 0.2
            }
        }
    }

    const cardVariant = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
    }

    const { landingTheme } = useLandingTheme()
    const vars = resolveLandingVars(landingTheme)

    // Use theme background color
    const sectionStyle = { background: vars.via2 }

    return (
        <section className='relative w-full py-20 md:py-32 overflow-hidden' style={sectionStyle}>
            {/* Background decoration */}
            <div className='absolute top-0 left-0 w-96 h-96 rounded-full opacity-8 blur-3xl' style={{ background: vars.via }} />
            <div className='absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-8 blur-3xl' style={{ background: vars.from }} />

            <div className='relative z-10 container mx-auto px-6 md:px-10'>
                {/* Career Paths Question Section */}
                <motion.div
                    className='mb-20 md:mb-32'
                    variants={staggerContainer}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.h2 variants={fadeInUp} className='text-3xl md:text-4xl font-bold text-center mb-12 leading-tight' style={{ color: vars.text }}>
                        Confused Where You Want to Land<br />
                        in the IT Industry?
                    </motion.h2>

                    {/* Career paths grid */}
                    <motion.div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' variants={staggerContainer}>
                        {careerPaths.map((path, index) => {
                            const Icon = path.icon
                            return (
                                <motion.div
                                    key={index}
                                    variants={cardVariant}
                                    className='group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur shadow-md hover:shadow-2xl'
                                    whileHover={animationConfig.cardLift}
                                    transition={animationConfig.cardHover}
                                    style={{
                                        background: landingTheme === 'light' ? vars.cardBgLight : vars.cardBgDark,
                                        borderColor: vars.rim
                                    }}
                                    onMouseEnter={(e) => cardHoverEffects.onCardHover(e.currentTarget, vars, landingTheme)}
                                    onMouseLeave={(e) => cardHoverEffects.onCardLeave(e.currentTarget, vars, landingTheme === 'light' ? vars.cardBgLight : vars.cardBgDark, landingTheme)}
                                >
                                    <div className='h-full flex flex-col items-center text-center'>
                                        <Icon className='w-10 h-10 mb-4 group-hover:scale-135 group-hover:rotate-12 transition-all duration-300' style={{ color: vars.brand }} />
                                        <h3 className='font-bold mb-2 transition-colors' style={{ color: vars.text }}>
                                            {path.title}
                                        </h3>
                                        <p className='text-sm transition-colors' style={{ color: landingTheme === 'light' ? '#475569' : 'rgba(255,255,255,0.75)' }}>
                                            {path.description}
                                        </p>
                                    </div>

                                    {/* Side accent on hover */}
                                    <div
                                        className='absolute right-3 top-3 bottom-3 w-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                        style={{ background: `linear-gradient(to bottom, ${vars.btnStart}, ${vars.btnEnd})` }}
                                    />
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </motion.div>

                {/* Main features section */}
                <motion.div
                    className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch'
                    variants={staggerContainer}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {/* Right column - Video placeholder (left in layout) */}
                    <motion.div
                        variants={fadeInUp}
                        className='relative hidden lg:flex items-center justify-center order-2 lg:order-1'
                    >
                        <div className='w-full h-full min-h-100 rounded-3xl overflow-hidden shadow-2xl'>
                            <div className='w-full h-full flex items-center justify-center relative' style={{ background: `linear-gradient(135deg, ${vars.btnStart}, ${vars.btnEnd})` }}>
                                <video
                                    src={CareerPath}
                                    autoPlay
                                    loop
                                    muted
                                    className='w-full h-full object-cover'
                                />

                            </div>
                        </div>
                    </motion.div>

                    {/* Left column - Cards (right in layout) */}
                    <motion.div className='flex flex-col gap-6 order-1 lg:order-2' >
                        <motion.div variants={fadeInUp}>
                            <h3 className='text-4xl md:text-5xl font-bold mb-4 leading-tight' style={{ color: vars.text }}>
                                Your Career <br />
                                <span style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', backgroundImage: `linear-gradient(90deg, ${vars.btnStart}, ${vars.btnEnd})` }}>
                                    Roadmap
                                </span>
                            </h3>
                            <p className='text-lg leading-relaxed' style={{ color: landingTheme === 'light' ? '#475569' : 'rgba(255,255,255,0.8)' }}>
                                Structured paths to help you reach your professional goals.
                            </p>
                        </motion.div>

                        <motion.div
                            className='grid grid-cols-1 sm:grid-cols-2 gap-4'
                            variants={staggerContainer}
                        >
                            {features.map((feature, index) => {
                                const Icon = feature.icon
                                return (
                                    <motion.div
                                        key={index}
                                        variants={cardVariant}
                                        className='group relative h-32 p-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden shadow-md hover:shadow-xl'
                                        whileHover={animationConfig.cardLift}
                                        transition={animationConfig.cardHover}
                                        style={{ background: landingTheme === 'light' ? vars.cardBgLight : vars.cardBgDark, borderColor: vars.rim }}
                                        onMouseEnter={(e) => cardHoverEffects.onCardHover(e.currentTarget, vars, landingTheme)}
                                        onMouseLeave={(e) => cardHoverEffects.onCardLeave(e.currentTarget, vars, landingTheme === 'light' ? vars.cardBgLight : vars.cardBgDark, landingTheme)}
                                    >
                                        {/* Background glow on hover */}
                                        <div className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300' style={{ background: `linear-gradient(180deg, ${vars.btnStart}11, ${vars.btnEnd}08)` }} />

                                        {/* Icon area */}
                                        <div className='relative flex flex-col h-full justify-between'>
                                            <Icon className='w-6 h-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300' style={{ color: vars.brand }} />

                                            {/* Title and description */}
                                            <div className='flex flex-col gap-1'>
                                                <h4 className='text-sm font-bold line-clamp-2' style={{ color: vars.text }}>
                                                    {feature.title}
                                                </h4>
                                                <p className='text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2' style={{ color: landingTheme === 'light' ? '#475569' : 'rgba(255,255,255,0.76)' }}>
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Hover accent line */}
                                        <div className='absolute right-3 top-3 bottom-3 w-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300' style={{ background: `linear-gradient(to bottom, ${vars.btnStart}, ${vars.btnEnd})` }} />
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

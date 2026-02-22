import { motion } from 'framer-motion'
import { AlertCircle, MessageSquare, Clock, BarChart3 } from 'lucide-react'
import { useLandingTheme, resolveLandingVars } from '../../pages/landing/LandingThemeContext'
import { cardHoverEffects, animationConfig } from './hoverEffects'

export default function AITechSection() {
    const features = [
        {
            icon: AlertCircle,
            title: 'AI Error Diagnosis',
            description: 'Our AI automatically detects bugs and suggests fixes instantly.'
        },
        {
            icon: MessageSquare,
            title: 'AI Assistants',
            description: 'Chat with an AI mentor for real-time coding guidance and explanations.'
        },
        {
            icon: Clock,
            title: 'Error History',
            description: 'View your complete error log and track your learning progress.'
        },
        {
            icon: BarChart3,
            title: 'Performance Metrics',
            description: 'See detailed analytics on your coding skills and improvements.'
        }
    ]
    const { landingTheme } = useLandingTheme()
    const vars = resolveLandingVars(landingTheme)

    // Use theme background color
    const sectionStyle = { background: vars.from }

    return (

        <section style={sectionStyle} className='relative w-full py-8 md:py-12 overflow-hidden'>
            {/* Light background blobs */}
            <div className='absolute top-0 right-0 w-80 h-80 rounded-full opacity-8 blur-3xl' style={{ background: vars.via }} />
            <div className='absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-8 blur-3xl' style={{ background: vars.from }} />

            <div className='relative z-10 container mx-auto px-6'>
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className='mb-12'
                >
                    <h2 className='text-4xl md:text-5xl font-bold mb-2' style={{ color: vars.text }}>
                        AI-Powered Code Editor
                    </h2>
                    <p className='text-lg' style={{ color: landingTheme === 'light' ? '#334155' : 'rgba(255,255,255,0.85)' }}>
                        Write better code with intelligent assistance and real-time feedback.
                    </p>
                </motion.div>

                {/* Main Content - Two columns */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch'>
                    {/* Left - Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className='flex flex-col gap-4'
                    >
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={animationConfig.cardLift}
                                    className='group p-5 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur shadow-md hover:shadow-xl'
                                    style={{
                                        background: landingTheme === 'light' ? vars.cardBgLight : vars.cardBgDark,
                                        borderColor: vars.rim
                                    }}
                                    onMouseEnter={(e) => cardHoverEffects.onCardHover(e.currentTarget, vars, landingTheme)}
                                    onMouseLeave={(e) => cardHoverEffects.onCardLeave(e.currentTarget, vars, landingTheme === 'light' ? vars.cardBgLight : vars.cardBgDark, landingTheme)}
                                >
                                    <div className='flex items-start gap-4'>
                                        <Icon className='w-6 h-6 flex-shrink-0 mt-1 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12' style={{ color: vars.brand }} />
                                        <div>
                                            <h3 className='font-bold mb-2 transition-colors duration-300' style={{ color: vars.text }}>
                                                {feature.title}
                                            </h3>
                                            <p className='text-sm transition-colors duration-300' style={{ color: landingTheme === 'light' ? 'rgba(17,24,39,0.7)' : 'rgba(255,255,255,0.78)' }}>
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>

                    {/* Right - GIF Container */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className='hidden lg:flex items-center justify-center'
                    >
                        {/* Placeholder: removed heavy GIF/video for performance. Add media later. */}
                        <div className='w-full aspect-video rounded-2xl overflow-hidden shadow-lg flex items-center justify-center' style={{ background: landingTheme === 'light' ? 'rgba(0,0,0,0.02)' : vars.cardBgDark, border: `1px solid ${vars.rim}` }}>
                            {/* Intentionally left empty for future GIF/video */}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

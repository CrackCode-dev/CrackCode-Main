import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { ChevronRight, BookOpenText, ChartLine, Rocket } from 'lucide-react'

function Title() {
    const navigate = useNavigate()
    
  return (
    <div className='relative '>

        {/* Title Section - Anchored at middle of viewport */}
        <section id="title-section" className='w-full flex flex-col items-center justify-center mt-20 md:mt-60 '>
            <div className='text-center space-y-6 px-4 md:px-0'>
                <h1 className='text-5xl md:text-7xl font-bold leading-tight tracking-tight'>
                    Solve Mysteries <br />Through <span className='text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600'>Code</span>
                </h1>
                <p className="text-xl md:text-xl text-[#FFFFFF80] text-balance max-w-3xl mx-auto leading-relaxed">
                Join the detective force and solve real-world coding challenges wrapped in thrilling mystery narratives. 
                Every case brings you close to <span className='text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600'>mastery</span>.
                </p>

                <div className='flex justify-center gap-4 pt-10'>
                    <Button variant="primary" size="lg" icon={ChevronRight} iconPosition="right" onClick={() => navigate('/login')}>
                        Get Started
                    </Button>

                    <Button variant="outline" size="lg" onClick={() => navigate('/home')} className='text-orange-500'>
                        Learn More
                    </Button>
                </div>
            </div>
        </section>

        {/* Features Section - Flows naturally below */}
        <section id='features-section' className='w-full flex flex-col items-center justify-center py-12 px-4'>
            <div className='flex flex-row items-center justify-center gap-10 flex-wrap max-w-7xl'>
                <Card title='Narrative-Driven' description="Every challenge is wrapped in an engaging detective story 
                that makes learning fun." icon={<BookOpenText className="w-8 h-8 text-orange-500" />} variant='outlined' hoverEffect='slide' className='w-xs rounded-xl' padding='lg' /> 

                <Card title='Track Progress' description="Climb the leaderboard and earn xp, badges as you solve cases
                and master algorithms." icon={<ChartLine className="w-8 h-8 text-orange-500" />} variant='outlined' hoverEffect='slide' className='w-xs rounded-xl' padding='lg' /> 

                <Card title='Career Growth' description="Build real skill that matter. Our career path guide you
                from beginner to expert." icon={<Rocket className="w-8 h-8 text-orange-500" />} variant='outlined' hoverEffect='slide' className='w-xs rounded-xl' padding='lg' /> 
            </div>
        </section>

    </div>
  )
}

export default Title
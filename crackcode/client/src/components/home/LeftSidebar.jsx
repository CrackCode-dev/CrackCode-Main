import { useState } from 'react'
import { useTheme } from '../../context/theme/ThemeContext'
import Card from '../ui/Card'
import { FileUser, Medal, Footprints, Zap, Target, Award, Lightbulb, ArrowRight } from 'lucide-react';

const menuItems = [
    {
        icon: FileUser,
        title: 'Case Files',
        description: 'Browse and select from active investigations'
    },
    {
        icon: Medal,
        title: 'Achievements',
        description: 'Earn badges and unlock special rewards'
    },
    {
        icon: Footprints,
        title: 'Learning Path',
        description: 'Follow guided tutorials and resources'
    }
]

const statsData = [
    {
        icon: Zap,
        label: 'Current Streak',
        value: '12 days',
        color: '#FFE66D'
    },
    {
        icon: Target,
        label: 'Cases Solved',
        value: '47',
        color: '#FF6B6B'
    },
    {
        icon: Award,
        label: 'Badges Earned',
        value: '18',
        color: '#4ECDC4'
    }
]

function LeftSidebar() {
  const { theme } = useTheme()
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [hoveredStat, setHoveredStat] = useState(null)

  return (
    <div className='w-64 shrink-0 space-y-4 flex flex-col'>
      {/* The Investigation Card */}
      <div
        className='rounded-lg p-6 transition-all duration-300'
        style={{
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className='flex items-center gap-2 mb-3'>
          <FileUser className='w-6 h-6' style={{ color: 'var(--brand)' }} />
          <h2 className='text-xl font-bold'>The Investigation</h2>
        </div>
        <p style={{ color: 'var(--textSec)' }} className='text-sm mb-6 leading-relaxed'>
          Welcome Detective! You've been recruited to solve the most challenging cases in the digital world. Each case tests your algorithmic thinking.
        </p>
        
        <div className='flex flex-col space-y-3'>
            {menuItems.map((item, index) => (
                <div 
                  key={index} 
                  className='flex flex-row items-start gap-3 p-4 rounded-lg transition-all duration-300 cursor-pointer'
                  style={{
                    background: hoveredMenu === index ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
                    transform: hoveredMenu === index ? 'translateX(4px)' : 'translateX(0)'
                  }}
                  onMouseEnter={() => setHoveredMenu(index)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                    <div>
                        <item.icon className='w-6 shrink-0 transition-transform duration-300' style={{ color: 'var(--brand)', transform: hoveredMenu === index ? 'scale(1.2) rotate(10deg)' : 'scale(1)' }} />
                    </div>
                    
                    <div className='flex flex-col flex-1 min-w-0'>
                        <h3 className='font-bold text-sm'>{item.title}</h3>
                        <p className='text-xs mt-1 leading-relaxed' style={{ color: 'var(--textSec)' }}>
                          {item.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Quick Stats Card */}
      <div
        className='rounded-lg p-6 transition-all duration-300'
        style={{
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <h3 className='font-bold mb-5 flex items-center gap-2 text-lg'>
          <Zap className='w-5 h-5 animate-pulse' style={{ color: 'var(--brand)' }} />
          Your Progress
        </h3>
        
        <div className='space-y-4'>
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className='flex items-center justify-between p-4 rounded-lg transition-all duration-300 cursor-pointer'
                style={{ 
                  background: hoveredStat === index ? 'rgba(255, 165, 0, 0.12)' : 'rgba(255, 165, 0, 0.05)',
                  transform: hoveredStat === index ? 'scale(1.02)' : 'scale(1)'
                }}
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className='flex items-center gap-3'>
                  <Icon className='w-5 h-5 transition-transform duration-300' style={{ color: stat.color, transform: hoveredStat === index ? 'scale(1.3)' : 'scale(1)' }} />
                  <div>
                    <p className='text-xs font-semibold' style={{ color: 'var(--textSec)' }}>{stat.label}</p>
                    <p className='font-bold text-sm'>{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips & Tricks Card - Enhanced */}
      <div
        className='rounded-lg p-6 transition-all duration-300 border-l-4 group cursor-pointer hover:shadow-lg'
        style={{
          background: 'linear-gradient(135deg, var(--surface) 0%, rgba(255, 165, 0, 0.03) 100%)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          borderLeftColor: 'var(--brand)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <h3 className='font-bold mb-3 text-lg flex items-center gap-2'>
          <Lightbulb className='w-5 h-5' style={{ color: '#FFE66D' }} />
          Quick Tip
        </h3>
        <p className='text-sm leading-relaxed mb-4' style={{ color: 'var(--textSec)' }}>
          Master arrays and linked lists first—most interview questions build on these fundamentals. Practice daily!
        </p>
        <button
          className='w-full py-2 rounded-md text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2'
          style={{
            background: 'rgba(255, 165, 0, 0.1)',
            color: 'var(--brand)',
            border: '1px solid var(--brand)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--brand)';
            e.target.style.color = 'var(--surface)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 165, 0, 0.1)';
            e.target.style.color = 'var(--brand)';
          }}
        >
          View More Tips
          <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
        </button>
      </div>
    </div>
  )
}

export default LeftSidebar

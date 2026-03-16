import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useTheme } from '../../context/theme/ThemeContext'
import { AppContent } from '../../context/userauth/authenticationContext'
import { FileUser, Medal, Footprints, Zap, Target, Award, Lightbulb, ChevronRight } from 'lucide-react';

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

const defaultStats = [
  {
    icon: Zap,
    label: 'Current Streak',
    value: '0 days',
    color: '#FFB33F'
  },
  {
    icon: Target,
    label: 'Cases Solved',
    value: '0',
    color: '#FF6B6B'
  },
  {
    icon: Award,
    label: 'Badges Earned',
    value: '0',
    color: '#4ECDC4'
  }
]

function LeftSidebar() {
  const { theme } = useTheme()
  const { userData, backendUrl } = useContext(AppContent)

  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [hoveredStat, setHoveredStat] = useState(null)
  const [statsData, setStatsData] = useState(defaultStats)

  useEffect(() => {
    // If no user data, keep zeros (no dummy values). Otherwise use real values.
    if (!userData) {
      setStatsData(defaultStats);
      return;
    }

    const streak = (typeof userData.currentStreak === 'number' && userData.currentStreak > 0)
      ? `${userData.currentStreak} days`
      : '0 days';

    const solved = (typeof userData.casesSolved === 'number' && userData.casesSolved > 0)
      ? `${userData.casesSolved}`
      : '0';

    const badges = Array.isArray(userData.achievements) && userData.achievements.length > 0
      ? `${userData.achievements.length}`
      : '0';

    setStatsData([
      { ...defaultStats[0], value: streak },
      { ...defaultStats[1], value: solved },
      { ...defaultStats[2], value: badges }
    ]);
  }, [userData])

  // Try to fetch a dedicated progress summary from the backend when available
  useEffect(() => {
    if (!backendUrl) return;

    const fetchSummary = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/progress-summary`, { withCredentials: true, timeout: 5000 });
        if (data?.success && data.data) {
          setStatsData([
            { ...defaultStats[0], value: data.data.currentStreak ? `${data.data.currentStreak} days` : defaultStats[0].value },
            { ...defaultStats[1], value: data.data.casesSolved != null ? `${data.data.casesSolved}` : defaultStats[1].value },
            { ...defaultStats[2], value: data.data.badgesEarned != null ? `${data.data.badgesEarned}` : defaultStats[2].value }
          ]);
          return;
        }
      } catch (err) {
        // ignore and keep defaults or userData-driven values
      }
    }

    fetchSummary();
  }, [backendUrl]);

  return (
    <div className='w-80 shrink-0 space-y-4 flex flex-col'>
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

      {/* Tips & Tricks Card - Rotating */}
      <div
        className='relative rounded-lg p-6 transition-all duration-300 border-l-4 group h-48 flex flex-col justify-center'
        style={{
          background: 'linear-gradient(135deg, var(--surface) 0%, rgba(255, 165, 0, 0.03) 100%)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          borderLeftColor: 'var(--brand)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <h3 className='font-bold mb-3 text-lg flex items-center gap-2'>
          <Lightbulb className='w-5 h-5' style={{ color: '#FFB33F' }} />
          Quick Tips
        </h3>

        {/* Rotating tips data and controls */}
        <TipsRotator />
      </div>
    </div>
  )
}

export default LeftSidebar

function TipsRotator() {
  const tips = [
    'Master arrays and linked lists first  many interview questions build on these fundamentals.',
    'Break problems into smaller pieces: write a plan before you code to reduce mistakes.',
    'Use meaningful variable names and keep functions short for easier debugging and review.',
    'Practice time boxed challenges to build speed and confidence under pressure.',
    'Read problem examples carefully off by-one errors often come from misreading constraints.'
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % tips.length);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const next = () => setIndex(i => (i + 1) % tips.length);

  return (
    <div className='relative px-4 h-full flex items-center'>
      <p key={index} className='text-sm leading-relaxed transition-opacity duration-500 opacity-100 pr-12 overflow-auto' style={{ color: 'var(--textSec)' }}>
        {tips[index]}
      </p>

      {/* Single right-corner arrow */}
      <button onClick={next} aria-label='Next tip' className='absolute top-3 right-3 p-2 rounded-full bg-black/10 hover:bg-black/20 z-20' style={{ backdropFilter: 'blur(4px)' }}>
        <ChevronRight className='w-4 h-4' />
      </button>
    </div>
  );
}

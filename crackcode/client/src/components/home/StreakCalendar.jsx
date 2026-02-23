import { useState, useMemo } from 'react';
import { useTheme } from '../../context/theme/ThemeContext';
import { Calendar, Zap, TrendingUp } from 'lucide-react';

export default function StreakCalendar() {
  const { theme } = useTheme();
  const [hoveredDate, setHoveredDate] = useState(null);

  // Mock activity data for the last 12 weeks
  const activityData = useMemo(() => {
    const data = {};
    const today = new Date();
    
    // Generate activity for the last 84 days
    // 1 = completed a question, 0 = no activity
    for (let i = 0; i < 84; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // 70% chance of having completed a question
      data[dateStr] = Math.random() > 0.3 ? 1 : 0;
    }
    
    return data;
  }, []);

  const weeks = useMemo(() => {
    const monthsData = {};
    const today = new Date();
    
    // Generate data for last 12 weeks (roughly 3 months)
    for (let i = 0; i < 84; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      
      if (!monthsData[monthKey]) {
        monthsData[monthKey] = [];
      }
      monthsData[monthKey].push({
        date,
        dateStr,
        activity: activityData[dateStr] || 0
      });
    }
    
    // Sort by month (newest first)
    const sortedMonths = Object.keys(monthsData).sort().reverse();
    
    // Group into weeks for each month
    const result = {};
    sortedMonths.forEach((monthKey) => {
      const daysInMonth = monthsData[monthKey];
      const weeks = [];
      let currentWeek = [];
      
      daysInMonth.forEach((day, index) => {
        currentWeek.push(day);
        if (currentWeek.length === 7 || index === daysInMonth.length - 1) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      });
      
      result[monthKey] = weeks;
    });
    
    return result;
  }, [activityData]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const stats = {
    currentStreak: 7,
    longestStreak: 23,
    totalContributions: Object.values(activityData).filter(v => v > 0).length,
    completionRate: '85%'
  };

  const getActivityColor = (completed) => {
    return completed === 1 ? 'var(--brand)' : '#f0f0f0';
  };

  const getActivityLabel = (completed) => {
    return completed === 1 ? 'Completed a question' : 'No activity';
  };

  return (
    <div className='w-full' style={{ color: 'var(--text)' }}>
      <div className='px-6 sm:px-10 py-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold mb-1 flex items-center gap-2'>
              <Calendar className='w-6 h-6' style={{ color: 'var(--brand)' }} />
              Your Activity
            </h2>
            <p style={{ color: 'var(--textSec)' }} className='text-sm'>
              Last 12 weeks of your coding consistency
            </p>
          </div>
        </div>

        {/* Stats Grid - Compact */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-8'>
          <div
            className='rounded-lg p-4 text-center'
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)'
            }}
          >
            <p style={{ color: 'var(--textSec)' }} className='text-xs mb-2 font-semibold'>
              Current Streak
            </p>
            <p className='text-xl font-bold' style={{ color: '#FF6B6B' }}>
              {stats.currentStreak}d
            </p>
          </div>

          <div
            className='rounded-lg p-4 text-center'
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)'
            }}
          >
            <p style={{ color: 'var(--textSec)' }} className='text-xs mb-2 font-semibold'>
              Longest Streak
            </p>
            <p className='text-xl font-bold' style={{ color: 'var(--brand)' }}>
              {stats.longestStreak}d
            </p>
          </div>

          <div
            className='rounded-lg p-4 text-center'
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)'
            }}
          >
            <p style={{ color: 'var(--textSec)' }} className='text-xs mb-2 font-semibold'>
              Contributions
            </p>
            <p className='text-xl font-bold' style={{ color: '#4ECDC4' }}>
              {stats.totalContributions}
            </p>
          </div>

          <div
            className='rounded-lg p-4 text-center'
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)'
            }}
          >
            <p style={{ color: 'var(--textSec)' }} className='text-xs mb-2 font-semibold'>
              Rate
            </p>
            <p className='text-xl font-bold' style={{ color: '#95E1D3' }}>
              {stats.completionRate}
            </p>
          </div>
        </div>

        {/* Calendar Grid - GitHub Style - Organized by Months - Horizontal */}
        <div
          className='rounded-lg p-6'
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            overflowX: 'auto'
          }}
        >
          <div style={{ display: 'flex', gap: '24px', minWidth: 'min-content', paddingBottom: '8px' }}>
            {Object.keys(weeks).map((monthKey) => {
              const date = new Date(monthKey + '-01');
              const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
              
              return (
                <div key={monthKey} style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Month Header */}
                  <h3 className='text-xs font-bold mb-3' style={{ color: 'var(--text)', whiteSpace: 'nowrap' }}>
                    {monthName}
                  </h3>
                  
                  {/* Weeks in Month */}
                  <div style={{ display: 'flex', gap: '2px', flexDirection: 'column' }}>
                    {weeks[monthKey].map((week, weekIndex) => (
                      <div
                        key={`${monthKey}-week-${weekIndex}`}
                        style={{ display: 'flex', gap: '2px' }}
                      >
                        {week.map((day) => (
                          <div
                            key={day.dateStr}
                            onMouseEnter={() => setHoveredDate(day.dateStr)}
                            onMouseLeave={() => setHoveredDate(null)}
                            className='rounded-sm transition-all duration-200 cursor-pointer relative'
                            style={{
                              width: '12px',
                              height: '12px',
                              background: getActivityColor(day.activity),
                              border: hoveredDate === day.dateStr ? '1px solid var(--brand)' : '1px solid rgba(255, 165, 0, 0.15)',
                              transform: hoveredDate === day.dateStr ? 'scale(1.2)' : 'scale(1)',
                              boxShadow: hoveredDate === day.dateStr ? `0 2px 8px ${getActivityColor(day.activity)}` : 'none'
                            }}
                            title={`${day.date.toDateString()}: ${getActivityLabel(day.activity)}`}
                          >
                            {hoveredDate === day.dateStr && (
                              <div
                                style={{
                                  position: 'absolute',
                                  bottom: '100%',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  background: 'var(--text)',
                                  color: 'var(--bg)',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  whiteSpace: 'nowrap',
                                  marginBottom: '6px',
                                  zIndex: 50,
                                  pointerEvents: 'none'
                                }}
                              >
                                {day.date.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className='mt-4 pt-4 border-t' style={{ borderColor: 'var(--border)' }}>
            <p className='text-xs mb-2 font-semibold' style={{ color: 'var(--textSec)' }}>
              Activity
            </p>
            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <div
                  className='rounded-sm'
                  style={{ width: '12px', height: '12px', background: '#f0f0f0', border: '1px solid #e0e0e0' }}
                />
                <span className='text-xs' style={{ color: 'var(--textSec)' }}>
                  No activity
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <div
                  className='rounded-sm'
                  style={{ width: '12px', height: '12px', background: 'var(--brand)' }}
                />
                <span className='text-xs' style={{ color: 'var(--textSec)' }}>
                  Completed a question
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div
          className='mt-6 p-4 rounded-lg text-center'
          style={{
            background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 165, 0, 0.02) 100%)',
            border: '1px solid rgba(255, 165, 0, 0.2)',
            color: 'var(--text)'
          }}
        >
          <p className='text-base font-bold mb-1'>
            🔥 Keep up the amazing work!
          </p>
          <p style={{ color: 'var(--textSec)' }} className='text-sm'>
            You're on a {stats.currentStreak}-day streak! Maintain consistency to unlock elite badges.
          </p>
        </div>
      </div>
    </div>
  );
}

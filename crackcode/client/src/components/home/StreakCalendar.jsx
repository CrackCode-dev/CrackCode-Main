import { useState, useMemo, useEffect, useContext } from 'react';
import { useTheme } from '../../context/theme/ThemeContext';
import { Calendar, Zap, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { AppContent } from '../../context/userauth/authenticationContext';

export default function StreakCalendar() {
  const { theme } = useTheme();
  const [hoveredDate, setHoveredDate] = useState(null);

  // Activity data (fetched from server, cached to localStorage and refreshed every 24 hours)
  const { backendUrl } = useContext(AppContent);
  const [activityData, setActivityData] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearsList, setYearsList] = useState([]);

  useEffect(() => {
    let mounted = true;

    const LOCAL_KEY = `userActivityData_v1_${selectedYear}`;
    const LOCAL_AT = `userActivityFetchedAt_v1_${selectedYear}`;
    const fetchIfNeeded = async () => {
      try {
        const fetchedAt = localStorage.getItem(LOCAL_AT);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (fetchedAt && now - Number(fetchedAt) < oneDay) {
          const cached = localStorage.getItem(LOCAL_KEY);
          if (cached) {
            if (!mounted) return;
            setActivityData(JSON.parse(cached));
            return;
          }
        }

        // fetch from backend for selected year (startDate..endDate)
        const year = selectedYear;
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59, 999);
        const url = `${backendUrl}/api/user/activity?startDate=${encodeURIComponent(start.toISOString())}&endDate=${encodeURIComponent(end.toISOString())}`;
        const { data } = await axios.get(url, { withCredentials: true, timeout: 10000 });
        if (data && data.success && mounted) {
          setActivityData(data.data.activity || {});
          localStorage.setItem(LOCAL_KEY, JSON.stringify(data.data.activity || {}));
          localStorage.setItem(LOCAL_AT, String(Date.now()));
        }
      } catch (err) {
        // if fetch fails, fall back to any cached data or leave empty
        const cached = localStorage.getItem(LOCAL_KEY);
        if (cached && mounted) setActivityData(JSON.parse(cached));
      }
    };

    fetchIfNeeded();

    // Set a timer to refresh after 24 hours
    const refreshTimer = setInterval(() => {
      fetchIfNeeded();
    }, 24 * 60 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(refreshTimer);
    };
  }, [backendUrl, selectedYear]);

  // Listen for submissions from other parts of the app and refresh activity cache
  useEffect(() => {
    const LOCAL_KEY = `userActivityData_v1_${selectedYear}`;
    const LOCAL_AT = `userActivityFetchedAt_v1_${selectedYear}`;

    const handleSolutionSubmitted = async () => {
      try {
        // Clear cached data for this year so we force a backend refresh
        localStorage.removeItem(LOCAL_KEY);
        localStorage.removeItem(LOCAL_AT);

        // Immediately fetch fresh activity for selectedYear
        const year = selectedYear;
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59, 999);
        const url = `${backendUrl}/api/user/activity?startDate=${encodeURIComponent(start.toISOString())}&endDate=${encodeURIComponent(end.toISOString())}`;
        const { data } = await axios.get(url, { withCredentials: true, timeout: 10000 });
        if (data && data.success) {
          setActivityData(data.data.activity || {});
          localStorage.setItem(LOCAL_KEY, JSON.stringify(data.data.activity || {}));
          localStorage.setItem(LOCAL_AT, String(Date.now()));
        }
      } catch (err) {
        // ignore 
      }
    };

    window.addEventListener('onSolutionSubmitted', handleSolutionSubmitted);
    return () => window.removeEventListener('onSolutionSubmitted', handleSolutionSubmitted);
  }, [backendUrl, selectedYear]);

  // Prepare years list (current year down to earliest 2018 or 5 years back)
  useEffect(() => {
    const current = new Date().getFullYear();
    const minYear = Math.max(2018, current - 6);
    const arr = [];
    for (let y = current; y >= minYear; y--) arr.push(y);
    setYearsList(arr);
    // ensure selectedYear is valid
    setSelectedYear((s) => (s ? s : current));
  }, []);

  // Fetch progress-summary (casesSolved, currentStreak) to populate stats
  const [progressSummary, setProgressSummary] = useState(null);
  useEffect(() => {
    let mounted = true;
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/progress-summary`, { withCredentials: true, timeout: 6000 });
        if (data && data.success && mounted) setProgressSummary(data.data);
      } catch (err) {
        // ignore
      }
    };
    fetchSummary();
    return () => { mounted = false };
  }, [backendUrl]);

  // Build months Jan..Dec for the selectedYear using activityData
  const weeks = useMemo(() => {
    const result = {};
    const year = selectedYear;

    for (let month = 0; month < 12; month++) {
      const first = new Date(year, month, 1);
      const last = new Date(year, month + 1, 0);
      const daysInMonth = last.getDate();

      const monthWeeks = [];
      let currentWeek = [];

      // Pad leading empty days to align weekdays if desired (we'll still present weeks as arrays)
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dateStr = date.toISOString().split('T')[0];
        currentWeek.push({ date, dateStr, activity: activityData[dateStr] || 0 });
        if (currentWeek.length === 7) {
          monthWeeks.push(currentWeek);
          currentWeek = [];
        }
      }
      if (currentWeek.length > 0) monthWeeks.push(currentWeek);

      const key = `${String(year)}-${String(month + 1).padStart(2, '0')}`;
      result[key] = monthWeeks;
    }

    return result;
  }, [activityData, selectedYear]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Derive stats: prefer server-provided summary for current streak; compute longest streak from activity data
  const stats = useMemo(() => {
    // compute days window for the selected year
    const yearStart = new Date(selectedYear, 0, 1);
    const yearEnd = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
    const daysWindow = Math.round((yearEnd - yearStart) / (1000 * 60 * 60 * 24)) + 1;

    const contributions = Object.values(activityData || {}).filter(v => v > 0).length;

    // compute longest consecutive streak from activity map
    const dates = Object.keys(activityData || {}).sort(); // ascending
    let longest = 0;
    let current = 0;
    let prevDate = null;

    for (const d of dates) {
      const val = activityData[d] || 0;
      if (val > 0) {
        if (prevDate) {
          const pd = new Date(prevDate);
          const cd = new Date(d);
          const diffDays = Math.round((cd - pd) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            current += 1;
          } else {
            current = 1;
          }
        } else {
          current = 1;
        }
        if (current > longest) longest = current;
        prevDate = d; // only advance prevDate when we have activity
      } else {
        // do not advance prevDate for empty days; this ensures consecutive checks work
        current = 0;
      }
    }

    // compute current streak: prefer server value if present
    const serverStreak = progressSummary?.currentStreak;

    // fallback compute current streak by checking trailing consecutive days from today
    let trailing = 0;
    try {
      const today = new Date();
      for (let i = 0; i < daysWindow; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        if ((activityData && activityData[key]) > 0) trailing += 1;
        else break;
      }
    } catch (e) {
      trailing = 0;
    }

    const currentStreak = typeof serverStreak === 'number' ? serverStreak : trailing;
    const completionRate = daysWindow > 0 ? `${Math.round((contributions / daysWindow) * 100)}%` : '0%';

    return {
      currentStreak: currentStreak || 0,
      longestStreak: longest || 0,
      totalContributions: contributions,
      completionRate,
    };
  }, [activityData, progressSummary, selectedYear]);

  const getActivityColor = (completed) => {
    return (completed || 0) > 0 ? 'var(--brand)' : '#f0f0f0';
  };

  const getActivityLabel = (completed) => {
    return (completed || 0) > 0 ? 'Completed a question' : 'No activity';
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
              Last 12 months of your coding consistency
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor='year-select' className='sr-only'>Select year</label>
            <select
              id='year-select'
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className='bg-transparent border rounded px-2 py-1 text-sm'
              aria-label='Select year'
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
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

        {/* Calendar Grid  - Organized by Months - Horizontal */}
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

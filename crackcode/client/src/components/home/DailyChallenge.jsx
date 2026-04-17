import { useState, useEffect, useContext } from 'react';
import { useTheme } from '../../context/theme/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, CircleCheck, Flame, AlertCircle } from 'lucide-react';
import { AppContent } from '../../context/userauth/authenticationContext';
import Button from '../ui/Button';

// Utility function to format seconds to readable time format
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
};

export default function DailyChallenge() {
  useTheme();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContent);
  const [timeLeft, setTimeLeft] = useState(23 * 3600 + 45 * 60);
  const [isHovered, setIsHovered] = useState(false);
  const [challenge, setChallenge] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  // Fetch daily challenge on mount
  useEffect(() => {
    const fetchDailyChallenge = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/learn/daily-challenge`);
        if (data.success) {
          setChallenge(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch daily challenge:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDailyChallenge();
  }, [backendUrl]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartChallenge = () => {
    if (challenge?.problemId) {
      // Navigate with the full challenge data and specify Java language
      navigate(`/code-editor/${challenge.problemId}`, { 
        state: { 
          question: challenge,
          language: 'java'  // Ensure Java starter code is loaded
        } 
      });
    }
  };

  // Get narrative from the first available variant
  const narrative = challenge?.variants?.[0]?.narrative || {
    title: challenge?.title || 'Daily Challenge',
    description: challenge?.description || 'Complete today\'s challenge'
  };

  // Default values while loading or on error
  const displayChallenge = challenge ? {
    title: narrative.title || challenge.title,
    description: narrative.description || challenge.description,
    difficulty: challenge.difficulty,
    points: 250,
    topic: challenge.topic
  } : {
    title: 'Loading Challenge...',
    description: 'Fetching your daily challenge...',
    difficulty: 'medium',
    points: 250,
    topic: 'Algorithms'
  };

  const completedQuestionIds = Array.isArray(userData?.completedQuestionIds) ? userData.completedQuestionIds : [];
  const isCompleted = Boolean(
    challenge?.problemId && completedQuestionIds.some((id) => String(id).trim() === String(challenge.problemId).trim())
  );

  return (
    <div
      className='rounded-lg p-6 transition-all duration-300 relative overflow-hidden'
      style={{
        background: 'var(--surface)',
        color: 'var(--text)',
        border: '2px solid var(--border)',
        backgroundImage: `linear-gradient(135deg, rgba(255, 165, 0, 0.08) 0%, rgba(255, 165, 0, 0.02) 100%)`,
        boxShadow: isHovered ? '0 12px 32px rgba(255, 165, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderColor: isHovered ? 'var(--brand)' : 'var(--border)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Daily Badge */}
      <div className='absolute top-4 right-4'>
        <div
          className='flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold'
          style={
            isCompleted
              ? { background: 'rgba(82, 200, 130, 0.2)', color: '#52C882' }
              : { background: 'rgba(255, 107, 107, 0.2)', color: '#FF6B6B' }
          }
        >
          {isCompleted ? <CircleCheck className='w-3 h-3' /> : <Flame className='w-3 h-3' />}
          {isCompleted ? 'Quest Completed' : 'Daily Quest'}
        </div>
      </div>

      {/* Narrative Question - Main Focus */}
      <div className='mb-5'>
        <h3 className='text-2xl font-bold mb-3 transition-all duration-300 line-clamp-2' style={{ color: isHovered ? 'var(--brand)' : 'var(--text)' }}>
          {displayChallenge.title}
        </h3>
        <p style={{ color: 'var(--textSec)' }} className='text-sm leading-relaxed mb-3 line-clamp-3'>
          {displayChallenge.description}
        </p>
      </div>

      {/* Stats Row - Compact */}
      <div className='flex flex-wrap gap-2 mb-4'>
        <div className='px-3 py-1 rounded-md text-xs font-bold' style={{ background: 'rgba(255, 165, 0, 0.15)', color: 'var(--brand)' }}>
          +{displayChallenge.points} pts
        </div>
        <div className='px-3 py-1 rounded-md text-xs font-bold' style={{ background: 'rgba(255, 165, 0, 0.1)', color: 'var(--textSec)' }}>
          {displayChallenge.topic}
        </div>
      </div>

      {/* Timer Section */}
      <div
        className='rounded-lg p-3 mb-4 flex items-center gap-3 transition-all duration-300'
        style={{
          background: isHovered ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 107, 107, 0.08)',
          border: '1px solid rgba(255, 107, 107, 0.4)'
        }}
      >
        <Clock className='w-5 h-5 animate-spin shrink-0' style={{ color: '#FF6B6B', animationDuration: '2s' }} />
        <div className='flex-1'>
          <p className='text-xs font-semibold uppercase' style={{ color: 'var(--textSec)' }}>
            Quest Reset In
          </p>
          <p className='font-bold text-sm' style={{ color: '#FF6B6B' }}>
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      {/* Note/Info Tip */}
      <div className='flex gap-2 p-3 rounded-lg mb-4' style={{ background: 'rgba(82, 200, 130, 0.1)', borderLeft: '3px solid #52c882' }}>
        {isCompleted ? (
          <CircleCheck className='w-4 h-4 shrink-0 mt-0.5' style={{ color: '#52c882' }} />
        ) : (
          <AlertCircle className='w-4 h-4 shrink-0 mt-0.5' style={{ color: '#52c882' }} />
        )}
        <p className='text-xs' style={{ color: '#52c882' }}>
          {isCompleted
            ? 'Great work. You completed today\'s quest. Revisit it anytime to refine your solution.'
            : 'Solve this daily quest to build your streak and unlock achievements!'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-3'>
        <Button 
          variant='primary' 
          size='md' 
          icon={isCompleted ? CircleCheck : AlertCircle} 
          fullWidth
          onClick={handleStartChallenge}
        >
          {isCompleted ? 'Revisit Completed Challenge' : 'Start Challenge'}
        </Button>
      </div>
    </div>
  );
}

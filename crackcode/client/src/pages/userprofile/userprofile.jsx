import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Button from '../../components/ui/Button';
import Header from '../../components/common/Header';
import { AppContent } from '../../context/userauth/authenticationContext';

const UserProfile = () => {
  // Get the current logged-in user's data and backend URL from authentication context
  const { userData, isLoggedIn, backendUrl } = useContext(AppContent);

  // State to store user profile stats fetched from the database
  const [userStatus, setUserStatus] = useState({
    name: "Loading...",
    email: "Loading...",
    level: 0,
    casesSolved: 0,
    totalPoints: 0,
    winStreaks: 0,
    rank: "#--",
    avatar: ""
  });

  // State to store difficulty distribution (Easy, Medium, Hard problems)
  const [difficultyDistribution, setDifficultyDistribution] = useState([
    { level: "Easy", count: 0, color: 'bg-green-500' },
    { level: "Medium", count: 0, color: 'bg-yellow-500' },
    { level: "Hard", count: 0, color: 'bg-red-500' }
  ]);

  // State to store programming language progress
  const [languageProgress, setLanguageProgress] = useState([
    { language: 'Python', percentage: 0 },
    { language: 'JavaScript', percentage: 0 },
    { language: 'Java', percentage: 0 },
    { language: 'C++', percentage: 0 }
  ]);

  // State to store user achievements
  const [achievements, setAchievements] = useState([
    { icon: '🏆', title: 'First Victory', description: 'Won your first case', unlocked: false },
    { icon: '⚡', title: 'Speed Solver', description: 'Solve case in 2 mins', unlocked: false },
    { icon: '🔥', title: 'Streak Master', description: '7 day streak', unlocked: false },
    { icon: '🧠', title: 'Code Master', description: '100% accuracy', unlocked: false },
    { icon: '⭐', title: 'Rising Star', description: 'Reached Level 10', unlocked: false },
    { icon: '💎', title: 'Persistent', description: '15 cases solved', unlocked: false },
    { icon: '🎯', title: 'Focused', description: 'Finished Goals', unlocked: false },
    { icon: '✅', title: 'Elite', description: 'Top 100 rank', unlocked: false }
  ]);

  // Function to fetch user stats from API
  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
        timeout: 5000
      });
      
      if (response.data.success) {
        const data = response.data.data;
        
        // Update user stats with real data from API
        setUserStatus(prevData => ({
          ...prevData,
          name: data.name || "User",
          email: data.email || "No email",
          level: data.level || 0,
          casesSolved: data.casesSolved || 0,
          totalPoints: data.xp || 0,
          winStreaks: data.currentStreak || 0,
          rank: "#" + (data.rank || "--")
        }));
      }
    } catch (error) {
      console.log("Error fetching user stats:", error.message);
    }
  };

  // Function to fetch learning progress and calculate difficulty distribution
  const fetchLearningProgress = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/learn/roadmap`, {
        withCredentials: true,
        timeout: 5000
      });
      
      if (response.data.success && response.data.data) {
        const questions = response.data.data;
        
        // Count problems by difficulty level
        const easyCount = questions.filter(q => q.difficulty === 'Easy' && q.status === 'completed').length;
        const mediumCount = questions.filter(q => q.difficulty === 'Medium' && q.status === 'completed').length;
        const hardCount = questions.filter(q => q.difficulty === 'Hard' && q.status === 'completed').length;
        
        // Update difficulty distribution with real data
        setDifficultyDistribution([
          { level: "Easy", count: easyCount, color: 'bg-green-500' },
          { level: "Medium", count: mediumCount, color: 'bg-yellow-500' },
          { level: "Hard", count: hardCount, color: 'bg-red-500' }
        ]);
      }
    } catch (error) {
      console.log("Error fetching learning progress:", error.message);
    }
  };

  // Function to fetch programming language progress
  const fetchLanguageProgress = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/learn/progress`, {
        withCredentials: true,
        timeout: 5000
      });
      
      if (response.data.success && response.data.data) {
        const progress = response.data.data;
        
        // Count completed problems per language
        const languages = ['Python', 'JavaScript', 'Java', 'C++'];
        const languageStats = languages.map(lang => {
          // Calculate percentage based on completed problems in that language
          const completed = progress.filter(p => p.language === lang && p.status === 'completed').length;
          const total = progress.filter(p => p.language === lang).length;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
          
          return {
            language: lang,
            percentage: percentage
          };
        });
        
        setLanguageProgress(languageStats);
      }
    } catch (error) {
      console.log("Error fetching language progress:", error.message);
    }
  };

  // Function to unlock achievements based on user stats
  const updateAchievements = () => {
    setAchievements(prevAchievements => 
      prevAchievements.map(achievement => {
        let unlocked = false;
        
        // Unlock achievements based on user stats
        if (achievement.title === 'First Victory' && userStatus.casesSolved >= 1) unlocked = true;
        if (achievement.title === 'Speed Solver' && userStatus.casesSolved >= 5) unlocked = true;
        if (achievement.title === 'Streak Master' && userStatus.winStreaks >= 7) unlocked = true;
        if (achievement.title === 'Code Master' && userStatus.totalPoints >= 1000) unlocked = true;
        if (achievement.title === 'Rising Star' && userStatus.level >= 10) unlocked = true;
        if (achievement.title === 'Persistent' && userStatus.casesSolved >= 15) unlocked = true;
        if (achievement.title === 'Focused' && userStatus.casesSolved >= 25) unlocked = true;
        if (achievement.title === 'Elite' && userStatus.rank !== "#--") unlocked = true;
        
        return {
          ...achievement,
          unlocked: unlocked
        };
      })
    );
  };

  // Load user data from authentication context when the component mounts
  useEffect(() => {
    if (userData) {
      // Update user name and email from the logged-in user data
      setUserStatus(prevData => ({
        ...prevData,
        name: userData.name || "User",
        email: userData.email || "No email"
      }));
    }
  }, [userData]);

  // Fetch all real data when user is logged in
  useEffect(() => {
    if (isLoggedIn && backendUrl) {
      fetchUserStats();
      fetchLearningProgress();
      fetchLanguageProgress();
    }
  }, [isLoggedIn, backendUrl]);

  // Update achievements whenever user stats change
  useEffect(() => {
    updateAchievements();
  }, [userStatus]);

  // If user is not logged in, show a message asking them to sign in
  if (!isLoggedIn) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 sm:px-10 py-6" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        <Header variant="empty" />
        <div className="text-center mt-20">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p style={{ color: 'var(--textSec)' }}>You need to sign in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 sm:px-10 py-6" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header variant="empty" />

      <main className='mt-20 px-6 sm:px-10 py-6'>
          {/* Profile Header Card - Shows user avatar, name, level, and rank */}
          <div className="rounded-2xl p-8 mb-8" style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-6 mb-8">
              {/* User Avatar Circle - Shows user's profile picture or placeholder */}
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: 'var(--brand)' }}>
                {userStatus.avatar || '👤'}
              </div>

              {/* User Name and Rank Info */}
              <div>
                <h1 className="text-3xl font-bold">{userStatus.name}</h1>
                <p style={{ color: 'var(--textSec)' }}>
                  Level {userStatus.level} | Rank <span style={{ color: 'var(--brand)' }}>{userStatus.rank}</span>
                </p>
              </div>
            </div>

            {/* Quick Stats Row - Shows Cases Solved, Points, and Win Streak */}
            <div className="grid grid-cols-3 gap-4">
              {/* Cases Solved Stat */}
              <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--brand)' }}>
                  <span>✓</span>
                  <span>Cases Solved</span>
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--brand)' }}>{userStatus.casesSolved}</div>
              </div>

              {/* Total Points Stat */}
              <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--brand)' }}>
                  <span>⭐</span>
                  <span>Total Points</span>
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--brand)' }}>{userStatus.totalPoints}</div>
              </div>

              {/* Win Streak Stat */}
              <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--brand)' }}>
                  <span>🔥</span>
                  <span>Win Streak</span>
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--brand)' }}>{userStatus.winStreaks}</div>
              </div>
            </div>
          </div>

        {/* Statistics Section - Displays learning and difficulty stats */}
        <h2 className="text-2xl text-left font-bold mb-6">Statistics</h2>
        <div className="grid grid-cols-2 gap-6 mb-8">

          {/* Difficulty Distribution - Shows how many problems solved of each difficulty */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-semibold mb-4">Difficulty Distribution</h3>
            <div className="space-y-4">
              {difficultyDistribution.map((item, index) => (
                <div key={index}>
                  {/* Label and count for difficulty level */}
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'var(--textSec)' }}>{item.level}</span>
                    <span style={{ color: 'var(--text)' }} className="font-semibold">{item.count}</span>
                  </div>

                  {/* Progress bar showing number of problems solved */}
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--border)' }}>
                    <div
                      // Use the color from the difficulty distribution array
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${(item.count / 24) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Distribution - Shows proficiency percentage in each programming language */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-semibold mb-4">Programming Language Progress</h3>
            <div className="space-y-4">

              {languageProgress.map((item, index) => (
                <div key={index}>
                  {/* Programming language name and percentage progress */}
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'var(--textSec)' }}>{item.language}</span>
                    <span style={{ color: 'var(--text)' }} className="font-semibold">{item.percentage}%</span>
                  </div>

                  {/* Progress bar showing learning progress for each language */}
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--border)' }}>
                    <div
                      // Progress bar fills up with brand color based on percentage
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%`, backgroundColor: 'var(--brand)' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Section - Shows all badges and accomplishments */}
        <h2 className="text-2xl text-left font-bold mb-6">Achievements</h2>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {achievements.map((achievement, index) => (
            // Each achievement is displayed as an interactive card
            <div
              key={index}
              className="rounded-xl p-6 text-center hover:scale-105 transition-all cursor-pointer"
              style={{ 
                backgroundColor: 'var(--surface)', 
                border: '1px solid var(--border)',
                opacity: achievement.unlocked ? 1 : 0.5 // Make locked achievements semi-transparent
              }}
            >
              <div className="text-4xl mb-3" style={{ filter: achievement.unlocked ? 'none' : 'grayscale(100%)' }}>
                {achievement.icon}
              </div>
              <h4 className="font-semibold mb-1">{achievement.title}</h4>
              <p className="text-xs" style={{ color: 'var(--textSec)' }}>{achievement.description}</p>
              {/* Show lock/unlock status */}
              <div className="text-xs mt-2" style={{ color: achievement.unlocked ? 'var(--brand)' : 'var(--textSec)' }}>
                {achievement.unlocked ? '🔓 Unlocked' : '🔒 Locked'}
              </div>
            </div>
          ))}
        </div>

        {/* Account Settings Section - Allow user to edit their profile settings */}
        <h2 className="text-2xl text-left font-bold mb-6">Account Settings</h2>
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="space-y-4">
            {/* Email Field */}
            <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <div className="font-medium">Email Address</div>
                <div className="text-sm" style={{ color: 'var(--textSec)' }}>{userStatus.email}</div>
              </div>
              <Button variant='outline' size='sm' style={{ color: 'var(--brand)' }}>Edit</Button>
            </div>

            {/* Password Change Field */}
            <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <div className="font-medium">Password</div>
                <div className="text-sm" style={{ color: 'var(--textSec)' }}>••••••••</div>
              </div>
              <Button variant='outline' size='sm' style={{ color: 'var(--brand)' }}>Change</Button>
            </div>

            {/* Notification Preferences Field */}
            <div className="flex justify-between items-center py-3">
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm" style={{ color: 'var(--textSec)' }}>Manage notification settings</div>
              </div>
              <Button variant='outline' size='sm' style={{ color: 'var(--brand)' }}>Configure</Button>
            </div>
          </div>
        </div>

        {/* Danger Zone Section - Account deletion (use with caution) */}
        <h2 className="text-2xl text-left font-bold mb-6" style={{ color: '#ef4444' }}>Danger Zone</h2>
        <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <h3 className="text-xl text-left font-bold mb-2" style={{ color: '#ef4444' }}>Terminate Account</h3>
          <p className="mb-4 text-left" style={{ color: 'var(--textSec)' }}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <div className='flex justify-start'>
            <Button variant='outline' size='lg' style={{ color: '#ef4444', borderColor: '#ef4444' }}>Delete Account</Button>
          </div>
        </div>
        </main>
    </div>
  );
};


export default UserProfile
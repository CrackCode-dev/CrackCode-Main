import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Button from '../../components/ui/Button';
import Header from '../../components/common/Header';
import { AppContent } from '../../context/userauth/authenticationContext';
import { fetchBadgeProgress } from '../../services/api/badgeService';
import EditEmailModal from '../../components/Profiles/EditEmailModal';
import ChangePasswordModal from '../../components/Profiles/ChangePasswordModal';
import ManageNotificationsModal from '../../components/Profiles/ManageNotificationsModal';

const UserProfile = () => {
  // Get the current logged  in user's data and backend URL from authentication context
  const { userData, isLoggedIn, backendUrl } = useContext(AppContent);

  // State to store user profile stats fetched from the database
  const [userStatus, setUserStatus] = useState({
    name: "Loading...",
    email: "Loading...",
    level: 0,
    casesSolved: 0,
    totalXP: 0,
    tokens: 0,
    rank: "#--",
    avatar: ""
  });

  // State to store difficulty distribution (Easy, Medium, Hard problems)
  const [difficultyDistribution, setDifficultyDistribution] = useState([
    { level: "Easy", count: 0, color: 'bg-green-500' },
    { level: "Medium", count: 0, color: 'bg-yellow-500' },
    { level: "Hard", count: 0, color: 'bg-red-500' }
  ]);
  // State to store programming language solved counts
  const [languageProgress, setLanguageProgress] = useState([
    { language: 'Python', count: 0 },
    { language: 'JavaScript', count: 0 },
    { language: 'Java', count: 0 },
    { language: 'C++', count: 0 }
  ]);

  // State to store badges from server
  const [badges, setBadges] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(true);

  // State for profile settings (email, notifications)
  const [profileSettings, setProfileSettings] = useState({
    email: '',
    emailSettings: {
      notifications: true,
      securityAlerts: true,
      weeklyDigest: true,
      leaderboardUpdates: true
    }
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  // State for modal visibility
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

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
          // Use server-provided fields: totalXP and tokens
          totalXP: data.totalXP ?? data.xp ?? 0,
          tokens: data.tokens ?? 0,
          rank: "#" + (data.rank || "--")
        }));
      }
    } catch (error) {
      console.log("Error fetching user stats:", error.message);
    }
  };

  // Function to fetch learning progress and calculate difficulty distribution
  // Fetch aggregated progress summary (difficulty counts + language counts)
  const fetchProgressSummary = async () => {
    try {
      const resp = await axios.get(`${backendUrl}/api/user/progress-summary`, { withCredentials: true, timeout: 5000 });
      if (!resp?.data?.success) return;

      const data = resp.data.data || {};

      // difficultyDistribution from server expected as { Easy: N, Medium: N, Hard: N }
      const diff = [
        { level: 'Easy', count: data.difficultyDistribution?.Easy || 0, color: 'bg-green-500' },
        { level: 'Medium', count: data.difficultyDistribution?.Medium || 0, color: 'bg-yellow-500' },
        { level: 'Hard', count: data.difficultyDistribution?.Hard || 0, color: 'bg-red-500' }
      ];
      setDifficultyDistribution(diff);

      // languageCounts from server: { Python: n, JavaScript: n, Java: n, 'C++': n }
      const langOrder = ['Python', 'JavaScript', 'Java', 'C++'];
      const langArr = langOrder.map(l => ({ language: l, count: data.languageCounts?.[l] || 0 }));
      setLanguageProgress(langArr);
    } catch (error) {
      console.log('❌ Error fetching progress summary:', error.message);
    }
  };

  // Function to fetch profile settings for account settings
  const fetchProfileSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await axios.get(`${backendUrl}/api/profile/settings`, {
        withCredentials: true,
        timeout: 5000
      });

      if (response.data.success) {
        setProfileSettings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching profile settings:", error.message);
    } finally {
      setSettingsLoading(false);
    }
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
      fetchProgressSummary();
      fetchBadgesData();
      fetchProfileSettings();
    }
  }, [isLoggedIn, backendUrl]);

  // Function to fetch badges from server
  const fetchBadgesData = async () => {
    try {
      setBadgesLoading(true);
      const badgesData = await fetchBadgeProgress();
      setBadges(badgesData || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
      setBadges([]);
    } finally {
      setBadgesLoading(false);
    }
  };

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

              {/* XP Stat */}
              <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--brand)' }}>
                  <span>⭐</span>
                  <span>XP</span>
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--brand)' }}>{userStatus.totalXP}</div>
              </div>

              {/* Tokens Stat */}
              <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--brand)' }}>
                  <span>💰</span>
                  <span>Tokens</span>
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--brand)' }}>{userStatus.tokens}</div>
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
                  <div key={index} className="flex items-center justify-between">
                    <div className="text-sm" style={{ color: 'var(--textSec)' }}>{item.level}</div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.count}</div>
                  </div>
                ))}
              </div>
          </div>

          {/* Learning Distribution  */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-semibold mb-4">Programming Language Progress</h3>
            <div className="space-y-4">
              {languageProgress.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm" style={{ color: 'var(--textSec)' }}>{item.language}</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements & Badges Section - Dynamic badges from server */}
        <h2 className="text-2xl text-left font-bold mb-6">Achievements & Badges</h2>
        {badgesLoading ? (
          <div className="p-8 text-center rounded-xl" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--textSec)' }}>Loading achievements...</p>
          </div>
        ) : badges.length === 0 ? (
          <div className="p-8 text-center rounded-xl" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--textSec)' }}>No achievements yet. Start solving challenges to unlock badges! 🚀</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold" style={{ color: 'var(--brand)' }}>
                    {badges.filter(b => b.isUnlocked).length}
                  </p>
                  <p style={{ color: 'var(--textSec)' }} className="text-sm">Badges Unlocked</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{badges.length}</p>
                  <p style={{ color: 'var(--textSec)' }} className="text-sm">Total Badges</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold" style={{ color: 'var(--brand)' }}>
                    {Math.round((badges.filter(b => b.isUnlocked).length / badges.length) * 100)}%
                  </p>
                  <p style={{ color: 'var(--textSec)' }} className="text-sm">Completion</p>
                </div>
              </div>
            </div>

            {/* Badges Grid - Organized by Category */}
            <div className="space-y-6">
              {/* Milestone Badges */}
              {badges.filter(b => b.category === 'milestone').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>📊</span> Milestone Badges
                  </h3>
                  <div className="grid grid-cols-5 gap-4">
                    {badges.filter(b => b.category === 'milestone').map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                  </div>
                </div>
              )}

              {/* Ranking Badges */}
              {badges.filter(b => b.category === 'ranking').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>🏅</span> Ranking Badges
                  </h3>
                  <div className="grid grid-cols-5 gap-4">
                    {badges.filter(b => b.category === 'ranking').map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                  </div>
                </div>
              )}

              {/* Career Badges */}
              {badges.filter(b => b.category === 'career').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>🎓</span> Career Badges
                  </h3>
                  <div className="grid grid-cols-5 gap-4">
                    {badges.filter(b => b.category === 'career').map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Account Settings Section - Allow user to edit their profile settings */}
        <h2 className="text-2xl text-left font-bold mb-6">Account Settings</h2>
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="space-y-4">
            {/* Email Field */}
            <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <div className="font-medium">Email Address</div>
                <div className="text-sm" style={{ color: 'var(--textSec)' }}>{profileSettings.email || "Loading..."}</div>
              </div>
              <Button 
                variant='outline' 
                size='sm' 
                onClick={() => setEmailModalOpen(true)}
                style={{ color: 'var(--brand)' }}>
                Edit
              </Button>
            </div>

            {/* Password Change Field */}
            <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <div className="font-medium">Password</div>
                <div className="text-sm" style={{ color: 'var(--textSec)' }}>••••••••</div>
              </div>
              <Button 
                variant='outline' 
                size='sm' 
                onClick={() => setPasswordModalOpen(true)}
                style={{ color: 'var(--brand)' }}>
                Change
              </Button>
            </div>

            {/* Notification Preferences Field */}
            <div className="flex justify-between items-center py-3">
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm" style={{ color: 'var(--textSec)' }}>
                  {settingsLoading 
                    ? "Loading..." 
                    : `${Object.values(profileSettings.emailSettings || {}).filter(Boolean).length} notification preferences enabled`}
                </div>
              </div>
              <Button 
                variant='outline' 
                size='sm' 
                onClick={() => setNotificationModalOpen(true)}
                style={{ color: 'var(--brand)' }}>
                Configure
              </Button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <EditEmailModal 
          isOpen={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
          currentEmail={profileSettings.email}
          backendUrl={backendUrl}
          onSuccess={(data) => {
            setProfileSettings(prev => ({
              ...prev,
              email: data.email
            }));
          }}
        />

        <ChangePasswordModal 
          isOpen={passwordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
          backendUrl={backendUrl}
          onSuccess={() => {
            // Password changed successfully
          }}
        />

        <ManageNotificationsModal 
          isOpen={notificationModalOpen}
          onClose={() => setNotificationModalOpen(false)}
          settings={profileSettings.emailSettings}
          backendUrl={backendUrl}
          onSuccess={(updatedSettings) => {
            setProfileSettings(prev => ({
              ...prev,
              emailSettings: updatedSettings
            }));
          }}
        />

        {/*Account deletion  */}
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

// Reusable Badge Card Component for displaying individual badges
const BadgeCard = ({ badge }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div
      key={badge.id}
      className="relative group cursor-pointer transition-all duration-300 h-full"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        opacity: badge.isUnlocked ? 1 : 0.3,
      }}
    >
      {/* Badge Container */}
      <div
        className="rounded-xl p-6 text-center hover:scale-105 transition-all h-full flex flex-col items-center justify-center relative"
        style={{
          backgroundColor: badge.isUnlocked ? `${badge.color}15` : 'rgba(128, 128, 128, 0.1)',
          border: badge.isUnlocked ? `2px solid ${badge.color}` : '1px solid rgba(128, 128, 128, 0.4)',
          boxShadow: showTooltip && badge.isUnlocked ? `0 4px 12px ${badge.color}30` : 'none',
        }}
      >
        {/* Badge Icon */}
        <div
          className="text-4xl mb-3 transition-transform duration-300"
          style={{
            filter: badge.isUnlocked ? 'grayscale(0)' : 'grayscale(1) brightness(0.7)'
          }}
        >
          {badge.icon}
        </div>

        {/* Badge Name */}
        <h4 className="font-semibold mb-2 text-sm text-center">{badge.name}</h4>

        {/* Badge Description */}
        <p className="text-xs text-center" style={{ color: 'var(--textSec)' }}>
          {badge.description}
        </p>

        {/* Progress Bar for Locked Badges */}
        {!badge.isUnlocked && badge.progress > 0 && (
          <div className="mt-4 w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${badge.progress}%`, backgroundColor: badge.color }}
            />
          </div>
        )}

        {/* Badge Status */}
        <div className="text-xs mt-3 font-medium" style={{ color: badge.isUnlocked ? badge.color : 'var(--textSec)' }}>
          {badge.isUnlocked ? '🔓 Unlocked' : badge.progress > 0 ? `${Math.round(badge.progress)}%` : '🔒 Locked'}
        </div>

        {/* Lock Icon Overlay for Locked Badges */}
        {!badge.isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg pointer-events-none" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
            <span className="text-lg">🔒</span>
          </div>
        )}
      </div>

      {/* Tooltip on Hover */}
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-black text-white text-xs rounded px-3 py-2 z-50 whitespace-nowrap"
          style={{
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
          }}
        >
          {badge.category === 'milestone' && '📊 Milestone'}
          {badge.category === 'ranking' && '🏅 Ranking'}
          {badge.category === 'career' && '🎓 Career'}
        </div>
      )}
    </div>
  );
};


export default UserProfile
import { useState } from 'react'
import Button from '../../components/ui/Button';

const UserProfile = () => {
  const [userStatus] = useState({
    name: "Detective John Doe",
    level: 12,
    casesSolved: 24,
    totalPoints: 3240,
    winStreaks: 7,
    rank: "#147",
    avatar: ""
  });

  const difficultyDistribution = [
    { level: "Easy", count: 12, color: 'bg-green-500' },
    { level: "Medium", count: 8, color: 'bg-yellow-500' },
    { level: "Hard", count: 4, color: 'bg-red-500' }
  ];

  const learningDistribution = [
    { topic: 'Data Structures', percentage: 75 },
    { topic: 'Algorithms', percentage: 60 },
    { topic: 'Web Development', percentage: 45 }
  ];

  const achievements = [
    { icon: '🏆', title: 'First Victory', description: 'Won your first case' },
    { icon: '⚡', title: 'Speed Solver', description: 'Solve case in 2 mins' },
    { icon: '🔥', title: 'Streak Master', description: '7 day streak' },
    { icon: '🧠', title: 'Code Master', description: '100% accuracy' },
    { icon: '⭐', title: 'Rising Star', description: 'Reached Level 10' },
    { icon: '💎', title: 'Persistent', description: '15 cases solved' },
    { icon: '🎯', title: 'Focused', description: 'Finished Goals' },
    { icon: '✅', title: 'Elite', description: 'Top 100 rank' }
  ];

  return (
    <div className="relative bg-black text-white p-8">
      
      {/* Profile Header */}
      <div className="profile-wrapper">
        <div className="bg-linear-to-r from-green-900/30 to-green-800/20 border border-green-700/50 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-4xl">
              {userStatus.avatar}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{userStatus.name}</h1>
              <p className="text-gray-400 text-left">
                Level {userStatus.level} | Rank <span className="text-green-400">{userStatus.rank}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-black/40 border border-green-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
                <span>✓</span>
                <span>Cases Solved</span>
              </div>
              <div className="text-3xl font-bold text-green-400">{userStatus.casesSolved}</div>
            </div>
            <div className="bg-black/40 border border-green-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
                <span>⭐</span>
                <span>Total Points</span>
              </div>
              <div className="text-3xl font-bold text-green-400">{userStatus.totalPoints}</div>
            </div>
            <div className="bg-black/40 border border-green-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
                <span>🔥</span>
                <span>Win Streak</span>
              </div>
              <div className="text-3xl font-bold text-green-400">{userStatus.winStreaks}</div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <h2 className="text-2xl text-left font-bold mb-6">Statistics</h2>
        <div className="grid grid-cols-2 gap-6 mb-8">

          {/* Difficulty Distribution */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Difficulty Distribution</h3>
            <div className="space-y-4">
              {difficultyDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{item.level}</span>
                    <span className="text-white font-semibold">{item.count}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${(item.count / 24) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Distribution */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Learning Distribution</h3>
            <div className="space-y-4">

              {learningDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{item.topic}</span>
                    <span className="text-white font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <h2 className="text-2xl text-left font-bold mb-6">Achievements</h2>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center hover:border-green-600 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">{achievement.icon}</div>
              <h4 className="font-semibold mb-1">{achievement.title}</h4>
              <p className="text-xs text-gray-400">{achievement.description}</p>
            </div>
          ))}
        </div>

        {/* Account Settings Section */}
        <h2 className="text-2xl text-left font-bold mb-6">Account Settings</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="space-y-4">
            {['Edit', 'Change', 'Configure'].map((action, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-0">
                <div>
                  <div className="font-medium">Email Address</div>
                  <div className="text-sm text-gray-400">john@crackcode.com</div>
                </div>
                <Button variant='outline' size='sm' className='text-white border border-white'>{action}</Button>

              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone Section */}
        <h2 className="text-2xl text-left font-bold mb-6">Danger Zone</h2>
        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6">
          <h3 className="text-xl text-left font-bold mb-2">Terminate Account</h3>
          <p className="text-gray-400 mb-4 text-left">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <div className='flex justify-start'>
            <Button variant='outline' size='lg' className='text-red-600 border border-red-600 hover:text-red-500 hover:border-red-500'>Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default UserProfile
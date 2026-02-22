import { useEffect } from 'react'
import { useTheme } from '../../context/theme/ThemeContext'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import LeftSidebar from '../../components/home/LeftSidebar'
import TopContentArea from '../../components/home/TopContentArea'
import ProfileCard from '../../components/home/ProfileCard'
import LeaderboardCard from '../../components/home/LeaderboardCard'
import FullWidthChallenges from '../../components/home/FullWidthChallenges'
import BrainBreaker from '../../components/home/BrainBreaker'
import ChallengesThisWeek from '../../components/home/ChallengesThisWeek'
import RecommendedChallenges from '../../components/home/RecommendedChallenges'
import StreakCalendar from '../../components/home/StreakCalendar'

function Home() {
  const { theme, setTheme } = useTheme()

  // Set light theme by default on home page
  useEffect(() => {
    if (theme !== 'light') {
      setTheme('light')
    }
  }, [theme, setTheme])

  return (
    <div className='min-h-screen flex flex-col' style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header variant="default" />
      
      <main className='flex-1 w-full flex flex-col'>
        {/* Top Section with Sidebars - Three Column Layout */}
        <div className='px-6 sm:px-10 py-10 flex-1 flex flex-col'>
          <div className='flex gap-6 pt-20 flex-1 items-stretch'>
            {/* Left Sidebar */}
            <LeftSidebar />
            
            {/* Center Content Area */}
            <TopContentArea />
            
            {/* Right Sidebar - Profile & Leaderboard */}
            <div className='w-80 shrink-0 space-y-4 flex flex-col'>
              <ProfileCard />
              <LeaderboardCard />
            </div>
          </div>
        </div>

        {/* Full Width Challenges Section */}
        <FullWidthChallenges />

        {/* Brain Breaker Mini-Game Section */}
        <div className='px-6 sm:px-10 py-8'>
          <BrainBreaker />
        </div>

        {/* Weekly Challenges Section */}
        <ChallengesThisWeek />

        {/* Recommended Challenges Section */}
        <RecommendedChallenges />

        {/* Activity Streak Calendar Section */}
        <StreakCalendar />
      </main>

      <Footer />
    </div>
  )
}

export default Home
import Card from '../ui/Card'
import Avatar from '../common/Avatar'
import ChallengeCard from './ChallengeCard';

function RightSidebar() {
  return (
    <div className='w-80 shrink-0 space-y-4'>

      <Card variant='flat'
      icon={<Avatar className='text-white w-20' />}
      title='John Doe'
      subtitle='Level 24'/>

      <ChallengeCard
        title='Daily Challenge'
        subtitle='"The Missing Witness" - Find the suspect using binary search'
        points='+50 pts'
        completed={1}
        total={3}
        buttonText='Start Challenge'
        buttonVariant='outline' 
      />

      <ChallengeCard
        title='Weekly Challenge'
        subtitle='"The Heist" - Solve 5 cases this week'
        points='+150 pts'
        completed={3}
        total={5}
        buttonText='View Challenge'
        buttonVariant='outline' 
      />

    </div>
  )
}

export default RightSidebar

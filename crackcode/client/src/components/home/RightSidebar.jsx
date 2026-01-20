import Card from '../ui/Card'
import Avatar from '../common/Avatar'
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

function RightSidebar() {
  return (
    <div className='w-80 shrink-0 space-y-4'>

      <Card variant='flat'
      icon={<Avatar className='text-white w-20' />}
      title='John Doe'
      subtitle='Level 24'/>

      <Card variant='flat'
      title='Daily Challenge'
      badge={<Badge type='point' size='md'>+50 pts</Badge>}
      subtitle='"The Missing Witness" - Find the suspect using binary search'
      description={<ProgressBar size='sm' completed={1} total={3} variant='default' labelText='cases completed' showLabel/>}
      footer={<Button variant='outline' fullWidth>Start Challenge</Button>}/>

      <Card variant='flat'
      badge={<Badge type='point' size='md'>+100 pts</Badge>}
      title='Weekly Challenge'
      subtitle='"The Heist" - Solve 5 cases this week' 
      description={<ProgressBar size='sm' completed={1} total={4} variant='default' labelText='cases completed' showLabel/>}
      footer={<Button variant='outline' fullWidth>View Challenge</Button>}/>

    </div>
  )
}

export default RightSidebar

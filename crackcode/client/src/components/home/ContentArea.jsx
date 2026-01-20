import Card from '../ui/Card'
import Badge from '../ui/Badge'

const cases = [
    {
        title: 'The Sum Mystery', 
        description: 'A crucial set of data has been stolen and scattered through arrays. Track each piece and reconstruct what was taken.',
        difficulty: 'Easy',
        points: '+100 pts'
    },
    {
        title: 'The Missing Evidence',
        description: 'Find the missing piece of evidence in a sequence of numbered items.',
        difficulty: 'Medium',
        points: '+150 pts'
    },
    {
        title: 'Duplicate Case',
        description: 'Identify duplicate clues in the evidence collection.',
        difficulty: 'Hard',
        points: '+250 pts'
    }    
];

function ContentArea() {
  return (
    <div className='grow px-5'>
      <h1 className='text-3xl font-bold'>Welcome Back, Detective!</h1>
        <p className='text-gray-300 mt-2 mb-6'>Ready to solve more mysteries and climb the leaderboard?</p>

        <h3 className="text-2xl text-left font-bold mb-6">Active Cases</h3>

        <Card variant='flat'
        title='The Sum Mystery'
        subtitle='A crucial set of data has been stolen and scattered through arrays. Track each 
piece and reconstruct what was taken.'
        badge={<Badge type='default' size='md' className=''>+50 pts</Badge>}
        />

    </div>
  )
}

export default ContentArea

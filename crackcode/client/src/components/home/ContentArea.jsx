import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button';
import InviteCard from './InviteCard';

const cases = [
    {
        title: 'The Sum Mystery', 
        description: 'A crucial set of data has been stolen and scattered through arrays. Track each piece and reconstruct what was taken.',
        difficulty: 'easy',
        difficultyLabel: 'Easy',
        points: '+100 pts'
    },
    {
        title: 'The Missing Evidence',
        description: 'Find the missing piece of evidence in a sequence of numbered items.',
        difficulty: 'medium',
        difficultyLabel: 'Medium',
        points: '+150 pts'
    },
    {
        title: 'Duplicate Case',
        description: 'Identify duplicate clues in the evidence collection.',
        difficulty: 'hard',
        difficultyLabel: 'Hard',
        points: '+250 pts'
    }    
];

function ContentArea() {
  return (
    <div className='grow px-5'>
      <h1 className='text-3xl font-bold'>Welcome Back, Detective!</h1>
        <p className='text-gray-300 mt-2 mb-6'>Ready to solve more mysteries and climb the leaderboard?</p>

        <h3 className="text-2xl text-left font-bold mb-6">Active Cases</h3>

        <div className='space-y-6'>
          {cases.map((caseItem, index) => (
            <Card key={index} 
              variant='flat'
              title={caseItem.title}
              subtitle={caseItem.description}
              actions={<Button variant='primary'>Investigate</Button>}
              footer={
                <div className='gap-2 flex'>
                  <Badge
                    type='difficulty'
                    difficulty={caseItem.difficulty}
                    size='md'
                  >
                    {caseItem.difficultyLabel}
                  </Badge>

                  <Badge
                    type='default'
                    size='md'
                  >
                    {caseItem.points}
                  </Badge>
                </div>
              }
            />
          ))}
        </div>

          
        <InviteCard />

    </div>
  )
}

export default ContentArea

import Card from '../ui/Card'
import { FileUser, Medal, Footprints } from 'lucide-react';

const menuItems = [
    {
        icon: FileUser,
        title: 'Case Files',
        description: 'Browse and select from active investigations'
    },
    {
        icon: Medal,
        title: 'Achievements',
        description: 'Earn badges and unlock special rewards'
    },
    {
        icon: Footprints,
        title: 'Learning Path',
        description: 'Follow guided tutorials and resources'
    }
]

function LeftSidebar() {
  return (
    <div className='w-64 flex-shrink-0 '>

      <Card title='The Investigation' 
      subtitle='Welcome Detective! you have been recruited to solve the most challenging cases in the digital world. 
      Each case will test your algorithmic thinking and problem solving skills.'
      variant='flat' hoverEffect='none' padding='md'>
        <div className=' flex-col space-y-4'>
            {menuItems.map((item, index) => (
                <div key={index} className='flex flex-row items-start gap-3 left-0'>
                    <div>
                        <item.icon className='w-6 text-orange-500 shrink-0' />
                    </div>
                    
                    <div className='flex flex-col flex-1 min-w-0'>
                        <h3 className='font-semibold leading-tight'>{item.title}</h3>
                        <p className='text-sm text-gray-400 mt-1 leading-relaxed'>{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
       </Card>

    </div>
  )
}

export default LeftSidebar

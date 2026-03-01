/**
 * Test Component - QuestionCompletionTester
 * 
 * Use this component TEMPORARILY to test badge unlocks.
 * Remove before production.
 * 
 * Import in Home.jsx like:
 * import QuestionCompletionTester from '../components/home/QuestionCompletionTester'
 * Then add <QuestionCompletionTester /> anywhere in Home.jsx
 */

import { useUserProgress } from '../../context/userauth/useUserProgress';
import { Zap } from 'lucide-react';

export default function QuestionCompletionTester() {
  const { completeQuestion, questionsCompleted } = useUserProgress();

  return (
    <div className='fixed bottom-4 right-4 z-50 p-3 rounded-lg' style={{ background: 'rgba(255, 165, 0, 0.9)', color: '#fff' }}>
      <div className='flex items-center gap-2'>
        <div>
          <p className='text-xs font-bold'>Questions: {questionsCompleted}</p>
          <button
            onClick={() => completeQuestion()}
            className='mt-1 px-3 py-1 rounded text-xs font-semibold' 
            style={{ background: '#fff', color: 'var(--brand)' }}
          >
            Complete Q
          </button>
        </div>
        <Zap className='w-4 h-4' />
      </div>
    </div>
  );
}

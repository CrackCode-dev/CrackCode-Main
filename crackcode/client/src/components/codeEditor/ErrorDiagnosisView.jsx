import { useState } from 'react';

// shows a detailed error breakdown in the errror diagnosis tab
// uses AI hints if available, otherwise falls back to built-in hints

// built-in hints for each error type, shown when AI is off
const FALLBACK = {
  'Wrong Answer': {
    whatWentWrong: 'Your code ran without errors but produced the wrong output. This usually means the logic or calculation produces a different value than intended.',
    steps: [
      'Check what your code returns or prints — trace it step by step',
      'Verify any mathematical formulas or conditions in your logic',
      'Consider edge cases: what happens with 0, negatives, or empty input?',
    ],
  },
  'Name Error': {
    whatWentWrong: 'A variable or function name was used that hasn\'t been defined at that point. Think of it like calling someone by a name they don\'t know yet.',
    steps: [
      'Check for spelling mistakes in variable names — Python is case-sensitive',
      'Make sure the variable is defined BEFORE the line where it\'s used',
      'Check if it\'s inside a function but was defined outside (or vice versa)',
    ],
  },
  'Index Error': {
    whatWentWrong: 'You tried to access a position in a list or string that doesn\'t exist. If a list has 3 items, the valid positions are 0, 1, and 2 — not 3.',
    steps: [
      'Print the length of your list/string and compare it to the index you\'re using',
      'Check if your loop goes one step too far (common off-by-one error)',
      'Make sure the list isn\'t empty before accessing it',
    ],
  },
  'Type Error': {
    whatWentWrong: 'An operation was performed on data of the wrong type — like trying to add a number to a word. Python and JavaScript need matching types for many operations.',
    steps: [
      'Print or check the type of the variable causing the error',
      'Look for places where you mix strings and numbers without converting',
      'Check function arguments — are you passing the right types?',
    ],
  },
  'Syntax Error': {
    whatWentWrong: 'The code structure is invalid and cannot be read. This is like a grammatical error in English — the sentence can\'t be understood.',
    steps: [
      'Look at the line number in the error — check that line and the one above it',
      'Check for missing colons (:) after if/for/def/while',
      'Count your opening and closing brackets, parentheses, and quotes',
    ],
  },
  'Zero Division Error': {
    whatWentWrong: 'The code tried to divide a number by zero, which is mathematically undefined. This usually happens when a variable unexpectedly holds the value 0.',
    steps: [
      'Find where division happens in your code',
      'Check what value the denominator (bottom number) holds at that point',
      'Add a condition to guard against dividing when the value is 0',
    ],
  },
  'Indentation Error': {
    whatWentWrong: 'Python uses spacing (indentation) to understand code structure. A block that\'s indented wrongly breaks the entire structure.',
    steps: [
      'Check the line mentioned in the error — is it indented consistently?',
      'Make sure you use either all spaces or all tabs (not mixed)',
      'Every line inside an if/for/def block must be indented equally',
    ],
  },
  'Value Error': {
    whatWentWrong: 'A function received a value of the right type but an invalid value — like trying to convert the text "hello" to an integer.',
    steps: [
      'Check what value is being passed to the function that\'s failing',
      'Verify that input values are in the expected format before converting them',
      'Add a print statement before the failing line to see what value it contains',
    ],
  },
  'Compilation Error': {
    whatWentWrong: 'The code could not even be compiled — there is a structural error that stops the program before it runs.',
    steps: [
      'Read the error message carefully — it usually points to the exact line',
      'Check for missing semicolons, brackets, or type mismatches',
      'Make sure all function signatures and variable declarations are correct',
    ],
  },
};

const getFallback = (errorType) =>
  FALLBACK[errorType] || {
    whatWentWrong: 'An unexpected error occurred while running your code.',
    steps: [
      'Read the error message carefully for clues',
      'Add print statements to trace what your variables contain',
      'Test your code with simpler inputs to isolate where it breaks',
    ],
  };

//  Error type styling 

const ERROR_STYLE = {
  'Wrong Answer':       { icon: '⚠️', color: 'text-amber-400',   border: 'border-amber-500/40',   bg: 'bg-amber-950/20' },
  'Runtime Error':      { icon: '💥', color: 'text-red-400',     border: 'border-red-500/40',     bg: 'bg-red-950/20'   },
  'Syntax Error':       { icon: '📋', color: 'text-orange-400',  border: 'border-orange-500/40',  bg: 'bg-orange-950/20'},
  'Name Error':         { icon: '🔍', color: 'text-red-400',     border: 'border-red-500/40',     bg: 'bg-red-950/20'   },
  'Index Error':        { icon: '📏', color: 'text-red-400',     border: 'border-red-500/40',     bg: 'bg-red-950/20'   },
  'Type Error':         { icon: '🔀', color: 'text-purple-400',  border: 'border-purple-500/40',  bg: 'bg-purple-950/20'},
  'Zero Division Error':{ icon: '➗', color: 'text-red-400',     border: 'border-red-500/40',     bg: 'bg-red-950/20'   },
  'Indentation Error':  { icon: '↹',  color: 'text-yellow-400',  border: 'border-yellow-500/40',  bg: 'bg-yellow-950/20'},
  'Value Error':        { icon: '❌', color: 'text-red-400',     border: 'border-red-500/40',     bg: 'bg-red-950/20'   },
  'Compilation Error':  { icon: '🔨', color: 'text-orange-400',  border: 'border-orange-500/40',  bg: 'bg-orange-950/20'},
  'Attribute Error':    { icon: '🔗', color: 'text-red-400',     border: 'border-red-500/40',     bg: 'bg-red-950/20'   },
  'Import Error':       { icon: '📦', color: 'text-red-400',     border: 'border-red-500/40',     bg: 'bg-red-950/20'   },
};

const getStyle = (errorType) =>
  ERROR_STYLE[errorType] || { icon: '❌', color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-950/20' };

// small expandable card that teaches the concept behind the error
const ConceptCard = ({ title, lesson }) => {
  const [open, setOpen] = useState(false);
  if (!title) return null;

  return (
    <div className="rounded-lg border border-amber-500/25 bg-amber-950/10 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-amber-900/15 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-xs">📖</span>
          <span className="text-amber-300 text-xs font-semibold">Concept: {title}</span>
        </div>
        <svg className={`w-3 h-3 text-amber-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && lesson && (
        <div className="px-3 pb-3 pt-1 border-t border-amber-500/15">
          <p className="text-xs text-amber-100/75 leading-relaxed">{lesson}</p>
        </div>
      )}
    </div>
  );
};

// main component
const ErrorDiagnosisView = ({ result }) => {
  if (!result) return null;

  const style    = getStyle(result.errorType);
  const ai       = result.aiAnalysis;
  const fallback = getFallback(result.errorType);
  const isWA     = result.errorType === 'Wrong Answer';

  // use AI content when available, otherwise use built-in hints
  const simplifiedMessage = ai?.simplifiedMessage || null;
  const whatWentWrong     = ai?.whatWentWrong     || fallback.whatWentWrong;
  const steps             = ai?.actionableSteps   || fallback.steps;
  const conceptTitle      = ai?.conceptTitle      || null;
  const conceptLesson     = ai?.conceptLesson     || null;

  return (
    <div className="space-y-3">

      {/*  Error type header  */}
      <div className={`rounded-lg border ${style.border} ${style.bg} px-3 py-2.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-base">{style.icon}</span>
          <span className={`text-sm font-bold ${style.color}`}>{result.errorType}</span>
        </div>
        {result.testNumber && (
          <span className="text-[10px] text-gray-600 font-mono bg-gray-800/60 px-2 py-0.5 rounded">
            Test {result.testNumber}
          </span>
        )}
      </div>

      {/*  Expected vs Actual (Wrong Answer only)  */}
      {isWA && result.expected != null && (
        <div className="rounded-lg border border-gray-700/50 bg-[#181818] overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-gray-700/50">
            <div className="p-2.5">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-1.5">Expected</p>
              <p className="text-sm font-mono text-emerald-400 font-bold">{result.expected}</p>
            </div>
            <div className="p-2.5">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-1.5">Your Output</p>
              <p className="text-sm font-mono text-red-400 font-bold">{result.actual || 'no output'}</p>
            </div>
          </div>
        </div>
      )}

      {/* raw error message (Runtime errors)  */}
      {!isWA && result.rawError && (
        <div className="rounded-lg bg-[#1a0f0f] border border-red-900/40 p-3">
          <p className="text-[10px] text-red-500 uppercase tracking-widest font-semibold mb-1.5">Error Message</p>
          <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {result.rawError}
          </pre>
        </div>
      )}

      {/*  AI simplified message  */}
      {simplifiedMessage && (
        <div className="rounded-lg bg-blue-950/20 border border-blue-500/25 px-3 py-2.5">
          <p className="text-xs text-blue-100 leading-relaxed">{simplifiedMessage}</p>
          <p className="text-[10px] text-blue-500/60 mt-1.5 font-semibold">✦ AI Analysis</p>
        </div>
      )}

      {/*  What went wrong  */}
      <div className="rounded-lg bg-[#161616] border border-gray-800 px-3 py-2.5">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">What went wrong</p>
        <p className="text-xs text-gray-300 leading-relaxed">{whatWentWrong}</p>
      </div>

      {/*  Actionable steps  */}
      {steps?.length > 0 && (
        <div className="rounded-lg bg-[#161616] border border-gray-800 px-3 py-2.5">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Steps to check</p>
          <ol className="space-y-1.5">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="shrink-0 w-4 h-4 rounded-full bg-gray-700 text-gray-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/*  Concept card  */}
      <ConceptCard title={conceptTitle} lesson={conceptLesson} />
    </div>
  );
};

export default ErrorDiagnosisView;

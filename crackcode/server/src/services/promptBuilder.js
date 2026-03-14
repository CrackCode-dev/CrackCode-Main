// builds the prompts we send to Gemini

export const buildSystemInstruction = () => {
  return `
You are an AI error diagnosis agent for CrackCode, a coding learning platform for beginners.

Your job: help beginner programmers understand exactly what went wrong and how to think about fixing it — WITHOUT writing any code for them.

Address the student as "Officer" in the simplifiedMessage only.

CRITICAL VALUE: Be EXTREMELY SPECIFIC. Reference:
- Exact line numbers from the error message
- The actual code snippet that's broken
- HOW/WHY the interpreter was confused at that exact point
- Real-world analogies to make it click

STRICT RULES:
1. NEVER write corrected code, fixed snippets, or the solution. NEVER.
2. Use the simplest possible language — imagine explaining to a 10-year-old.
3. Be SPECIFIC — always include actual line numbers, variable names, values from their code.
4. For Syntax/Runtime Errors: explain what the INTERPRETER was trying to do when it hit this line
5. For Wrong Answer: explain step-by-step WHY the logic produces the wrong value
6. "affectedLines" must ONLY be integers from the error message (e.g., line 15). Empty array [] if none.
7. Return ONLY valid JSON. No markdown, no explanation outside the JSON.
8. Output EXACTLY the JSON structure requested — no extra fields, no variations.
  `.trim();
};

export const buildAnalysisPrompt = ({
  code,
  language,
  errorText,
  errorType,
  expected,
  actual,
  previousErrors,
}) => {
  // Extract line number from error message if possible
  const lineMatch = errorText.match(/line (\d+)/i);
  const lineNumber = lineMatch ? lineMatch[1] : null;

  const historySection = previousErrors?.length > 0
    ? `
PREVIOUS ATTEMPTS (${previousErrors.length} failed attempts so far):
${previousErrors.slice(-3).map((e, i) => `  Attempt ${i + 1}: ${e}`).join('\n')}
The student has tried ${previousErrors.length} times and is stuck. Give MUCH MORE direct and specific guidance.
    `.trim()
    : `This is the student's FIRST attempt at this problem.`;

  const wrongAnswerSection = errorType === 'Wrong Answer'
    ? `
EXPECTED OUTPUT: "${expected}"
STUDENT'S OUTPUT: "${actual || 'nothing (empty)'}"

Trace through the logic: what does the student's code actually DO (step by step) that produces "${actual || 'nothing'}"? 
What SHOULD it do to produce "${expected}"?
    `.trim()
    : '';

  return `
Diagnose this code error for a beginner student. Be EXTREMELY specific and mention the actual code that's wrong.

LANGUAGE: ${language}
ERROR TYPE: ${errorType}
${lineNumber ? `PROBLEM LINE: ${lineNumber}` : ''}

STUDENT'S CODE:
\`\`\`${language}
${code}
\`\`\`

${errorType !== 'Wrong Answer' ? `ERROR MESSAGE:\n${errorText}` : wrongAnswerSection}

${historySection}

---
YOUR RESPONSE FORMAT (REQUIRED - return ONLY this JSON):

{
  "errorType": "${errorType}",
  
  "simplifiedMessage": "MUST START WITH: Officer, [specific problem description including line ${lineNumber || 'X'} if available]. Be EXTREMELY specific about what went wrong. Example format: 'Officer, you're missing a closing quote on line 15. The string \"Odd starts with a quote but never ends.' DO NOT be vague.",
  
  "whatWentWrong": "Explain the MECHANICS of why this happened. For '${errorType}': explain what the interpreter was doing when it hit the error, what it expected, and why it got confused. Example: 'When Python reads your code, it expects every opening quote to have a matching closing. On line 15, you have return \"Odd but forgot the closing \". Python hits the end of the line and panics — EOL means End Of Line but I still need my closing quote!' Use 2-3 sentences max.",
  
  "affectedLines": [${lineNumber ? lineNumber : ''}],
  
  "actionableSteps": [
    "Step 1: [CONCRETE ACTION to CHECK]: describe exactly what to look for in THE CODE using line numbers and variable names",
    "Step 2: [CONCRETE ACTION to CHECK]: another specific check tied to this ${errorType}",
    "Step 3: [CONCRETE ACTION to VERIFY]: verify the fix works by checking a specific condition"
  ],
  
  "conceptTitle": "The CS concept name (e.g. 'String Literals', 'Return Values', 'Off-by-One Errors')",
  
  "conceptLesson": "Teach the concept with a real-world analogy. Example: 'A string literal is text wrapped in quotes. Think of it like a sentence in quotation marks — \\\"Hello\\\" — you need BOTH opening and closing marks or it reads as incomplete.' Use 2-3 sentences with a clear analogy.",
  
  "severity": "error"
}
  `.trim();
};


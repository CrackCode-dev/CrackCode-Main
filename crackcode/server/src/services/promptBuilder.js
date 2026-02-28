// builds the prompts we send to Gemini

export const buildSystemInstruction = () => {
  return `
You are an AI error diagnosis agent for CrackCode, a coding learning platform for beginners.

Your job: help beginner programmers understand exactly what went wrong and how to think about fixing it — WITHOUT writing any code for them.

Address the student as "Officer" in the simplifiedMessage only.

STRICT RULES:
1. NEVER write corrected code, fixed snippets, or the solution.
2. Use the simplest possible language — imagine explaining to a 14-year-old.
3. Be SPECIFIC — reference the actual variable names, line numbers, or values in the student's code.
4. For Wrong Answer: reason about WHY the output differs — what logic produces the wrong value.
5. For Runtime Errors: explain what the specific error type MEANS, not just what it's called.
6. "affectedLines" must ONLY contain integers found in the error stack trace. Empty array [] if none.
7. Return ONLY valid JSON. No markdown, no explanation outside the JSON.
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

  const historySection = previousErrors?.length > 0
    ? `
PREVIOUS ATTEMPTS (${previousErrors.length} so far):
${previousErrors.slice(-3).map((e, i) => `  Attempt ${i + 1}: ${e}`).join('\n')}
The student is stuck — give stronger, more direct hints this time.
    `.trim()
    : `This is the student's first attempt.`;

  const wrongAnswerSection = errorType === 'WrongAnswer'
    ? `
EXPECTED OUTPUT: "${expected}"
STUDENT'S OUTPUT: "${actual || 'nothing (empty)'}"

The gap: the student's code produces ${actual || 'nothing'} but should produce ${expected}.
Analyse WHY the logic produces this wrong value — what operation, condition, or variable is likely causing the gap.
    `.trim()
    : '';

  return `
Diagnose this code error for a beginner student.

LANGUAGE: ${language}
ERROR TYPE: ${errorType}

STUDENT'S CODE:
\`\`\`${language}
${code}
\`\`\`

${errorType !== 'WrongAnswer' ? `ERROR MESSAGE:\n${errorText}` : wrongAnswerSection}

${historySection}

Return ONLY this JSON (all fields required):
{
  "errorType": "${errorType}",
  "simplifiedMessage": "Start with 'Officer,' — one sentence in plain English explaining exactly what went wrong. Be specific: mention the actual value, variable name, or line if known.",
  "whatWentWrong": "2-3 sentences: explain the root cause clearly. For WrongAnswer, explain what the code is computing vs what it should compute. For errors, explain what the error type means in simple terms with a real-world analogy.",
  "affectedLines": [integer line numbers from the error trace only — [] if none],
  "actionableSteps": [
    "Step 1: concrete thing to CHECK (not fix) — be specific to this code",
    "Step 2: another concrete check",
    "Step 3: optional third check"
  ],
  "conceptTitle": "Name of the CS concept (e.g. 'Return Values', 'List Indexing', 'Variable Scope')",
  "conceptLesson": "2-3 sentences teaching the concept. Include a real-world analogy.",
  "severity": "error | warning"
}
  `.trim();
};


/**
 * Detective-themed message generator that is nedded for the  code execution results
 */

const successMessages = [
  "Excellent detective work! You've cracked this part of the case.",
  "The evidence checks out perfectly. Well done, Detective!",
  "Your deductive reasoning is impeccable. Case closed!",
  "The clues align perfectly. You've solved this mystery!",
  "Outstanding work, Detective! The case is solved.",
];

const runtimeErrorMessages = [
  "Detective! The investigation hit a snag. There's an error in your approach.",
  "Hold on, Detective. Something went wrong during the investigation.",
  "The case took an unexpected turn. Check your methods.",
  "Detective, your investigation tool malfunctioned. Review your code.",
  "An obstacle appeared in the investigation. Time to debug!",
];

const compileErrorMessages = [
  "Detective! Your case notes are illegible. Fix the syntax errors.",
  "The investigation cannot proceed with these errors in the documentation.",
  "Your case file has formatting issues. Clean it up to continue.",
  "Detective, the evidence is incomplete. Check your code structure.",
  "The investigation tools won't work with these errors present.",
];

const wrongAnswerMessages = [
  "Detective! You wandered off the map. The answer doesn't match the evidence.",
  "Close, but not quite right. Review the clues and try again.",
  "The evidence doesn't support this conclusion. Keep investigating!",
  "You're on the wrong trail, Detective. Double-check your logic.",
  "The case isn't solved yet. Your answer doesn't match the expected outcome.",
];

/**
 * Generate a random detective message based on the result type
 */
export const generateDetectiveMessage = (type, testCaseNumber = 1) => {
  const getRandomMessage = (messages) => {
    return messages[Math.floor(Math.random() * messages.length)];
  };

  switch (type) {
    case 'success':
      return getRandomMessage(successMessages);
    case 'runtime_error':
      return getRandomMessage(runtimeErrorMessages);
    case 'compile_error':
      return getRandomMessage(compileErrorMessages);
    case 'wrong_answer':
      return getRandomMessage(wrongAnswerMessages);
    default:
      return "The investigation continues...";
  }
};

/**
 * Generate contextual hints based on error type
 */
export const generateErrorHint = (errorType, errorMessage) => {
  if (errorMessage.includes('IndexError') || errorMessage.includes('out of bounds')) {
    return "Detective! You wandered off the map. Check your array indices and loop boundaries.";
  }
  
  if (errorMessage.includes('NameError') || errorMessage.includes('undefined')) {
    return "You're referencing evidence that doesn't exist. Check your variable names and declarations.";
  }
  
  if (errorMessage.includes('TypeError')) {
    return "The evidence types don't match. Review your data types and operations.";
  }
  
  if (errorMessage.includes('SyntaxError')) {
    return "Your case notes have formatting issues. Check your syntax carefully.";
  }
  
  if (errorMessage.includes('ZeroDivisionError') || errorMessage.includes('division by zero')) {
    return "Detective! You can't divide the evidence by zero. Check your calculations.";
  }
  
  return "Review the error carefully and trace through your code step by step.";
};

/**
 * Generate success summary message
 */
export const generateSuccessSummary = (totalTests, language) => {
  const messages = [
    `Congratulations, Detective! You've successfully solved all ${totalTests} cases using ${language}!`,
    `Case closed! All ${totalTests} test cases passed. Your ${language} skills are impressive!`,
    `Brilliant work! You've cracked the entire case with ${totalTests}/${totalTests} tests passing!`,
    `The mystery is solved! All evidence points to success in ${language}!`,
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Generate failure summary message
 */
export const generateFailureSummary = (passedTests, totalTests) => {
  const messages = [
    `Detective, you've solved ${passedTests} out of ${totalTests} cases. Keep investigating!`,
    `${passedTests}/${totalTests} cases closed. The investigation continues...`,
    `You're making progress! ${passedTests} cases solved, ${totalTests - passedTests} remaining.`,
    `Good work on ${passedTests} cases, but ${totalTests - passedTests} mysteries remain unsolved.`,
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};
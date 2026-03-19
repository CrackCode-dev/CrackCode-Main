export const checkFillBlankAnswer = (userAnswer, correctAnswers) => {

  const normalizedUserAnswer = userAnswer
    .toLowerCase()
    .trim();

  return correctAnswers.some(ans => {
    const normalizedAns = ans.toLowerCase().trim();

    // Exact match
    if (normalizedAns === normalizedUserAnswer) return true;

    // If correct answer is two words, accept either word
    const words = normalizedAns.split(/\s+/);
    if (words.length === 2 && words.includes(normalizedUserAnswer)) return true;

    return false;
  });
};

export const checkFillBlankAnswer = (userAnswer, correctAnswers) => {

  const normalizedUserAnswer = userAnswer
    .toLowerCase()
    .trim();

  return correctAnswers.some(ans =>
    ans.toLowerCase().trim() === normalizedUserAnswer
  );
};

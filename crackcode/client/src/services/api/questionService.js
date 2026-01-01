import { MOCK_PROBLEMS } from './mockAPI';

export const fetchProblemById = async (id) => {
  // Simulate network delay for a realistic UI feel
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const problem = MOCK_PROBLEMS[id];
      if (problem) {
        resolve(problem);
      } else {
        reject(new Error("Case file not found in the archives."));
      }
    }, 800);
  });
};
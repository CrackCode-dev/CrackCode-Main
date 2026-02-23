const API_BASE_URL = 'http://localhost:5050/api/learn';

/**
 * Fetch all questions with optional filters
 * @param {string} difficulty - Optional: 'Easy', 'Medium', 'Hard'
 * @param {string} topic - Optional: 'arrays', 'trees', 'graphs', etc.
 */
export const fetchAllQuestions = async (difficulty = null, topic = null) => {
  try {
    let url = `${API_BASE_URL}/questions`;
    const params = new URLSearchParams();

    if (difficulty) params.append('difficulty', difficulty);
    if (topic) params.append('topic', topic);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result; // Handle both formats
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch questions');
  }
};

/**
 * Fetch a single problem by ID (full details with test cases)
 * @param {string} id - Problem ID (problemId or MongoDB _id)
 */
export const fetchProblemById = async (id) => {
  try {
    if (!id) {
      throw new Error('Problem ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/questions/${id}`);

    if (!response.ok) {
      throw new Error(`Problem not found: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    throw new Error(error.message || 'Failed to load problem');
  }
};

/**
 * Fetch a problem with a specific language variant
 * @param {string} id - Problem ID
 * @param {string} language - Language code (python, javascript, java, cpp)
 */
export const fetchProblemByLanguage = async (id, language) => {
  try {
    if (!id || !language) {
      throw new Error('Problem ID and language are required');
    }

    const response = await fetch(`${API_BASE_URL}/questions/${id}/${language}`);

    if (!response.ok) {
      throw new Error(
        `Language variant not found: ${response.statusText}`
      );
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    throw new Error(error.message || 'Failed to load problem with language variant');
  }
};

/**
 * Fetch problems by topic/category
 * @param {string} topic - Topic name (arrays, trees, graphs, etc.)
 */
export const fetchProblemsByTopic = async (topic) => {
  try {
    if (!topic) {
      throw new Error('Topic is required');
    }

    const response = await fetch(`${API_BASE_URL}/questions?topic=${topic}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch problems by topic: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch problems by topic');
  }
};

/**
 * Transform problem data to match frontend format
 * Converts MongoDB schema to UI-friendly format
 */
export const transformProblemData = (problem, language = 'python') => {
  if (!problem) return null;

  // Find the variant for the selected language
  const variant = problem.variants?.find((v) => v.language === language) || 
                  problem.variants?.[0] || {};

  return {
    id: problem.problemId || problem._id,
    problemId: problem.problemId,
    caseNumber: problem.story?.beatId || 'case-001',
    title: problem.original?.title || variant.narrative?.title,
    description: problem.original?.description || variant.narrative?.description,
    difficulty: problem.difficulty,
    topic: problem.topic,
    fileName: `investigation.${language === 'python' ? 'py' : 'js'}`,
    objectives: [], // To be filled from description if needed
    clue: 'Focus on edge cases and constraints',
    example: problem.examples?.[0] || {},
    starterCode: {
      python: problem.variants?.find((v) => v.language === 'python')?.starterCode || '',
      javascript: problem.variants?.find((v) => v.language === 'javascript')?.starterCode || '',
      java: problem.variants?.find((v) => v.language === 'java')?.starterCode || '',
      cpp: problem.variants?.find((v) => v.language === 'cpp')?.starterCode || '',
    },
    testCases: problem.test_cases || [],
    constraints: problem.constraints || [],
    story: problem.story || {},
    variant: variant,
  };
};

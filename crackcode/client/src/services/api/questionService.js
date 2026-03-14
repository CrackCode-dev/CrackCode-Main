const API_BASE_URL = 'http://localhost:5050/api/learn';

// Fetch questions from a language+difficulty specific collection
// e.g. fetchLearnQuestions('python', 'fundamentals') → learnPythonFundamentalsQ
export const fetchLearnQuestions = async (language, difficulty) => {
  try {
    if (!language || !difficulty) {
      throw new Error('Language and difficulty are required');
    }

    const response = await fetch(
      `${API_BASE_URL}/questions/by-collection?language=${encodeURIComponent(language)}&difficulty=${encodeURIComponent(difficulty)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch learn questions: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch learn questions');
  }
};

// fetch all questions, optionally filtered by difficulty or topic
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
    return result.data || result; // handle both response formats
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch questions');
  }
};

// fetch a single problem by its ID (includes test cases)
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

// fetch a problem with starter code for a specific language
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

// fetch all problems belonging to a topic (e.g. 'arrays')
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

// converts a MongoDB problem object into the shape the UI expects
export const transformProblemData = (problem, language = 'python') => {
  if (!problem) return null;

  // Find the variant for the selected language
  const variant = problem.variants?.find((v) => v.language === language) || 
                  problem.variants?.[0] || {};

  // Prefer variant's themed narrative; fall back to the original generic text
  const title       = variant.narrative?.title       || problem.original?.title;
  const description = variant.narrative?.description || problem.original?.description;

  const extMap = { python: 'py', javascript: 'js', java: 'java', cpp: 'cpp' };

  return {
    id: problem.problemId || problem._id,
    problemId: problem.problemId,
    caseNumber: problem.story?.beatId || 'case-001',
    title,
    description,
    difficulty: problem.difficulty,
    topic: problem.topic,
    fileName: `investigation.${extMap[language] || 'py'}`,
    objectives: [],
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

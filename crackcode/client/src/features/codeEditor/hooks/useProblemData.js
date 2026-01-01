import { useState, useEffect } from 'react';
import { useEditor } from '../../../context/codeEditor/EditorContext';
import { fetchProblemById } from '../../../services/api/questionService';

export const useProblemData = (problemId) => {
  const { setCurrentProblem, setCode, setLoading, language } = useEditor();
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProblem = async () => {
      if (!problemId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const problem = await fetchProblemById(problemId);
        
        setCurrentProblem(problem);
        
        // Set initial starter code based on selected language
        if (problem.starterCode && problem.starterCode[language]) {
          setCode(problem.starterCode[language]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to load problem:', err);
        setError(err.message || 'Failed to load case file');
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [problemId, language]);

  return { error };
};
import { useState, useEffect } from 'react';
import { useEditor } from '../../../context/codeEditor/EditorContext';
import { fetchProblemByLanguage, transformProblemData } from '../../../services/api/questionService';

export const useProblemData = (problemId) => {
  const { setCurrentProblem, setCode, setLoading, language, setLanguage } = useEditor();
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProblem = async () => {
      if (!problemId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch problem with specific language variant from backend
        const rawProblem = await fetchProblemByLanguage(problemId, language);

        // Transform the data to match our UI format
        const transformedProblem = transformProblemData(rawProblem, language);

        setCurrentProblem(transformedProblem);

        // Set initial starter code from variant
        if (rawProblem.variant?.starterCode) {
          setCode(rawProblem.variant.starterCode);
        }
      } catch (err) {
        console.error('Failed to load problem:', err);
        setError(err.message || 'Failed to load case file');
        setCurrentProblem(null);
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [problemId, language, setCurrentProblem, setCode, setLoading]);

  return { error, setLanguage };
};
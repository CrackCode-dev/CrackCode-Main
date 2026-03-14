import { useState, useEffect } from 'react';
import { useEditor } from '../../../context/codeEditor/EditorContext';
import { fetchProblemByLanguage, transformProblemData } from '../../../services/api/questionService';

export const useProblemData = (problemId, preloadedQuestion = null) => {
  const { setCurrentProblem, setCode, setLoading, language, setLanguage, languageLocked, setLanguageLocked } = useEditor();
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProblem = async () => {
      if (!problemId) {
        setLoading(false);
        return;
      }

      // If the full question was passed via navigation state, use it directly
      // (questions from learn collections may not exist in the main collection)
      if (preloadedQuestion) {
        try {
          setLoading(true);
          setError(null);
          const transformed = transformProblemData(preloadedQuestion, language);
          setCurrentProblem(transformed);
          const variant = preloadedQuestion.variants?.find((v) => v.language === language)
            || preloadedQuestion.variants?.[0];
          if (variant?.starterCode) setCode(variant.starterCode);
        } catch (err) {
          setError(err.message || 'Failed to load case file');
          setCurrentProblem(null);
        } finally {
          setLoading(false);
        }
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
  }, [problemId, language, preloadedQuestion, setCurrentProblem, setCode, setLoading]);

  return { error, setLanguage, setLanguageLocked };
};
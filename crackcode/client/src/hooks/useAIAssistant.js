
// This hook handles all the API logic for talking to Detective AI

import { useState } from 'react';
import axios from '../api/axios.js';

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const ask = async ({
    question,
    language,
    code,
    problemTitle,
    problemDescription,
    lastJudgeResult
  }) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log('🤖 Asking AI Assistant:', question);

      const response = await axios.post('/ai/assistant', {
        question,
        language,
        code,
        problemTitle,
        problemDescription,
        lastJudgeResult
      }, { withCredentials: true });

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || 'Unknown error');
      }

      if (data.data?.rateLimited) {
        setError({
          type: 'rate_limited',
          message: data.data.message,
          resetAt: data.data.resetAt,
          remaining: data.data.remaining
        });
        setIsLoading(false);
        return;
      }

      if (data.data?.disabled) {
        setError({
          type: 'disabled',
          message: data.data.message
        });
        setIsLoading(false);
        return;
      }

      const aiResponse = data.data;
      setResponse({
        mode: aiResponse.mode,
        reply: aiResponse.reply,
        hintTitle: aiResponse.hintTitle,
        hintText: aiResponse.hintText,
        nextStep: aiResponse.nextStep,
        severity: aiResponse.severity,
        cached: aiResponse.cached || false
      });

      console.log('✅ AI Response:', aiResponse);
    } catch (err) {
      console.error('❌ AI Assistant error:', err);
      setError({
        type: 'error',
        message: err.message || 'Could not get response'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    response,
    ask,
    clearError
  };
};

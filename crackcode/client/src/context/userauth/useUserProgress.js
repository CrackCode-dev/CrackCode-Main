import { useContext } from 'react';
import { UserProgressContext } from './UserProgressContext';

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error('useUserProgress must be used within UserProgressProvider');
  }
  return context;
};

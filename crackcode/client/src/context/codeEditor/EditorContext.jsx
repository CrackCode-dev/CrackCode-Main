import React, { createContext, useContext, useState } from 'react';

const EditorContext = createContext();

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
};

export const EditorProvider = ({ children }) => {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [showClue, setShowClue] = useState(false);
  
  // ✅ CHANGED: Default tab is now 'ai-assistant' instead of 'error-log'
  const [activeTab, setActiveTab] = useState('ai-assistant');
  
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const value = {
    currentProblem, setCurrentProblem, 
    loading, setLoading,
    code, setCode, 
    language, setLanguage,
    isExecuting, setIsExecuting, 
    testResults, setTestResults,
    showClue, setShowClue, 
    activeTab, setActiveTab,
    aiMessages, setAiMessages, 
    aiInput, setAiInput, 
    isAiTyping, setIsAiTyping,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
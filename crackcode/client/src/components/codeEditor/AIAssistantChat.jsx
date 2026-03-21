import React, { useRef, useEffect } from 'react';
import { useEditor } from '../../context/codeEditor/EditorContext';
import axios from '../../api/axios.js';

const AIAssistantChat = () => {
  const { aiMessages, setAiMessages, aiInput, setAiInput, isAiTyping, setIsAiTyping, testResults, code, language } = useEditor();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAiTyping]);

  const sendMessage = async () => {
    const text = aiInput.trim();
    if (!text) return;

    const userMsg = { role: 'user', text, id: Date.now() };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setIsAiTyping(true);

    try {
      console.log('📤 Sending to AI Assistant:', {
        question: text,
        language: language || 'python',
        code: code ? code.substring(0, 100) : '(empty)',
        testResults: testResults?.length || 0
      });

      // Use axios instance (honors VITE_BACKEND_URL)
      const resp = await axios.post('/ai/assistant', {
        question: text,
        language: language || 'python',
        code: code || '',
        problemTitle: '',
        problemDescription: '',
        lastJudgeResult: testResults?.[0] || null
      }, { withCredentials: true });

      const data = resp.data;
      console.log('✅ API response:', data);

      if (!data.success) {
        throw new Error(data.message || 'Unknown error');
      }

      // Get the reply from the API response
      let replyText = data.data?.reply || 'Assistant unavailable.';
      
      // Format with detective emoji
      replyText = `🕵️ ${replyText}`;

      setAiMessages(prev => [...prev, { role: 'assistant', text: replyText, id: Date.now() + 1 }]);
    } catch (error) {
      console.error('❌ AI Assistant error:', error);
      const errorReply = `🕵️ Error: ${error.message}`;
      setAiMessages(prev => [...prev, { role: 'assistant', text: errorReply, id: Date.now() + 1 }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat history */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Welcome message */}
        {aiMessages.length === 0 && (
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700
                            flex items-center justify-center text-sm flex-shrink-0 mt-0.5 shadow-lg">
              🕵️
            </div>
            <div className="max-w-[90%]">
              <p className="text-[10px] text-gray-600 mb-1 font-semibold uppercase tracking-wide">Detective AI</p>
              <div className="bg-[#1e2a35] border border-cyan-900/40 rounded-xl rounded-tl-none px-3 py-2.5">
                <p className="text-cyan-100 text-xs leading-relaxed">
                  I'm your AI partner on this case. Ask me about errors, hints, algorithm complexity, or anything else you're stuck on.
                </p>
                <p className="text-gray-500 text-[10px] mt-1.5 italic">Run your code first for the best analysis.</p>
              </div>
            </div>
          </div>
        )}

        {/* only shown when empty */}
        {aiMessages.length === 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {["Explain my error", "Give me a hint", "Check complexity", "Help with loops"].map(chip => (
              <button
                key={chip}
                onClick={() => { setAiInput(chip); inputRef.current?.focus(); }}
                className="px-2.5 py-1 text-[10px] rounded-full border border-gray-700
                           text-gray-400 hover:border-cyan-600 hover:text-cyan-400 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        {aiMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2.5 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5
              ${msg.role === 'user'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-lg'
              }`}>
              {msg.role === 'user' ? '👤' : '🕵️'}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap break-words
                ${msg.role === 'user'
                  ? 'bg-indigo-600/80 text-white rounded-tr-none'
                  : 'bg-[#1e2a35] border border-cyan-900/40 text-cyan-100 rounded-tl-none'
                }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isAiTyping && (
          <div className="flex gap-2.5 items-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700
                            flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              🕵️
            </div>
            <div className="bg-[#1e2a35] border border-cyan-900/40 rounded-xl rounded-tl-none px-3 py-2.5">
              <div className="flex gap-1 items-center h-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-gray-800/80 p-2.5 bg-[#111111]">
        <div className="flex items-end gap-2 bg-[#1a1a1a] rounded-xl border border-gray-700/60
                        focus-within:border-cyan-600/50 transition-colors px-3 py-2">
          <textarea
            ref={inputRef}
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the Detective AI…"
            rows={1}
            className="flex-1 bg-transparent text-gray-200 text-xs resize-none outline-none
                       placeholder-gray-600 max-h-24 min-h-[20px] leading-relaxed"
            style={{ scrollbarWidth: 'none' }}
          />
          <button
            onClick={sendMessage}
            disabled={!aiInput.trim() || isAiTyping}
            className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all
              ${aiInput.trim() && !isAiTyping
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/40 active:scale-95'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[9px] text-gray-700 mt-1 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default AIAssistantChat;
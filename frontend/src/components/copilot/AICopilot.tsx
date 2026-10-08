import React, { useState, useRef, useEffect } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AICopilot: React.FC = () => {
  const {
    profile,
    isCopilotOpen,
    toggleCopilot,
    chatMessages,
    isChatLoading,
    sendCopilotMessage
  } = useDeveloperStore();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Why is my backend score low?',
    'How can I reach Elite Senior?',
    'What should I learn next?',
    'What projects are missing from my portfolio?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isChatLoading) {
      sendCopilotMessage(inputVal);
      setInputVal('');
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!isChatLoading) {
      sendCopilotMessage(prompt);
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Trigger Button */}
      {!isCopilotOpen && (
        <motion.button
          onClick={toggleCopilot}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-xl shadow-indigo-500/30 flex items-center gap-2 font-mono text-xs font-bold hover:shadow-indigo-500/50 transition-all cursor-pointer"
        >
          <Sparkles size={16} className="animate-spin" style={{ animationDuration: '4s' }} />
          ✨ CodeDNA Copilot
        </motion.button>
      )}

      {/* Floating Copilot Modal/Drawer */}
      <AnimatePresence>
        {isCopilotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-96 sm:w-[420px] h-[540px] rounded-2xl bg-white dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-[#F7F9FC] dark:bg-[#070A0F] border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#06B6D4] text-white flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5">
                    CodeDNA Copilot
                    <span className="text-[10px] text-emerald-500 font-normal">● Online</span>
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
                    <span>Profile: <strong>@{profile.username}</strong></span>
                    <span>•</span>
                    <span className="text-[#6366F1] dark:text-[#818CF8]">✨ Gemini 1.5 Flash</span>
                  </div>
                </div>
              </div>

              <button
                onClick={toggleCopilot}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#EEF2F7] dark:hover:bg-[#1E293B] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={13} />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#6366F1] text-white rounded-tr-xs font-mono'
                        : 'bg-[#F7F9FC] dark:bg-[#161B22] text-[#111827] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#1E293B] rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <div
                      className={`text-[9px] mt-1 font-mono flex items-center justify-between gap-2 opacity-70 ${
                        msg.sender === 'user' ? 'text-indigo-100' : 'text-[#94A3B8]'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.engine && (
                        <span>{msg.engine === 'gemini' ? '● Gemini' : '⚡ Local ML'}</span>
                      )}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User size={13} />
                    </div>
                  )}
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#6366F1] dark:text-[#818CF8] p-2">
                  <Loader2 size={14} className="animate-spin" />
                  CodeDNA analyzing profile context…
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Suggestions */}
            <div className="p-2.5 bg-[#F7F9FC] dark:bg-[#070A0F] border-t border-[#E2E8F0] dark:border-[#1E293B] overflow-x-auto whitespace-nowrap space-x-1.5 flex">
              {quickPrompts.map((qp) => (
                <button
                  key={qp}
                  onClick={() => handleQuickPrompt(qp)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:border-[#6366F1] shrink-0 transition-colors"
                >
                  “{qp}”
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-[#0D1117] border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask CodeDNA Copilot about this developer…"
                disabled={isChatLoading}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#F7F9FC] dark:bg-[#070A0F] border border-[#E2E8F0] dark:border-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#6366F1] font-mono"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isChatLoading}
                className="p-2 rounded-xl bg-[#6366F1] text-white disabled:opacity-40 hover:bg-[#4F46E5] transition-colors"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

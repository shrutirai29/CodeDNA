import React, { useState, useRef, useEffect } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelGhost } from '../common/PixelGhost';

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCopilotOpen) {
        toggleCopilot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCopilotOpen, toggleCopilot]);

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
          className="!fixed bottom-5 md:bottom-6 right-4 md:right-6 z-40 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-xl shadow-indigo-500/30 flex items-center gap-2 font-mono text-xs font-bold hover:shadow-indigo-500/50 transition-all cursor-pointer"
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
            className="!fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[520px] sm:h-[560px] max-h-[85vh] rounded-2xl glass-card !bg-white/95 dark:!bg-[#0D1117]/95 !backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 bg-slate-50/80 dark:bg-white/[0.03] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#06B6D4] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5">
                    CodeDNA Copilot
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Online
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
                    <span>Profile: <strong>@{profile?.username || 'shrutirai29'}</strong></span>
                    <span>•</span>
                    <span className="text-[#6366F1] dark:text-[#818CF8]">✨ Gemini 1.5 Flash</span>
                  </div>
                </div>
              </div>

              <button
                onClick={toggleCopilot}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Copilot"
                title="Close (Esc)"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-transparent">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot size={13} />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-tr-xs font-mono shadow-sm'
                        : 'bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/5 text-[#111827] dark:text-[#F8FAFC] rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <div
                      className={`text-[9px] mt-1 font-mono flex items-center justify-between gap-2 opacity-75 ${
                        msg.sender === 'user' ? 'text-indigo-100' : 'text-[#64748B] dark:text-[#94A3B8]'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.engine && (
                        <span>{msg.engine === 'gemini' ? '● Gemini' : '⚡ Local ML'}</span>
                      )}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <User size={13} />
                    </div>
                  )}
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#6366F1] dark:text-[#818CF8] p-2 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                  <div className="-my-14 -mx-11 shrink-0">
                    <PixelGhost scale={0.22} />
                  </div>
                  <Loader2 size={14} className="animate-spin" />
                  <span>CodeDNA analyzing profile context…</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Suggestions */}
            <div className="p-2.5 bg-slate-50/70 dark:bg-black/30 backdrop-blur-md border-t border-slate-200/60 dark:border-white/10 overflow-x-auto whitespace-nowrap space-x-1.5 flex scrollbar-none">
              {quickPrompts.map((qp) => (
                <button
                  key={qp}
                  onClick={() => handleQuickPrompt(qp)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono glass-pill text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:border-[#6366F1] shrink-0 transition-colors cursor-pointer"
                >
                  “{qp}”
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-3 bg-white/90 dark:bg-[#0D1117]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask CodeDNA Copilot about this developer…"
                disabled={isChatLoading}
                className="flex-1 px-3 py-2 rounded-xl text-xs glass-input text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#6366F1] font-mono"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isChatLoading}
                className="p-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white disabled:opacity-40 hover:opacity-90 shadow-sm transition-all cursor-pointer"
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

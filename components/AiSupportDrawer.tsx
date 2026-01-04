
import React, { useState, useEffect, useRef } from 'react';
import { startChat } from '../services/gemini';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AiSupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiSupportDrawer: React.FC<AiSupportDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I am your Baji369 Gaming Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      try {
        chatRef.current = startChat();
        setIsConfigured(true);
      } catch (err: any) {
        if (err.message === "API_KEY_MISSING") {
          setIsConfigured(false);
          setMessages([{ 
            role: 'model', 
            text: 'আমাদের AI অ্যাসিস্ট্যান্ট বর্তমানে কনফিগার করা নেই। অনুগ্রহ করে অ্যাডমিনকে এপিআই কি (API_KEY) চেক করতে বলুন।' 
          }]);
        }
        console.error("AI Initialization Error:", err);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !isConfigured) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (chatRef.current) {
        const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: input });
        const botText = response.text || "I'm having trouble processing that right now. Please try again.";
        setMessages(prev => [...prev, { role: 'model', text: botText }]);
      } else {
        throw new Error("Chat session not initialized");
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please check your connection or API key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end">
      <div className="w-full bg-white dark:bg-surface-dark h-[80%] rounded-t-[2.5rem] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Baji369 AI Assistant</h3>
              <div className="flex items-center gap-1.5">
                <div className={`size-2 rounded-full ${isConfigured ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isConfigured ? 'Always online' : 'Configuration Error'}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-slate-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5">
          <div className="relative flex items-center gap-2">
            <input 
              value={input}
              disabled={!isConfigured}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isConfigured ? "Ask me anything..." : "Assistant is offline"}
              className="w-full pl-4 pr-12 py-3.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-900 dark:text-white disabled:opacity-50"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim() || !isConfigured}
              className="absolute right-1.5 bg-primary text-white size-10 rounded-full flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSupportDrawer;

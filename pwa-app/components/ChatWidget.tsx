'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS_ID = [
  'Bagaimana cara mencegah black mold?',
  'Kelembapan berapa yang aman untuk kamar?',
  'Tanda-tanda awal jamur di dinding?',
];
const SUGGESTIONS_EN = [
  'How to prevent black mold?',
  'What humidity level is safe for a room?',
  'Early signs of mold on walls?',
];

const HIDDEN_PATHS = ['/', '/login', '/signup'];

export default function ChatWidget() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const isEN = lang === 'EN';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = isEN ? SUGGESTIONS_EN : SUGGESTIONS_ID;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const isHidden = HIDDEN_PATHS.includes(pathname) || pathname.startsWith('/onboarding') || pathname.startsWith('/setup');
  if (isHidden) return null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply = res.ok && data.reply
        ? data.reply
        : (isEN ? 'Sorry, something went wrong. Please try again.' : 'Maaf, terjadi kesalahan. Coba lagi ya.');
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isEN ? 'Sorry, something went wrong. Please try again.' : 'Maaf, terjadi kesalahan. Coba lagi ya.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-[#78B5D6] rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Open AI Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 13H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7V9h10v2z"/>
        </svg>
      </button>

      {/* Chat Panel Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-md h-[80vh] bg-white rounded-t-[32px] flex flex-col shadow-2xl border-t-4 border-[#78B5D6]">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#F9D66F] rounded-t-[32px] bg-[#78B5D6]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#78B5D6">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-white font-black text-lg leading-tight">MoldCheck AI</h2>
                  <p className="text-white/80 text-xs font-semibold">
                    {isEN ? 'Powered by Groq' : 'Didukung Groq'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center pt-4 pb-2">
                  <div className="w-16 h-16 bg-[#BDD16D]/30 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#84A982">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                    </svg>
                  </div>
                  <p className="text-[#84A982] font-black text-center text-base">
                    {isEN ? 'Hi! Ask me anything about mold & your room.' : 'Hai! Tanyakan apa saja soal jamur & kamarmu.'}
                  </p>
                  <p className="text-[#84A982]/70 text-xs text-center mt-1 mb-4">
                    {isEN ? 'Try one of these:' : 'Coba tanya:'}
                  </p>
                  <div className="flex flex-col gap-2 w-full">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-left bg-[#F9D66F]/40 border-2 border-[#F9D66F] rounded-2xl px-4 py-2 text-[#FF7AA2] font-bold text-sm hover:bg-[#F9D66F]/70 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-[#78B5D6] rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                      </svg>
                    </div>
                  )}
                  <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#78B5D6] text-white rounded-tr-sm'
                      : 'bg-[#F5F5F5] text-neutral-700 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 bg-[#78B5D6] rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                    </svg>
                  </div>
                  <div className="bg-[#F5F5F5] px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#84A982] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-[#84A982] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-[#84A982] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-4 py-3 border-t-2 border-gray-100 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isEN ? 'Ask about mold...' : 'Tanya soal jamur...'}
                className="flex-1 bg-[#F5F5F5] rounded-full px-4 py-2.5 text-sm font-medium text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#78B5D6]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-[#78B5D6] rounded-full flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-transform flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

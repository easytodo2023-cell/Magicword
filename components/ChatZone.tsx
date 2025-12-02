import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatZoneProps {
  messages: ChatMessage[];
  onSend: (msg: string) => void;
  word: string;
}

const ChatZone: React.FC<ChatZoneProps> = ({ messages, onSend, word }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuickAction = (action: string) => {
    let prompt = "";
    switch (action) {
      case 'sentence':
        prompt = `Make another funny sentence with "${word}"`;
        break;
      case 'quiz':
        prompt = `Give me a mini quiz about "${word}"`;
        break;
      case 'synonym':
        prompt = `What are some similar words to "${word}"?`;
        break;
    }
    onSend(prompt);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border-b-8 border-kid-yellow overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 bg-kid-yellow text-white font-bold text-lg flex items-center gap-2">
        <span>🤖</span> Fun Practice Zone
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream">
        {messages.length === 0 && (
           <div className="text-center text-gray-400 mt-8">
             <p>Ask me anything about <b>{word}</b>!</p>
           </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-md shadow-sm ${
                msg.role === 'user'
                  ? 'bg-kid-blue text-white rounded-br-none'
                  : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
              }`}
            >
              {msg.isLoading ? (
                 <div className="flex space-x-1 items-center h-6">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                 </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 bg-gray-50 flex gap-2 overflow-x-auto scrollbar-hide">
        <button onClick={() => handleQuickAction('sentence')} className="whitespace-nowrap px-4 py-2 bg-white border-2 border-kid-pink text-kid-pink rounded-full text-sm font-bold hover:bg-kid-pink hover:text-white transition">
          📝 New Sentence
        </button>
        <button onClick={() => handleQuickAction('quiz')} className="whitespace-nowrap px-4 py-2 bg-white border-2 border-kid-purple text-kid-purple rounded-full text-sm font-bold hover:bg-kid-purple hover:text-white transition">
          ❓ Quiz Me
        </button>
        <button onClick={() => handleQuickAction('synonym')} className="whitespace-nowrap px-4 py-2 bg-white border-2 border-kid-green text-kid-green rounded-full text-sm font-bold hover:bg-kid-green hover:text-white transition">
          🔄 Similar Words
        </button>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-kid-yellow"
        />
        <button 
          onClick={handleSend}
          className="bg-kid-yellow text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 transition shadow-md"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatZone;

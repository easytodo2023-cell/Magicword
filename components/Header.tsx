import React from 'react';

interface HeaderProps {
  onHome: () => void;
  onMyCards: () => void;
  savedCount: number;
}

const Header: React.FC<HeaderProps> = ({ onHome, onMyCards, savedCount }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-50 px-4 md:px-8">
      <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform" onClick={onHome}>
        <div className="bg-kid-yellow w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-yellow-400">
          ✨
        </div>
        <h1 className="text-2xl font-bold text-kid-purple tracking-wide font-sans">Magic Word</h1>
      </div>
      
      <button 
        onClick={onMyCards}
        className="flex items-center gap-2 bg-cream px-4 py-2 rounded-full border-2 border-kid-blue hover:bg-blue-50 transition-colors shadow-sm group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">📚</span>
        <span className="font-bold text-kid-blue hidden md:inline">My Cards</span>
        {savedCount > 0 && (
          <span className="bg-kid-pink text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
            {savedCount}
          </span>
        )}
      </button>
    </header>
  );
};

export default Header;
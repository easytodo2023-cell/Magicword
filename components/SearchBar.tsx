import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (word: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [term, setTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-kid-blue via-kid-purple to-kid-pink rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
        <div className="relative flex items-center bg-white rounded-full p-2 shadow-lg">
          <div className="pl-4 text-2xl">🔍</div>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Type a word here... (e.g. Apple)"
            className="w-full p-3 md:p-4 text-xl md:text-2xl text-gray-700 rounded-full focus:outline-none font-bold placeholder-gray-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`ml-2 px-6 py-3 rounded-full font-bold text-white text-lg transition-transform transform active:scale-95 ${
              isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-kid-pink hover:bg-pink-600 shadow-md'
            }`}
          >
            {isLoading ? 'Thinking...' : 'GO!'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;

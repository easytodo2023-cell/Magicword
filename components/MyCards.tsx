import React from 'react';
import { WordData } from '../types';

interface MyCardsProps {
  savedWords: WordData[];
  onSelectWord: (wordData: WordData) => void;
  onRemoveWord: (word: string) => void;
  onBack: () => void;
}

const MyCards: React.FC<MyCardsProps> = ({ savedWords, onSelectWord, onRemoveWord, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="bg-white text-kid-blue px-6 py-3 rounded-full font-bold shadow-md hover:bg-blue-50 transition flex items-center gap-2"
        >
          <span className="text-xl">⬅️</span> Back
        </button>
        <h2 className="text-3xl md:text-4xl font-bold text-kid-purple flex items-center gap-3">
          <span>My Collection</span> 
          <span className="text-3xl">📚</span>
        </h2>
        <div className="w-[100px] hidden md:block"></div> {/* Spacer for centering */}
      </div>

      {savedWords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl border-4 border-dashed border-gray-200 mx-4">
          <div className="text-8xl mb-6 animate-bounce">📭</div>
          <p className="text-2xl font-bold text-gray-400 mb-2">Your collection is empty!</p>
          <p className="text-gray-400">Search for words and click the <span className="text-kid-yellow text-xl">⭐</span> to save them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {savedWords.map((word) => (
            <div 
              key={word.word}
              onClick={() => onSelectWord(word)}
              className="bg-white p-6 rounded-3xl shadow-lg border-b-8 border-kid-yellow cursor-pointer hover:-translate-y-2 transition-all duration-300 relative group border-2 border-transparent hover:border-kid-yellow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-3xl font-bold text-kid-blue tracking-tight">{word.word}</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveWord(word.word);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 transition shadow-sm"
                  title="Remove card"
                >
                  ✕
                </button>
              </div>
              <div className="mb-3">
                 <span className="inline-block bg-gray-50 px-2 py-1 rounded text-sm font-mono text-gray-500">{word.pronunciation}</span>
              </div>
              <p className="text-xl font-bold text-gray-800 mb-2">{word.meaning_cn}</p>
              <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{word.meaning_en_simple}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                 <span className="text-xs font-bold text-kid-pink bg-pink-50 px-3 py-1 rounded-full">Review Now ➤</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCards;
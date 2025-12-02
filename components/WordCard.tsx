
import React from 'react';
import { WordData } from '../types';

interface WordCardProps {
  data: WordData;
  onPlayAudio: () => void;
  isPlayingAudio: boolean;
  isSaved: boolean;
  onToggleSave: () => void;
}

const WordCard: React.FC<WordCardProps> = ({ data, onPlayAudio, isPlayingAudio, isSaved, onToggleSave }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-b-8 border-kid-blue transform transition duration-300 relative">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-kid-purple mb-2 tracking-tight">{data.word}</h2>
          <div className="inline-block bg-gray-100 rounded-lg px-3 py-1">
            <p className="text-lg text-gray-600 font-mono">{data.pronunciation}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={onToggleSave}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all border-2 ${
              isSaved 
                ? 'bg-kid-yellow border-yellow-400 text-white scale-110' 
                : 'bg-white border-gray-200 text-gray-300 hover:border-kid-yellow hover:text-kid-yellow'
            }`}
            title={isSaved ? "Remove from My Cards" : "Save to My Cards"}
          >
            <span className="text-3xl">{isSaved ? '⭐' : '☆'}</span>
          </button>

          <button
            onClick={onPlayAudio}
            disabled={isPlayingAudio}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all border-2 border-kid-green ${
              isPlayingAudio ? 'bg-green-100 animate-pulse' : 'bg-kid-green hover:bg-green-400 text-white active:scale-95'
            }`}
            aria-label="Play pronunciation"
          >
            <span className="text-2xl">{isPlayingAudio ? '🔊' : '🔈'}</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-5">
        <div className="bg-blue-50 p-5 rounded-2xl border-l-8 border-kid-blue relative overflow-hidden group hover:bg-blue-100 transition">
          <div className="absolute -right-4 -top-4 text-6xl opacity-10 rotate-12 group-hover:rotate-0 transition">🇨🇳</div>
          <h3 className="text-xs uppercase font-bold text-kid-blue mb-1 tracking-wider">Meaning (Chinese)</h3>
          <p className="text-2xl font-bold text-gray-800">{data.meaning_cn}</p>
        </div>

        <div className="p-2">
          <h3 className="text-xs uppercase font-bold text-gray-400 mb-1 tracking-wider">Simple English</h3>
          <p className="text-xl text-gray-700 leading-relaxed font-medium">{data.meaning_en_simple}</p>
        </div>

        <div className="bg-pink-50 p-5 rounded-2xl border-l-8 border-kid-pink relative overflow-hidden hover:bg-pink-100 transition">
          <div className="absolute -right-2 -bottom-2 text-6xl opacity-10">💬</div>
          <h3 className="text-xs uppercase font-bold text-kid-pink mb-1 tracking-wider">Example</h3>
          <p className="text-xl italic text-gray-700 font-serif">"{data.example_sentence}"</p>
          {data.example_sentence_cn && (
            <p className="text-lg text-gray-600 mt-2 pt-2 border-t border-pink-200 font-medium">{data.example_sentence_cn}</p>
          )}
        </div>

         <div className="bg-purple-50 p-5 rounded-2xl border-l-8 border-kid-purple relative hover:bg-purple-100 transition">
          <h3 className="text-xs uppercase font-bold text-kid-purple mb-1 tracking-wider">Memory Tip 💡</h3>
          <p className="text-lg text-gray-700">{data.memory_tip}</p>
        </div>
      </div>
    </div>
  );
};

export default WordCard;

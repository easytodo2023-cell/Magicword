import React from 'react';

interface ImageCardProps {
  imageUrl: string;
  isLoading: boolean;
  word: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, isLoading, word }) => {
  return (
    <div className="h-full bg-white rounded-3xl p-4 shadow-xl border-b-8 border-kid-green flex flex-col">
      <h3 className="text-center font-bold text-gray-400 mb-2 uppercase text-sm tracking-wider">Memory Picture</h3>
      <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden relative flex items-center justify-center min-h-[300px]">
        {isLoading ? (
          <div className="text-center p-6">
            <div className="animate-bounce text-4xl mb-4">🎨</div>
            <p className="text-gray-500 font-medium">Painting a picture for <br/><span className="text-kid-pink font-bold">{word}</span>...</p>
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt={`Illustration for ${word}`} 
            className="w-full h-full object-cover animate-in fade-in duration-1000"
          />
        ) : (
          <div className="text-gray-400 text-center p-4">
            <span className="text-4xl block mb-2">🤔</span>
            Could not draw image.
          </div>
        )}
      </div>
      <div className="mt-3 text-center text-xs text-gray-400">
        AI Generated • Visual Memory Aid
      </div>
    </div>
  );
};

export default ImageCard;

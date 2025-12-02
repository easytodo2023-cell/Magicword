import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WordCard from './components/WordCard';
import ImageCard from './components/ImageCard';
import ChatZone from './components/ChatZone';
import MyCards from './components/MyCards';
import { 
  getWordExplanation, 
  generateWordImage, 
  generateWordPronunciation, 
  playAudioFromBase64, 
  getChatResponse 
} from './services/geminiService';
import { WordData, AppState, ChatMessage } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [savedWords, setSavedWords] = useState<WordData[]>([]);
  
  // Use ref to store audio data to avoid re-fetching, but simple state is fine for now if we cache it
  const [audioData, setAudioData] = useState<string | null>(null);

  // Load saved words from localStorage on boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem('magicWord_saved');
      if (stored) {
        setSavedWords(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved words", e);
    }
  }, []);

  // Save to localStorage whenever savedWords changes
  useEffect(() => {
    localStorage.setItem('magicWord_saved', JSON.stringify(savedWords));
  }, [savedWords]);

  const toggleSaveWord = useCallback(() => {
    if (!wordData) return;
    
    setSavedWords(prev => {
      const exists = prev.some(w => w.word === wordData.word);
      if (exists) {
        return prev.filter(w => w.word !== wordData.word);
      } else {
        return [...prev, wordData];
      }
    });
  }, [wordData]);

  const isSaved = wordData ? savedWords.some(w => w.word === wordData.word) : false;

  const handleSearch = async (word: string) => {
    setAppState(AppState.LOADING);
    setCurrentWord(word);
    setWordData(null);
    setImageUrl('');
    setAudioData(null);
    setChatMessages([]);

    try {
      // 1. Get Explanation
      const data = await getWordExplanation(word);
      setWordData(data);
      setAppState(AppState.RESULT);

      // 2. Parallel Fetch for Image and Audio to speed up perceived perf
      setImageLoading(true);
      
      // Fire and forget promises, handle state independently
      generateWordImage(word).then((url) => {
        setImageUrl(url);
        setImageLoading(false);
      });

      generateWordPronunciation(word).then((audio) => {
        setAudioData(audio);
      });

    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const handleSelectSavedWord = (data: WordData) => {
    // Set Immediate Data
    setWordData(data);
    setCurrentWord(data.word);
    setAppState(AppState.RESULT);
    setChatMessages([]);
    
    // Reset Image/Audio states
    setImageUrl('');
    setAudioData(null);
    
    // Re-fetch rich media
    setImageLoading(true);
    generateWordImage(data.word).then((url) => {
      setImageUrl(url);
      setImageLoading(false);
    });

    generateWordPronunciation(data.word).then((audio) => {
      setAudioData(audio);
    });
  };

  const handleRemoveSavedWord = (word: string) => {
    setSavedWords(prev => prev.filter(w => w.word !== word));
  };

  const handlePlayAudio = useCallback(async () => {
    if (audioPlaying) return;
    
    setAudioPlaying(true);
    try {
      if (audioData) {
        await playAudioFromBase64(audioData);
      } else {
        // Try fetching if not ready yet (edge case)
        const audio = await generateWordPronunciation(currentWord);
        if (audio) {
            setAudioData(audio);
            await playAudioFromBase64(audio);
        }
      }
    } catch (e) {
      console.error("Audio error", e);
    } finally {
      setTimeout(() => setAudioPlaying(false), 2000); 
    }
  }, [audioData, currentWord, audioPlaying]);

  const handleChatSend = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text
    };
    
    const loadingMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: '',
      isLoading: true
    };

    setChatMessages(prev => [...prev, userMsg, loadingMsg]);

    try {
      // Construct simple history for context
      const history = chatMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      // Add context about current word if it's the start of conversation
      if (history.length === 0) {
         history.push({
             role: 'model',
             parts: [{ text: `I am teaching the word "${currentWord}". Definition: ${wordData?.meaning_en_simple}` }]
         });
      }

      const responseText = await getChatResponse(history, text);

      setChatMessages(prev => prev.map(msg => 
        msg.id === loadingMsg.id ? { ...msg, text: responseText || "I didn't quite get that.", isLoading: false } : msg
      ));

    } catch (error) {
       setChatMessages(prev => prev.map(msg => 
        msg.id === loadingMsg.id ? { ...msg, text: "Oops, something went wrong!", isLoading: false } : msg
      ));
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-20 font-sans">
      <Header 
        onHome={() => setAppState(AppState.HOME)} 
        onMyCards={() => setAppState(AppState.MY_CARDS)}
        savedCount={savedWords.length}
      />

      <main className="container mx-auto px-4 pt-8">
        
        {/* HOME STATE */}
        {appState === AppState.HOME && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
              <h2 className="text-4xl md:text-6xl font-bold text-kid-blue">Hello! 👋</h2>
              <p className="text-xl text-gray-500">What word do you want to learn today?</p>
            </div>
            <div className="w-full flex justify-center">
                <SearchBar onSearch={handleSearch} isLoading={false} />
            </div>
            <div className="flex gap-4 text-5xl opacity-50 select-none pointer-events-none">
              <span>🍎</span><span>🐘</span><span>🚀</span>
            </div>
            {savedWords.length > 0 && (
               <button 
                 onClick={() => setAppState(AppState.MY_CARDS)}
                 className="mt-8 text-kid-purple font-bold hover:underline"
               >
                 Review my {savedWords.length} saved cards &rarr;
               </button>
            )}
          </div>
        )}

        {/* MY CARDS STATE */}
        {appState === AppState.MY_CARDS && (
           <MyCards 
             savedWords={savedWords}
             onSelectWord={handleSelectSavedWord}
             onRemoveWord={handleRemoveSavedWord}
             onBack={() => setAppState(AppState.HOME)}
           />
        )}

        {/* LOADING STATE */}
        {appState === AppState.LOADING && (
           <div className="flex flex-col items-center justify-center min-h-[50vh]">
             <div className="animate-spin text-6xl mb-4">🎡</div>
             <p className="text-2xl font-bold text-kid-purple animate-pulse">Finding "{currentWord}"...</p>
           </div>
        )}

        {/* ERROR STATE */}
        {appState === AppState.ERROR && (
           <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
             <div className="text-6xl mb-4">🙈</div>
             <h3 className="text-2xl font-bold text-gray-700">Oops!</h3>
             <p className="text-gray-500 mb-6">We couldn't find that word. Maybe check the spelling?</p>
             <button 
               onClick={() => setAppState(AppState.HOME)}
               className="bg-kid-blue text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-500"
             >
               Try Another Word
             </button>
           </div>
        )}

        {/* RESULT STATE */}
        {appState === AppState.RESULT && wordData && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-center mb-8">
                <SearchBar onSearch={handleSearch} isLoading={imageLoading} />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Left Col: Definition */}
               <div className="space-y-6">
                 <WordCard 
                   data={wordData} 
                   onPlayAudio={handlePlayAudio} 
                   isPlayingAudio={audioPlaying}
                   isSaved={isSaved}
                   onToggleSave={toggleSaveWord}
                 />
               </div>

               {/* Right Col: Image */}
               <div className="h-[400px] lg:h-auto">
                 <ImageCard 
                   imageUrl={imageUrl} 
                   isLoading={imageLoading}
                   word={currentWord}
                 />
               </div>
             </div>

             {/* Bottom: Chat */}
             <div className="mt-8">
               <ChatZone 
                 messages={chatMessages} 
                 onSend={handleChatSend} 
                 word={currentWord}
               />
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;

import { GoogleGenAI, Type, Modality } from "@google/genai";
import { WordData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper for Audio Decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const playAudioFromBase64 = async (base64Audio: string) => {
  try {
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const outputNode = outputAudioContext.createGain();
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1,
    );
    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputNode);
    source.connect(outputAudioContext.destination);
    source.start();
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

export const getWordExplanation = async (word: string): Promise<WordData> => {
  const prompt = `Explain the English word "${word}" to a 7-12 year old student. Provide pronunciation, simple Chinese meaning, simple English meaning, a fun example sentence, the Chinese translation of that sentence, and a memory tip.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          pronunciation: { type: Type.STRING, description: "Phonetic symbols or simple pronunciation guide" },
          meaning_cn: { type: Type.STRING, description: "Chinese translation suitable for kids" },
          meaning_en_simple: { type: Type.STRING, description: "Simple English definition using basic vocabulary" },
          example_sentence: { type: Type.STRING, description: "A fun, short sentence using the word" },
          example_sentence_cn: { type: Type.STRING, description: "Chinese translation of the example sentence" },
          memory_tip: { type: Type.STRING, description: "A mnemonic or fun association to remember the word" }
        },
        required: ["word", "pronunciation", "meaning_cn", "meaning_en_simple", "example_sentence", "example_sentence_cn", "memory_tip"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as WordData;
  }
  throw new Error("No data returned");
};

export const generateWordImage = async (word: string): Promise<string> => {
  try {
    // Using Imagen 3/4 for high quality memory aids
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `A cute, colorful, cartoon-style illustration suitable for children to help remember the English word "${word}". The image should clearly depict the concept of "${word}". White background, sticker style.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64ImageBytes) {
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return "";
  } catch (e) {
    console.error("Image generation failed, falling back to flash-image or skipping", e);
    // Fallback to generic image generation if the high-quality one fails or is restricted
    try {
       const fallbackResponse = await ai.models.generateContent({
         model: 'gemini-2.5-flash-image',
         contents: {
           parts: [{ text: `Draw a simple cartoon image for the word: ${word}` }]
         },
         config: { responseModalities: [Modality.IMAGE] }
       });
       const part = fallbackResponse.candidates?.[0]?.content?.parts?.[0];
       if (part?.inlineData?.data) {
         return `data:image/png;base64,${part.inlineData.data}`;
       }
    } catch (fallbackError) {
        console.error("Fallback image failed", fallbackError);
    }
    return "";
  }
};

export const generateWordPronunciation = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Gentle voice
          },
        },
      },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (e) {
    console.error("TTS generation failed", e);
    return null;
  }
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], newMessage: string) => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      systemInstruction: "You are a friendly, encouraging English teacher for elementary students. Keep answers short, simple, and fun. Use emojis.",
    }
  });
  
  const result = await chat.sendMessage({ message: newMessage });
  return result.text;
};

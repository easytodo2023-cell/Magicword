
export interface WordData {
  word: string;
  pronunciation: string;
  meaning_cn: string;
  meaning_en_simple: string;
  example_sentence: string;
  example_sentence_cn?: string;
  memory_tip: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export enum AppState {
  HOME = 'HOME',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
  MY_CARDS = 'MY_CARDS',
}

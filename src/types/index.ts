export interface Question {
  id: string;
  answer: string;        // BÜYÜK HARF, Türkçe
  definition: string;    // Tanım cümlesi
  letterCount: number;   // answer.length ile eşleşmeli
  category?: string;
}

export type GameStatus = 'menu' | 'playing' | 'finished';

// 'wrong' → yanlış cevap sonrası doğru gösterimi
export type QuestionStatus = 'idle' | 'answering' | 'correct' | 'wrong' | 'skipped' | 'timeout';

export interface GameState {
  status: GameStatus;
  questions: Question[];
  currentQuestionIndex: number;
  revealedLetters: boolean[];
  currentInput: string;
  timeRemaining: number;
  isTimerRunning: boolean;
  benjaminTimeRemaining: number;
  isBenjaminTimerRunning: boolean;
  totalScore: number;
  questionScores: number[];
  hintsUsedPerQuestion: number[];
  correctAnswers: boolean[];
  questionStatus: QuestionStatus;
  answerLocked: boolean;
  lastAnswerCorrect: boolean | null;
  wasTimeout: boolean;   // Oyun süre dolarak mı bitti?
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'REQUEST_HINT' }
  | { type: 'LOCK_ANSWER' }
  | { type: 'SKIP_QUESTION' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'TICK' }
  | { type: 'BENJAMIN_TICK' }
  | { type: 'FINISH_GAME' }
  | { type: 'RESET_GAME' };

import { useReducer, useEffect, useCallback } from 'react';
import { GameState, GameAction } from '../types';
import { generateRound, checkAnswer, getQuestionScore } from '../data/questions';

const TOTAL_TIME = 240;
const BENJAMIN_TIME = 10;

function buildInitialReveal(answer: string): boolean[] {
  return Array(answer.length).fill(false);
}

function getInitialState(): GameState {
  return {
    status: 'menu',
    questions: [],
    currentQuestionIndex: 0,
    revealedLetters: [],
    currentInput: '',
    timeRemaining: TOTAL_TIME,
    isTimerRunning: false,
    benjaminTimeRemaining: BENJAMIN_TIME,
    isBenjaminTimerRunning: false,
    totalScore: 0,
    questionScores: [],
    hintsUsedPerQuestion: [],
    correctAnswers: [],
    questionStatus: 'idle',
    answerLocked: false,
    lastAnswerCorrect: null,
    wasTimeout: false,
  };
}

function revealAll(answer: string): boolean[] {
  return Array(answer.length).fill(true);
}

function revealRandomLetter(revealed: boolean[]): boolean[] {
  const hidden = revealed.map((r, i) => (!r ? i : -1)).filter((i) => i !== -1);
  if (hidden.length <= 1) return revealed;
  const idx = hidden[Math.floor(Math.random() * hidden.length)];
  const next = [...revealed];
  next[idx] = true;
  return next;
}

function advanceToNext(state: GameState): GameState {
  const nextIdx = state.currentQuestionIndex + 1;
  if (nextIdx >= state.questions.length) {
    return { ...state, status: 'finished', isTimerRunning: false, isBenjaminTimerRunning: false };
  }
  const nextQ = state.questions[nextIdx];
  return {
    ...state,
    currentQuestionIndex: nextIdx,
    revealedLetters: buildInitialReveal(nextQ.answer),
    currentInput: '',
    isTimerRunning: true,
    isBenjaminTimerRunning: false,
    benjaminTimeRemaining: BENJAMIN_TIME,
    questionStatus: 'answering',
    answerLocked: false,
    lastAnswerCorrect: null,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'START_GAME': {
      const questions = generateRound();
      const first = questions[0];
      return {
        ...getInitialState(),
        status: 'playing',
        questions,
        currentQuestionIndex: 0,
        revealedLetters: buildInitialReveal(first.answer),
        questionScores: Array(questions.length).fill(0),
        hintsUsedPerQuestion: Array(questions.length).fill(0),
        correctAnswers: Array(questions.length).fill(false),
        timeRemaining: TOTAL_TIME,
        isTimerRunning: true,
        questionStatus: 'answering',
      };
    }

    case 'SET_INPUT':
      if (!state.answerLocked) return state; // Input sadece Benjamin sonrası
      return { ...state, currentInput: action.payload };

    case 'REQUEST_HINT': {
      if (state.answerLocked) return state;
      const q = state.questions[state.currentQuestionIndex];
      const hints = state.hintsUsedPerQuestion[state.currentQuestionIndex];
      if (hints >= q.letterCount - 1) return state;
      const newRevealed = revealRandomLetter(state.revealedLetters);
      const newHints = [...state.hintsUsedPerQuestion];
      newHints[state.currentQuestionIndex] = hints + 1;
      return { ...state, revealedLetters: newRevealed, hintsUsedPerQuestion: newHints };
    }

    case 'LOCK_ANSWER': {
      if (state.answerLocked) return state;
      return {
        ...state,
        answerLocked: true,
        isTimerRunning: false,
        isBenjaminTimerRunning: true,
        benjaminTimeRemaining: BENJAMIN_TIME,
        lastAnswerCorrect: null,
      };
    }

    case 'SUBMIT_ANSWER': {
      if (!state.answerLocked) return state;
      const q = state.questions[state.currentQuestionIndex];
      const correct = checkAnswer(state.currentInput, q.answer);
      const hints = state.hintsUsedPerQuestion[state.currentQuestionIndex];
      const earned = correct ? getQuestionScore(q.letterCount, hints) : 0;

      if (correct) {
        const newScores = [...state.questionScores];
        newScores[state.currentQuestionIndex] = earned;
        const newCorrect = [...state.correctAnswers];
        newCorrect[state.currentQuestionIndex] = true;
        return {
          ...state,
          revealedLetters: revealAll(q.answer),
          totalScore: state.totalScore + earned,
          questionScores: newScores,
          correctAnswers: newCorrect,
          questionStatus: 'correct',
          isBenjaminTimerRunning: false,
          lastAnswerCorrect: true,
        };
      }

      // Yanlış → timer devam eder, tekrar dene (sadece süre bitince geç)
      return {
        ...state,
        currentInput: '',
        lastAnswerCorrect: false,
      };
    }

    case 'TICK': {
      if (!state.isTimerRunning) return state;
      const newTime = state.timeRemaining - 1;
      if (newTime <= 0) {
        return {
          ...state,
          timeRemaining: 0,
          isTimerRunning: false,
          status: 'finished',
          wasTimeout: true,
        };
      }
      return { ...state, timeRemaining: newTime };
    }

    case 'BENJAMIN_TICK': {
      if (!state.isBenjaminTimerRunning) return state;
      const newBenTime = state.benjaminTimeRemaining - 1;
      if (newBenTime <= 0) {
        // Süre doldu → cevabı göster, 'wrong' status ile geç
        const q = state.questions[state.currentQuestionIndex];
        return {
          ...state,
          revealedLetters: revealAll(q.answer),
          isBenjaminTimerRunning: false,
          benjaminTimeRemaining: 0,
          questionStatus: 'wrong',
          lastAnswerCorrect: false,
        };
      }
      return { ...state, benjaminTimeRemaining: newBenTime };
    }

    case 'NEXT_QUESTION':
      return advanceToNext(state);

    case 'SKIP_QUESTION':
      return advanceToNext({ ...state, isBenjaminTimerRunning: false });

    case 'FINISH_GAME':
      return { ...state, status: 'finished', isTimerRunning: false, isBenjaminTimerRunning: false };

    case 'RESET_GAME':
      return getInitialState();

    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());

  // Ana timer
  useEffect(() => {
    if (!state.isTimerRunning) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.isTimerRunning]);

  // Benjamin timer
  useEffect(() => {
    if (!state.isBenjaminTimerRunning) return;
    const id = setInterval(() => dispatch({ type: 'BENJAMIN_TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.isBenjaminTimerRunning]);

  // Doğru cevap → 1.2sn sonra sonraki soru
  useEffect(() => {
    if (state.questionStatus !== 'correct') return;
    const id = setTimeout(() => dispatch({ type: 'NEXT_QUESTION' }), 1200);
    return () => clearTimeout(id);
  }, [state.questionStatus]);

  // Yanlış (benjamin süresi doldu) → 2sn doğruyu göster, sonraki soru
  useEffect(() => {
    if (state.questionStatus !== 'wrong') return;
    const id = setTimeout(() => dispatch({ type: 'NEXT_QUESTION' }), 2200);
    return () => clearTimeout(id);
  }, [state.questionStatus]);

  const startGame    = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const setInput     = useCallback((v: string) => dispatch({ type: 'SET_INPUT', payload: v }), []);
  const requestHint  = useCallback(() => dispatch({ type: 'REQUEST_HINT' }), []);
  const lockAnswer   = useCallback(() => dispatch({ type: 'LOCK_ANSWER' }), []);
  const submitAnswer = useCallback(() => dispatch({ type: 'SUBMIT_ANSWER' }), []);
  const skipQuestion = useCallback(() => dispatch({ type: 'SKIP_QUESTION' }), []);
  const resetGame    = useCallback(() => dispatch({ type: 'RESET_GAME' }), []);

  const currentQuestion =
    state.status === 'playing' ? state.questions[state.currentQuestionIndex] ?? null : null;

  const currentHints =
    state.status === 'playing'
      ? state.hintsUsedPerQuestion[state.currentQuestionIndex] ?? 0
      : 0;

  const canRequestHint =
    !state.answerLocked &&
    currentQuestion !== null &&
    currentHints < currentQuestion.letterCount - 1;

  return {
    state,
    currentQuestion,
    currentHints,
    canRequestHint,
    startGame,
    setInput,
    requestHint,
    lockAnswer,
    submitAnswer,
    skipQuestion,
    resetGame,
  };
}

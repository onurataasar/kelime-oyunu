import { useRef, useEffect, KeyboardEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, SkipForward, CheckCircle2, XCircle } from 'lucide-react';
import { LetterBox } from './LetterBox';
import { Timer } from './Timer';
import { ScoreDisplay } from './ScoreDisplay';
import { Question } from '../types';
import { getQuestionScore } from '../data/questions';
import {
  playCorrect,
  playWrong,
  playHint,
  playBenjamin,
  playTick,
  playBenjaminTimeout,
} from '../utils/sounds';

interface GameScreenProps {
  question: Question;
  revealedLetters: boolean[];
  currentInput: string;
  timeRemaining: number;
  benjaminTimeRemaining: number;
  isBenjaminTimerRunning: boolean;
  totalScore: number;
  questionIndex: number;
  totalQuestions: number;
  hintsUsed: number;
  answerLocked: boolean;
  lastAnswerCorrect: boolean | null;
  questionStatus: string;
  canRequestHint: boolean;
  onInputChange: (v: string) => void;
  onLockAnswer: () => void;
  onSubmitAnswer: () => void;
  onRequestHint: () => void;
  onSkip: () => void;
}

/** Klavye kısayol badge'i */
function KeyBadge({ label, wide = false }: { label: string; wide?: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center h-5 rounded bg-white/15 border border-white/20 font-display text-[10px] text-white/50 leading-none px-1.5 ${wide ? 'min-w-[3rem]' : 'w-5'}`}>
      {label}
    </span>
  );
}

export function GameScreen({
  question,
  revealedLetters,
  currentInput,
  timeRemaining,
  benjaminTimeRemaining,
  isBenjaminTimerRunning,
  totalScore,
  questionIndex,
  totalQuestions,
  hintsUsed,
  answerLocked,
  lastAnswerCorrect,
  questionStatus,
  canRequestHint,
  onInputChange,
  onLockAnswer,
  onSubmitAnswer,
  onRequestHint,
  onSkip,
}: GameScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const prevStatus = useRef(questionStatus);
  const prevBenjaminTime = useRef(benjaminTimeRemaining);
  const prevTimeRemaining = useRef(timeRemaining);

  const isCorrect = questionStatus === 'correct';
  const isWrong   = questionStatus === 'wrong';
  const isDone    = isCorrect || isWrong;
  const currentMax = getQuestionScore(question.letterCount, hintsUsed);

  // Input'a odaklan
  useEffect(() => {
    if (answerLocked && !isDone) inputRef.current?.focus();
  }, [questionIndex, answerLocked, isDone]);

  // Ses: doğru/yanlış status değişince
  useEffect(() => {
    if (questionStatus === prevStatus.current) return;
    if (questionStatus === 'correct') playCorrect();
    if (questionStatus === 'wrong')   playWrong();
    prevStatus.current = questionStatus;
  }, [questionStatus]);

  // Ses: yanlış cevap girince (lastAnswerCorrect false olunca)
  const prevLastCorrect = useRef(lastAnswerCorrect);
  useEffect(() => {
    if (lastAnswerCorrect === false && prevLastCorrect.current !== false) {
      playWrong();
    }
    prevLastCorrect.current = lastAnswerCorrect;
  }, [lastAnswerCorrect]);

  // Ses: ana timer tık (son 10sn, benjamin kapalı)
  useEffect(() => {
    if (isBenjaminTimerRunning) return;
    if (timeRemaining <= 10 && timeRemaining > 0 && prevTimeRemaining.current !== timeRemaining) {
      playTick();
    }
    prevTimeRemaining.current = timeRemaining;
  }, [timeRemaining, isBenjaminTimerRunning]);

  // Ses: benjamin timer tık + timeout sesi
  useEffect(() => {
    if (!isBenjaminTimerRunning) return;
    if (benjaminTimeRemaining > 0 && prevBenjaminTime.current !== benjaminTimeRemaining) {
      playTick();
    }
    if (benjaminTimeRemaining === 0) playBenjaminTimeout();
    prevBenjaminTime.current = benjaminTimeRemaining;
  }, [benjaminTimeRemaining, isBenjaminTimerRunning]);

  const handleLock = useCallback(() => {
    playBenjamin();
    onLockAnswer();
  }, [onLockAnswer]);

  const handleHint = useCallback(() => {
    if (!canRequestHint) return;
    playHint();
    onRequestHint();
  }, [canRequestHint, onRequestHint]);

  // Klavye kısayolları
  useEffect(() => {
    if (isDone) return;
    function onKeyDown(e: globalThis.KeyboardEvent) {
      const inInput = document.activeElement === inputRef.current;

      // Space → Harf İste (yalnızca Benjamin basılmamışken, input dışında)
      if (e.key === ' ' && !inInput && !answerLocked) {
        e.preventDefault();
        handleHint();
        return;
      }

      // Enter → Benjamin (input dışında, kilitli değilken)
      if (e.key === 'Enter' && !inInput && !answerLocked) {
        e.preventDefault();
        handleLock();
        return;
      }

      // P / Escape → Pas Geç
      if ((e.key === 'p' || e.key === 'P' || e.key === 'Escape') && !inInput) {
        e.preventDefault();
        onSkip();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDone, answerLocked, handleHint, handleLock, onSkip]);

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && answerLocked) onSubmitAnswer();
  }

  const benjaminColor =
    benjaminTimeRemaining <= 3 ? 'text-red-400' :
    benjaminTimeRemaining <= 6 ? 'text-orange-400' : 'text-white';

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col p-4 py-5 gap-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-48 bg-gold-400/4 blur-3xl rounded-full" />
      </div>

      {/* Üst bar */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex items-start justify-between">
        <Timer seconds={timeRemaining} isBenjaminRunning={isBenjaminTimerRunning} />
        <ScoreDisplay score={totalScore} questionIndex={questionIndex} totalQuestions={totalQuestions} />
      </div>

      {/* Soru kartı */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex-1 flex flex-col gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className={`
              backdrop-blur-md border rounded-3xl p-5 sm:p-7 transition-colors duration-500
              ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' :
                isWrong   ? 'bg-red-500/10 border-red-500/30' :
                            'bg-white/5 border-white/10'}
            `}
          >
            {/* Kategori + puan */}
            <div className="flex items-center justify-between mb-5">
              {question.category
                ? <span className="bg-white/10 text-white/50 text-xs font-body uppercase tracking-widest px-3 py-1 rounded-full">{question.category}</span>
                : <span />}
              <span className="bg-gold-400/10 border border-gold-400/30 text-gold-400 text-xs font-display font-bold px-3 py-1 rounded-full">
                {question.letterCount} harf · max {currentMax} puan
              </span>
            </div>

            {/* Tanım */}
            <p className="font-body text-white/85 text-base sm:text-lg text-center leading-relaxed mb-7">
              {question.definition}
            </p>

            {/* Harf kutuları — 10 harf için flex-nowrap */}
            <div className={`flex gap-1.5 justify-center ${question.letterCount >= 8 ? 'flex-nowrap' : 'flex-wrap'}`}>
              {question.answer.split('').map((letter, i) => (
                <LetterBox
                  key={i}
                  index={i}
                  letter={letter}
                  revealed={revealedLetters[i] ?? false}
                  isCorrect={isCorrect}
                  totalLetters={question.letterCount}
                />
              ))}
            </div>

            {/* Yanlış → doğruyu göster */}
            <AnimatePresence>
              {isWrong && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex flex-col items-center gap-1.5"
                >
                  <div className="flex items-center gap-2 text-red-400 text-sm font-body">
                    <XCircle size={16} /> Doğru cevap:
                  </div>
                  <span className="font-display font-bold text-2xl text-white/90 tracking-widest">
                    {question.answer}
                  </span>
                  <span className="text-white/30 text-xs font-body">Sonraki soruya geçiliyor…</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Doğru */}
            <AnimatePresence>
              {isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex flex-col items-center gap-1"
                >
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={18} />
                    <span className="font-display font-bold text-xl">Doğru!</span>
                  </div>
                  <span className="text-emerald-300/70 text-sm font-body">
                    +{getQuestionScore(question.letterCount, hintsUsed)} puan
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Input */}
        <AnimatePresence>
          {!isDone && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <motion.input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={!answerLocked}
                placeholder={answerLocked ? 'Cevabınızı yazın...' : 'Önce BENJAMİN butonuna basın...'}
                animate={lastAnswerCorrect === false ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                className={`
                  w-full py-4 px-6 rounded-2xl outline-none transition-colors
                  bg-white/8 backdrop-blur-sm text-white font-body text-xl text-center
                  placeholder:text-white/25 border-2
                  ${!answerLocked
                    ? 'border-white/10 opacity-50 cursor-not-allowed'
                    : lastAnswerCorrect === false
                    ? 'border-red-500/70 bg-red-500/10'
                    : 'border-gold-400/50 bg-gold-400/5 focus:border-gold-400'
                  }
                `}
              />
              {answerLocked && lastAnswerCorrect === false && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-red-400 text-sm font-body text-center mt-1.5"
                >
                  Yanlış — tekrar deneyin ({benjaminTimeRemaining}sn kaldı)
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alt butonlar */}
      {!isDone && (
        <div className="relative z-10 w-full max-w-2xl mx-auto">

          {/* Benjamin geri sayım */}
          <AnimatePresence>
            {isBenjaminTimerRunning && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-center mb-3"
              >
                <motion.span
                  animate={benjaminTimeRemaining <= 3 ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className={`font-display font-bold text-2xl tabular-nums ${benjaminColor}`}
                >
                  {benjaminTimeRemaining}
                </motion.span>
                <span className="text-white/30 text-sm font-body ml-2">saniye kaldı</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Klavye kısayol gösterimi — butonların üstünde */}
          {!answerLocked && (
            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 mb-1.5 px-1">
              <div className="flex justify-center">
                <KeyBadge label="Space" wide />
              </div>
              <div className="flex justify-center" style={{ width: 112 }}>
                <KeyBadge label="Enter" wide />
              </div>
              <div className="flex justify-center">
                <KeyBadge label="P" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">

            {/* Harf İste */}
            <motion.button
              whileHover={canRequestHint ? { scale: 1.04 } : {}}
              whileTap={canRequestHint ? { scale: 0.96 } : {}}
              onClick={handleHint}
              disabled={!canRequestHint}
              className={`
                flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl
                font-body font-semibold text-sm transition-all
                ${canRequestHint
                  ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300 hover:bg-blue-500/30'
                  : 'bg-white/5 border border-white/10 text-white/25 cursor-not-allowed'}
              `}
            >
              <Lightbulb size={20} />
              <span>Harf İste{hintsUsed > 0 ? ` (${hintsUsed})` : ''}</span>
            </motion.button>

            {/* BENJAMİN / CEVAPLA */}
            <div className="flex flex-col items-center">
              {!answerLocked ? (
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.91, y: 6 }}
                  onClick={handleLock}
                  className="relative group"
                >
                  <div className="absolute inset-0 top-2 rounded-full bg-red-900 blur-sm opacity-80" />
                  <div className="absolute inset-x-0 bottom-0 h-5 rounded-full bg-red-900" />
                  <div className={`
                    relative w-28 h-28 rounded-full
                    bg-gradient-to-b from-red-400 via-red-600 to-red-700
                    border-4 border-red-800
                    shadow-[0_6px_0_#7f1d1d,0_0_30px_rgba(239,68,68,0.5)]
                    flex flex-col items-center justify-center
                    group-active:shadow-[0_2px_0_#7f1d1d] group-active:translate-y-1
                    transition-all duration-75
                  `}>
                    <div className="absolute top-3 left-4 w-8 h-4 rounded-full bg-white/25 blur-sm rotate-[-20deg]" />
                    <span className="font-display font-black text-white text-xs tracking-widest drop-shadow-md">BENJAMİN</span>
                  </div>
                </motion.button>
              ) : (
                <motion.button
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSubmitAnswer}
                  className="
                    relative w-28 h-28 rounded-full
                    bg-gradient-to-b from-emerald-400 via-emerald-600 to-emerald-700
                    border-4 border-emerald-800
                    shadow-[0_6px_0_#064e3b,0_0_25px_rgba(52,211,153,0.4)]
                    flex flex-col items-center justify-center gap-1
                    font-display font-black text-white text-xs tracking-widest
                  "
                >
                  <div className="absolute top-3 left-4 w-8 h-4 rounded-full bg-white/20 blur-sm rotate-[-20deg]" />
                  <CheckCircle2 size={22} />
                  <span>CEVAPLA</span>
                </motion.button>
              )}
            </div>

            {/* Pas Geç */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onSkip}
              className="
                flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl
                font-body font-semibold text-sm
                bg-white/5 border border-white/10 text-white/40
                hover:bg-white/10 hover:text-white/60 transition-all
              "
            >
              <SkipForward size={20} />
              <span>Pas Geç</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

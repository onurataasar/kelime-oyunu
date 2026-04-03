import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from './hooks/useGame';
import { MenuScreen } from './components/MenuScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';

const HIGH_SCORE_KEY = 'kelime_oyunu_high_score';
const TODAY_SCORE_KEY = 'kelime_oyunu_today_score';
const TODAY_DATE_KEY = 'kelime_oyunu_today_date';

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadHighScore(): number {
  return parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? '0', 10) || 0;
}

function loadTodayScore(): number {
  const date = localStorage.getItem(TODAY_DATE_KEY);
  if (date !== getTodayStr()) return 0;
  return parseInt(localStorage.getItem(TODAY_SCORE_KEY) ?? '0', 10) || 0;
}

function saveScores(score: number) {
  const high = loadHighScore();
  if (score > high) localStorage.setItem(HIGH_SCORE_KEY, String(score));
  const today = getTodayStr();
  const prevToday = loadTodayScore();
  localStorage.setItem(TODAY_DATE_KEY, today);
  if (score > prevToday) localStorage.setItem(TODAY_SCORE_KEY, String(score));
}

export default function App() {
  const {
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
  } = useGame();

  const [highScore, setHighScore] = useState(loadHighScore);
  const [todayScore, setTodayScore] = useState(loadTodayScore);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    if (state.status !== 'finished') return;
    const s = state.totalScore;
    saveScores(s);
    const newHigh = loadHighScore();
    setHighScore(newHigh);
    setTodayScore(loadTodayScore());
    setIsNewHighScore(s > 0 && s === newHigh);
  }, [state.status, state.totalScore]);

  const screenKey =
    state.status === 'menu' ? 'menu' : state.status === 'playing' ? 'game' : 'result';

  return (
    <div className="font-body">
      <AnimatePresence mode="wait">
        <motion.div
          key={screenKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {state.status === 'menu' && (
            <MenuScreen onStart={startGame} highScore={highScore} todayScore={todayScore} />
          )}

          {state.status === 'playing' && currentQuestion && (
            <GameScreen
              question={currentQuestion}
              revealedLetters={state.revealedLetters}
              currentInput={state.currentInput}
              timeRemaining={state.timeRemaining}
              benjaminTimeRemaining={state.benjaminTimeRemaining}
              isBenjaminTimerRunning={state.isBenjaminTimerRunning}
              totalScore={state.totalScore}
              questionIndex={state.currentQuestionIndex}
              totalQuestions={state.questions.length}
              hintsUsed={currentHints}
              answerLocked={state.answerLocked}
              lastAnswerCorrect={state.lastAnswerCorrect}
              questionStatus={state.questionStatus}
              canRequestHint={canRequestHint}
              onInputChange={setInput}
              onLockAnswer={lockAnswer}
              onSubmitAnswer={submitAnswer}
              onRequestHint={requestHint}
              onSkip={skipQuestion}
            />
          )}

          {state.status === 'finished' && (
            <ResultScreen
              questions={state.questions}
              questionScores={state.questionScores}
              correctAnswers={state.correctAnswers}
              hintsUsedPerQuestion={state.hintsUsedPerQuestion}
              totalScore={state.totalScore}
              highScore={highScore}
              isNewHighScore={isNewHighScore}
              wasTimeout={state.wasTimeout}
              onRestart={resetGame}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

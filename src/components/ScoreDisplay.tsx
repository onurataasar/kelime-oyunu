import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface ScoreDisplayProps {
  score: number;
  questionIndex: number;
  totalQuestions: number;
}

/** Animasyonlu sayı sayacı */
function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value === prevRef.current) return;
    const from = prevRef.current;
    const to = value;
    const diff = to - from;
    const steps = 20;
    let step = 0;
    prevRef.current = value;

    const id = setInterval(() => {
      step++;
      setDisplayed(Math.round(from + (diff * step) / steps));
      if (step >= steps) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [value]);

  return <>{displayed.toLocaleString('tr-TR')}</>;
}

export function ScoreDisplay({ score, questionIndex, totalQuestions }: ScoreDisplayProps) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="text-white/50 text-xs font-body uppercase tracking-widest">
        Puan
      </div>
      <motion.div
        key={score}
        initial={{ scale: 1.3, color: '#86efac' }}
        animate={{ scale: 1, color: '#ffd700' }}
        transition={{ duration: 0.4 }}
        className="font-display font-bold text-3xl sm:text-4xl text-gold-400 tabular-nums"
      >
        <AnimatePresence>
          <AnimatedNumber value={score} />
        </AnimatePresence>
      </motion.div>
      <div className="text-white/40 text-xs font-body">
        {questionIndex + 1} / {totalQuestions}
      </div>
    </div>
  );
}

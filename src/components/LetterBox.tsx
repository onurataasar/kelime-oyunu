import { motion, AnimatePresence } from 'framer-motion';

interface LetterBoxProps {
  letter: string;
  revealed: boolean;
  isCorrect?: boolean;
  index: number;
  /** Toplam harf sayısına göre otomatik boyut küçültme */
  totalLetters?: number;
}

function sizeClasses(total: number) {
  if (total >= 10) return 'w-9 h-11 text-lg sm:w-10 sm:h-12 sm:text-xl';
  if (total >= 8)  return 'w-10 h-12 text-xl sm:w-11 sm:h-13 sm:text-2xl';
  return 'w-11 h-13 text-xl sm:w-13 sm:h-15 md:w-14 md:h-16 md:text-3xl';
}

export function LetterBox({ letter, revealed, isCorrect, index, totalLetters = 0 }: LetterBoxProps) {
  const sz = sizeClasses(totalLetters);

  return (
    <motion.div className="relative" style={{ perspective: 600 }} initial={false}>
      <AnimatePresence mode="wait" initial={false}>
        {revealed ? (
          <motion.div
            key="revealed"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className={`
              ${sz} flex items-center justify-center rounded-lg border-2
              font-display font-bold select-none
              ${isCorrect
                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                : 'bg-gold-400/20 border-gold-400 text-gold-400 shadow-[0_0_8px_rgba(255,215,0,0.3)]'
              }
            `}
          >
            {letter}
          </motion.div>
        ) : (
          <motion.div
            key="hidden"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`
              ${sz} flex items-center justify-center rounded-lg border-2
              border-white/20 bg-white/5 text-white/20
              font-display select-none
            `}
          >
            _
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

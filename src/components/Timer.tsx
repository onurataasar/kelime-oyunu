import { motion } from 'framer-motion';

interface TimerProps {
  seconds: number;
  totalSeconds?: number;
  isBenjaminRunning?: boolean;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function Timer({ seconds, totalSeconds = 240, isBenjaminRunning = false }: TimerProps) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pct = (seconds / totalSeconds) * 100;

  const isWarning = seconds <= 30;
  const isCritical = seconds <= 10;

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="text-white/40 text-xs font-body uppercase tracking-widest">
        {isBenjaminRunning ? 'Bekliyor' : 'Süre'}
      </div>
      <motion.div
        animate={
          isCritical && !isBenjaminRunning
            ? { scale: [1, 1.08, 1], color: ['#ef4444', '#fca5a5', '#ef4444'] }
            : isWarning && !isBenjaminRunning
            ? { color: '#ef4444' }
            : isBenjaminRunning
            ? { color: '#94a3b8', opacity: 0.6 }
            : { color: '#ffd700' }
        }
        transition={isCritical && !isBenjaminRunning ? { repeat: Infinity, duration: 0.7 } : { duration: 0.3 }}
        className="font-display font-bold text-3xl sm:text-4xl tabular-nums tracking-wider"
      >
        {pad(mins)}:{pad(secs)}
      </motion.div>

      {/* Progress bar */}
      <div className="w-32 sm:w-44 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full transition-colors ${
            isBenjaminRunning ? 'bg-slate-500' : isWarning ? 'bg-red-500' : 'bg-gold-400'
          }`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </div>
    </div>
  );
}

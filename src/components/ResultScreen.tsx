import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle, Lightbulb, RotateCcw } from 'lucide-react';
import { Question } from '../types';
import { getMaxScore } from '../data/questions';

interface ResultScreenProps {
  questions: Question[];
  questionScores: number[];
  correctAnswers: boolean[];
  hintsUsedPerQuestion: number[];
  totalScore: number;
  highScore: number;
  isNewHighScore: boolean;
  wasTimeout: boolean;
  onRestart: () => void;
}

export function ResultScreen({
  questions,
  questionScores,
  correctAnswers,
  hintsUsedPerQuestion,
  totalScore,
  highScore,
  isNewHighScore,
  wasTimeout,
  onRestart,
}: ResultScreenProps) {
  const correct = correctAnswers.filter(Boolean).length;
  const total = questions.length;
  const maxPossible = questions.reduce((sum, q) => sum + getMaxScore(q.letterCount), 0);
  const pct = Math.round((totalScore / maxPossible) * 100);

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-start p-4 py-8 overflow-y-auto">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-400/5 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col gap-5">
        {/* Süre doldu bildirimi */}
        {wasTimeout && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 bg-red-500/15 border border-red-500/40 rounded-2xl px-5 py-3"
          >
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-display font-bold text-red-400 text-sm tracking-wider">SÜRE DOLDU!</p>
              <p className="text-red-300/60 text-xs font-body">4 dakika tamamlandı</p>
            </div>
          </motion.div>
        )}

        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="font-display text-gold-400/60 text-xs tracking-[0.4em] uppercase mb-2">
            Oyun Bitti
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white">SONUÇLAR</h1>
        </motion.div>

        {/* Ana skor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.45 }}
          className="bg-white/5 backdrop-blur-md border border-gold-400/20 rounded-3xl p-8 text-center"
        >
          {isNewHighScore && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 inline-flex items-center gap-2 bg-gold-400/20 border border-gold-400/40 text-gold-400 text-xs font-display font-bold px-4 py-1.5 rounded-full tracking-widest"
            >
              <Trophy size={14} />
              YENİ REKOR!
            </motion.div>
          )}
          <div className="font-display font-black text-6xl sm:text-7xl text-gold-400 mb-2">
            {totalScore.toLocaleString('tr-TR')}
          </div>
          <div className="text-white/40 font-body text-sm">
            {correct}/{total} doğru · %{pct} başarı
          </div>
          <div className="mt-2 text-white/25 font-body text-xs">
            En yüksek: {highScore.toLocaleString('tr-TR')} puan
          </div>
        </motion.div>

        {/* Soru breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="font-display text-white/50 text-xs uppercase tracking-widest">
              Soru Detayları
            </h2>
          </div>
          <div className="divide-y divide-white/5">
            {questions.map((q, i) => {
              const earned = questionScores[i] ?? 0;
              const max = getMaxScore(q.letterCount);
              const isRight = correctAnswers[i];
              const hints = hintsUsedPerQuestion[i] ?? 0;

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.035 }}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  {isRight ? (
                    <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle size={20} className="text-white/20 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className={`font-display font-bold text-sm ${isRight ? 'text-white' : 'text-white/35'}`}>
                      {q.answer}
                    </div>
                    <div className="text-white/30 text-xs font-body truncate">{q.definition}</div>
                    {hints > 0 && (
                      <div className="flex items-center gap-1 text-blue-400/60 text-xs font-body mt-0.5">
                        <Lightbulb size={11} />
                        {hints} ipucu kullanıldı
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className={`font-display font-bold text-base ${isRight ? 'text-gold-400' : 'text-white/20'}`}>
                      {earned > 0 ? `+${earned}` : '0'}
                    </div>
                    <div className="text-white/20 text-xs font-body">/ {max}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tekrar oyna */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(255,215,0,0.3)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onRestart}
          className="
            w-full py-5 rounded-2xl
            bg-gradient-to-r from-gold-600 to-gold-400
            font-display font-bold text-navy-950 text-xl tracking-wider
            shadow-lg shadow-gold-400/20
            flex items-center justify-center gap-3
          "
        >
          <RotateCcw size={22} />
          TEKRAR OYNA
        </motion.button>
      </div>
    </div>
  );
}

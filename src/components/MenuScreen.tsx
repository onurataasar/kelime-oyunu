import { motion } from "framer-motion";
import { Play, Clock, Lightbulb, Lock, Timer, RotateCcw } from "lucide-react";

interface MenuScreenProps {
  onStart: () => void;
  highScore: number;
  todayScore: number;
}

const RULES = [
  { icon: Clock, text: "4 dakika içinde 14 soruyu yanıtla" },
  { icon: Lightbulb, text: "Her sorudan harf ipucu alabilirsin (−100 puan)" },
  {
    icon: Lock,
    text: "BENJAMİN butonuna bas, süreyi durdur ve cevabı kilitle",
  },
  { icon: Timer, text: "Kilitledikten sonra 10 saniye içinde doğruyu bul" },
  { icon: RotateCcw, text: "10 saniye içinde istediğin kadar tekrar dene" },
];

export function MenuScreen({
  onStart,
  highScore,
  todayScore,
}: MenuScreenProps) {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold-400/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-7 max-w-lg w-full">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          {/* Zıpır yarışma badge */}
          <motion.div
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="inline-block mb-4"
          >
            <span className="bg-gold-400/15 border border-gold-400/30 text-gold-400 font-display text-xs tracking-widest uppercase px-4 py-1.5 rounded-full">
              Harf Alayım
            </span>
          </motion.div>

          <h1 className="font-display font-black text-5xl sm:text-7xl text-white leading-none">
            KELİME
            <br />
            <span className="text-gold-400">OYUNU</span>
          </h1>

          <p className="mt-3 font-body text-white/40 text-sm tracking-wide italic">
            Zıpır bir yarışmaya hoşgeldin...
          </p>
        </motion.div>

        {/* Skor kartları */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="grid grid-cols-2 gap-4 w-full"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-white/40 text-xs font-body uppercase tracking-widest mb-1">
              Bugünkü Rekorum
            </div>
            <div className="font-display font-bold text-2xl text-gold-400">
              {todayScore > 0 ? todayScore.toLocaleString("tr-TR") : "—"}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-gold-400/20 rounded-2xl p-4 text-center">
            <div className="text-white/40 text-xs font-body uppercase tracking-widest mb-1">
              Tüm Zamanlar
            </div>
            <div className="font-display font-bold text-2xl text-gold-400">
              {highScore > 0 ? highScore.toLocaleString("tr-TR") : "—"}
            </div>
          </div>
        </motion.div>

        {/* Başlat butonu */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45 }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 0 35px rgba(255,215,0,0.4)",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="
            w-full py-5 rounded-2xl
            bg-gradient-to-r from-gold-600 to-gold-400
            font-display font-bold text-navy-950 text-2xl tracking-wider
            shadow-lg shadow-gold-400/20
            flex items-center justify-center gap-3
          "
        >
          <Play size={26} fill="currentColor" />
          OYUNA BAŞLA
        </motion.button>

        {/* Kurallar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
        >
          <h2 className="font-display text-white/50 text-xs uppercase tracking-widest mb-4">
            Oyun Kuralları
          </h2>
          <ul className="space-y-3">
            {RULES.map(({ icon: Icon, text }, i) => (
              <li
                key={i}
                className="flex items-start gap-3 font-body text-white/65 text-sm"
              >
                <Icon
                  size={16}
                  className="text-gold-400 flex-shrink-0 mt-0.5"
                />
                {text}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="text-white/20 text-xs font-body">
          Teorik maksimum: 9.800 puan
        </div>
      </div>
    </div>
  );
}

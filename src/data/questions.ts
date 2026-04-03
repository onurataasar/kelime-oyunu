import { Question } from '../types';

/**
 * Türkçe büyük harf normalizasyonu — karşılaştırma için kullanılır.
 *
 * Sorun: JS'in varsayılan toUpperCase() İngilizce locale kullanır:
 *   'i'.toUpperCase() → 'I'   (oysa Türkçe'de 'İ' olmalı)
 *   'ı'.toUpperCase() → 'I'
 * Bu yüzden 'deniz' → 'DENIZ', ama answer 'DENİZ' → karşılaştırma başarısız.
 *
 * Çözüm: karşılaştırmada İ/I ayrımını kaldır — her ikisini 'I'ye eşle.
 * Oyun bağlamında bu ayrım kullanıcıyı yanıltmaz; doğru kelimeyi bilen
 * 'DENİZ' mi 'DENIZ' mi diye düşünmez.
 */
export function normalizeAnswer(str: string): string {
  return str
    .replace(/İ/g, 'I')   // Büyük İ (U+0130) → I
    .replace(/i/g, 'I')   // Küçük noktalı i → I
    .replace(/ı/g, 'I')   // Küçük noktasız ı → I
    .toUpperCase();         // ş→Ş, ç→Ç, ö→Ö, ü→Ü, ğ→Ğ …
}

export function checkAnswer(input: string, answer: string): boolean {
  return normalizeAnswer(input.trim()) === normalizeAnswer(answer.trim());
}

export function getMaxScore(letterCount: number): number {
  return letterCount * 100;
}

export function getQuestionScore(letterCount: number, hintsUsed: number): number {
  const max = getMaxScore(letterCount);
  const score = max - hintsUsed * 100;
  return Math.max(score, 100);
}

// ─────────────────────────────────────────────
// Soru havuzu  (5 tur için yeterli, her uzunluktan 10+ kelime)
// ─────────────────────────────────────────────

const ALL_QUESTIONS: Question[] = [
  // ── 4 HARF ──────────────────────────────────
  { id: 'q4_01', answer: 'DAĞ',    letterCount: 3, definition: 'Yeryüzünün yüksek ve sarp kısımlarından oluşan doğa oluşumu', category: 'coğrafya' },
  { id: 'q4_02', answer: 'KALE',   letterCount: 4, definition: 'Savunma amaçlı inşa edilmiş, surlarla çevrili tarihi yapı', category: 'tarih' },
  { id: 'q4_03', answer: 'ARPA',   letterCount: 4, definition: 'Bira ve hayvan yemi yapımında kullanılan tahıl bitkisi', category: 'günlük' },
  { id: 'q4_04', answer: 'GECE',   letterCount: 4, definition: 'Güneşin ufkun altında olduğu, karanlık geçen zaman dilimi', category: 'günlük' },
  { id: 'q4_05', answer: 'HAVA',   letterCount: 4, definition: 'Atmosferin yeryüzüne yakın tabakasında bulunan gaz karışımı', category: 'bilim' },
  { id: 'q4_06', answer: 'KURT',   letterCount: 4, definition: 'Köpeğin yaban atası, sürü hâlinde yaşayan yırtıcı memeli', category: 'hayvan' },
  { id: 'q4_07', answer: 'ÇINAR',  letterCount: 5, definition: 'Asya\'ya özgü, geniş gölge yapan uzun ömürlü ağaç', category: 'doğa' },
  { id: 'q4_08', answer: 'OCAK',   letterCount: 4, definition: 'Yılın ilk ayı; aynı zamanda ısınmak için ateş yakılan yer', category: 'günlük' },
  { id: 'q4_09', answer: 'ÇATI',   letterCount: 4, definition: 'Binanın üst örtüsünü oluşturan yapı elemanı', category: 'mimari' },
  { id: 'q4_10', answer: 'KAYA',   letterCount: 4, definition: 'Doğada bulunan büyük, sert taş kütlesi', category: 'coğrafya' },

  // ── 5 HARF ──────────────────────────────────
  { id: 'q5_01', answer: 'DENİZ',  letterCount: 5, definition: 'Karaların arasını dolduran tuzlu su kütlesi', category: 'coğrafya' },
  { id: 'q5_02', answer: 'KURAL',  letterCount: 5, definition: 'Uyulması gereken ilke veya düzenleme', category: 'günlük' },
  { id: 'q5_03', answer: 'BULUT',  letterCount: 5, definition: 'Su buharından oluşan, gökyüzünde yüzen beyaz kütle', category: 'doğa' },
  { id: 'q5_04', answer: 'ASLAN',  letterCount: 5, definition: 'Afrika\'nın büyük yırtıcısı, ormanların kralı olarak bilinen kedi familyası üyesi', category: 'hayvan' },
  { id: 'q5_05', answer: 'ELMAS',  letterCount: 5, definition: 'Doğanın en sert maddesi olan değerli taş', category: 'bilim' },
  { id: 'q5_06', answer: 'ÇELIK',  letterCount: 5, definition: 'Demir ve karbonun alaşımından elde edilen sert metal', category: 'bilim' },
  { id: 'q5_07', answer: 'FIRTINA', letterCount: 7, definition: 'Şiddetli rüzgar ve yağışla birlikte görülen sert hava olayı', category: 'doğa' },
  { id: 'q5_08', answer: 'GÜNEŞ',  letterCount: 5, definition: 'Dünya\'nın çevresinde döndüğü, ısı ve ışık kaynağı olan yıldız', category: 'bilim' },
  { id: 'q5_09', answer: 'YAZAR',  letterCount: 5, definition: 'Kitap, makale veya senaryo kaleme alan kişi', category: 'sanat' },
  { id: 'q5_10', answer: 'KÖPRÜ',  letterCount: 5, definition: 'İki yakayı ya da iki yolu birbirine bağlayan yapı', category: 'mimari' },

  // ── 6 HARF ──────────────────────────────────
  { id: 'q6_01', answer: 'GEZEGEN', letterCount: 7, definition: 'Güneş sistemindeki büyük gök cisimlerinden biri', category: 'bilim' },
  { id: 'q6_02', answer: 'MUTLAK', letterCount: 6, definition: 'Koşulsuz, sınırsız; bağımsız ve tartışmasız olan', category: 'felsefe' },
  { id: 'q6_03', answer: 'ÖZGÜR',  letterCount: 5, definition: 'Baskı ve kısıtlamadan arınmış, serbest olan', category: 'felsefe' },
  { id: 'q6_04', answer: 'BAHÇE',  letterCount: 5, definition: 'Çiçek, sebze veya meyve yetiştirilen çevrili alan', category: 'günlük' },
  { id: 'q6_05', answer: 'ÇERÇEVE', letterCount: 7, definition: 'Resim veya fotoğrafın etrafına geçirilen süslü kenar', category: 'sanat' },
  { id: 'q6_06', answer: 'TOPRAK', letterCount: 6, definition: 'Bitkilerin yetiştiği, mineraller ve organik madde içeren yeryüzü tabakası', category: 'doğa' },
  { id: 'q6_07', answer: 'MÜZIK',  letterCount: 5, definition: 'Sesin ritim ve uyum içinde düzenlendiği sanat dalı', category: 'sanat' },
  { id: 'q6_08', answer: 'LIMAN',  letterCount: 5, definition: 'Gemilerin yük alıp boşalttığı, barındığı kıyı yapısı', category: 'coğrafya' },
  { id: 'q6_09', answer: 'KAPLAN', letterCount: 6, definition: 'Çizgili postu ve güçlü yapısıyla tanınan büyük kedi', category: 'hayvan' },
  { id: 'q6_10', answer: 'BALIK',  letterCount: 5, definition: 'Solungaçlarıyla solunum yapan, suda yaşayan omurgalı', category: 'hayvan' },

  // ── 7 HARF ──────────────────────────────────
  { id: 'q7_01', answer: 'ŞELALE',  letterCount: 6, definition: 'Yüksek bir yerden dökülen su kütlesi', category: 'coğrafya' },
  { id: 'q7_02', answer: 'BALİNA',  letterCount: 6, definition: 'Okyanusta yaşayan, dünyanın en büyük memelisi', category: 'hayvan' },
  { id: 'q7_03', answer: 'KOMŞU',  letterCount: 5, definition: 'Yanı başında oturan, aynı mahallede yaşayan kişi', category: 'günlük' },
  { id: 'q7_04', answer: 'RÜZGAR',  letterCount: 6, definition: 'Basınç farkından doğan yatay hava hareketi', category: 'doğa' },
  { id: 'q7_05', answer: 'ARMAĞAN', letterCount: 7, definition: 'Sevgi ve saygının göstergesi olarak verilen nesne', category: 'günlük' },
  { id: 'q7_06', answer: 'ÇÖKÜNTÜ', letterCount: 7, definition: 'Zemin veya yapının çökmesiyle oluşan çukur; aynı zamanda ekonomik kriz anlamına gelir', category: 'günlük' },
  { id: 'q7_07', answer: 'BULMACA', letterCount: 7, definition: 'Çözülmesi gereken kelime veya görsel zeka oyunu', category: 'eğlence' },
  { id: 'q7_08', answer: 'ŞAPKALI', letterCount: 7, definition: 'Başında şapka bulunan; şapka giyen kişiye sıfat', category: 'günlük' },
  { id: 'q7_09', answer: 'YELPAZE', letterCount: 7, definition: 'Hava yaratmak için sallanan yelken biçimli aksesuar', category: 'günlük' },
  { id: 'q7_10', answer: 'KARIDES', letterCount: 7, definition: 'Denizde yaşayan, ince kabuklu küçük deniz ürünü', category: 'hayvan' },

  // ── 8 HARF ──────────────────────────────────
  { id: 'q8_01', answer: 'DÖRTGEN',  letterCount: 7, definition: 'Dört kenarlı geometrik şekil', category: 'matematik' },
  { id: 'q8_02', answer: 'KARDEŞLER', letterCount: 9, definition: 'Aynı anne babadan doğan, birden fazla kişi için kullanılan ifade', category: 'aile' },
  { id: 'q8_03', answer: 'HASTANE',  letterCount: 7, definition: 'Hastaların muayene ve tedavi edildiği sağlık kuruluşu', category: 'günlük' },
  { id: 'q8_04', answer: 'FELSEFE',  letterCount: 7, definition: 'Varlık, bilgi ve değer üzerine sistematik düşünce disiplini', category: 'bilim' },
  { id: 'q8_05', answer: 'ÇIÇEKLER', letterCount: 8, definition: 'Bitkilerin üreme organlarını taşıyan, renkli yapılar (çoğul)', category: 'doğa' },
  { id: 'q8_06', answer: 'GÖNÜLLÜ', letterCount: 7, definition: 'Herhangi bir karşılık beklemeden iş yapan istekli kişi', category: 'sosyal' },
  { id: 'q8_07', answer: 'MÜZISYEN', letterCount: 8, definition: 'Müzik icra eden veya besteleyen sanatçı', category: 'sanat' },
  { id: 'q8_08', answer: 'TÜRKÇE',   letterCount: 6, definition: 'Türk milletinin ana dili; Türkiye\'nin resmî dili', category: 'dil' },
  { id: 'q8_09', answer: 'KELEBEK',  letterCount: 7, definition: 'Renkli kanatlarıyla uçan, çiçeklerden beslenen böcek', category: 'hayvan' },
  { id: 'q8_10', answer: 'TAKVIM',   letterCount: 6, definition: 'Günleri, haftaları, ayları ve yılları gösteren çizelge', category: 'günlük' },

  // ── 9 HARF ──────────────────────────────────
  { id: 'q9_01', answer: 'ANAHTARLIK', letterCount: 10, definition: 'Anahtarları taşımaya yarayan küçük aksesuar', category: 'günlük' },
  { id: 'q9_02', answer: 'KARANLIK',   letterCount: 8, definition: 'Işık bulunmayan, görüşü engelleyen durum', category: 'günlük' },
  { id: 'q9_03', answer: 'YÜKSEKLIK',  letterCount: 9, definition: 'Bir nesnenin zeminden olan dikey uzaklığı', category: 'matematik' },
  { id: 'q9_04', answer: 'GÖKYÜZÜ',    letterCount: 7, definition: 'Yeryüzünün üzerini örten, mavi ya da bulutlu görünen alan', category: 'doğa' },
  { id: 'q9_05', answer: 'OYUNCAK',    letterCount: 7, definition: 'Çocukların oynaması için tasarlanmış nesne', category: 'günlük' },
  { id: 'q9_06', answer: 'SÜZGEÇ',     letterCount: 6, definition: 'Sıvıyı katı maddelerden ayırmaya yarayan mutfak aleti', category: 'günlük' },
  { id: 'q9_07', answer: 'BAHARAT',    letterCount: 7, definition: 'Yemeklere aroma ve lezzet katmak için kullanılan bitki özleri', category: 'günlük' },
  { id: 'q9_08', answer: 'KARŞILIK',   letterCount: 8, definition: 'Bir şeyin karşılığında verilen bedel ya da yanıt', category: 'dil' },
  { id: 'q9_09', answer: 'BALKABAĞ',   letterCount: 8, definition: 'Turuncu renkli, tatlandırıcı olarak da kullanılan kabak türü', category: 'günlük' },
  { id: 'q9_10', answer: 'ÇIĞLAYAN',   letterCount: 8, definition: 'Yüksek sesle bağıran, feryadeden kişiyi tanımlayan sıfat', category: 'günlük' },

  // ── 10 HARF ──────────────────────────────────
  { id: 'q10_01', answer: 'CUMHURİYET',  letterCount: 10, definition: 'Halkın seçimle yöneticilerini belirlediği devlet yönetim biçimi', category: 'tarih' },
  { id: 'q10_02', answer: 'ASTRONOMİ',   letterCount: 9,  definition: 'Gök cisimlerini inceleyen bilim dalı', category: 'bilim' },
  { id: 'q10_03', answer: 'DEMOKRASI',   letterCount: 9,  definition: 'Halkın egemenliğine dayanan yönetim sistemi', category: 'tarih' },
  { id: 'q10_04', answer: 'FOTOĞRAFÇI', letterCount: 10, definition: 'Fotoğraf çeken, görüntüyü sanatsal biçimde işleyen kişi', category: 'sanat' },
  { id: 'q10_05', answer: 'KÜTÜPHANE',  letterCount: 9,  definition: 'Kitapların toplandığı ve okuyucuya sunulduğu yer', category: 'kültür' },
  { id: 'q10_06', answer: 'ARKEOLOJI',  letterCount: 9,  definition: 'Eski uygarlıkların kalıntılarını inceleyerek tarihi aydınlatan bilim', category: 'bilim' },
  { id: 'q10_07', answer: 'HEYKELTRAŞ', letterCount: 10, definition: 'Heykel yapan; taş, metal veya kil yontan sanatçı', category: 'sanat' },
  { id: 'q10_08', answer: 'GAZETECI',   letterCount: 9,  definition: 'Haber toplayan, yazıp yayımlayan basın mensubu', category: 'medya' },
  { id: 'q10_09', answer: 'RENGARENK',  letterCount: 9,  definition: 'Birçok rengi bir arada barındıran, göz alıcı çok renkli', category: 'dil' },
  { id: 'q10_10', answer: 'ÇOBANLATMA', letterCount: 10, definition: 'Sürüyü bir çoban tarafından güdülme, yönetme eylemi', category: 'günlük' },
];

/** letterCount ile eşleşmeyen soruları filtrele ve doğrula */
const VALIDATED = ALL_QUESTIONS.filter((q) => {
  const ok = q.answer.length === q.letterCount;
  if (!ok) {
    console.warn(`[questions] letterCount uyuşmazlığı: ${q.id} — answer.length=${q.answer.length}, letterCount=${q.letterCount}`);
  }
  return ok;
});

/** Bir tur için 14 soru: her uzunluktan 2 */
const LENGTHS_PER_ROUND = [4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];

function pickByLength(pool: Question[], len: number, exclude: Set<string>): Question | null {
  const candidates = pool.filter((q) => q.letterCount === len && !exclude.has(q.id));
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Karıştırılmış, uzunluğa göre sıralı 14 soruluk tur oluştur */
export function generateRound(): Question[] {
  const used = new Set<string>();
  const round: Question[] = [];

  for (const len of LENGTHS_PER_ROUND) {
    const q = pickByLength(VALIDATED, len, used);
    if (q) {
      round.push(q);
      used.add(q.id);
    }
  }

  return round;
}

# Kelime Oyunu 🎪

Ali İhsan Varol'un efsane TV yarışması **Kelime Oyunu**'nun web uygulaması versiyonu.
React + TypeScript ile geliştirilmiş, tamamen Türkçe.

## Özellikler

- **14 soruluk tur** — 4'ten 10 harfe kadar artan zorluk
- **4 dakika** ana süre (yalnızca düşünürken akar, Benjamin'de durur)
- **BENJAMİN butonu** — kilitleme mekanizması + 10 saniyelik cevap penceresi
- **Harf ipucu** — her harf −100 puan, minimum 100 puan
- **Puan sistemi** — teorik maksimum 9.800 puan
- **localStorage** skoru — bugünkü ve tüm zamanlar rekoru
- **Ses efektleri** — Web Audio API (doğru, yanlış, ipucu, benjamin, tik-tak)
- **Animasyonlar** — framer-motion (flip, shake, feedback)
- **Türkçe normalizasyon** — i/ı/İ/I ayrımını karşılaştırmada görmezden gelir

## Klavye Kısayolları

| Tuş | İşlev |
|-----|-------|
| `Space` | Harf İste |
| `Enter` | BENJAMİN (kilitle) |
| `Enter` *(input odaklıyken)* | Cevapla |
| `P` / `Escape` | Pas Geç |

## Kurulum

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| UI | React 18 + TypeScript |
| Stil | Tailwind CSS v3 |
| Animasyon | framer-motion |
| İkonlar | lucide-react |
| Ses | Web Audio API (harici dosya yok) |
| State | useReducer + custom hooks |
| Build | Vite 5 |

## Oyun Mekanikleri

```
Tur başlar → Ana timer (4:00) akar
    ↓
Harf İste  →  Rastgele harf açılır (−100 puan potansiyeli)
    ↓
BENJAMİN   →  Ana timer DURUR, 10 saniyelik pencere BAŞLAR
    ↓
Cevap yaz + Cevapla tuşuna bas
    ↓
Doğru?  ✓ → Puan eklenir, 1.2sn sonra sonraki soru
Yanlış? ✗ → 10 saniye dolana kadar tekrar deneyebilirsin
Süre?   ⏰ → Doğru cevap gösterilir, 2.2sn sonra sonraki soru
```

## Puanlama

| Harf | Maks | 1 ipucu | 2 ipucu | … |
|------|------|---------|---------|---|
| 4 | 400 | 300 | 200 | min 100 |
| 5 | 500 | 400 | 300 | min 100 |
| … | … | … | … | … |
| 10 | 1000 | 900 | 800 | min 100 |

// src/utils/jellyMarketUtils.js

// 🔸 기본 젤리 주식 목록
export const BASE_JELLY_STOCKS = [
  {
    id: "JELLY-STR",
    name: "딸기젤리 성장주",
    basePriceWon: 1500,
    emoji: "🍓",
    mood: "growth",
  },
  {
    id: "JELLY-GRP",
    name: "포도젤리 지수",
    basePriceWon: 1300,
    emoji: "🍇",
    mood: "stable",
  },
  {
    id: "JELLY-COLA",
    name: "콜라젤리 ETF",
    basePriceWon: 900,
    emoji: "🥤",
    mood: "volatile",
  },
  {
    id: "JELLY-LEMON",
    name: "레몬젤리 하이브리드",
    basePriceWon: 1100,
    emoji: "🍋",
    mood: "middle",
  },
  {
    id: "JELLY-SODA",
    name: "소다젤리 테마",
    basePriceWon: 1000,
    emoji: "🍧",
    mood: "theme",
  },
  {
    id: "JELLY-APPLE",
    name: "사과젤리 우량주",
    basePriceWon: 1800,
    emoji: "🍎",
    mood: "bluechip",
  },
  {
    id: "JELLY-MANGO",
    name: "망고젤리 성장주",
    basePriceWon: 2000,
    emoji: "🥭",
    mood: "growth",
  },
  {
    id: "JELLY-CHERRY",
    name: "체리젤리 테크",
    basePriceWon: 1700,
    emoji: "🍒",
    mood: "volatile",
  },
  {
    id: "JELLY-ORANGE",
    name: "오렌지젤리 인덱스",
    basePriceWon: 1400,
    emoji: "🍊",
    mood: "stable",
  },
  {
    id: "JELLY-GREEN",
    name: "청포도젤리 우량주",
    basePriceWon: 1600,
    emoji: "🍈",
    mood: "bluechip",
  },
  {
    id: "JELLY-PEACH",
    name: "복숭아젤리 배당주",
    basePriceWon: 1400,
    emoji: "🍑",
    mood: "dividend",
  },
  {
    id: "JELLY-GRAPEFRUIT",
    name: "자몽젤리 성장주",
    basePriceWon: 1500,
    emoji: "🍊",
    mood: "growth",
  },
  {
    id: "JELLY-MELON",
    name: "메론젤리 대형주",
    basePriceWon: 1300,
    emoji: "🍈",
    mood: "stable",
  },
  {
    id: "JELLY-PINE",
    name: "파인애플젤리 테마주",
    basePriceWon: 1200,
    emoji: "🍍",
    mood: "theme",
  },
  {
    id: "JELLY-PLUM",
    name: "자두젤리 중형주",
    basePriceWon: 1250,
    emoji: "🍑",
    mood: "middle",
  },
  {
    id: "JELLY-YOGURT",
    name: "요거트젤리 방어주",
    basePriceWon: 1150,
    emoji: "🥛",
    mood: "dividend",
  },
  {
    id: "JELLY-MILK",
    name: "밀크젤리 우량주",
    basePriceWon: 1700,
    emoji: "🍼",
    mood: "bluechip",
  },
  {
    id: "JELLY-BLACK",
    name: "블랙젤리 하이리스크",
    basePriceWon: 900,
    emoji: "⚫",
    mood: "volatile",
  },
  {
    id: "JELLY-WATER",
    name: "수박젤리 테마주",
    basePriceWon: 1000,
    emoji: "🍉",
    mood: "theme",
  },
];

// 마켓 데이터 버전
export const JELLY_MARKET_VERSION = 3;

// 원 → 젤리 단위 변환
export function priceToJelly(priceWon) {
  return Math.max(1, Math.ceil(priceWon / 1000));
}

// 등락률 포맷
export function formatRate(rate) {
  const fixed = rate.toFixed(2);
  if (rate > 0) return `+${fixed}%`;
  if (rate < 0) return `${fixed}%`;
  return "0.00%";
}

// 무드 라벨
export function moodLabel(mood) {
  switch (mood) {
    case "growth":
      return "성장주";
    case "stable":
      return "지수/안정";
    case "volatile":
      return "변동성";
    case "middle":
      return "중형/일반";
    case "theme":
      return "테마/이벤트";
    case "bluechip":
      return "우량주";
    case "dividend":
      return "배당주";
    default:
      return "일반";
  }
}

// 랜덤 변동률
export function getRandomChangePercent(stock) {
  let upProb = 0.5;
  let maxRange = 0.05;

  switch (stock.mood) {
    case "growth":
      upProb = 0.58;
      maxRange = 0.06;
      break;
    case "volatile":
      upProb = 0.52;
      maxRange = 0.08;
      break;
    case "middle":
      upProb = 0.5;
      maxRange = 0.05;
      break;
    case "theme":
      upProb = 0.48;
      maxRange = 0.09;
      break;
    case "bluechip":
      upProb = 0.52;
      maxRange = 0.04;
      break;
    case "dividend":
      upProb = 0.5;
      maxRange = 0.03;
      break;
    case "stable":
    default:
      upProb = 0.5;
      maxRange = 0.04;
      break;
  }

  const isUp = Math.random() < upProb;
  const magnitude = Math.random() * maxRange;
  return isUp ? magnitude : -magnitude;
}

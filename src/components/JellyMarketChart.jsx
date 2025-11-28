// src/components/JellyMarketChart.jsx
import React from "react";

export default function JellyMarketChart({
  history,
  mood = "growth",
  basePrice,
}) {
  if (!history || history.length === 0) return null;

  const base = basePrice ?? history[0];

  // 등락률 배열로 변환
  const rates = history.map((p) => ((p - base) / base) * 100);

  let minRate = Math.min(...rates);
  let maxRate = Math.max(...rates);

  // 모두 같은 값이면 살짝 범위 벌려주기
  if (minRate === maxRate) {
    minRate -= 1;
    maxRate += 1;
  }

  const width = 120;
  const height = 40;

  const pts = rates.map((rate, idx) => {
    const x =
      history.length === 1 ? width / 2 : (idx / (history.length - 1)) * width;
    const norm = (rate - minRate) / (maxRate - minRate); // 0~1
    const y = height - norm * (height - 4) - 2; // 위아래 여백
    return { x, y, rate };
  });

  const path = pts.map((pt) => `${pt.x},${pt.y}`).join(" ");

  const strokeColor =
    mood === "stable" ? "#64748b" : mood === "volatile" ? "#eab308" : "#3f7fd3";

  return (
    <svg
      className="mini-chart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      {/* 배경 */}
      <defs>
        <linearGradient id="miniChartBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5f3ff" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#miniChartBg)"
        rx="6"
      />

      {/* 선 */}
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        points={path}
      />

      {/* 점 */}
      {pts.map((pt, idx) => (
        <circle
          key={idx}
          cx={pt.x}
          cy={pt.y}
          r="1.6"
          fill="#fff"
          stroke={strokeColor}
          strokeWidth="0.7"
        />
      ))}
    </svg>
  );
}

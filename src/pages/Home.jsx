// src/pages/Home.js
import React from "react";

export default function Home({ onStart }) {
  return (
    <div className="card">
      <div className="badge">JELLY STOCK</div>
      <button className="start-btn" onClick={onStart}>
        젤리 주식 시작하기
      </button>
    </div>
  );
}

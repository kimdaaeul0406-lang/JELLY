// src/pages/MyPage.jsx
import React, { useState, useEffect } from "react";

export default function MyPage({ user, wallet, jellyPositions }) {
  const totalJellyStocks = Object.values(jellyPositions).reduce(
    (sum, pos) => sum + pos.qty,
    0
  );

  // 환경 설정 상태
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("jellyUserSettings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("설정 로드 실패:", e);
      }
    }
    return {
      beginnerMode: true,
      celebrationPopup: true,
    };
  });

  // 설정 저장
  useEffect(() => {
    localStorage.setItem("jellyUserSettings", JSON.stringify(settings));
  }, [settings]);

  function handleSettingChange(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="simple-page">
      <h2>🙋 마이페이지</h2>

      <section className="mypage-section">
        <h3>프로필</h3>
        {user ? (
          <>
            <p>
              닉네임: <strong>{user.nickname}</strong>
            </p>
            <p>
              이메일: <strong>{user.email}</strong>
            </p>
          </>
        ) : (
          <p>로그인 후 이용 가능한 페이지입니다.</p>
        )}
      </section>

      <section className="mypage-section">
        <h3>내 지갑 요약</h3>
        <p>
          현금: <strong>{wallet.cash.toLocaleString()}원</strong>
        </p>
        <p>
          젤리: <strong>{wallet.jelly.toLocaleString()} J</strong>
        </p>
        <p>
          보유 젤리 주식 수량: <strong>{totalJellyStocks}주</strong>
        </p>
      </section>

      <section className="mypage-section">
        <h3>환경 설정</h3>
        <label className="mypage-option">
          <input
            type="checkbox"
            checked={settings.beginnerMode}
            onChange={(e) => handleSettingChange("beginnerMode", e.target.checked)}
            aria-label="주린이 모드"
          />
          주린이 모드 ON (어려운 용어 최소화)
        </label>
        <label className="mypage-option">
          <input
            type="checkbox"
            checked={settings.celebrationPopup}
            onChange={(e) => handleSettingChange("celebrationPopup", e.target.checked)}
            aria-label="축하 팝업"
          />
          젤리 10,000개 넘으면 축하 팝업 보기
        </label>
      </section>
    </div>
  );
}

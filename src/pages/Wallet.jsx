// src/pages/Wallet.jsx
import React, { useState } from "react";

export default function Wallet({ wallet, onCharge, onConvert }) {
  const [amount, setAmount] = useState("");

  const MAX_CHARGE_AMOUNT = 100000000; // 최대 충전 금액 (1억)

  function handleSubmit(e) {
    e.preventDefault();

    const raw = amount.trim();
    if (!raw) return;

    const value = Number(raw);

    // 1) 숫자인지 확인
    if (Number.isNaN(value)) {
      alert("숫자를 입력해 주세요!");
      return;
    }

    // 2) 0 이하 금액 금지
    if (value <= 0) {
      alert("0원보다 큰 금액을 입력해야 해요!");
      return;
    }

    // 3) 최대 충전 금액 제한
    if (value > MAX_CHARGE_AMOUNT) {
      alert(
        `한 번에 충전할 수 있는 최대 금액은 ${MAX_CHARGE_AMOUNT.toLocaleString()}원입니다.`
      );
      return;
    }

    // 4) 정상일 때만 충전 실행
    onCharge(value);
    setAmount("");
  }

  const canConvert = wallet.jelly >= 10000;
  const inputValue = Number(amount) || 0;
  const estimatedJelly = Math.floor(inputValue / 10000) * 10;

  // 빠른 충전 버튼
  const quickChargeAmounts = [10000, 50000, 100000, 500000];

  function handleQuickCharge(amount) {
    setAmount(amount.toString());
  }

  return (
    <div className="simple-page">
      <h2>💼 내 지갑</h2>
      <p>계좌 연동 없이, 과제용으로 가짜 충전을 하는 지갑입니다.</p>

      <div className="wallet-grid">
        <section className="wallet-block">
          <h3>현재 잔액</h3>
          <div className="wallet-balance-card">
            <div className="wallet-balance-item">
              <span className="wallet-balance-label">현금</span>
              <span className="wallet-balance-amount">
                {wallet.cash.toLocaleString()}원
              </span>
            </div>
            <div className="wallet-balance-item">
              <span className="wallet-balance-label">젤리</span>
              <span className="wallet-balance-amount jelly">
                {wallet.jelly.toLocaleString()} J
              </span>
            </div>
          </div>
          <p className="wallet-note">
            10,000원 충전할 때마다 <strong>10젤리</strong>가 적립돼요.
          </p>
        </section>

        <section className="wallet-block">
          <h3>충전하기</h3>
          <form onSubmit={handleSubmit} className="wallet-charge-form">
            <input
              type="number"
              value={amount}
              min={0}
              max={MAX_CHARGE_AMOUNT}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="충전할 금액 (원)"
              aria-label="충전할 금액 입력"
            />

            {/* 빠른 충전 버튼 */}
            <div className="wallet-quick-charge">
              <span className="wallet-quick-label">빠른 충전:</span>
              <div className="wallet-quick-buttons">
                {quickChargeAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className="wallet-quick-btn"
                    onClick={() => handleQuickCharge(amt)}
                    aria-label={`${amt.toLocaleString()}원 빠른 충전`}
                  >
                    {amt >= 100000
                      ? `${amt / 10000}만원`
                      : `${amt.toLocaleString()}원`}
                  </button>
                ))}
              </div>
            </div>

            {/* 예상 적립 젤리 표시 */}
            {inputValue > 0 && (
              <div className="wallet-estimated">
                예상 적립: <strong>{estimatedJelly} J</strong>
              </div>
            )}

            <button
              type="submit"
              className="wallet-charge-btn"
              aria-label="충전 및 젤리 적립"
            >
              충전 + 젤리 적립
            </button>
          </form>
          <p className="wallet-tip">
            예) 10,000원 → 10J, 30,000원 → 30J 가 적립됩니다.
          </p>
        </section>

        <section className="wallet-block">
          <h3>젤리 → 현금 전환</h3>
          <p className="wallet-note">
            젤리를 <strong>10,000 J</strong> 이상 모으면, 한 번에 현금으로
            전환할 수 있어요.
          </p>

          {/* 전환 진행률 표시 */}
          <div className="wallet-convert-progress">
            <div className="wallet-convert-progress-bar">
              <div
                className="wallet-convert-progress-fill"
                style={{
                  width: `${Math.min(100, (wallet.jelly / 10000) * 100)}%`,
                }}
              />
            </div>
            <div className="wallet-convert-progress-text">
              {wallet.jelly >= 10000
                ? "전환 가능!"
                : `${10000 - wallet.jelly} J 더 필요해요`}
            </div>
          </div>

          <button
            className={`wallet-convert-btn ${
              canConvert ? "" : "wallet-convert-btn-disabled"
            }`}
            onClick={onConvert}
            disabled={!canConvert}
            aria-label={
              canConvert
                ? "젤리 10,000개를 현금으로 전환"
                : "젤리가 부족하여 전환 불가"
            }
          >
            젤리 10,000 J 현금으로 전환하기
          </button>
          {!canConvert && (
            <p className="wallet-tip">
              현재 보유: <strong>{wallet.jelly.toLocaleString()} J</strong> /
              필요: <strong>10,000 J</strong>
            </p>
          )}
          {canConvert && (
            <p className="wallet-tip">
              전환 시: 젤리 <strong>10,000 J</strong> → 현금{" "}
              <strong>10,000,000원</strong>
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

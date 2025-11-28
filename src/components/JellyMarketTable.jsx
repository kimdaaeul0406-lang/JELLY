// src/components/JellyMarketTable.jsx
import React from "react";
import JellyMarketChart from "./JellyMarketChart";

export default function JellyMarketTable({
  boardStocks,
  sortKey,
  setSortKey,
  selectedStock,
  setSelectedStockId,
  qty,
  setQty,
  jellyPositions,
  nowTime,
  priceToJelly,
  formatRate,
  moodLabel,
  onBuy,
  onSell,
  topUpStock,
  topDownStock,
}) {
  if (!boardStocks || boardStocks.length === 0) {
    return (
      <section className="market-table-section">
        <h2 className="market-section-title">리스트 보기</h2>
        <p>현재 표시할 젤리 종목이 없어요 😢</p>
      </section>
    );
  }

  // 🔼 가장 많이 오른 종목
  const topRiser = [...boardStocks].sort(
    (a, b) => b.changeRate - a.changeRate
  )[0];

  // 🔽 가장 많이 떨어진 종목
  const topFaller = [...boardStocks].sort(
    (a, b) => a.changeRate - b.changeRate
  )[0];

  function handleQtyChange(stockId, value) {
    setQty((prev) => ({
      ...prev,
      [stockId]: value,
    }));
  }

  function getHolding(stockId) {
    if (!jellyPositions) return 0;
    const pos = jellyPositions[stockId];
    if (!pos) return 0;
    return pos.qty || 0;
  }

  function handleSort(nextKey) {
    setSortKey(nextKey);
  }

  return (
    <section className="market-table-section">
      {/* 헤더 + 시간 */}
      <div className="market-table-header-row">
        <h2 className="market-section-title">리스트 보기</h2>
        <div className="market-table-time">업데이트: {nowTime}</div>
      </div>

      {/* 🔥 실시간 상승 / 하락 TOP1 카드 + 그래프 */}
      <div className="market-highlight-row">
        {/* 상승 1종목 */}
        <div className="market-highlight-card up">
          <div className="highlight-label">실시간 상승 TOP 1</div>
          <div className="highlight-main">
            <div className="highlight-emoji">{topRiser.emoji}</div>
            <div className="highlight-text">
              <div className="highlight-name">{topRiser.name}</div>
              <div className="highlight-sub">
                {moodLabel(topRiser.mood)} · {topRiser.id}
              </div>
            </div>
          </div>

          <div className="highlight-price">
            <span className="highlight-price-main">
              {topRiser.priceWon.toLocaleString("ko-KR")}원
            </span>
            <span className="highlight-change up">
              {formatRate(topRiser.changeRate)}
            </span>
          </div>

          {/* 🔹 상승 종목 미니 그래프 */}
          <div className="highlight-chart">
            <JellyMarketChart
              history={topRiser.history || [topRiser.priceWon]}
              mood={topRiser.mood}
              basePrice={topRiser.basePriceWon}
            />
          </div>
        </div>

        {/* 하락 1종목 */}
        <div className="market-highlight-card down">
          <div className="highlight-label">실시간 하락 TOP 1</div>
          <div className="highlight-main">
            <div className="highlight-emoji">{topFaller.emoji}</div>
            <div className="highlight-text">
              <div className="highlight-name">{topFaller.name}</div>
              <div className="highlight-sub">
                {moodLabel(topFaller.mood)} · {topFaller.id}
              </div>
            </div>
          </div>

          <div className="highlight-price">
            <span className="highlight-price-main">
              {topFaller.priceWon.toLocaleString("ko-KR")}원
            </span>
            <span className="highlight-change down">
              {formatRate(topFaller.changeRate)}
            </span>
          </div>

          {/* 🔹 하락 종목 미니 그래프 */}
          <div className="highlight-chart">
            <JellyMarketChart
              history={topFaller.history || [topFaller.priceWon]}
              mood={topFaller.mood}
              basePrice={topFaller.basePriceWon}
            />
          </div>
        </div>
      </div>

      {/* 정렬 탭 */}
      <div className="market-table-sort-row">
        <button
          className={
            sortKey === "name" ? "sort-chip sort-chip-active" : "sort-chip"
          }
          onClick={() => handleSort("name")}
        >
          이름순
        </button>
        <button
          className={
            sortKey === "change" ? "sort-chip sort-chip-active" : "sort-chip"
          }
          onClick={() => handleSort("change")}
        >
          등락률순
        </button>
      </div>

      {/* 실제 리스트 테이블 */}
      <div className="market-table-wrapper">
        <table className="market-table">
          <thead>
            <tr>
              <th>종목</th>
              <th>현재가</th>
              <th>등락률</th>
              <th>분위기</th>
              <th>보유수량</th>
              <th>매수/매도</th>
              <th>맨위/맨아래</th>
            </tr>
          </thead>
          <tbody>
            {boardStocks.map((stock) => {
              const jellyPrice = priceToJelly(stock.priceWon);
              const holding = getHolding(stock.id);
              const inputVal = qty[stock.id] ?? "";

              const isUp = stock.changeRate >= 0;

              return (
                <tr
                  key={stock.id}
                  className={
                    selectedStock && selectedStock.id === stock.id
                      ? "market-row selected"
                      : "market-row"
                  }
                  onClick={() => setSelectedStockId(stock.id)}
                >
                  {/* 종목명 */}
                  <td className="market-cell-name">
                    <div className="cell-main-name">
                      <span className="cell-emoji">{stock.emoji}</span>
                      <span className="cell-name-text">{stock.name}</span>
                    </div>
                    <div className="cell-sub-id">{stock.id}</div>
                  </td>

                  {/* 현재가 */}
                  <td className="market-cell-price">
                    <div className="cell-price-won">
                      {stock.priceWon.toLocaleString("ko-KR")}원
                    </div>
                    <div className="cell-price-jelly">
                      ≈ {jellyPrice.toLocaleString("ko-KR")} J
                    </div>
                  </td>

                  {/* 등락률 */}
                  <td className="market-cell-change">
                    <span
                      className={isUp ? "change-badge up" : "change-badge down"}
                    >
                      {formatRate(stock.changeRate)}
                    </span>
                  </td>

                  {/* 분위기 */}
                  <td className="market-cell-mood">
                    <span className="mood-badge">{moodLabel(stock.mood)}</span>
                  </td>

                  {/* 보유 수량 */}
                  <td className="market-cell-holding">
                    {holding.toLocaleString("ko-KR")}주
                  </td>

                  {/* 매수 / 매도 */}
                  <td className="market-cell-trade">
                    <input
                      type="number"
                      min="0"
                      className="qty-input"
                      value={inputVal}
                      onChange={(e) =>
                        handleQtyChange(stock.id, e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="trade-button-row">
                      <button
                        className="trade-btn buy"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBuy(stock, jellyPrice);
                        }}
                      >
                        매수
                      </button>
                      <button
                        className="trade-btn sell"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSell(stock, jellyPrice);
                        }}
                      >
                        매도
                      </button>
                    </div>
                  </td>

                  {/* 맨위/맨아래 */}
                  <td className="market-cell-top">
                    <button
                      className="top-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        topUpStock(stock.id);
                      }}
                    >
                      ↑
                    </button>
                    <button
                      className="top-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        topDownStock(stock.id);
                      }}
                    >
                      ↓
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

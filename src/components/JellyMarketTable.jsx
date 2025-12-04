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

  const topRiser = [...boardStocks].sort(
    (a, b) => b.changeRate - a.changeRate
  )[0];

  const topFaller = [...boardStocks].sort(
    (a, b) => a.changeRate - b.changeRate
  )[0];

  function handleQtyChange(stockId, value) {
    setQty((prev) => ({ ...prev, [stockId]: value }));
  }

  function getHolding(stockId) {
    if (!jellyPositions) return null;
    return jellyPositions[stockId] || null;
  }

  function calcPnL(holding, currentJellyPrice) {
    if (!holding || holding.qty === 0) return null;
    const avgPrice = holding.avgPriceJelly;
    const pnl = (currentJellyPrice - avgPrice) * holding.qty;
    const pnlPercent = ((currentJellyPrice - avgPrice) / avgPrice) * 100;
    return { pnl, pnlPercent };
  }

  return (
    <section className="market-table-section">
      {/* 헤더 */}
      <div className="market-table-header-row">
        <h2 className="market-section-title">리스트 보기</h2>
        <div className="market-table-time">업데이트: {nowTime}</div>
      </div>

      {/* 실시간 상승/하락 TOP 1 */}
      <div className="market-highlight-row">
        <div className="market-highlight-card up">
          <div className="highlight-label">🔥 실시간 상승 TOP 1</div>
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
          <div className="highlight-chart">
            <JellyMarketChart
              history={topRiser.history || [topRiser.priceWon]}
              mood={topRiser.mood}
              basePrice={topRiser.basePriceWon}
            />
          </div>
        </div>

        <div className="market-highlight-card down">
          <div className="highlight-label">💧 실시간 하락 TOP 1</div>
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
          <div className="highlight-chart">
            <JellyMarketChart
              history={topFaller.history || [topFaller.priceWon]}
              mood={topFaller.mood}
              basePrice={topFaller.basePriceWon}
            />
          </div>
        </div>
      </div>

      {/* 종목 리스트 테이블 */}
      <div className="market-table-wrapper">
        <table className="market-table market-table-fixed">
          <thead>
            <tr>
              <th className="col-name">종목</th>
              <th className="col-price">현재가</th>
              <th className="col-change">등락률</th>
              <th className="col-holding">보유 현황</th>
              <th className="col-trade">매수/매도</th>
            </tr>
          </thead>
          <tbody>
            {boardStocks.map((stock) => {
              const jellyPrice = priceToJelly(stock.priceWon);
              const holding = getHolding(stock.id);
              const holdingQty = holding?.qty || 0;
              const inputVal = qty[stock.id] ?? "";
              const inputQty = Number(inputVal) || 0;
              const isUp = stock.changeRate >= 0;
              const pnlInfo = holding ? calcPnL(holding, jellyPrice) : null;

              return (
                <tr key={stock.id} className="market-row">
                  {/* 종목 */}
                  <td className="col-name">
                    <div className="cell-stock">
                      <span className="cell-emoji">{stock.emoji}</span>
                      <div className="cell-stock-info">
                        <span className="cell-name">{stock.name}</span>
                        <span className="cell-id">{stock.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* 현재가 */}
                  <td className="col-price">
                    <div className="cell-price-won">
                      {stock.priceWon.toLocaleString("ko-KR")}원
                    </div>
                    <div className="cell-price-jelly">
                      {jellyPrice.toLocaleString("ko-KR")} J
                    </div>
                  </td>

                  {/* 등락률 */}
                  <td className="col-change">
                    <span className={`change-badge ${isUp ? "up" : "down"}`}>
                      {formatRate(stock.changeRate)}
                    </span>
                  </td>

                  {/* 보유 현황 */}
                  <td className="col-holding">
                    {holding && holdingQty > 0 ? (
                      <div className="cell-holding">
                        <div className="cell-holding-qty">
                          {holdingQty}주 보유
                        </div>
                        <div className="cell-holding-avg">
                          평균 {holding.avgPriceJelly} J
                        </div>
                        {pnlInfo && (
                          <div
                            className={`cell-holding-pnl ${
                              pnlInfo.pnl >= 0 ? "up" : "down"
                            }`}
                          >
                            {pnlInfo.pnl >= 0 ? "+" : ""}
                            {pnlInfo.pnl.toFixed(0)} J (
                            {pnlInfo.pnl >= 0 ? "+" : ""}
                            {pnlInfo.pnlPercent.toFixed(1)}%)
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="cell-holding-empty">미보유</div>
                    )}
                  </td>

                  {/* 매수/매도 */}
                  <td className="col-trade">
                    <div className="cell-trade">
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        className="trade-qty-input"
                        value={inputVal}
                        onChange={(e) =>
                          handleQtyChange(stock.id, e.target.value)
                        }
                        placeholder="수량"
                      />
                      {inputQty > 0 && (
                        <div className="trade-preview-mini">
                          = {(jellyPrice * inputQty).toLocaleString("ko-KR")} J
                        </div>
                      )}
                      <div className="trade-btn-group">
                        <button
                          className="trade-btn-buy"
                          onClick={() => onBuy(stock, jellyPrice)}
                        >
                          매수
                        </button>
                        <button
                          className="trade-btn-sell"
                          onClick={() => onSell(stock, jellyPrice)}
                          disabled={holdingQty === 0}
                        >
                          매도
                        </button>
                      </div>
                    </div>
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

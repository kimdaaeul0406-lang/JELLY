// src/components/JellyMarketCards.jsx
import React from "react";

export default function JellyMarketCards({
  topGainers,
  visibleCardStocks,
  sortKey,
  setSortKey,
  qty,
  setQty,
  jellyPositions,
  priceToJelly,
  formatRate,
  moodLabel,
  onBuy,
  onSell,
}) {
  function calcPnL(holding, currentJellyPrice) {
    if (!holding || holding.qty === 0) return null;
    const avgPrice = holding.avgPriceJelly;
    const pnl = (currentJellyPrice - avgPrice) * holding.qty;
    const pnlPercent = ((currentJellyPrice - avgPrice) / avgPrice) * 100;
    return { pnl, pnlPercent };
  }

  // 등락률순으로 정렬된 전체 종목
  const allStocksSorted = [...topGainers, ...visibleCardStocks];

  return (
    <>
      {/* 실시간 상승률 TOP 2 */}
      <section className="featured-section">
        <div className="stocks-header">
          <h2>실시간 상승률 TOP 2</h2>
          <p>지금 가장 많이 오른 젤리예요.</p>
        </div>
        <div className="featured-grid">
          {topGainers.map((stock) => {
            const jellyPrice = priceToJelly(stock.priceWon);
            const holding = jellyPositions[stock.id] || null;
            const holdingQty = holding?.qty || 0;
            const history = stock.history || [stock.priceWon];
            const min = Math.min(...history);
            const max = Math.max(...history);
            const range = max - min || 1;
            const isUp = stock.changeRate > 0;
            const isDown = stock.changeRate < 0;
            const changeText = formatRate(stock.changeRate);
            const pnlInfo = holding ? calcPnL(holding, jellyPrice) : null;

            return (
              <article key={stock.id} className="stock-card featured-card">
                <div className="stock-top featured-top">
                  <div className="stock-emoji">{stock.emoji}</div>
                  <div className="featured-title-wrap">
                    <div className="stock-name">{stock.name}</div>
                    <div className="stock-id">티커: {stock.id}</div>
                  </div>
                  <span
                    className={
                      isUp
                        ? "stock-change up"
                        : isDown
                        ? "stock-change down"
                        : "stock-change"
                    }
                  >
                    {changeText}
                  </span>
                </div>

                <div className="featured-middle">
                  <span className="mood-badge">{moodLabel(stock.mood)}</span>
                  <div className="stock-price featured-price">
                    ₩ {stock.priceWon.toLocaleString("ko-KR")}
                    <span className="stock-price-note">
                      &nbsp;/ 1주 ({jellyPrice} J)
                    </span>
                  </div>
                </div>

                <div className="jelly-chart featured-chart">
                  {history.map((p, idx) => {
                    const h = ((p - min) / range) * 100;
                    return (
                      <div
                        key={idx}
                        className="jelly-chart-bar"
                        style={{ height: `${15 + h * 0.7}%` }}
                      />
                    );
                  })}
                </div>

                <div className="stock-holding">
                  {holding && holdingQty > 0 ? (
                    <div className="holding-info-card">
                      <div className="holding-row">
                        <span>보유 수량:</span>
                        <strong>{holdingQty}주</strong>
                      </div>
                      <div className="holding-row">
                        <span>평균 매수가:</span>
                        <strong>
                          {holding.avgPriceJelly.toLocaleString("ko-KR")} J
                        </strong>
                      </div>
                      <div className="holding-row">
                        <span>현재가:</span>
                        <strong>{jellyPrice.toLocaleString("ko-KR")} J</strong>
                      </div>
                      {pnlInfo && (
                        <div
                          className={`holding-pnl-row ${
                            pnlInfo.pnl >= 0 ? "up" : "down"
                          }`}
                        >
                          <span>평가 손익:</span>
                          <strong>
                            {pnlInfo.pnl >= 0 ? "+" : ""}
                            {pnlInfo.pnl.toLocaleString("ko-KR")} J (
                            {pnlInfo.pnl >= 0 ? "+" : ""}
                            {pnlInfo.pnlPercent.toFixed(1)}%)
                          </strong>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="holding-empty-card">
                      아직 보유 중이 아니에요.
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 전체 젤리 종목 (등락률순 고정) */}
      <section className="stocks-section">
        <div className="stocks-header">
          <h2>전체 젤리 종목</h2>
          <p>
            등락률순으로 정렬되어 있어요. 매수/매도는 리스트 보기에서 가능해요.
          </p>
        </div>

        <div className="stocks-grid">
          {visibleCardStocks.length === 0 && (
            <p className="search-empty">조건에 맞는 젤리가 없어요.</p>
          )}

          {visibleCardStocks.map((stock) => {
            const jellyPrice = priceToJelly(stock.priceWon);
            const holding = jellyPositions[stock.id] || null;
            const holdingQty = holding?.qty || 0;
            const history = stock.history || [stock.priceWon];
            const min = Math.min(...history);
            const max = Math.max(...history);
            const range = max - min || 1;
            const isUp = stock.changeRate > 0;
            const isDown = stock.changeRate < 0;
            const changeText = formatRate(stock.changeRate);
            const pnlInfo = holding ? calcPnL(holding, jellyPrice) : null;

            return (
              <article key={stock.id} className="stock-card">
                <div className="stock-top">
                  <div className="stock-emoji">{stock.emoji}</div>
                  <span className="mood-badge">{moodLabel(stock.mood)}</span>
                  <span
                    className={
                      isUp
                        ? "stock-change up"
                        : isDown
                        ? "stock-change down"
                        : "stock-change"
                    }
                  >
                    {changeText}
                  </span>
                </div>

                <div className="stock-name">{stock.name}</div>
                <div className="stock-id">티커: {stock.id}</div>

                <div className="stock-price">
                  ₩ {stock.priceWon.toLocaleString("ko-KR")}
                  <span className="stock-price-note">
                    &nbsp;/ 1주 ({jellyPrice} J)
                  </span>
                </div>

                <div className="jelly-chart">
                  {history.map((p, idx) => {
                    const h = ((p - min) / range) * 100;
                    return (
                      <div
                        key={idx}
                        className="jelly-chart-bar"
                        style={{ height: `${10 + h * 0.8}%` }}
                      />
                    );
                  })}
                </div>

                <div className="stock-holding">
                  {holding && holdingQty > 0 ? (
                    <div className="holding-info-card">
                      <div className="holding-row">
                        <span>보유:</span>
                        <strong>{holdingQty}주</strong>
                      </div>
                      <div className="holding-row">
                        <span>평균 매수가:</span>
                        <strong>
                          {holding.avgPriceJelly.toLocaleString("ko-KR")} J
                        </strong>
                      </div>
                      {pnlInfo && (
                        <div
                          className={`holding-pnl-row ${
                            pnlInfo.pnl >= 0 ? "up" : "down"
                          }`}
                        >
                          <span>손익:</span>
                          <strong>
                            {pnlInfo.pnl >= 0 ? "+" : ""}
                            {pnlInfo.pnl.toLocaleString("ko-KR")} J (
                            {pnlInfo.pnl >= 0 ? "+" : ""}
                            {pnlInfo.pnlPercent.toFixed(1)}%)
                          </strong>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="holding-empty-card">미보유</div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

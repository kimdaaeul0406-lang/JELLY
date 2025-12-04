// src/pages/Market.jsx
import React, { useState, useEffect, useMemo } from "react";

import {
  BASE_JELLY_STOCKS,
  JELLY_MARKET_VERSION,
  priceToJelly,
  formatRate,
  moodLabel,
  getRandomChangePercent,
} from "../components/utils/jellyMarketUtils";

import JellyMarketCards from "../components/JellyMarketCards";
import JellyMarketTable from "../components/JellyMarketTable";
import JellyChat from "../components/JellyChat"; // 🔸 리서치 톡 컴포넌트

export default function Market({ wallet, jellyPositions, onBuy, onSell }) {
  // 🔸 종목 상태
  const [stocks, setStocks] = useState(() => {
    const savedRaw = localStorage.getItem("jellyMarketStocks");
    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw);
        if (
          saved &&
          saved.version === JELLY_MARKET_VERSION &&
          Array.isArray(saved.items) &&
          saved.items.length === BASE_JELLY_STOCKS.length
        ) {
          return saved.items.map((s) => ({
            ...s,
            history:
              s.history && Array.isArray(s.history) && s.history.length > 0
                ? s.history
                : [s.priceWon || s.basePriceWon],
            volume: s.volume ?? 100 + Math.floor(Math.random() * 400),
          }));
        }
      } catch (e) {
        console.error("Failed to parse jellyMarketStocks", e);
        // 파싱 실패 시 기본값으로 초기화
      }
    }

    // 🔸 저장된 게 없으면 기본 젤리 종목들로 초기화
    return BASE_JELLY_STOCKS.map((s) => ({
      ...s,
      priceWon: s.basePriceWon,
      changeRate: 0,
      history: [s.basePriceWon],
      volume: 100 + Math.floor(Math.random() * 400),
    }));
  });

  const [qty, setQty] = useState({});
  const [sortKey, setSortKey] = useState("name");
  const [search, setSearch] = useState("");
  const [jellyTopSearches, setJellyTopSearches] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [viewMode, setViewMode] = useState("card");
  const [selectedStockId, setSelectedStockId] = useState(null);
  const [nowTime, setNowTime] = useState("");

  const sortedStocks = useMemo(() => {
    const copy = [...stocks];
    switch (sortKey) {
      case "change":
        return copy.sort((a, b) => b.changeRate - a.changeRate);
      case "name":
      default:
        return copy.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    }
  }, [stocks, sortKey]);

  const filteredStocks = useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) return sortedStocks;

    return sortedStocks.filter((s) => {
      const name = s.name.toLowerCase();
      const id = s.id.toLowerCase();
      const emoji = (s.emoji || "").toLowerCase();
      return (
        name.includes(trimmed) ||
        id.includes(trimmed) ||
        emoji.includes(trimmed)
      );
    });
  }, [sortedStocks, search]);

  const topGainers = useMemo(() => {
    const copy = [...filteredStocks];
    return copy.sort((a, b) => b.changeRate - a.changeRate).slice(0, 2);
  }, [filteredStocks]);

  const cardStocks = useMemo(() => {
    const topIds = topGainers.map((t) => t.id);
    return filteredStocks.filter((s) => !topIds.includes(s.id));
  }, [filteredStocks, topGainers]);

  const visibleCardStocks = useMemo(
    () => cardStocks.slice(0, visibleCount),
    [cardStocks, visibleCount]
  );

  const boardStocks = filteredStocks;

  const selectedStock = useMemo(() => {
    if (!boardStocks.length) return null;
    const found = boardStocks.find((s) => s.id === selectedStockId);
    return found || boardStocks[0];
  }, [boardStocks, selectedStockId]);

  // 🔸 1초마다 가격/등락률 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((s) => {
          const oldPrice = s.priceWon;
          const changePercent = getRandomChangePercent(s);

          let newPrice = oldPrice * (1 + changePercent);
          if (newPrice < s.basePriceWon * 0.4) newPrice = s.basePriceWon * 0.4;
          if (newPrice > s.basePriceWon * 10) newPrice = s.basePriceWon * 10;

          const basediffRate =
            ((newPrice - s.basePriceWon) / s.basePriceWon) * 100;

          const newHistory = [...(s.history || [s.basePriceWon]), newPrice];
          if (newHistory.length > 24) newHistory.shift();

          const newVolume = Math.max(
            50,
            (s.volume ?? 300) + Math.round((Math.random() - 0.5) * 80)
          );

          return {
            ...s,
            priceWon: Math.round(newPrice),
            changeRate: basediffRate,
            history: newHistory,
            volume: newVolume,
          };
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // 🔸 상태가 바뀔 때마다 저장
  useEffect(() => {
    const payload = {
      version: JELLY_MARKET_VERSION,
      items: stocks,
    };
    localStorage.setItem("jellyMarketStocks", JSON.stringify(payload));
  }, [stocks]);

  // 🔸 카드 무한스크롤
  useEffect(() => {
    if (viewMode !== "card") return;

    function handleScroll() {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.offsetHeight;
      if (scrollBottom + 120 >= docHeight) {
        setVisibleCount((prev) =>
          Math.min(prev + 6, cardStocks.length || prev)
        );
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [viewMode, cardStocks.length]);

  useEffect(() => {
    setVisibleCount(6);
  }, [search, sortKey]);

  useEffect(() => {
    if (!boardStocks.length) {
      setSelectedStockId(null);
      return;
    }
    const exists = boardStocks.some((s) => s.id === selectedStockId);
    if (!exists) {
      setSelectedStockId(boardStocks[0].id);
    }
  }, [boardStocks, selectedStockId]);

  // 🔸 현재 시간 표시
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setNowTime(
        now.toLocaleTimeString("ko-KR", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // 🔸 검색 관련
  function handleSearchSubmit(e) {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) return;

    setJellyTopSearches((prev) => {
      const exists = prev.find((item) => item.keyword === trimmed);
      if (exists) {
        return prev
          .map((item) =>
            item.keyword === trimmed ? { ...item, count: item.count + 1 } : item
          )
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      }
      const next = [...prev, { keyword: trimmed, count: 1 }];
      return next.sort((a, b) => b.count - a.count).slice(0, 5);
    });
  }

  function handleSearchKeywordClick(keyword) {
    setSearch(keyword);
  }

  // 🔸 매수/매도
  function handleBuy(stock, jellyPrice) {
    const q = Number(qty[stock.id] || 0);
    if (q <= 0 || !Number.isInteger(q)) {
      alert("1주 이상의 정수를 입력해 주세요.");
      return;
    }
    if (q > 10000) {
      alert("한 번에 10,000주 이상 매수할 수 없어요.");
      return;
    }
    onBuy(stock.id, stock.name, jellyPrice, q);
    setQty((prev) => ({ ...prev, [stock.id]: "" }));
  }

  function handleSell(stock, jellyPrice) {
    const sellQty = Number(qty[stock.id] || 0);
    if (sellQty <= 0 || !Number.isInteger(sellQty)) {
      alert("1주 이상의 정수를 입력해 주세요.");
      return;
    }
    const holding = jellyPositions[stock.id];
    if (holding && sellQty > holding.qty) {
      alert(`보유 수량(${holding.qty}주)보다 많이 매도할 수 없어요.`);
      return;
    }
    onSell(stock.id, stock.name, jellyPrice, sellQty);
    setQty((prev) => ({ ...prev, [stock.id]: "" }));
  }

  // ⭐ 리스트 모드에서 쓰려고 했던 함수들 - 정의가 없어서 깨졌던 부분
  function topUpStock(stockId) {
    // 일단은 "해당 종목 선택" 정도만 수행하게 해둘게
    setSelectedStockId(stockId);
  }

  function topDownStock(stockId) {
    // 나중에 진짜 "맨 아래로 보내기" 같은 기능 넣을 수 있음
    setSelectedStockId(stockId);
  }

  return (
    <div className="market-wrapper">
      <div className="market-inner">
        {/* 헤더 영역 */}
        <header className="market-header">
          <div>
            <div className="market-badge">JELLY STOCK MARKET</div>
            <h1>젤리 주식 마켓</h1>
            <p>젤리로만 연습해 보는 가짜 주식 시장이에요 🍬</p>
          </div>

          <div className="market-index-card">
            <div className="index-label">젤리 마켓 지수</div>
            <div className="index-value">
              {stocks.length > 0
                ? Math.round(
                    stocks.reduce((sum, s) => sum + s.priceWon, 0) /
                      stocks.length
                  ).toLocaleString("ko-KR")
                : "-"}
            </div>
            <div className="index-change up">+3.21%</div>
          </div>
        </header>

        {/* 지갑 */}
        <section className="wallet-card">
          <div className="wallet-main">
            <div>
              <div className="wallet-label">내 젤리 지갑 요약</div>
              <div className="wallet-cash">
                <span>보유 현금</span>
                <span>{wallet.cash.toLocaleString("ko-KR")}원</span>
              </div>
              <div className="wallet-jelly">
                <span>보유 젤리</span>
                <span>{wallet.jelly.toLocaleString("ko-KR")} J</span>
              </div>
            </div>
            <div className="wallet-pill">
              젤리는 실제 돈이 아닌 연습용 포인트예요 🍬
            </div>
          </div>

          <div className="wallet-progress">
            <div
              className="wallet-progress-fill"
              style={{
                width: `${Math.min(100, (wallet.jelly / 10000) * 100)}%`,
              }}
            />
          </div>
          <div className="wallet-progress-text">
            10,000J까지 {Math.max(0, 10000 - wallet.jelly)} J 남음
          </div>
        </section>

        {/* 검색 + 인기 검색어 */}
        <section className="jelly-search-section">
          <form className="jelly-search-form" onSubmit={handleSearchSubmit}>
            <input
              className="jelly-search-input"
              placeholder="젤리 종목명 또는 티커 검색 (예: 딸기, JELLY-STR, 🍧)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="젤리 종목 검색"
            />
            <button
              className="jelly-search-btn"
              type="submit"
              aria-label="검색 실행"
            >
              검색
            </button>
          </form>

          <div className="jelly-search-panels">
            <div className="jelly-search-panel">
              <h3>젤리 인기 검색어</h3>
              {jellyTopSearches.length === 0 && (
                <p className="search-empty">아직 인기 검색어가 없어요.</p>
              )}
              <div className="jelly-chip-wrap">
                {jellyTopSearches.map((s) => (
                  <button
                    key={s.keyword}
                    className="search-chip"
                    onClick={() => handleSearchKeywordClick(s.keyword)}
                    title={`검색 ${s.count}회`}
                  >
                    {s.keyword}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 보기 모드 토글 */}
        <div className="view-toggle">
          <button
            className={
              viewMode === "card" ? "view-toggle-btn active" : "view-toggle-btn"
            }
            onClick={() => setViewMode("card")}
            aria-label="카드 보기 모드"
            aria-pressed={viewMode === "card"}
          >
            카드 보기
          </button>
          <button
            className={
              viewMode === "table"
                ? "view-toggle-btn active"
                : "view-toggle-btn"
            }
            onClick={() => setViewMode("table")}
            aria-label="리스트 보기 모드"
            aria-pressed={viewMode === "table"}
          >
            리스트 보기
          </button>
        </div>

        {/* 카드 보기 모드 */}
        {viewMode === "card" && (
          <JellyMarketCards
            topGainers={topGainers}
            visibleCardStocks={visibleCardStocks}
            sortKey={sortKey}
            setSortKey={setSortKey}
            qty={qty}
            setQty={setQty}
            jellyPositions={jellyPositions}
            priceToJelly={priceToJelly}
            formatRate={formatRate}
            moodLabel={moodLabel}
            onBuy={handleBuy}
            onSell={handleSell}
          />
        )}

        {/* 리스트 보기 모드 */}
        {viewMode === "table" && (
          <JellyMarketTable
            boardStocks={boardStocks}
            sortKey={sortKey}
            setSortKey={setSortKey}
            selectedStock={selectedStock}
            setSelectedStockId={setSelectedStockId}
            qty={qty}
            setQty={setQty}
            jellyPositions={jellyPositions}
            nowTime={nowTime}
            priceToJelly={priceToJelly}
            formatRate={formatRate}
            moodLabel={moodLabel}
            onBuy={handleBuy}
            onSell={handleSell}
            topUpStock={topUpStock} // ⭐ 이제 정의되어 있음
            topDownStock={topDownStock} // ⭐ 이제 정의되어 있음
          />
        )}

        {/* 🔸 젤리 리서치 톡 */}
        <JellyChat />
      </div>
    </div>
  );
}

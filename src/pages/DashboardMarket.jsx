// src/pages/DashboardMarket.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";

// 🔹 다슬이 별명 처리 (엘지/현대/기아 등)
function normalizeQuery(q) {
  const t = q.trim();
  if (t === "엘지" || t === "엘지전자") return "LG전자";
  if (t === "현대" || t === "현대차") return "현대차";
  if (t === "기아차") return "기아";
  return t;
}

// 🔹 인기 종목(초기 화면용) – 실제 시세는 API로 가져옴
const HOT_CODES = [
  "005930", // 삼성전자
  "066570", // LG전자
  "005380", // 현대차
];

// 🔹 공공데이터포털 주식 시세 API
const API_URL =
  "https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo";

const API_KEY =
  "37c76d375164de2a5b62d339534e9ed9417e99fb398695594f253508b4cfb42d";

// 🔹 캐시 유효 시간 (5분)
const CACHE_DURATION = 5 * 60 * 1000;

// 🔹 API 응답 1개를 화면용 데이터로 변환하는 함수
function mapApiItem(x) {
  const rawPrice = Number(x.clpr); // 종가
  const rawRate = Number(x.fltRt); // 등락률(%)

  const hasPrice = !isNaN(rawPrice) && rawPrice !== 0;
  const price = hasPrice ? Math.round(rawPrice) : null;

  const rate = !isNaN(rawRate) ? rawRate : null;
  const sign = rate === null || rate === 0 ? "" : rate > 0 ? "+" : "";
  const change =
    rate === null || rate === 0 ? "-" : `${sign}${rate.toFixed(2)}%`;

  return {
    name: x.itmsNm,
    symbol: x.srtnCd || x.isinCd || "정보 없음",
    price,
    change,
    rate,
    date: x.basDt || null,
  };
}

/* ─────────────────────────────────────
   📱 PC/모바일 구분 훅 (width 기준)
   ───────────────────────────────────── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 768;
  });

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

/* ─────────────────────────────────────
   🔍 검색 결과
   ───────────────────────────────────── */
function SearchResultsSection({ query, results, loading, noResult, isMobile }) {
  const [page, setPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(10);

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil((results?.length || 0) / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
    setVisibleCount(PAGE_SIZE);
  }, [query, results?.length]);

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  let pageItems;
  if (isMobile) {
    const sliceCount = Math.min(visibleCount, results.length);
    pageItems = results.slice(0, sliceCount);
  } else {
    pageItems = results.slice(startIndex, endIndex);
  }

  useEffect(() => {
    if (!isMobile) return;
    if (results.length === 0) return;

    function handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        setVisibleCount((prev) => {
          if (prev >= results.length) return prev;
          return Math.min(results.length, prev + PAGE_SIZE);
        });
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, results.length]);

  return (
    <section className="stocks-section-real">
      {!query && !loading && (
        <div className="stocks-header">
          <p>위에서 종목명을 검색하면 이곳에 시세가 표시돼요.</p>
        </div>
      )}

      {loading && <p className="search-empty">검색 결과를 불러오는 중...</p>}

      {!loading && results.length === 0 && noResult && (
        <p className="search-empty">검색 결과가 없습니다.</p>
      )}

      {!loading && results.length > 0 && (
        <>
          <div style={{ marginTop: 4 }}>
            <div className="stocks-grid">
              {pageItems.map((s) => (
                <article key={s.symbol + s.name} className="stock-card">
                  <div className="stock-top">
                    <span className="stock-name">{s.name}</span>
                    <span
                      className={
                        s.change.startsWith("+")
                          ? "stock-change up"
                          : s.change.startsWith("-")
                          ? "stock-change down"
                          : "stock-change"
                      }
                    >
                      {s.change}
                    </span>
                  </div>
                  <div className="stock-id">코드: {s.symbol}</div>
                  <div className="stock-price">
                    {s.price == null
                      ? "가격 정보 없음"
                      : `₩ ${s.price.toLocaleString()}`}
                  </div>
                  <button
                    className="stock-buy-btn"
                    onClick={() =>
                      alert(
                        `[${s.name}] 매수 시뮬레이션은 젤리 주식 탭에서 할 수 있어요!`
                      )
                    }
                  >
                    매수 시뮬레이션
                  </button>
                </article>
              ))}
            </div>
          </div>

          {!isMobile && (
            <div
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === page;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    className="search-chip"
                    style={
                      isActive
                        ? {
                            background: "#ff9ac4",
                            color: "#ffffff",
                            fontWeight: 700,
                          }
                        : {}
                    }
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}

/* ─────────────────────────────────────
   📊 전체 종목 목록 (캐싱 적용)
   ───────────────────────────────────── */
function AllStocksSection() {
  const [items, setItems] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [errorAll, setErrorAll] = useState("");

  const [sortMode, setSortMode] = useState("popular");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;
  const listRef = useRef(null);

  // ✅ 캐싱 적용된 API 호출
  useEffect(() => {
    async function loadAll() {
      // 캐시 확인
      const cached = sessionStorage.getItem("allStocksCache");
      const cacheTime = sessionStorage.getItem("allStocksCacheTime");
      const now = Date.now();

      // 캐시가 유효하면 사용
      if (cached && cacheTime && now - Number(cacheTime) < CACHE_DURATION) {
        try {
          const parsed = JSON.parse(cached);
          setItems(parsed);
          return;
        } catch (e) {
          console.error("캐시 파싱 실패:", e);
        }
      }

      // 캐시 없거나 만료됨 → API 호출
      setLoadingAll(true);
      setErrorAll("");
      try {
        const url =
          `${API_URL}?serviceKey=${API_KEY}` +
          `&numOfRows=100&pageNo=1&resultType=json`;
        const res = await fetch(url);
        const json = await res.json();

        const itemsRaw = json?.response?.body?.items?.item;
        if (!itemsRaw) {
          setItems([]);
          setErrorAll("전체 종목 데이터를 불러오지 못했어요.");
        } else {
          const arr = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];
          const mapped = arr.map(mapApiItem);
          setItems(mapped);

          // 캐시 저장
          sessionStorage.setItem("allStocksCache", JSON.stringify(mapped));
          sessionStorage.setItem("allStocksCacheTime", String(now));
        }
      } catch (err) {
        console.error("전체 목록 API 오류:", err);
        setErrorAll("전체 종목을 불러오는 중 오류가 발생했어요.");
        setItems([]);
      } finally {
        setLoadingAll(false);
      }
    }

    loadAll();
  }, []);

  const sortedItems = useMemo(() => {
    const arr = [...items];

    if (sortMode === "latest") {
      arr.sort((a, b) => {
        const da = a.date || "";
        const db = b.date || "";
        return db.localeCompare(da);
      });
    } else if (sortMode === "name") {
      arr.sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));
    } else if (sortMode === "popular") {
      arr.sort((a, b) => {
        const ra = a.rate == null ? -Infinity : Math.abs(a.rate);
        const rb = b.rate == null ? -Infinity : Math.abs(b.rate);
        return rb - ra;
      });
    }

    return arr;
  }, [items, sortMode]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [sortMode, sortedItems.length]);

  function handleScroll(e) {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;

    const scrollable = scrollHeight - clientHeight;
    if (scrollable <= 0) {
      setPage(1);
      return;
    }

    const ratio = scrollTop / scrollable;
    const pageIndex = Math.floor(ratio * totalPages);
    const pageNum = Math.min(totalPages, Math.max(1, pageIndex + 1));

    if (pageNum !== page) {
      setPage(pageNum);
    }
  }

  function goPage(target) {
    const el = listRef.current;
    setPage(target);

    if (!el) return;

    const { scrollHeight, clientHeight } = el;
    const scrollable = scrollHeight - clientHeight;
    if (scrollable <= 0 || totalPages === 1) {
      el.scrollTop = 0;
      return;
    }

    const ratio = (target - 1) / (totalPages - 1);
    el.scrollTop = scrollable * ratio;
  }

  return (
    <section className="stocks-section-real">
      <div className="stocks-header">
        <h2>📊 전체 종목 목록</h2>
        <p>
          공공데이터포털 API에서 가져온 <b>실제 종목 리스트</b>예요.
        </p>
      </div>

      {sortedItems.length > 0 && (
        <div style={{ marginTop: 6, marginBottom: 6 }}>
          <div className="chart-tabs">
            <button
              type="button"
              className={
                "chart-tab" + (sortMode === "popular" ? " active" : "")
              }
              onClick={() => setSortMode("popular")}
            >
              인기순
            </button>
            <button
              type="button"
              className={"chart-tab" + (sortMode === "latest" ? " active" : "")}
              onClick={() => setSortMode("latest")}
            >
              최신순
            </button>
            <button
              type="button"
              className={"chart-tab" + (sortMode === "name" ? " active" : "")}
              onClick={() => setSortMode("name")}
            >
              이름순
            </button>
          </div>
        </div>
      )}

      {loadingAll && <p className="search-empty">전체 종목을 불러오는 중...</p>}
      {errorAll && !loadingAll && <p className="search-empty">{errorAll}</p>}

      {!loadingAll && !errorAll && sortedItems.length > 0 && (
        <>
          <div
            ref={listRef}
            onScroll={handleScroll}
            style={{
              maxHeight: "320px",
              overflowY: "auto",
              marginTop: 4,
              paddingRight: 2,
              borderRadius: 12,
            }}
          >
            <div className="stocks-grid">
              {sortedItems.map((s) => (
                <article key={s.symbol + s.name} className="stock-card">
                  <div className="stock-top">
                    <span className="stock-name">{s.name}</span>
                    <span
                      className={
                        s.change.startsWith("+")
                          ? "stock-change up"
                          : s.change.startsWith("-")
                          ? "stock-change down"
                          : "stock-change"
                      }
                    >
                      {s.change}
                    </span>
                  </div>
                  <div className="stock-id">코드: {s.symbol}</div>
                  <div className="stock-price">
                    {s.price == null
                      ? "가격 정보 없음"
                      : `₩ ${s.price.toLocaleString()}`}
                  </div>
                  <button
                    className="stock-buy-btn"
                    onClick={() =>
                      alert(
                        `[${s.name}] 매수 시뮬레이션은 젤리 주식 탭에서 할 수 있어요!`
                      )
                    }
                  >
                    매수 시뮬레이션
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === page;
              return (
                <button
                  key={pageNum}
                  type="button"
                  className="search-chip"
                  style={
                    isActive
                      ? {
                          background: "#ff9ac4",
                          color: "#ffffff",
                          fontWeight: 700,
                        }
                      : {}
                  }
                  onClick={() => goPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        </>
      )}

      {!loadingAll && !errorAll && sortedItems.length === 0 && (
        <p className="search-empty">표시할 종목이 아직 없어요.</p>
      )}
    </section>
  );
}

/* ─────────────────────────────────────
   메인 대시보드
   ───────────────────────────────────── */
export default function DashboardMarket({ searchHistory, onAddSearch }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [hotStocks, setHotStocks] = useState([]);

  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState("dashboard");

  // 🔥 인기 종목 3개 (캐싱 적용)
  useEffect(() => {
    async function loadHotStocks() {
      // 캐시 확인
      const cached = sessionStorage.getItem("hotStocksCache");
      const cacheTime = sessionStorage.getItem("hotStocksCacheTime");
      const now = Date.now();

      if (cached && cacheTime && now - Number(cacheTime) < CACHE_DURATION) {
        try {
          const parsed = JSON.parse(cached);
          setHotStocks(parsed);
          return;
        } catch (e) {
          console.error("캐시 파싱 실패:", e);
        }
      }

      // API 호출
      try {
        const promises = HOT_CODES.map((code) => {
          const url =
            `${API_URL}?serviceKey=${API_KEY}` +
            `&numOfRows=1&pageNo=1&resultType=json` +
            `&likeSrtnCd=${code}`;

          return fetch(url)
            .then((res) => res.json())
            .then((json) => {
              const items = json?.response?.body?.items?.item;
              if (!items) return null;
              const x = Array.isArray(items) ? items[0] : items;
              return mapApiItem(x);
            })
            .catch((err) => {
              console.error("인기 종목 로딩 오류:", err);
              return null;
            });
        });

        const loaded = (await Promise.all(promises)).filter(Boolean);
        setHotStocks(loaded);

        // 캐시 저장
        sessionStorage.setItem("hotStocksCache", JSON.stringify(loaded));
        sessionStorage.setItem("hotStocksCacheTime", String(now));
      } catch (err) {
        console.error("인기 종목 로딩 전체 오류:", err);
      }
    }

    loadHotStocks();
  }, []);

  const counts = {};
  searchHistory.forEach((q) => {
    counts[q] = (counts[q] || 0) + 1;
  });
  const recentSearches = [...searchHistory].slice(-5).reverse();
  const topSearches = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

  function handleBackToDashboard() {
    setViewMode("dashboard");
  }

  async function handleSearch(e) {
    e.preventDefault();
    const raw = query.trim();
    if (!raw) return;

    const normalized = normalizeQuery(raw);
    onAddSearch(normalized);

    setLoading(true);
    setNoResult(false);
    setResults([]);
    setViewMode("search");

    try {
      const url =
        `${API_URL}?serviceKey=${API_KEY}` +
        `&numOfRows=100&pageNo=1&resultType=json` +
        `&likeItmsNm=${encodeURIComponent(normalized)}`;

      const res = await fetch(url);
      const json = await res.json();

      const items = json?.response?.body?.items?.item;

      if (!items) {
        setResults([]);
        setNoResult(true);
        setLoading(false);
        return;
      }

      const arr = Array.isArray(items) ? items : [items];

      const latestBasDt = arr.reduce((max, x) => {
        if (!x.basDt) return max;
        if (!max) return x.basDt;
        return x.basDt > max ? x.basDt : max;
      }, null);

      const latestItems = latestBasDt
        ? arr.filter((x) => x.basDt === latestBasDt)
        : arr;

      const byCode = new Map();
      latestItems.forEach((x) => {
        const code = x.srtnCd || x.isinCd || x.itmsNm;
        if (!byCode.has(code)) byCode.set(code, x);
      });
      const uniqueItems = Array.from(byCode.values());

      const list = uniqueItems.map(mapApiItem);

      if (list.length === 0) {
        setResults([]);
        setNoResult(true);
      } else {
        setResults(list);
      }
    } catch (err) {
      console.error("검색 API 오류:", err);
      setResults([]);
      setNoResult(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-wrapper">
      {viewMode === "dashboard" && (
        <>
          <section className="summary-row">
            <div className="summary-card">
              <div className="summary-label">KOSPI (샘플)</div>
              <div className="summary-value">2,750.32</div>
              <div className="summary-change up">+0.42%</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">KOSDAQ (샘플)</div>
              <div className="summary-value">890.15</div>
              <div className="summary-change down">-0.31%</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">내 포트폴리오 (형식)</div>
              <div className="summary-value">+3.20%</div>
              <div className="summary-note">나중에 실제 계산 연결 가능</div>
            </div>
          </section>

          <section className="chart-section">
            <div className="chart-header">
              <h2>📈 오늘의 시장 차트</h2>
              <div className="chart-tabs">
                <button className="chart-tab active">1일</button>
                <button className="chart-tab">1주</button>
                <button className="chart-tab">1개월</button>
              </div>
            </div>
            <div className="fake-chart">
              <div className="fake-line" />
              <div className="fake-line faint" />
            </div>
          </section>

          <section className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <input
                className="search-input"
                placeholder="삼성전자 / 005930 검색"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                {loading ? "검색 중..." : "검색"}
              </button>
            </form>

            <div className="search-panels">
              <div className="search-panel">
                <h3>최근 검색</h3>
                {recentSearches.length === 0 && (
                  <p className="search-empty">아직 검색 기록이 없어요.</p>
                )}
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    className="search-chip"
                    onClick={() => setQuery(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="search-panel">
                <h3>많이 검색된 종목</h3>
                {topSearches.length === 0 && (
                  <p className="search-empty">검색을 하면 순위가 생겨요.</p>
                )}
                <ol className="search-ranking">
                  {topSearches.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="stocks-section-real">
            <div className="stocks-header">
              <h2>🔥 인기 종목</h2>
              <p>
                대표 3개 종목의 <b>실제 시세</b>를 보여줘요.
              </p>
            </div>

            <div className="stocks-grid">
              {hotStocks.length === 0 && (
                <p className="search-empty">
                  인기 종목 시세를 불러오는 중입니다...
                </p>
              )}
              {hotStocks.slice(0, 3).map((s) => (
                <article key={s.symbol + s.name} className="stock-card">
                  <div className="stock-top">
                    <span className="stock-name">{s.name}</span>
                    <span
                      className={
                        s.change.startsWith("+")
                          ? "stock-change up"
                          : s.change.startsWith("-")
                          ? "stock-change down"
                          : "stock-change"
                      }
                    >
                      {s.change}
                    </span>
                  </div>
                  <div className="stock-id">코드: {s.symbol}</div>
                  <div className="stock-price">
                    {s.price == null
                      ? "가격 정보 없음"
                      : `₩ ${s.price.toLocaleString()}`}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <AllStocksSection />
        </>
      )}

      {viewMode === "search" && (
        <div className="search-result-page">
          <div
            className="search-result-header"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className="search-chip"
              onClick={handleBackToDashboard}
            >
              ← 대시보드로
            </button>
            <h2 style={{ margin: 0, fontSize: "1.1rem" }}>
              🔍 "{query || "종목"}" 검색 결과
            </h2>
          </div>

          <form
            onSubmit={handleSearch}
            className="search-form"
            style={{ marginBottom: 8 }}
          >
            <input
              className="search-input"
              placeholder="다른 종목 다시 검색하기"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              {loading ? "검색 중..." : "검색"}
            </button>
          </form>

          <SearchResultsSection
            isMobile={isMobile}
            query={query}
            results={results}
            loading={loading}
            noResult={noResult}
          />
        </div>
      )}
    </div>
  );
}

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
    rate, // 등락률 숫자 (인기순 정렬용)
    date: x.basDt || null, // 최신순 정렬용
  };
}

/* ─────────────────────────────────────
   📱 PC/모바일 구분 훅 (width 기준)
   ───────────────────────────────────── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 768; // 아이폰 프로맥스 포함
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
   - 데스크탑/태블릿: 10개씩 + 페이지 버튼
   - 모바일: 무한 스크롤(10개씩 추가 로드)
   ───────────────────────────────────── */
function SearchResultsSection({ query, results, loading, noResult, isMobile }) {
  const [page, setPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(10); // 모바일에서 몇 개까지 보여줄지

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil((results?.length || 0) / PAGE_SIZE));

  // 검색어/결과 바뀔 때 초기화
  useEffect(() => {
    setPage(1);
    setVisibleCount(PAGE_SIZE);
  }, [query, results?.length]);

  // 👉 데스크탑용: 현재 페이지에 보여줄 데이터
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  let pageItems;
  if (isMobile) {
    // 👉 모바일: 0 ~ visibleCount 까지만 보여줌 (무한 스크롤)
    const sliceCount = Math.min(visibleCount, results.length);
    pageItems = results.slice(0, sliceCount);
  } else {
    // 👉 데스크탑: 페이지별로 자르기
    pageItems = results.slice(startIndex, endIndex);
  }

  // 📱 모바일 전용: window 스크롤 위치 감지해서 바닥 근처면 더 로드
  useEffect(() => {
    if (!isMobile) return;
    if (results.length === 0) return;

    function handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 바닥 근처로 내려오면
      if (scrollTop + windowHeight >= documentHeight - 100) {
        setVisibleCount((prev) => {
          if (prev >= results.length) return prev; // 더 이상 없음
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

          {/* 💻 데스크탑에서만 페이지 버튼 표시 */}
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
   📊 전체 종목 목록 (스크롤 + 페이지 인식)
   ───────────────────────────────────── */
function AllStocksSection() {
  const [items, setItems] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [errorAll, setErrorAll] = useState("");

  const [sortMode, setSortMode] = useState("popular"); // popular | latest | name
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;
  const listRef = useRef(null);

  // ✅ 전체 목록용 데이터 한 번만 가져오기
  useEffect(() => {
    async function loadAll() {
      setLoadingAll(true);
      setErrorAll("");
      try {
        const url =
          `${API_URL}?serviceKey=${API_KEY}` +
          `&numOfRows=100&pageNo=1&resultType=json`; // 100개 정도만
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

  // 정렬 적용
  const sortedItems = useMemo(() => {
    const arr = [...items];

    if (sortMode === "latest") {
      // 기준일(YYYYMMDD) 내림차순
      arr.sort((a, b) => {
        const da = a.date || "";
        const db = b.date || "";
        return db.localeCompare(da);
      });
    } else if (sortMode === "name") {
      arr.sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));
    } else if (sortMode === "popular") {
      // 등락률 절댓값 큰 순서대로
      arr.sort((a, b) => {
        const ra = a.rate == null ? -Infinity : Math.abs(a.rate);
        const rb = b.rate == null ? -Infinity : Math.abs(b.rate);
        return rb - ra;
      });
    }

    return arr;
  }, [items, sortMode]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));

  // 정렬 변경 시 1페이지 + 맨 위로
  useEffect(() => {
    setPage(1);
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [sortMode, sortedItems.length]);

  // 스크롤 위치 → 페이지 번호
  function handleScroll(e) {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;

    const scrollable = scrollHeight - clientHeight;
    if (scrollable <= 0) {
      setPage(1);
      return;
    }

    const ratio = scrollTop / scrollable; // 0 ~ 1
    const pageIndex = Math.floor(ratio * totalPages); // 0 ~ totalPages-1
    const pageNum = Math.min(totalPages, Math.max(1, pageIndex + 1));

    if (pageNum !== page) {
      setPage(pageNum);
    }
  }

  // 페이지 버튼 → 해당 구간으로 스크롤 점프
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

    const ratio = (target - 1) / (totalPages - 1); // 0~1
    el.scrollTop = scrollable * ratio;
  }

  return (
    <section className="stocks-section-real">
      <div className="stocks-header">
        <h2>📊 전체 종목 목록</h2>
        <p>
          공공데이터포털 API에서 가져온 <b>실제 종목 리스트</b>예요.
          <br />
          스크롤을 쭉 내리면 2, 3, … 페이지 구간을 지나가고, 아래 페이지
          버튼으로 원하는 구간으로 바로 이동할 수 있어요.
        </p>
      </div>

      {/* 정렬 탭 */}
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

          {/* 페이지 버튼 – 단순히 위치 점프 + 현재 페이지 표시 */}
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
  const [results, setResults] = useState([]); // 검색 결과
  const [loading, setLoading] = useState(false); // 검색 로딩
  const [noResult, setNoResult] = useState(false); // “검색 결과 없음”
  const [hotStocks, setHotStocks] = useState([]); // 인기 종목

  // 🔹 PC / 모바일 구분
  const isMobile = useIsMobile();

  // 🔹 지금 어떤 화면인지
  // "dashboard" = 요약 + 차트 + 인기 + 전체
  // "search" = 검색 결과 전용 화면
  const [viewMode, setViewMode] = useState("dashboard");

  // 🔥 인기 종목 3개 – 컴포넌트 처음 로드될 때 자동으로 API 호출
  useEffect(() => {
    async function loadHotStocks() {
      try {
        const promises = HOT_CODES.map((code) => {
          const url =
            `${API_URL}?serviceKey=${API_KEY}` +
            `&numOfRows=1&pageNo=1&resultType=json` +
            `&likeSrtnCd=${code}`; // 종목 코드 부분검색

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
      } catch (err) {
        console.error("인기 종목 로딩 전체 오류:", err);
      }
    }

    loadHotStocks();
  }, []);

  // 🔢 검색 순위 / 최근 검색
  const counts = {};
  searchHistory.forEach((q) => {
    counts[q] = (counts[q] || 0) + 1;
  });
  const recentSearches = [...searchHistory].slice(-5).reverse();
  const topSearches = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

  // 🔙 대시보드로 돌아가기
  function handleBackToDashboard() {
    setViewMode("dashboard");
  }

  // 🔍 검색 버튼
  async function handleSearch(e) {
    e.preventDefault();
    const raw = query.trim();
    if (!raw) return;

    const normalized = normalizeQuery(raw);
    onAddSearch(normalized);

    setLoading(true);
    setNoResult(false);
    setResults([]);

    // 🔥 검색을 시작하면 "검색 결과 페이지"로 전환
    setViewMode("search");

    try {
      const url =
        `${API_URL}?serviceKey=${API_KEY}` +
        `&numOfRows=100&pageNo=1&resultType=json` +
        `&likeItmsNm=${encodeURIComponent(normalized)}`; // 종목명 부분검색

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

      // ① 최신 기준일(basDt)만 남기기
      const latestBasDt = arr.reduce((max, x) => {
        if (!x.basDt) return max;
        if (!max) return x.basDt;
        return x.basDt > max ? x.basDt : max;
      }, null);

      const latestItems = latestBasDt
        ? arr.filter((x) => x.basDt === latestBasDt)
        : arr;

      // ② 같은 종목코드(srtnCd)는 하나만
      const byCode = new Map();
      latestItems.forEach((x) => {
        const code = x.srtnCd || x.isinCd || x.itmsNm;
        if (!byCode.has(code)) byCode.set(code, x);
      });
      const uniqueItems = Array.from(byCode.values());

      // ③ 화면용 데이터로 변환
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
      {/* ─────────────────────────────
          1) 기본 대시보드 화면
          ───────────────────────────── */}
      {viewMode === "dashboard" && (
        <>
          {/* 상단 요약 카드 – 샘플 값 */}
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

          {/* 메인 젤리 차트 영역 */}
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

          {/* 🔍 검색 + 검색 순위 */}
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

          {/* 🔥 인기 종목 3개 */}
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

          {/* 📊 전체 종목 */}
          <AllStocksSection />
        </>
      )}

      {/* ─────────────────────────────
          2) 검색 결과 전용 화면
          ───────────────────────────── */}
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

          {/* 검색 결과 페이지에서도 검색 다시 가능 */}
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

          {/* 검색 결과 리스트 (모바일: 무한 스크롤 / PC: 페이지 버튼) */}
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

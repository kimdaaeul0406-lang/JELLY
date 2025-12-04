// src/App.jsx
import React, { useState, useEffect } from "react";
import "./styles.css";

import JellyPop from "./components/JellyPop";
import Home from "./pages/Home";
import Market from "./pages/Market";

import Header from "./components/Header";
import AuthModal from "./components/AuthModal";
import DashboardMarket from "./pages/DashboardMarket";
import Wallet from "./pages/Wallet";
import MyPage from "./pages/MyPage";

// 충전 규칙 / 전환 규칙 상수
const JELLY_PER_10000_WON = 10; // 10,000원당 10젤리
const JELLY_TO_CASH_RATE = 1000; // 1 J -> 1,000원 (개념상)
const JELLY_CONVERT_THRESHOLD = 10000; // 10,000J 이상부터 전환 가능

export default function App() {
  const [page, setPage] = useState("home"); // home | dashboard
  const [showPop, setShowPop] = useState(false);

  const [user, setUser] = useState(null); // { email, nickname }
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login | register

  const [activeTab, setActiveTab] = useState("market"); // market | jelly | wallet | mypage

  const [searchHistory, setSearchHistory] = useState([]);

  // 💰 내 지갑 상태 (현금 / 젤리)
  const [wallet, setWallet] = useState({
    cash: 500000, // 초기 현금 (예시)
    jelly: 120, // 초기 젤리 (예시)
  });

  // 🍬 젤리 주식 보유 현황 (id -> { name, qty, avgPriceJelly })
  const [jellyPositions, setJellyPositions] = useState({});

  // 로그인/검색 내역/지갑/보유종목 불러오기
  useEffect(() => {
    try {
      // 🔐 현재 로그인 세션 정보
      const savedSession = localStorage.getItem("jellyUserSession");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed.email && parsed.nickname) {
          setUser({ email: parsed.email, nickname: parsed.nickname });
          setIsLoggedIn(true);
        }
      }
    } catch (e) {
      console.error("세션 정보 로드 실패:", e);
    }

    try {
      const savedHistory = localStorage.getItem("jellySearchHistory");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed);
        }
      }
    } catch (e) {
      console.error("검색 내역 로드 실패:", e);
    }

    try {
      const savedWallet = localStorage.getItem("jellyWallet");
      if (savedWallet) {
        const parsed = JSON.parse(savedWallet);
        if (parsed.cash !== undefined && parsed.jelly !== undefined) {
          setWallet(parsed);
        }
      }
    } catch (e) {
      console.error("지갑 정보 로드 실패:", e);
    }

    try {
      const savedPositions = localStorage.getItem("jellyPositions");
      if (savedPositions) {
        const parsed = JSON.parse(savedPositions);
        if (typeof parsed === "object" && parsed !== null) {
          setJellyPositions(parsed);
        }
      }
    } catch (e) {
      console.error("보유 종목 로드 실패:", e);
    }
  }, []);

  // 검색 히스토리 저장
  useEffect(() => {
    localStorage.setItem("jellySearchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // 지갑 저장
  useEffect(() => {
    localStorage.setItem("jellyWallet", JSON.stringify(wallet));
  }, [wallet]);

  // 보유 종목 저장
  useEffect(() => {
    localStorage.setItem("jellyPositions", JSON.stringify(jellyPositions));
  }, [jellyPositions]);

  // 홈 → 대시보드 전환
  function handleStartClick() {
    setPage("dashboard");
    setShowPop(true);
  }

  function handlePopComplete() {
    setShowPop(false);
  }

  // 모달 조작
  function openLoginModal() {
    setAuthMode("login");
    setAuthOpen(true);
  }

  function openRegisterModal() {
    setAuthMode("register");
    setAuthOpen(true);
  }

  function closeAuthModal() {
    setAuthOpen(false);
  }

  // 회원가입
  function handleRegister({ email, password, passwordConfirm, nickname }) {
    if (!email || !password || !passwordConfirm || !nickname) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 🔐 계정 정보 저장 키: jellyUserAccount
    const saved = localStorage.getItem("jellyUserAccount");
    if (saved) {
      const savedUser = JSON.parse(saved);
      if (savedUser.email === email) {
        alert("이미 가입된 이메일입니다.");
        return;
      }
    }

    const newUser = { email, password, nickname };
    // 계정 정보 저장 (로그아웃해도 남는 계정)
    localStorage.setItem("jellyUserAccount", JSON.stringify(newUser));

    // 로그인 세션 정보도 생성
    const session = { email, nickname };
    localStorage.setItem("jellyUserSession", JSON.stringify(session));

    setUser({ email, nickname });
    setIsLoggedIn(true);
    setAuthOpen(false);
    setPage("dashboard");
    setActiveTab("market");

    alert("회원가입 완료! 자동 로그인되었습니다.");
  }

  // 로그인
  function handleLogin({ email, password }) {
    // 계정 정보는 여기서 확인
    const saved = localStorage.getItem("jellyUserAccount");
    if (!saved) {
      alert("가입된 계정을 찾을 수 없습니다.");
      return;
    }
    const savedUser = JSON.parse(saved);

    if (savedUser.email === email && savedUser.password === password) {
      // 로그인 세션 생성
      const session = { email: savedUser.email, nickname: savedUser.nickname };
      localStorage.setItem("jellyUserSession", JSON.stringify(session));

      setUser({ email: savedUser.email, nickname: savedUser.nickname });
      setIsLoggedIn(true);
      setAuthOpen(false);
      setPage("dashboard");
      setActiveTab("market");
    } else {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  }

  // 로그아웃 (세션만 제거, 계정은 유지)
  function handleLogout() {
    // 현재 로그인 세션 삭제
    localStorage.removeItem("jellyUserSession");

    setIsLoggedIn(false);
    setUser(null);
    alert("로그아웃 되었습니다.");
  }

  // 로그인 필요한 메뉴
  function handleProtectedTab(tab) {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능한 메뉴예요 🙂");
      openLoginModal();
      return;
    }
    setActiveTab(tab);
  }

  // 검색 히스토리 추가
  function addSearchQuery(q) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => [...prev, trimmed]);
  }
  // 💰 지갑 충전 (일일 한도 포함)
  function handleCharge(amountWon) {
    const amount = Number(amountWon);
    if (isNaN(amount) || amount <= 0) {
      alert("충전 금액을 올바르게 입력해 주세요!");
      return;
    }

    const DAILY_LIMIT = 50000000; // 하루 충전 한도 (5천만 원)

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const saved = JSON.parse(localStorage.getItem("dailyCharge") || "{}");

    const totalToday = saved[today] || 0;

    // 🔒 일일 한도 초과 체크
    if (totalToday + amount > DAILY_LIMIT) {
      const remain = DAILY_LIMIT - totalToday;
      alert(
        `오늘은 더 충전할 수 없어요!\n남은 일일 충전 한도: ${remain.toLocaleString()}원`
      );
      return;
    }

    // 정상 충전 → 기록 저장
    saved[today] = totalToday + amount;
    localStorage.setItem("dailyCharge", JSON.stringify(saved));

    const bonusJelly = Math.floor(amount / 10000) * JELLY_PER_10000_WON;

    setWallet((prev) => ({
      cash: prev.cash + amount,
      jelly: prev.jelly + bonusJelly,
    }));

    alert(
      `${amount.toLocaleString()}원이 충전되었습니다.\n보너스 젤리 ${bonusJelly} J 적립!`
    );
  }

  // 🍬 젤리 10,000개 → 현금 전환
  function handleConvertJellyToCash() {
    if (wallet.jelly < JELLY_CONVERT_THRESHOLD) {
      alert("젤리 10,000개 이상 모아야 전환할 수 있어요!");
      return;
    }

    const convertJelly = JELLY_CONVERT_THRESHOLD;
    const gainedCash = convertJelly * JELLY_TO_CASH_RATE;

    setWallet((prev) => ({
      jelly: prev.jelly - convertJelly,
      cash: prev.cash + gainedCash,
    }));

    alert(
      `젤리 ${convertJelly.toLocaleString()} J를 현금 ${gainedCash.toLocaleString()}원으로 전환했습니다.\n이제 '시장' 탭에서 실제 주식처럼 연습해볼 수 있어요.`
    );
  }

  // 🍬 젤리 주식 매수 (수량 입력 지원)
  function handleBuyJellyStock(stockId, stockName, priceJelly, quantity = 1) {
    const qty = Number(quantity) || 0;
    if (qty <= 0) {
      alert("1주 이상 입력해 주세요.");
      return;
    }

    const totalJelly = priceJelly * qty;

    if (wallet.jelly < totalJelly) {
      alert(
        `보유 젤리가 부족해서 매수할 수 없어요.\n필요 젤리: ${totalJelly} J`
      );
      return;
    }

    setWallet((prev) => ({
      ...prev,
      jelly: prev.jelly - totalJelly,
    }));

    setJellyPositions((prev) => {
      const prevPos = prev[stockId] || {
        name: stockName,
        qty: 0,
        avgPriceJelly: priceJelly,
      };
      const newQty = prevPos.qty + qty;
      const newAvg =
        (prevPos.avgPriceJelly * prevPos.qty + priceJelly * qty) / newQty;

      return {
        ...prev,
        [stockId]: {
          name: stockName,
          qty: newQty,
          avgPriceJelly: Math.round(newAvg * 10) / 10,
        },
      };
    });

    alert(
      `'${stockName}' ${qty}주를 젤리 ${totalJelly} J에 매수했습니다.\n(주당 ${priceJelly} J)`
    );
  }

  // 🍬 젤리 주식 매도 (수량 입력 지원)
  function handleSellJellyStock(stockId, stockName, priceJelly, quantity = 1) {
    const qty = Number(quantity) || 0;
    if (qty <= 0) {
      alert("매도할 수량을 1주 이상 입력해 주세요.");
      return;
    }

    const pos = jellyPositions[stockId];
    if (!pos || pos.qty < qty) {
      alert("보유 수량이 부족해서 매도할 수 없어요.");
      return;
    }

    const totalJelly = priceJelly * qty;

    setWallet((prev) => ({
      ...prev,
      jelly: prev.jelly + totalJelly,
    }));

    setJellyPositions((prev) => {
      const current = prev[stockId];
      const newQty = current.qty - qty;

      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[stockId];
        return copy;
      }

      return {
        ...prev,
        [stockId]: {
          ...current,
          qty: newQty,
        },
      };
    });

    alert(
      `'${stockName}' ${qty}주를 젤리 ${totalJelly} J에 매도했습니다.\n(주당 ${priceJelly} J)`
    );
  }

  const isHome = page === "home";

  return (
    <div className={`app ${isHome ? "app-home" : "app-dashboard"}`}>
      {showPop && <JellyPop onComplete={handlePopComplete} />}

      {isHome && <Home onStart={handleStartClick} />}

      {!isHome && (
        <>
          <Header
            activeTab={activeTab}
            isLoggedIn={isLoggedIn}
            user={user}
            onTabChange={(tab) => {
              if (tab === "market") setActiveTab("market");
              else if (tab === "jelly") setActiveTab("jelly");
              else if (tab === "wallet") handleProtectedTab("wallet");
              else if (tab === "mypage") handleProtectedTab("mypage");
            }}
            onLoginClick={openLoginModal}
            onRegisterClick={openRegisterModal}
            onLogout={handleLogout}
          />

          <main className="dashboard-main">
            {/* 시장(메인) 탭 */}
            <div
              className={`tab-content ${
                activeTab === "market"
                  ? "tab-content-active"
                  : "tab-content-hidden"
              }`}
            >
              <DashboardMarket
                searchHistory={searchHistory}
                onAddSearch={addSearchQuery}
              />
            </div>

            {/* 젤리 주식 탭 */}
            <div
              className={`tab-content ${
                activeTab === "jelly"
                  ? "tab-content-active"
                  : "tab-content-hidden"
              }`}
            >
              <Market
                wallet={wallet}
                jellyPositions={jellyPositions}
                onBuy={handleBuyJellyStock}
                onSell={handleSellJellyStock}
              />
            </div>

            {/* 젤리 지갑 탭 */}
            <div
              className={`tab-content ${
                activeTab === "wallet"
                  ? "tab-content-active"
                  : "tab-content-hidden"
              }`}
            >
              <Wallet
                wallet={wallet}
                onCharge={handleCharge}
                onConvert={handleConvertJellyToCash}
              />
            </div>

            {/* 마이페이지 탭 */}
            <div
              className={`tab-content ${
                activeTab === "mypage"
                  ? "tab-content-active"
                  : "tab-content-hidden"
              }`}
            >
              <MyPage
                user={user}
                wallet={wallet}
                jellyPositions={jellyPositions}
              />
            </div>
          </main>

          <footer className="footer">
            © 2025 Jelly Stock · 공공데이터포털 API 연습용 데모
          </footer>
        </>
      )}

      {authOpen && (
        <AuthModal
          mode={authMode}
          onClose={closeAuthModal}
          onSwitchMode={setAuthMode}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}

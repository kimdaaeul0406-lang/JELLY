import React, { useState } from "react";

export default function Header({
  activeTab,
  isLoggedIn,
  user,
  onTabChange,
  onLoginClick,
  onRegisterClick,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nickname = user?.nickname || "게스트";

  function handleTab(tab) {
    onTabChange(tab);
    setMenuOpen(false); // 모바일 메뉴 닫기
  }

  return (
    <header className="header">
      {/* 왼쪽 로고 */}
      <div className="header-left">
        <div className="logo-mark">📈</div>
        <div className="logo-text">
          <div className="logo-title">Jelly Stock</div>
          <div className="logo-sub">감성 주식 & 젤리 대시보드</div>
        </div>
      </div>

      {/* PC 네비게이션 */}
      <nav className="header-nav">
        <button
          className={
            activeTab === "market" ? "nav-item nav-item-active" : "nav-item"
          }
          onClick={() => handleTab("market")}
        >
          시장
        </button>
        <button
          className={
            activeTab === "wallet" ? "nav-item nav-item-active" : "nav-item"
          }
          onClick={() => handleTab("wallet")}
        >
          내지갑
        </button>
        <button
          className={
            activeTab === "jelly" ? "nav-item nav-item-active" : "nav-item"
          }
          onClick={() => handleTab("jelly")}
        >
          젤리주식
        </button>
        <button
          className={
            activeTab === "mypage" ? "nav-item nav-item-active" : "nav-item"
          }
          onClick={() => handleTab("mypage")}
        >
          마이페이지
        </button>
      </nav>

      {/* PC 로그인 / 유저영역 */}
      <div className="header-right">
        {isLoggedIn ? (
          <div className="header-user">
            <span className="user-badge">{nickname} 님</span>
            <button className="header-btn outline" onClick={onLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <>
            <button className="header-btn outline" onClick={onLoginClick}>
              로그인
            </button>
            <button className="header-btn filled" onClick={onRegisterClick}>
              회원가입
            </button>
          </>
        )}
      </div>

      {/* 모바일 햄버거 메뉴 버튼 */}
      <button
        className={menuOpen ? "header-hamburger open" : "header-hamburger"}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span className="header-hamburger-line" />
        <span className="header-hamburger-line" />
        <span className="header-hamburger-line" />
      </button>

      {/* 모바일 메뉴 패널 */}
      <div
        className={menuOpen ? "header-mobile-menu open" : "header-mobile-menu"}
      >
        <div className="header-mobile-nav">
          <button
            className={
              activeTab === "market" ? "nav-item nav-item-active" : "nav-item"
            }
            onClick={() => handleTab("market")}
          >
            시장
          </button>
          <button
            className={
              activeTab === "wallet" ? "nav-item nav-item-active" : "nav-item"
            }
            onClick={() => handleTab("wallet")}
          >
            내지갑
          </button>
          <button
            className={
              activeTab === "jelly" ? "nav-item nav-item-active" : "nav-item"
            }
            onClick={() => handleTab("jelly")}
          >
            젤리주식
          </button>
          <button
            className={
              activeTab === "mypage" ? "nav-item nav-item-active" : "nav-item"
            }
            onClick={() => handleTab("mypage")}
          >
            마이페이지
          </button>
        </div>

        {/* 모바일 로그인/로그아웃 */}
        <div className="header-mobile-auth">
          {isLoggedIn ? (
            <>
              <span className="user-badge">{nickname} 님</span>
              <button className="header-btn outline" onClick={onLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button className="header-btn outline" onClick={onLoginClick}>
                로그인
              </button>
              <button className="header-btn filled" onClick={onRegisterClick}>
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

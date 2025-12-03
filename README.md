Jelly Stock (젤리주식)

React 기반 가상 주식 & 젤리 투자 웹 프로젝트

1. 프로젝트 소개

이 프로젝트는
“초보자도 부담 없이 즐기며 주식 시장의 구조를 경험할 수 있는 웹 서비스”
라는 목표로 제작된 React 기반 웹 애플리케이션입니다.

실제 주식 사이트들은 정보량이 많고 복잡하며,
처음 접하는 사람에게는 어렵고 무섭게 느껴질 수 있습니다.
특히 투자 경험이 없는 사용자 입장에서는

시세가 어떻게 움직이는지

종목 정보는 어떻게 읽는지

매수/매도는 어떤 흐름인지
감이 잘 오지 않습니다.

그래서 이 프로젝트는 “주식”이라는 소재를
귀엽고 부담 없는 ‘젤리 테마’로 재해석하여
누구나 가볍게 즐기면서 원리를 배울 수 있도록 기획했습니다.

원래는
"젤리나라 쫀즙마을" 같은 젤리 전용 세계관을 가진 웹 서비스를 만들고 싶었지만,
이번 과제의 핵심이 API 연동이었기 때문에
실제 주식 API를 활용하되
젤리 느낌을 살린 가상 투자 시스템으로 구성했습니다.

그 결과:

실제 주식 시세 조회(공공데이터포털 API)

젤리 테마의 가상 마켓(가상 종목 + 랜덤 변동)

젤리 구매/판매를 통한 투자 경험 제공

무료 AI API 기반의 주식 기초 설명 챗봇

귀엽지만 구조는 실제 주식처럼 설계된 UI

이렇게 현실성과 재미를 모두 담은 서비스가 완성되었습니다.

2. 주요 기능 요약
   ● 대시보드 (Dashboard)

공공데이터포털 주식 시세 API 연동

종목명 검색 및 자동 필터링

최신 날짜 기준 정리된 시세 데이터 표시

등락률 계산 및 색상으로 표현

● 젤리마켓 (Jelly Market)

딸기젤리, 포도젤리 등 “젤리 종목” 구성

랜덤 기반 가격 변화 알고리즘

카드형/테이블형 UI 제공

작은 미니 그래프(chart)로 가격 흐름 시각화

가상 매수/매도 기능

● 지갑 및 충전 (Wallet)

localStorage 기반 포인트 저장

현금 → 젤리 충전

1회 충전 한도 + 하루 충전 한도 설정

젤리 보유량 및 사용 내역 저장

● 회원가입 & 로그인

localStorage 기반 간단 인증 시스템

로그인 후 지갑 및 개인 페이지 접근 가능

새로고침해도 로그인 유지

● 젤리봇 (AI 주식 기초 챗봇)

무료 AI API 사용

API Key 없이 작동

주식, ETF, 투자 기초를 쉽고 부드럽게 설명

대화 초기화 기능 포함

3. 기술 스택

React 18

JavaScript (ES6+)

CSS (모듈화 및 섹션별 스타일 파일)

무료 AI API (Key 없이 사용)

공공데이터포털 한국 주식 시세 API

LocalStorage

Vercel 또는 Netlify

4. 폴더 구조

src
├─ components
│ ├─ Header.jsx
│ ├─ AuthModal.jsx
│ ├─ JellyChat.jsx
│ ├─ JellyMarketCards.jsx
│ ├─ JellyMarketTable.jsx
│ ├─ JellyMarketChart.jsx
│ └─ JellyPop.jsx
│
├─ pages
│ ├─ Home.jsx
│ ├─ Market.jsx
│ ├─ DashboardMarket.jsx
│ ├─ Wallet.jsx
│ └─ MyPage.jsx
│
├─ styles
│ ├─ base.css
│ ├─ home.css
│ ├─ market.css
│ ├─ wallet.css
│ ├─ auth.css
│ ├─ mypage.css
│ └─ header.css
│
├─ jellyMarketUtils.js
├─ App.jsx
└─ index.jsx

5. 실행 방법

패키지 설치
npm install

개발 모드 실행
npm run dev

빌드
npm run build

(Vercel 또는 Netlify에 바로 배포 가능)

6. 프로젝트 목적

이 프로젝트는 다음과 같은 목표로 제작되었습니다.

주식 시장의 기본 구조를 쉽게 이해시키는 UI 만들기

무서운 느낌의 투자 환경을 “젤리 테마”로 친근하게 재해석

React 컴포넌트 구조 설계 및 상태 관리 능력 향상

API 연동 및 비동기 처리 경험

LocalStorage 기반 인증/지갑 시스템 구현

웹 프로젝트에서 AI 기능을 활용해보기

과제의 목적(공공 API 활용)을 충족하면서도 개성 있는 기획 구성

7. 마무리

"Jelly Stock"은
주식 API, 젤리 테마 가상 종목, 지갑 시스템, AI 챗봇까지
다양한 기능을 하나의 React 프로젝트 안에서 통합한 웹 서비스입니다.

초보자도 부담 없이 즐기고 이해할 수 있도록
재미와 실용성을 동시에 담아 제작했습니다.

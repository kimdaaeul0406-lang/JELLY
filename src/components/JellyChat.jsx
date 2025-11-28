// src/components/JellyChat.jsx
import React, { useState, useEffect } from "react";

// 🔸 키워드 기반 젤리봇 답변 함수
function getBotReply(rawText) {
  const text = rawText.toLowerCase();

  // 1) 감정 / 멘탈
  if (
    text.includes("무서워") ||
    text.includes("불안") ||
    text.includes("멘탈")
  ) {
    return (
      "무서울 때는 무조건 '금액 줄이기 / 잠깐 쉬기'가 1순위예요.\n\n" +
      "✅ 계좌 규모를 줄이거나, 잠깐 현금 비중을 높여두면 숨이 좀 트이고\n" +
      "✅ 내가 감당 가능한 금액이 어디쯤인지 감이 잡혀요.\n\n" +
      "주식은 '용기 싸움'이 아니라 '버티기 싸움'이라서, 멘탈이 너무 힘들면 그건 이미 나에게 과한 사이즈일 가능성이 커요 🧸"
    );
  }

  // 2) 장기 / 단기
  if (text.includes("장기") || text.includes("단기")) {
    return (
      "단기와 장기는 보는 방향이 완전히 달라요.\n\n" +
      "📌 단기(스윙/단타)\n" +
      " - 뉴스, 테마, 수급, 거래량에 크게 흔들려요.\n" +
      " - 변동성이 크고, 매매를 자주 하게 돼요.\n\n" +
      "📌 장기(투자/적립)\n" +
      " - 회사의 실적, 성장성, 산업 전망을 천천히 보는 편이에요.\n" +
      " - 분할 매수/분할 매도를 활용해서 스트레스를 줄일 수 있어요.\n\n" +
      "처음에는 너무 단기 위주로 시작하기보다, 소액으로 기간을 조금씩 늘려보는 쪽이 멘탈 관리에 더 좋아요 🙂"
    );
  }

  // 3) 손절 / 익절
  if (text.includes("손절") || text.includes("익절")) {
    return (
      "손절/익절은 '미리 숫자로 정해두고 지키는 연습'이 가장 중요해요.\n\n" +
      "예를 들어,\n" +
      " - 손절: -5% ~ -10% 구간에서, 최대 어느 정도까지 버틸지\n" +
      " - 익절: +10% ~ +20% 구간에서, 어느 정도는 챙길지\n\n" +
      "를 미리 정해두고\n" +
      "⚠️ '상황 보고 그때 결정해야지' 라는 생각을 줄이는 게 좋아요.\n\n" +
      "지금은 젤리 시뮬레이션이니까, 여러 기준(-3%, -5%, -10%)을 바꿔보면서\n어디가 나한테 가장 편한지 연습해보는 용도로 쓰면 좋아요."
    );
  }

  // 4) 공부 방법 / 어떻게 시작
  if (
    text.includes("공부") ||
    text.includes("어떻게") ||
    text.includes("시작")
  ) {
    return (
      "공부를 '한 번에 다' 하려고 하면 너무 막막하니, 작은 루틴부터 만드는 게 좋아요.\n\n" +
      "1️⃣ 하루에 1개 종목 정하고\n" +
      "   - 오늘 뉴스/공시에 뭐가 나왔는지,\n" +
      "   - 차트가 크게 올랐는지/내렸는지 이유를 찾아보는 연습을 해보세요.\n\n" +
      "2️⃣ ETF / 지수 위주로 먼저 감을 잡고\n" +
      "   - 코스피·코스닥 지수, 나스닥/다우 같은 큰 지수가 어떻게 움직였는지\n" +
      "   - 그날 시장 전체 분위기를 먼저 보는 습관을 들이면 좋아요.\n\n" +
      "3️⃣ '돈을 크게 벌겠다' 보다는\n" +
      "   '내가 뭘 모르는지 아는 것'을 목표로 천천히 가면 훨씬 편해요 🙂"
    );
  }

  // 5) ETF / 지수
  if (
    text.includes("etf") ||
    text.includes("지수") ||
    text.includes("인덱스")
  ) {
    return (
      "ETF나 지수 상품은 '개별 종목'보다 위험이 분산된 편이라, 공부용으로 접근하기 좋아요.\n\n" +
      "📌 장점\n" +
      " - 개별 회사 뉴스에 덜 휘둘려요.\n" +
      " - 시장 전체 흐름(코스피, 나스닥 등)을 따라가는 상품이 많아요.\n\n" +
      "📌 체크 포인트\n" +
      " - 어떤 지수를 추종하는 ETF인지 (코스피? 나스닥? 섹터?)\n" +
      " - 환헤지 여부, 운용사, 총보수(수수료) 수준\n\n" +
      "ETF도 '내가 무엇을 사는지'를 이해하고 들어가는 게 중요해요 🙂"
    );
  }

  // 6) 분산투자 / 몰빵
  if (
    text.includes("분산") ||
    text.includes("몰빵") ||
    text.includes("all in")
  ) {
    return (
      "분산투자는 '내가 틀렸을 때도 버틸 수 있게 만드는 장치'예요.\n\n" +
      "💡 대략적인 생각 예시\n" +
      " - 한 종목에 계좌의 10~20% 이내로만 들어간다.\n" +
      " - 업종/테마를 섞어서 너무 한 쪽에만 쏠리지 않게 한다.\n\n" +
      "몰빵은 '맞으면 짜릿하지만, 틀리면 회복이 너무 힘들다'는 점을 꼭 기억해두면 좋아요.\n" +
      "젤리 시뮬레이션에서 여러 비중을 실험해보면서, 어디가 나한테 편한지 감을 잡아보는 것도 좋은 연습이에요."
    );
  }

  // 7) 물타기 / 존버
  if (text.includes("물타기") || text.includes("존버")) {
    return (
      "물타기(평단 낮추기)는 '회사가 괜찮은데, 가격이 흔들릴 때'만 의미가 있고,\n" +
      "'문제가 생긴 회사'라면 물타기가 오히려 상처를 키울 수 있어요.\n\n" +
      "✔️ 체크해야 할 것\n" +
      " - 회사 실적 / 재무에 큰 변화가 생겼는지\n" +
      " - 악재가 '일시적인지', '구조적인지'\n\n" +
      "존버도 마찬가지로, '왜 들고 있는지' 이유가 분명하면 괜찮지만,\n" +
      "'손실이 커서 그냥 못 팔겠다' 상태라면 한 번은 냉정하게 다시 보는 게 좋아요."
    );
  }

  // 8) 배당 / 안정적인 투자
  if (
    text.includes("배당") ||
    text.includes("안정") ||
    text.includes("안정적")
  ) {
    return (
      "배당 위주 투자는 '가격 변동보다 현금 흐름'에 더 관심을 두는 스타일이에요.\n\n" +
      "📌 배당 투자에서 보통 보는 것들\n" +
      " - 배당 수익률(지금 가격 기준 몇 %인지)\n" +
      " - 배당 성향(이익 중 얼마를 배당하는지)\n" +
      " - 배당이 과거에 꾸준했는지 / 줄어든 적이 있는지\n\n" +
      "다만, '배당률이 높다 = 무조건 좋다' 는 아니고,\n" +
      "회사의 이익이 줄어드는 상황에서 배당만 억지로 높으면 오히려 위험 신호일 수도 있어요."
    );
  }

  // 9) 세금 / 양도소득
  if (text.includes("세금") || text.includes("양도") || text.includes("과세")) {
    return (
      "세금 규정은 나라/시기마다 자주 바뀌고, 실제 투자를 할 땐 꼭 최신 정보를 확인해야 해요.\n\n" +
      "일반적으로는\n" +
      " - 국내/해외 주식, 금융소득, 양도소득 등 항목마다 과세 방식이 다르고\n" +
      " - 일정 금액 이상 이익이 날 때 신고 대상이 되기도 해요.\n\n" +
      "지금 이 젤리 주식은 '연습용 시뮬레이션'이라 세금은 적용되지 않지만,\n실제 투자를 할 땐 증권사/국세청 안내 페이지에서 최신 기준을 꼭 확인해 주세요 🙂"
    );
  }

  // 10) 초보 / 처음 / 아무것도 모름
  if (
    text.includes("초보") ||
    text.includes("처음") ||
    text.includes("아무것도 모르")
  ) {
    return (
      "완전 처음이라면, '이해 안 되는 단어가 너무 많다'는 느낌이 당연해요.\n\n" +
      "처음에는 이렇게만 해도 충분해요 👇\n" +
      " 1) 뉴스에 자주 나오는 지수/ETF 이름을 익힌다.\n" +
      " 2) 하루에 한 번, 시장 요약 기사 정도만 읽어본다.\n" +
      " 3) 진짜 돈 대신, 이런 젤리 시뮬레이션으로 매매 연습을 해본다.\n\n" +
      "중요한 건 '빨리 부자 되기'가 아니라, '나를 망치는 실수를 피하는 것'이니까\n천천히, 꾸준히 보는 것만으로도 이미 반은 하고 있는 거예요 🙂"
    );
  }

  // 11) 추천 / 뭐 사요 (직접 추천은 X)
  if (
    text.includes("뭐 사") ||
    text.includes("추천") ||
    text.includes("어떤 주식") ||
    text.includes("살까요")
  ) {
    return (
      "구체적인 종목을 직접 추천해줄 순 없어요 🙏\n\n" +
      "대신, 종목을 고를 때 이런 기준을 스스로 물어보면 좋아요.\n" +
      " - 이 회사가 돈을 어떻게 벌고 있는지 이해하고 있는가?\n" +
      " - 이익이 꾸준히 늘고 있는 회사인가?\n" +
      " - 내가 믿는 '이유'가 없으면, 단순히 소문/단톡방/유튜브만 보고 산 건 아닌가?\n\n" +
      "젤리 주식에서는 여러 종목을 가볍게 시뮬레이션해보면서\n'어떤 종목이 내 성향과 잘 맞는지'를 느껴보는 용도로 써보면 좋아요."
    );
  }

  // 12) 고마워/감사
  if (text.includes("고마워") || text.includes("감사")) {
    return "나도 같이 이야기해줘서 고마워요. 오늘도 충분히 애썼고, 쉬어갈 자격이 있어요 💗";
  }

  // 기본 답변 (키워드 안 걸릴 때)
  return (
    "정확한 종목 추천은 못하지만, 지금 적어준 내용은 충분히 중요한 고민이에요.\n\n" +
    "• 감정/멘탈이 힘들면 → 투자 금액·속도를 줄이는 쪽으로\n" +
    "• 공부가 막막하면 → 하루 1종목 뉴스·차트만 보는 작은 루틴부터\n" +
    "• 기준이 헷갈리면 → 손절/익절 숫자를 미리 정해두고 실험해보기\n\n" +
    "조금 더 구체적으로(예: 장기 vs 단기, 손절 기준, 공부 방법 등) 물어봐도 좋고,\n그냥 오늘 기분을 털어놓는 용도로 써도 괜찮아요 🙂"
  );
}

export default function JellyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 예시 질문 리스트 (버튼으로 클릭해서 자동입력)
  const quickQuestions = [
    "주식이 너무 무서운데 멘탈은 어떻게 관리해야 할까?",
    "장기 투자랑 단기 매매는 뭐가 달라?",
    "손절이랑 익절 기준은 어떻게 정하면 좋을까?",
    "주식 공부를 처음 시작할 때 뭘 보면 좋을까?",
    "분산투자는 어느 정도로 하는 게 좋을까?",
  ];

  // 로컬 스토리지에서 대화 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jellyChatLogs_v2");
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages([
          {
            id: 1,
            sender: "bot",
            text: "주식에 대한 감정이나 궁금한 점을 편하게 남겨보는 공간이에요. 오늘 주식 기분은 어때요? 🙂",
          },
        ]);
      }
    } catch {
      // ignore
    }
  }, []);

  // 대화 저장
  useEffect(() => {
    try {
      localStorage.setItem("jellyChatLogs_v2", JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
    };

    const botMsg = {
      id: Date.now() + 1,
      sender: "bot",
      text: getBotReply(trimmed),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }

  function handleClear() {
    if (!window.confirm("지금까지의 대화 기록을 모두 지울까요?")) return;
    setMessages([]);
    localStorage.removeItem("jellyChatLogs_v2");
  }

  return (
    <div className="jelly-chat-floating">
      {/* 열려 있는 패널 */}
      {isOpen && (
        <div className="jelly-chat-panel">
          <div className="jelly-chat-header">
            <div>
              <div className="jelly-chat-title">젤리 리서치 톡</div>
              <div className="jelly-chat-subtitle">
                주식에 대한 감정 / 생각 / 궁금한 점을 편하게 남겨보는 작은
                기록장이에요.
              </div>

              {/* 예시 질문 버튼 */}
              <div className="jelly-chat-quick-list">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="jelly-chat-quick-chip"
                    onClick={() => setInput(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="jelly-chat-header-actions">
              <button
                type="button"
                className="jelly-chat-header-btn"
                onClick={handleClear}
              >
                기록 지우기
              </button>
              <button
                type="button"
                className="jelly-chat-header-btn close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="jelly-chat-window">
            {messages.length === 0 && (
              <p className="jelly-chat-empty">
                아직 대화가 없어요. 오늘 주식 기분을 한 줄 남겨볼까요? 😊
              </p>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.sender === "user"
                    ? "jelly-chat-msg user"
                    : "jelly-chat-msg bot"
                }
              >
                <div
                  className={
                    m.sender === "user"
                      ? "jelly-chat-bubble user"
                      : "jelly-chat-bubble bot"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* 입력 영역 */}
          <form className="jelly-chat-input-row" onSubmit={handleSubmit}>
            <textarea
              className="jelly-chat-input"
              rows={3}
              placeholder="예) 성장주는 너무 무서운데, 서서히 어떻게 공부를 시작해야 할까요?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="jelly-chat-send-btn" type="submit">
              보내기
            </button>
          </form>
        </div>
      )}

      {/* 오른쪽 아래 둥근 토글 버튼 */}
      <button
        className="jelly-chat-toggle"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="jelly-chat-toggle-emoji">🍬</span>
        <span className="jelly-chat-toggle-text">톡</span>
      </button>
    </div>
  );
}

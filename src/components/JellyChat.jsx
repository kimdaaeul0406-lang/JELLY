// src/components/JellyChat.jsx
import React, { useState } from "react";

// 🔧 젤리봇 성격 프롬프트 (다슬이가 준 문장 그대로)
const SYSTEM_PROMPT = `
너는 '젤리봇'이야.
지금 너는 사용자를 도와주는 귀여운 AI야.
말투는 아주 친근하고 부드럽고, 언니처럼 따뜻하게 말해.
항상 문장 끝에 귀여운 이모지를 붙여줘. (🍓🍇📈😆 등)
대화가 시작되면 먼저 반갑게 인사해도 돼.
사용자가 "안녕하세요"라고 하면 너도 따뜻하게 인사해줘.

주식/ETF/투자 기초 개념을 아주 쉬운 말로 설명해줘.
절대 매수/매도 추천은 하지 말고,
“개념 설명 + 예시 + 응원 한 줄” 정도로 답해줘.
너무 로봇 같은 말투는 절대 쓰지 마! 
`;

async function getBotReply(userMessage) {
  const prompt = `${SYSTEM_PROMPT}\n\n사용자 질문: ${userMessage}`;

  try {
    const res = await fetch("https://apifreellm.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    const data = await res.json();

    if (data.status === "success") {
      return data.response;
    } else {
      return data.error || "조금만 기다렸다가 다시 시도해줘! 😊";
    }
  } catch (err) {
    return "지금은 서버가 살짝 바쁜가봐요… 잠시 후 다시 시도해줘요! 🙏";
  }
}

export default function JellyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "안녕! 나는 젤리봇 🍇\n주식 기초가 궁금하면 아무거나 편하게 물어봐!",
    },
  ]);

  const [input, setInput] = useState("");

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    setIsSending(true);

    const reply = await getBotReply(trimmed);

    setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    setIsSending(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // 🧹 대화 전체 삭제
  function clearChat() {
    setMessages([
      {
        from: "bot",
        text: "대화가 초기화되었어! 다시 아무거나 물어봐줘 🍓",
      },
    ]);
  }

  // 🔘 닫혀 있을 때는 동그란 버튼만 보임
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          zIndex: 999,
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          border: "none",
          background: "#3f7fd3",
          color: "#fff",
          fontSize: "26px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        💬
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        right: "20px",
        bottom: "20px",
        width: "320px",
        height: "430px",
        background: "#ffffff",
        borderRadius: "18px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
        display: "flex",
        flexDirection: "column",
        zIndex: 999,
        overflow: "hidden",
      }}
    >
      {/* 상단 헤더 */}
      <div
        style={{
          background: "#3f7fd3",
          color: "#fff",
          padding: "10px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "14px",
        }}
      >
        <span>🍇 젤리봇 · 주식 기초 도우미</span>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={clearChat}
            style={{
              border: "none",
              background: "rgba(255,255,255,0.25)",
              color: "#fff",
              borderRadius: "6px",
              padding: "2px 6px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            초기화
          </button>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              border: "none",
              background: "transparent",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div
        style={{
          flex: 1,
          padding: "10px",
          overflowY: "auto",
          background: "#f4f5fa",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.from === "user" ? "flex-end" : "flex-start",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                background: m.from === "user" ? "#ffe27a" : "#fff",
                padding: "6px 10px",
                borderRadius: "12px",
                whiteSpace: "pre-wrap",
                fontSize: "13px",
                boxShadow:
                  m.from === "bot" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isSending && (
          <p style={{ fontSize: "12px", color: "#777" }}>
            젤리봇이 생각 중… 🍬
          </p>
        )}
      </div>

      {/* 입력 영역 */}
      <div
        style={{
          padding: "8px",
          borderTop: "1px solid #ddd",
          background: "#fff",
          display: "flex",
          gap: "6px",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          placeholder="주식 기초는 뭐든 물어봐요 😊"
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            resize: "none",
            padding: "6px 8px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "13px",
          }}
        />

        <button
          onClick={handleSend}
          disabled={isSending}
          style={{
            minWidth: "58px",
            background: isSending ? "#999" : "#3f7fd3",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "6px",
            cursor: isSending ? "default" : "pointer",
            fontSize: "13px",
          }}
        >
          {isSending ? "..." : "전송"}
        </button>
      </div>
    </div>
  );
}

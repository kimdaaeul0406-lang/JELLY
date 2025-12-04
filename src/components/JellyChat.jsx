// src/components/JellyChat.jsx
import React, { useState, useEffect, useRef } from "react";
import "../styles/jelly-chat.css";
import { getBotReply } from "./JellyChat/api";
import ChatButton from "./JellyChat/ChatButton";
import ChatHeader from "./JellyChat/ChatHeader";
import MessageList from "./JellyChat/MessageList";
import ChatInput from "./JellyChat/ChatInput";

// 메시지에 고유 ID 생성 헬퍼
function createMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 초기 봇 메시지
const INITIAL_BOT_MESSAGE = {
  id: createMessageId(),
  from: "bot",
  text: "안녕! 나는 젤리봇 🍇\n주식 기초가 궁금하면 아무거나 편하게 물어봐!",
};

export default function JellyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  // localStorage에서 메시지 히스토리 불러오기
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("jellyChatMessages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse chat messages", e);
      }
    }
    return [INITIAL_BOT_MESSAGE];
  });

  const [input, setInput] = useState("");

  // 메시지가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("jellyChatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // 채팅창이 열릴 때 입력창에 자동 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 포커스
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: createMessageId(),
      from: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const reply = await getBotReply(trimmed);
      // 봇 응답 추가
      const botMessage = {
        id: createMessageId(),
        from: "bot",
        text: reply,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // 에러 발생 시 에러 메시지 추가
      const errorMessage = {
        id: createMessageId(),
        from: "bot",
        text: "지금은 서버가 살짝 바쁜가봐요… 잠시 후 다시 시도해줘요! 🙏",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  }

  // 🧹 대화 전체 삭제
  function clearChat() {
    if (window.confirm("대화 내역을 모두 삭제할까요?")) {
      const resetMessage = {
        id: createMessageId(),
        from: "bot",
        text: "대화가 초기화되었어! 다시 아무거나 물어봐줘 🍓",
      };
      setMessages([resetMessage]);
      localStorage.setItem("jellyChatMessages", JSON.stringify([resetMessage]));
    }
  }

  // 🔘 닫혀 있을 때는 동그란 버튼만 보임
  if (!isOpen) {
    return <ChatButton onClick={() => setIsOpen(true)} />;
  }

  return (
    <div className="jelly-chat-container">
      <ChatHeader onClear={clearChat} onClose={() => setIsOpen(false)} />
      <MessageList messages={messages} isSending={isSending} />
      <ChatInput
        input={input}
        onChange={setInput}
        onSend={handleSend}
        isSending={isSending}
        inputRef={inputRef}
      />
    </div>
  );
}

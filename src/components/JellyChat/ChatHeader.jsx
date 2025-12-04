// src/components/JellyChat/ChatHeader.jsx
import React from "react";

export default function ChatHeader({ onClear, onClose }) {
  return (
    <div className="jelly-chat-header">
      <span>🍇 젤리봇 · 주식 기초 도우미</span>
      <div className="jelly-chat-header-actions">
        <button
          onClick={onClear}
          className="jelly-chat-header-btn"
          aria-label="대화 초기화"
        >
          초기화
        </button>
        <button
          onClick={onClose}
          className="jelly-chat-header-close"
          aria-label="채팅 닫기"
        >
          ✕
        </button>
      </div>
    </div>
  );
}


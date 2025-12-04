// src/components/JellyChat/ChatButton.jsx
import React from "react";

export default function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="jelly-chat-button"
      aria-label="젤리봇 채팅 열기"
    >
      💬
    </button>
  );
}


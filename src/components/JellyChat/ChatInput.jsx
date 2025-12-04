// src/components/JellyChat/ChatInput.jsx
import React from "react";

export default function ChatInput({ input, onChange, onSend, isSending, inputRef }) {
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="jelly-chat-input-area">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder="주식 기초는 뭐든 물어봐요 😊"
        onKeyDown={handleKeyDown}
        className="jelly-chat-textarea"
        aria-label="메시지 입력"
      />
      <button
        onClick={onSend}
        disabled={isSending}
        className={`jelly-chat-send-btn ${isSending ? "jelly-chat-send-btn-disabled" : ""}`}
        aria-label="메시지 전송"
      >
        {isSending ? "..." : "전송"}
      </button>
    </div>
  );
}


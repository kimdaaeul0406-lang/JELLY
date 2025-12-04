// src/components/JellyChat/MessageItem.jsx
import React, { useState } from "react";

export default function MessageItem({ message }) {
  const isUser = message.from === "user";
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(message.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className={`jelly-chat-message ${isUser ? "jelly-chat-message-user" : "jelly-chat-message-bot"}`}
    >
      <div
        className={`jelly-chat-message-bubble ${isUser ? "jelly-chat-message-bubble-user" : "jelly-chat-message-bubble-bot"}`}
      >
        <span className="jelly-chat-message-text">{message.text}</span>
        <button
          onClick={handleCopy}
          className="jelly-chat-copy-btn"
          aria-label="메시지 복사"
          title={copied ? "복사됨!" : "복사"}
        >
          {copied ? "✓" : "📋"}
        </button>
      </div>
    </div>
  );
}


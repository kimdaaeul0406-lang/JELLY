// src/components/JellyChat/MessageItem.jsx
import React from "react";

export default function MessageItem({ message }) {
  const isUser = message.from === "user";

  return (
    <div
      className={`jelly-chat-message ${isUser ? "jelly-chat-message-user" : "jelly-chat-message-bot"}`}
    >
      <div
        className={`jelly-chat-message-bubble ${isUser ? "jelly-chat-message-bubble-user" : "jelly-chat-message-bubble-bot"}`}
      >
        {message.text}
      </div>
    </div>
  );
}


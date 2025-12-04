// src/components/JellyChat/MessageList.jsx
import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

export default function MessageList({ messages, isSending }) {
  const messagesEndRef = useRef(null);

  // 새 메시지가 추가되면 자동으로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  return (
    <div className="jelly-chat-messages">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {isSending && (
        <div className="jelly-chat-loading">
          <div className="jelly-chat-loading-text">젤리봇이 생각 중</div>
          <div className="jelly-chat-loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}


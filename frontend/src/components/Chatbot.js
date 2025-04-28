// frontend/src/components/Chatbot.js

import React, { useState, useRef, useEffect } from 'react';
import api from '../axios';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // Generate one userID per page load:
  const userIDRef = useRef(
    // if crypto.randomUUID is available, use it; otherwise fall back to Math.random
    (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 10)
  );
  const userID = userIDRef.current;

  const chatEndRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    // Add the user’s message
    setMessages(m => [...m, { id: Date.now(), from: 'user', text }]);
    setInput('');

    try {
      const { data } = await api.post('chatbot/', {
        message: text,
        userID
      });
      // Add the bot’s reply
      setMessages(m => [...m, { id: Date.now()+1, from: 'bot', text: data.response }]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(m => [
        ...m,
        { id: Date.now()+2, from: 'bot', text: '⚠️ Server unreachable.' }
      ]);
    }
  };

  const onKeyDown = e => {
    if (e.key === 'Enter') sendMessage();
  };

  // Minimized view
  if (isMinimized) {
    return (
      <div className="chatbot-minimized">
        <button
          className="chatbot-minimized__open"
          onClick={() => setIsMinimized(false)}
        >
          💬 Assistant
        </button>
      </div>
    );
  }

  // Full chat widget
  return (
    <div className="chatbot">
      <header className="chatbot__header">
        <h4 className="chatbot__title">PokéTrade Assistant</h4>
        <button
          className="chatbot__minimize"
          onClick={() => setIsMinimized(true)}
          aria-label="Minimize"
        >
          —
        </button>
      </header>

      <div className="chatbot__window">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`chatbot__message chatbot__message--${msg.from}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chatbot__input-area">
        <input
          className="chatbot__input"
          type="text"
          placeholder="Type a message…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className="chatbot__send" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

// frontend/src/components/Chatbot.js

import React, { useState, useRef, useEffect } from 'react';
import api from '../axios';
import { v4 as uuidv4 } from 'uuid';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(false);
  const userID = useRef(uuidv4());
  const chatEndRef = useRef(null);

  // auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { id: uuidv4(), from: 'user', text }]);
    setInput('');
    try {
      const { data } = await api.post('chatbot/', {
        message: text,
        userID: userID.current
      });
      setMessages(m => [...m, { id: uuidv4(), from: 'bot', text: data.response }]);
    } catch {
      setMessages(m => [
        ...m,
        { id: uuidv4(), from: 'bot', text: 'Sorry, there was an error.' }
      ]);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className={`chatbot-widget ${minimized ? 'minimized' : ''}`}>
      <div className="chatbot-header">
        <span className="chatbot-title">PokéTrade Assistant</span>
        <button
          className="chatbot-toggle"
          onClick={() => setMinimized(v => !v)}
          aria-label={minimized ? 'Open chat' : 'Minimize chat'}
        >
          {minimized ? '+' : '–'}
        </button>
      </div>

      <div className="chatbot-body">
        <div className="chatbot-messages">
          {messages.map(m => (
            <div key={m.id} className={`message ${m.from}`}>
              {m.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Type a message…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="send-btn" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

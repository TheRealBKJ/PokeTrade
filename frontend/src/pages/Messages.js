// frontend/src/pages/Messages.js

import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import './Messages.css';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await axios.get('messages/');
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }
    // prefix with void to satisfy eslint about unhandled promises
    void fetchMessages();
  }, [navigate]);

  const handleSend = async () => {
    if (!recipient.trim() || !body.trim()) {
      return alert('Both fields are required');
    }
    try {
      await axios.post('messages/', { recipient, body });
      setRecipient('');
      setBody('');
      setLoading(true);
      const res = await axios.get('messages/');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading messages…</p>;

  return (
    <div className="messages-page">
      <h2>Messages</h2>
      <div className="compose">
        <input
          type="text"
          placeholder="Recipient username"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
        />
        <textarea
          placeholder="Type your message…"
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>

      <ul className="message-list">
        {messages.map(msg => {
          // destructure so sender_username, recipient_username, sent_at, body are declared
          const {
            id,
            sender_username,
            recipient_username,
            sent_at,
            body: messageBody,
            read,
          } = msg;

          return (
            <li key={id} className={read ? 'read' : 'unread'}>
              <div className="meta">
                <strong>{sender_username}</strong>
                {' → '}
                <strong>{recipient_username}</strong>
                <span className="timestamp">
                  {new Date(sent_at).toLocaleString()}
                </span>
              </div>
              <p>{messageBody}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

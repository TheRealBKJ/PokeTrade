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
    const fetchMessages = async () => {
      try {
        const res = await axios.get('/api/messages/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [navigate]);

  const handleSend = async () => {
    if (!recipient || !body) return alert('Both fields are required');
    try {
      await axios.post(
        '/api/messages/',
        { recipient, body },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      );
      setRecipient('');
      setBody('');
      // refresh inbox
      const res = await axios.get('/api/messages/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
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
        {messages.map(msg => (
          <li key={msg.id} className={msg.read ? 'read' : 'unread'}>
            <div className="meta">
              <strong>{msg.sender_username}</strong> → <strong>{msg.recipient_username}</strong>
              <span className="timestamp">{new Date(msg.sent_at).toLocaleString()}</span>
            </div>
            <p>{msg.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

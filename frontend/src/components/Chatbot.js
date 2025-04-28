import React, { useState, useRef, useEffect } from 'react';
import api from '../axios';           // ← use your configured instance
import { v4 as uuidv4 } from 'uuid';
import './Chatbot.css';              // Optional: for extra styling

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [userID]                = useState(uuidv4());
  const chatEndRef              = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: uuidv4(), from: 'user', text: input.trim() };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');

    try {
      const { data } = await api.post('chatbot/', {
        message: userMsg.text,
        userID
      });

      const botMsg = { id: uuidv4(), from: 'bot', text: data.response };
      setMessages(msgs => [...msgs, botMsg]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const errMsg = {
        id: uuidv4(),
        from: 'bot',
        text: '🤖 Sorry, I can’t reach the server right now.'
      };
      setMessages(msgs => [...msgs, errMsg]);
    }
  };

  const onKeyDown = e => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>PokéTrade Assistant</h2>
      </header>

      <div style={styles.chatWindow}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              ...(msg.from === 'user' ? styles.userBubble : styles.botBubble)
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

// -----------------------------
// Inline style objects below
// -----------------------------
const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  header: {
    padding: '1rem',
    backgroundColor: '#3b4cca',
    color: 'white',
    textAlign: 'center'
  },
  chatWindow: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: '1rem',
    overflowY: 'auto'
  },
  message: {
    maxWidth: '70%',
    padding: '0.75rem 1rem',
    borderRadius: '16px',
    margin: '0.5rem 0',
    lineHeight: '1.4',
    wordBreak: 'break-word'
  },
  userBubble: {
    backgroundColor: '#e0f7fa',
    alignSelf: 'flex-end'
  },
  botBubble: {
    backgroundColor: '#fff',
    border: '1px solid #eee',
    alignSelf: 'flex-start'
  },
  inputContainer: {
    display: 'flex',
    padding: '1rem',
    borderTop: '1px solid #ddd',
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: '24px',
    border: '1px solid #ccc',
    outline: 'none',
    fontSize: '1rem'
  },
  button: {
    marginLeft: '0.75rem',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '24px',
    backgroundColor: '#3b4cca',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer'
  }
};

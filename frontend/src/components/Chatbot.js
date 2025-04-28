import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Install uuid with npm install uuid

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userID] = useState(uuidv4()); // Generate random userID once

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('http://localhost:8000/chatbot/', {
        message: input,
        userID: userID,
      });

      const botReply = response.data.response;
      setMessages([...newMessages, { from: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { from: 'bot', text: 'Error: Could not reach server.' }]);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <div style={{ marginBottom: '10px', height: '400px', overflowY: 'auto', border: '1px solid black', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '5px 0' }}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        style={{ width: '80%', padding: '10px' }}
      />
      <button onClick={handleSend} style={{ padding: '10px 20px', marginLeft: '10px' }}>
        Send
      </button>
    </div>
  );
};

export default Chatbot;

import { useState } from "react";
import axios from '../axios';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return; // prevent empty messages

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // clear input immediately
    setLoading(true);

    try {
      const response = await axios.post("/api/chatbot/chat/", { message: input });
      const botMessage = { sender: "bot", text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const botMessage = { sender: "bot", text: "⚠️ Sorry, I couldn't understand that." };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">PokeTrade Chatbot</div>

      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === "user" ? "chatbot-message-user" : "chatbot-message-bot"}
          >
            <p>{msg.sender === "user" ? "🧑 " : "🤖 "}{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="chatbot-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about Pokémon trades!"
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;


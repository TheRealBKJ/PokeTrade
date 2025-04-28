import { useState } from "react";
import axios from "axios";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const response = await axios.post("/api/chatbot/chat/", { message: input });
    const botMessage = { sender: "bot", text: response.data.response };
    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };

  return (
    <div className="p-4 border rounded w-96">
      <div className="h-64 overflow-y-scroll mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === "user" ? "text-right" : "text-left"}>
            <p className="mb-2">{msg.sender === "user" ? "🧑 " : "🤖 "}{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="border p-2 flex-grow"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Pokémon trades!"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 ml-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;

import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import NicknameForm from "./NicknameForm";
import "./assets/App.css";

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [nickname, setNickname] = useState(null);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((messages) => [...messages, msg]);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue !== "") {
      socket.emit("chat message", inputValue);
      setInputValue("");
    }
  };

  const handleRegisterNickname = (nickname) => {
    setNickname(nickname);
    socket.emit("register nickname", nickname);
  };

  if (!nickname) {
    return <NicknameForm onRegisterNickname={handleRegisterNickname} />;
  }

  return (
    <div>
      <ul className="messages">
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.nickname}: {msg.message}
          </li>
        ))}
      </ul>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;

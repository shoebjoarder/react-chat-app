import React, { useState } from "react";
import "./assets/NicknameForm.css";

const NicknameForm = ({ onRegisterNickname }) => {
  const [nickname, setNickname] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (nickname !== "") {
      onRegisterNickname(nickname);
    }
  };

  return (
    <div className="nickname-form">
      <form onSubmit={handleSubmit}>
        <label>
          Enter your nickname:
          <input
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NicknameForm;

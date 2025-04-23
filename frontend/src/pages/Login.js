import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("user", JSON.stringify({ username: "Ash" }));
    navigate("/profile");
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <p>Sign in to your PokeTrade account.</p>
      <button className="auth-button" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;


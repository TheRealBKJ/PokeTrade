import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");
    setTimeout(() => navigate("/login"), 1500);
  }, [navigate]);

  return (
    <div className="auth-container">
      <h2>Logging you out...</h2>
      <p>Redirecting to login screen.</p>
    </div>
  );
};

export default Logout;

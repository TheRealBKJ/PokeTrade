import React from "react";
import "./Settings.css";

const Settings = () => {
  return (
    <div className="settings-container">
      <h2>User Settings</h2>
      <form className="settings-form">
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>
        <label>
          Username
          <input type="text" placeholder="YourUsername" />
        </label>
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
};

export default Settings;

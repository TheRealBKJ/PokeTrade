import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationInbox.css";

const NotificationInbox = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get("/api/notifications/")  // Make sure backend is running
      .then(res => setNotifications(res.data))
      .catch(err => console.error("Error fetching notifications:", err));
  }, []);

  return (
    <div className="notifications-page">
      <h2>Your Notifications</h2>
      <ul className="notification-list">
        {notifications.map((notif) => (
          <li key={notif.id} className={notif.read ? "read" : "unread"}>
            {notif.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationInbox; // ✅ **THIS LINE IS CRITICAL**

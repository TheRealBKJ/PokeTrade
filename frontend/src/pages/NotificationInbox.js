// frontend/src/pages/NotificationInbox.js
import React, { useEffect, useState } from 'react';
import api from '../axios';

const NotificationInbox = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // GET http://localhost:8000/api/notifications/
        const res = await api.get('notifications/');
        setNotes(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        alert('Unable to load notifications.');
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="notifications-page">
      <h1>Your Notifications 🔔</h1>
      {notes.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        notes.map(n => (
          <div key={n.id} className="notification-item">
            {n.message}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationInbox;

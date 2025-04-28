import React, { useEffect, useState } from 'react';
import axios from '../axios'; // your axios file
import './Settings.css'; // if you have styles

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No token found. Please log in.');
          return;
        }

        const res = await axios.get('/api/profile/', {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 VERY IMPORTANT
          },
        });

        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile. Try logging in again.');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div className="settings-page"><p>{error}</p></div>;
  }

  if (!profile) {
    return <div className="settings-page"><p>Loading...</p></div>;
  }

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Currency:</strong> {profile.currency_balance} 🪙</p>
    </div>
  );
};

export default Settings;

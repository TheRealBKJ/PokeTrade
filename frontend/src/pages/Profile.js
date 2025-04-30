// frontend/src/pages/Profile.js

import React, { useState, useEffect } from 'react';
import api from '../axios';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('profiles/');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
        alert('Unable to load profile.');
      }
    };
    void fetchProfile();
  }, []);

  const claimDailyPack = async () => {
    try {
      const res = await api.post('profiles/daily-pack/');
      const { message, new_card } = res.data;
      // new_card is what the backend actually returns
      alert(`${message}\nNew card ➡️ ${new_card.card_name}`);
      // refresh your profile (balance, counts, etc)
      const updated = await api.get('profiles/');
      setProfile(updated.data);
    } catch (err) {
      console.error('Claim failed:', err);
      // show the server‐sent error or a generic fallback
      alert(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Failed to claim daily pack!'
      );
    }
  };

  if (!profile) return <p>Loading...</p>;

  const { username, currency_balance } = profile;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src="/Pika.png"
          alt="Profile Avatar"
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
        <h2>Trainer Profile 🧢</h2>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Currency Balance:</strong> {currency_balance} 🪙</p>
        <button className="make-trade-button" onClick={claimDailyPack}>
          Claim Daily Pack 🎁
        </button>
      </div>
    </div>
  );
};

export default Profile;

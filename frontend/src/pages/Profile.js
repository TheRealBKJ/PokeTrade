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
        console.error('Failed to fetch profile:', err);
        alert('Unable to load profile.');
      }
    };
    fetchProfile();
  }, []);

  const claimDailyPack = async () => {
    try {
      const res = await api.post('profiles/daily-pack/');
      const { message, card } = res.data;    // match backend fields

      const cardName = card.name;

      alert(`${message}\nNew card ➡️ ${cardName}`);

      // refresh profile (balance updated)
      const updated = await api.get('profiles/');
      setProfile(updated.data);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.error ||
        JSON.stringify(err.response?.data) ||
        'Failed to claim daily pack!'
      );
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src="/Pika.png"
          alt="Profile Avatar"
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
        <h2>Trainer Profile 🧢</h2>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Currency Balance:</strong> {profile.currency_balance} 🪙</p>

        <button className="make-trade-button" onClick={claimDailyPack}>
          Claim Daily Pack 🎁
        </button>
      </div>
    </div>
  );
};

export default Profile;

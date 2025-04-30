// frontend/src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import api from '../axios';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('profiles/')
      .then(res => setProfile(res.data))
      .catch(() => alert('Failed to load profile'));
  }, []);

  const claimDailyPack = async () => {
    try {
      const res = await api.post('profiles/daily-pack/');
      const { message, new_card } = res.data;

      // Unwrap if it's an object
      const cardName = new_card && typeof new_card === 'object'
        ? new_card.name
        : new_card;

      alert(
        `${message}${cardName ? `\nNew card ➡️ ${cardName}` : ''}`
      );

      // Refresh profile data
      const updated = await api.get('profiles/');
      setProfile(updated.data);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.error ||
        err.response?.data ||
        'Failed to claim daily pack!'
      );
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>Welcome, {profile.username}</h2>
      <p>Balance: {profile.currency_balance}</p>
      <p>Cards Owned: {profile.cards_count}</p>
      <button
        onClick={claimDailyPack}
        className="daily-pack-button"
      >
        Claim Daily Pack
      </button>
    </div>
  );
};

export default Profile;

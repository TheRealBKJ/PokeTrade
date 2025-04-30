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
    void fetchProfile();
  }, []);

  const claimDailyPack = async () => {
    try {
      const res = await api.post('profiles/daily-pack/');
      const { message, card } = res.data;
      alert(`${message}\nNew card ➡️ ${card.name}`);
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

  if (!profile) return <p className="loading-text">Loading Profile...</p>;

  const { username, currency_balance, wishlist = [], trades_completed = 0 } = profile;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src="/Pika.png" alt="Profile Avatar" className="profile-avatar" />
        <div className="profile-info">
          <h2>{username}</h2>
          <p className="profile-sub">Trainer since 2023</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>{currency_balance}</h3>
          <p>PokéCoins</p>
        </div>
        <div className="stat-card">
          <h3>{trades_completed}</h3>
          <p>Trades Completed</p>
        </div>
      </div>

      <button className="daily-pack-button" onClick={claimDailyPack}>
        🎁 Claim Daily Pack
      </button>

      <div className="profile-section">
        <h3>Wishlist 🧾</h3>
        {wishlist.length > 0 ? (
          <ul className="wishlist-list">
            {wishlist.map((poke, idx) => (
              <li key={idx}>{poke}</li>
            ))}
          </ul>
        ) : (
          <p>No Pokémon in wishlist.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

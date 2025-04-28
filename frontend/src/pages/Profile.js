import React, { useEffect, useState } from 'react';
import api from '../axios';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // api.defaults.headers.common['Authorization'] should already be set on login
        const res = await api.get('users/profile/');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found.</p>;

  const claimDaily = async () => {
    try {
      const res = await api.post('users/profile/claim_daily_pack/');
      alert(res.data.message);
      // re-fetch to update currency/cards
      const updated = await api.get('users/profile/');
      setProfile(updated.data);
    } catch (err) {
      console.error('Failed to claim daily pack:', err);
      alert('Failed to claim daily pack!');
    }
  };

  return (
    <div className="profile-page">
      <h1>Trainer Profile 🧢</h1>
      <div className="profile-info">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Currency Balance:</strong> {profile.currency_balance} 🪙</p>
        <p><strong>Pokémon Collected:</strong> {profile.cards_count}</p>
      </div>
      <button className="daily-pack-button" onClick={claimDaily}>
        Claim Daily Pack 🎁
      </button>
    </div>
  );
};

export default Profile;

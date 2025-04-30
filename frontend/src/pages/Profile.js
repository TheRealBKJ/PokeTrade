// frontend/src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import api from '../axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // GET http://localhost:8000/api/profiles/
        const res = await api.get('profiles/');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        alert('Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Claim daily pack
  const claimDailyPack = async () => {
    try {
      // POST http://localhost:8000/api/profiles/daily-pack/
      const res = await api.post('profiles/daily-pack/');
      alert(
        res.data.message +
          (res.data.new_card ? `\nNew card ➡️ ${res.data.new_card}` : '')
      );
      // Refresh profile to update balance
      const updated = await api.get('profiles/');
      setProfile(updated.data);
    } catch (err) {
      console.error('Failed to claim daily pack:', err);
      alert(err.response?.data?.error || 'Failed to claim daily pack!');
    }
  };

  if (loading) return <p>Loading profile…</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div className="profile-page">
      <h1>Trainer Profile 🧢</h1>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Currency Balance:</strong> {profile.currency_balance} 🪙</p>
      <button onClick={claimDailyPack}>
        Claim Daily Pack 🎁
      </button>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import api from '../axios';
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);  // Add loading state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('profiles/');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        alert('Unable to load profile.');
      } finally {
        setLoading(false);  // Set loading to false once the data is fetched or an error occurs
      }
    };
    fetchProfile();
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
        message + (new_card ? `\nNew card ➡️ ${cardName}` : '')
      );
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

  if (loading) return <p>Loading...</p>;  // Show loading message while waiting for data

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Default Avatar for All Users */}
        <img 
          src='/Pika.png'  // Hardcoded default avatar image
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
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './Profile.css'; // your css

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('/api/profile/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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

  return (
    <div className="profile-page">
      <h1>Trainer Profile 🧢</h1>

      <div className="profile-info">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Currency Balance:</strong> {profile.currency_balance} 🪙</p>
        <p><strong>Pokémon Collected:</strong> {profile.cards_count}</p>
      </div>

      {/* Optional Daily Pack button here */}
      <button
        className="daily-pack-button"
        onClick={async () => {
          try {
            const token = localStorage.getItem('access_token');
            const res = await axios.post('/api/profile/claim_daily_pack/', {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
            alert(res.data.message);
            window.location.reload(); // refresh profile after claiming
          } catch (err) {
            console.error(err);
            alert('Failed to claim daily pack!');
          }
        }}
      >
        Claim Daily Pack 🎁
      </button>

    </div>
  );
};

export default Profile;


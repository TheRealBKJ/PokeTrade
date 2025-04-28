import React, { useEffect, useState } from 'react';
import axios from '../axios'; // assuming you are using the axios setup
import './Profile.css'; // if you want custom styles

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('/api/users/profile/', {
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
        {/* If you later add number of cards, you can display it too */}
        {/* <p><strong>Cards Collected:</strong> {profile.cards_count}</p> */}
      </div>
    </div>
  );
};

export default Profile;

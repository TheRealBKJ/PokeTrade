// src/pages/Home.js
import React, { useState } from 'react';
import axios from '../axios';
import './Home.css';

const Home = () => {
  const [message, setMessage] = useState('');
  const [packClaimed, setPackClaimed] = useState(false);
  const [loading, setLoading] = useState(false);  // 🔥 NEW

  const claimDailyPack = async () => {
    try {
      setLoading(true);  // 🔥 Start spinning
      const token = localStorage.getItem('access_token');
      const res = await axios.post('/api/profile/daily-pack/', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(res.data.message);
      setPackClaimed(true);
    } catch (err) {
      console.error('Failed to claim daily pack:', err);
      setMessage('Failed to claim daily pack.');
    } finally {
      setLoading(false); // 🔥 Stop spinning
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
          alt="Pokeball" 
          className={`home-pokeball ${loading ? 'spinning' : ''}`}  // 🔥 Conditional spin
        />
        <h1 className="home-title">Welcome to PokeTrade! 🟡</h1>
        <p className="home-subtitle">Trade, collect, and explore Pokémon cards.</p>

        <button 
          onClick={claimDailyPack} 
          className="daily-pack-button"
          disabled={packClaimed || loading}
        >
          {packClaimed ? "🎉 Daily Pack Claimed!" : "🎁 Claim Your Daily Pack"}
        </button>

        {message && <p className="home-message">{message}</p>}
      </div>
    </div>
  );
};

export default Home;

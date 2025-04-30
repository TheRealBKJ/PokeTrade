// frontend/src/pages/Home.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../axios';
import './Home.css';

const Home = () => {
  const [message, setMessage] = useState('');
  const [packClaimed, setPackClaimed] = useState(false);
  const [loading, setLoading] = useState(false);

  const claimDailyPack = async () => {
    setLoading(true);
    try {
      // POST http://localhost:8000/api/profiles/daily-pack/
      const res = await api.post('profiles/daily-pack/');
      setMessage(
        res.data.message +
          (res.data.new_card ? ` You got: ${res.data.new_card}` : '')
      );
      setPackClaimed(true);
    } catch (err) {
      console.error('Failed to claim daily pack:', err);
      setMessage(err.response?.data?.error || 'Failed to claim daily pack!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          alt="Pokeball"
          className={`home-pokeball ${loading ? 'spinning' : ''}`}
        />

        <h1 className="home-title">Welcome to PokeTrade!</h1>
        <p className="home-subtitle">
          Trade, collect, and explore Pokémon cards.
        </p>

        <div className="home-buttons">
          <button
            onClick={claimDailyPack}
            className="home-button"
            disabled={packClaimed || loading}
          >
            {loading
              ? 'Loading…'
              : packClaimed
              ? 'Daily Pack Claimed!'
              : 'Claim Daily Pack'}
          </button>

          <Link to="/profile" className="home-button">
            My Profile
          </Link>
          <Link to="/daily-challenges" className="home-button">
            Daily Challenges
          </Link>
          <Link to="/notifications" className="home-button">
            Notifications
          </Link>
        </div>

        {message && <div className="home-message">{message}</div>}
      </div>
    </div>
  );
};

export default Home;

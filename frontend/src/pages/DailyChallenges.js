// frontend/src/pages/DailyChallenges.js
import React, { useEffect, useState } from 'react';
import api from '../axios';
import './DailyChallenges.css';

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch today's challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // GET http://localhost:8000/api/challenges/daily/
        const res = await api.get('challenges/daily/');
        setChallenges(res.data);
      } catch (err) {
        console.error('Failed to fetch daily challenges:', err);
        alert('Unable to load daily challenges.');
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  // Claim a completed challenge
  const claimChallenge = async (challengeId) => {
    try {
      // POST http://localhost:8000/api/challenges/claim/<id>/
      await api.post(`challenges/claim/${challengeId}/`);
      // update local state
      setChallenges(challenges.map(c =>
        c.id === challengeId ? { ...c, claimed: true } : c
      ));
      alert('Challenge claimed! Check your profile for rewards.');
    } catch (err) {
      console.error('Failed to claim challenge:', err);
      alert(err.response?.data?.error || 'Could not claim challenge.');
    }
  };

  if (loading) {
    return <p>Loading challenges…</p>;
  }

  if (!challenges.length) {
    return <p>No challenges available today.</p>;
  }

  return (
    <div className="daily-challenges-page">
      <h1>Daily Challenges</h1>
      <ul className="challenge-list">
        {challenges.map(ch => (
          <li key={ch.id} className={`challenge-item ${ch.claimed ? 'claimed' : ''}`}>
            <div className="challenge-info">
              <h2>{ch.name}</h2>
              <p>{ch.description}</p>
              <small>Reward: {ch.reward} 🪙</small>
            </div>
            {ch.completed && !ch.claimed ? (
              <button
                className="claim-btn"
                onClick={() => claimChallenge(ch.id)}
              >
                Claim
              </button>
            ) : ch.claimed ? (
              <span className="claimed-label">✔ Claimed</span>
            ) : (
              <span className="incomplete-label">Incomplete</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyChallenges;

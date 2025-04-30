// frontend/src/pages/DailyChallenges.js
import React, { useEffect, useState } from 'react';
import api from '../axios';
import './DailyChallenges.css';

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch today's challenges on mount
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
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

  // Complete a challenge
  const completeChallenge = async (id) => {
    try {
      const res = await api.patch(`challenges/complete/${id}/`);
      alert(res.data.message); // show earned coins
      setChallenges(challenges.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to complete challenge:', err);
      alert(err.response?.data?.error || 'Could not complete challenge.');
    }
  };

  if (loading) return <p>Loading challenges…</p>;

  if (!challenges.length) {
    return (
      <div className="all-complete">
        🎉 All done for today!<br/>
        Check your notifications for new challenges.
      </div>
    );
  }

  return (
    <div className="daily-challenges-page">
      <h1>Daily Challenges</h1>
      <ul className="challenge-list">
        {challenges.map(ch => (
          <li key={ch.id} className="challenge-item">
            <div className="challenge-info">
              <h2>{ch.name}</h2>
              <p>{ch.description}</p>
              <small>Reward: {ch.reward} 🪙</small>
            </div>
            <button
              className="complete-btn"
              onClick={() => completeChallenge(ch.id)}
            >
              Complete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyChallenges;

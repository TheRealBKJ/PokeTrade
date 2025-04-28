import React, { useState, useEffect } from 'react';
import axios from '../axios';
import './DailyChallenges.css'; // Custom CSS styling for the page

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('/api/challenges/daily/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChallenges(res.data);
      } catch (err) {
        console.error('Failed to fetch challenges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const handleClaimReward = async (challengeId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`/api/challenges/claim/${challengeId}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Reward claimed successfully!');
      setChallenges(prevChallenges => prevChallenges.map(challenge =>
        challenge.id === challengeId ? { ...challenge, claimed: true } : challenge
      ));
    } catch (err) {
      console.error('Failed to claim challenge reward:', err);
      alert('Error claiming reward.');
    }
  };

  if (loading) return <p>Loading challenges...</p>;

  return (
    <div className="challenges-container">
      <h2>Daily Challenges</h2>
      {challenges.length === 0 ? (
        <p>No daily challenges available.</p>
      ) : (
        <div className="challenge-list">
          {challenges.map(challenge => (
            <div key={challenge.id} className="challenge-item">
              <h3>{challenge.challenge.name}</h3>
              <p>{challenge.challenge.description}</p>
              <p>Reward: {challenge.challenge.reward_amount} Currency</p>
              <p>Status: {challenge.completed ? (challenge.claimed ? 'Claimed' : 'Completed') : 'Not completed'}</p>
              <button
                onClick={() => handleClaimReward(challenge.id)}
                disabled={challenge.claimed || !challenge.completed}
              >
                {challenge.claimed ? 'Claimed' : 'Claim Reward'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyChallenges;

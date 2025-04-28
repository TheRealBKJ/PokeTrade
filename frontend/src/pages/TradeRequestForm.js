import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios';
import './TradeRequestForm.css';

const TradeRequestForm = () => {
  const { state } = useLocation();  // expects ownerId and cardId from the previous page
  const navigate = useNavigate();

  const [myCards, setMyCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState('');

  useEffect(() => {
    const fetchMyCollection = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('/usercollections/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyCards(res.data);
      } catch (err) {
        console.error('Error fetching your collection:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCollection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCardId) {
      alert('Please select a card to offer.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      await axios.post('/api/trades/', {
        recipient: state.ownerId,
        offered_card_id: selectedCardId,
        requested_card_id: state.cardId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Trade offer sent successfully!');
      navigate('/trade/requests');
    } catch (err) {
      console.error('Error sending trade:', err);
      alert('Failed to send trade offer.');
    }
  };

  if (loading) return <p>Loading your collection...</p>;

  return (
    <div className="trade-request-form">
      <h1>Propose a Trade</h1>

      <form onSubmit={handleSubmit}>
        <label>Select one of your cards to offer:</label>
        <select
          value={selectedCardId}
          onChange={(e) => setSelectedCardId(e.target.value)}
        >
          <option value="">-- Select a Card --</option>
          {myCards.map(card => (
            <option key={card.id} value={card.id}>
              {card.card_name}
            </option>
          ))}
        </select>

        <button type="submit">Send Trade Offer</button>
      </form>
    </div>
  );
};

export default TradeRequestForm;

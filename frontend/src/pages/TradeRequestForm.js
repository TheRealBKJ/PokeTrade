// frontend/src/pages/TradeRequestForm.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios';
import './TradeRequestForm.css';

const TradeRequestForm = () => {
  const { state } = useLocation();  // expects { ownerId, cardId }
  const navigate = useNavigate();

  const [myCards, setMyCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // GET /api/usercollections/
        const res = await axios.get('usercollections/');
        setMyCards(res.data);
      } catch (err) {
        console.error('Fetch collection error:', err.message, err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCardId) {
      return alert('Please select a card to offer.');
    }

    try {
      // POST /api/trades/
      const resp = await axios.post('trades/', {
        recipient: state.ownerId,
        offered_card_id: selectedCardId,
        requested_card_id: state.cardId,
      });
      console.log('Trade created:', resp.data);
      alert('✅ Trade offer sent successfully!');
      navigate('/trade/requests');
    } catch (err) {
      // If err.response is undefined, it was a network/CORS error
      console.error(
        'Send trade error:',
        err.message,
        err.request,    // the raw request object (no response)
        err.response    // will be undefined on network errors
      );
      const status = err.response?.status ?? 'NO_RESPONSE';
      const data = err.response?.data
        ? JSON.stringify(err.response.data)
        : '—';
      alert(`❌ Failed to send trade: ${status} — ${data}\n\n(Network error if NO_RESPONSE)`);
    }
  };

  if (loading) return <p>Loading your collection…</p>;

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
          {myCards.map((card) => (
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

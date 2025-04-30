import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';
import './TradeRequestForm.css';

export default function TradeRequestForm() {
  const { ownerId, cardId } = useParams();
  const navigate = useNavigate();

  const [myCards,       setMyCards]       = useState([]);
  const [requestedCard, setRequestedCard] = useState(null);
  const [selectedId,    setSelectedId]    = useState(null);
  const [loading,       setLoading]       = useState(true);

  // load your cards
  useEffect(() => {
    axios.get('usercollections/')
      .then(res => {
        setMyCards(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // load requested card info
  useEffect(() => {
    axios.get('usercollections/all/')
      .then(res => {
        const found = res.data.find(
          c => c.card_id === cardId && c.user === ownerId
        );
        setRequestedCard(found);
      })
      .catch(() => {});
  }, [ownerId, cardId]);

  const handleSubmit = async () => {
    if (!selectedId) return alert('Select a card to offer.');
    try {
      await axios.post('trades/', {
        offered_card_id:   selectedId,
        requested_card_id: cardId,
      });
      alert('✅ Trade request sent!');
      navigate('/trade/requests');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to send trade.');
    }
  };

  return (
    <div className="trf">
      <h2 className="trf__title">Request Trade</h2>

      {requestedCard ? (
        <div className="trf__requested">
          <img
            src={requestedCard.card_image_url}
            alt={requestedCard.card_name}
            className="trf__req-img"
          />
          <div className="trf__req-info">
            <h3>{requestedCard.card_name}</h3>
            <p>#{requestedCard.card_id}</p>
            <p>Owner: <strong>{requestedCard.user}</strong></p>
          </div>
        </div>
      ) : (
        <p className="trf__status">Requesting #{cardId} from {ownerId}</p>
      )}

      <h3 className="trf__sub">Select one of your cards to offer</h3>

      {loading ? (
        <p className="trf__status">Loading your cards…</p>
      ) : myCards.length ? (
        <div className="trf__grid">
          {myCards.map(c => (
            <div
              key={c.id}
              className={`trf__card ${selectedId === c.card_id ? 'selected' : ''}`}
              onClick={() => setSelectedId(c.card_id)}
            >
              <img
                src={c.card_image_url}
                alt={c.card_name}
                className="trf__img"
              />
              <p className="trf__name">{c.card_name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="trf__status">You have no cards to offer.</p>
      )}

      <button
        onClick={handleSubmit}
        className="trf__btn"
        disabled={!selectedId}
      >
        Send Request
      </button>
    </div>
  );
}

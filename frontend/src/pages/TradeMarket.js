import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import './Trademarket.css';

export default function TradeMarket() {
  const [cards,   setCards]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('usercollections/all/')
      .then(res => {
        setCards(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Marketplace load error:', err);
        setError('Could not load cards.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="tm__status">Loading marketplace…</p>;
  if (error)   return <p className="tm__status tm__error">{error}</p>;
  if (!cards.length) return <p className="tm__status">No cards in the marketplace.</p>;

  return (
    <div className="tm">
      <h2 className="tm__title">PokéTrade Marketplace</h2>
      <div className="tm__grid">
        {cards.map(card => (
          <div
            key={card.id}
            className="tm__card"
            onClick={() => navigate(`/trade/new/${card.user}/${card.card_id}`)}
          >
            <div className="tm__img-wrap">
              <img
                src={card.card_image_url}
                alt={card.card_name}
                className="tm__img"
              />
            </div>
            <div className="tm__info">
              <h3 className="tm__name">{card.card_name}</h3>
              <p className="tm__meta">#{card.card_id}</p>
              <p className="tm__meta">Owner: <strong>{card.user}</strong></p>
            </div>
            <div className="tm__actions">
              <button className="tm__btn">Request Trade</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

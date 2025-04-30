import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './TradeRequests.css';

export default function TradeRequests() {
  const [trades, setTrades]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    let myId;
    // 1) fetch your user ID
    axios.get('users/profile/')
      .then(res => {
        myId = res.data.id;
        // 2) fetch all pending trades
        return axios.get('trades/?pending=1');
      })
      .then(res => {
        // 3) filter to only the ones you initiated
        const outgoing = res.data.filter(t => t.trader === myId);
        setTrades(outgoing);
      })
      .catch(err => {
        console.error('Error loading outgoing trades:', err);
        setError('Failed to load your outgoing trades.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleRescind = (tradeId) => {
    axios.post(`trades/${tradeId}/reject/`)
      .then(() => {
        setTrades(ts => ts.filter(t => t.id !== tradeId));
      })
      .catch(err => {
        console.error('Failed to rescind trade:', err);
        alert('❌ Could not rescind this trade.');
      });
  };

  // build image URL from card_id like "bw1-3"
  const imgUrl = (cardId) => {
    const [set, num] = cardId.split('-');
    return `https://images.pokemontcg.io/${set}/${num}.png`;
  };

  if (loading) return <p className="trr__status">Loading your outgoing trades…</p>;
  if (error)   return <p className="trr__status trr__error">{error}</p>;
  if (!trades.length) return <p className="trr__status">You have no pending outgoing trades.</p>;

  return (
    <div className="trr">
      <h2 className="trr__title">My Outgoing Trades</h2>
      <div className="trr__grid">
        {trades.map(tr => (
          <div key={tr.id} className="trr__card">
            <div className="trr__images">
              <div className="trr__img-wrap">
                <img
                  src={imgUrl(tr.offered_card_id)}
                  alt={tr.offered_card_id}
                  className="trr__img"
                />
                <span className="trr__label">Offered</span>
              </div>
              <div className="trr__img-wrap">
                <img
                  src={imgUrl(tr.requested_card_id)}
                  alt={tr.requested_card_id}
                  className="trr__img"
                />
                <span className="trr__label">Requested</span>
              </div>
            </div>
            <p className="trr__trade-id">Trade #{tr.id}</p>
            <button
              className="trr__btn trr__btn--rescind"
              onClick={() => handleRescind(tr.id)}
            >
              Rescind
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

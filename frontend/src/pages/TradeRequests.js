import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './TradeRequests.css';

export default function TradeRequests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const imgUrl = (cardId) => {
    const [set, num] = cardId.split('-');
    return `https://images.pokemontcg.io/${set}/${num}.png`;
  };

  useEffect(() => {
    let myId;

    axios.get('users/profile/')
      .then(res => {
        myId = res.data.id;
        return axios.get('trades/?pending=1');
      })
      .then(res => {
        const all = res.data;

        const outgoing = all.filter(t => t.trader === myId);
        const incoming = all.filter(t => t.trader !== myId && (!t.recipient || t.recipient === myId));

        setIncoming(incoming);
        setOutgoing(outgoing);
      })
      .catch(err => {
        console.error('Error loading trades:', err);
        setError('Failed to load trade requests.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRescind = (id) => {
    axios.post(`trades/${id}/reject/`)
      .then(() => setOutgoing(out => out.filter(t => t.id !== id)))
      .catch(() => alert('❌ Could not rescind this trade.'));
  };

  const handleAccept = (id) => {
    axios.post(`trades/${id}/accept/`)
      .then(() => setIncoming(trades => trades.filter(t => t.id !== id)))
      .catch(() => alert('❌ Could not accept this trade.'));
  };

  const handleReject = (id) => {
    axios.post(`trades/${id}/reject/`)
      .then(() => setIncoming(trades => trades.filter(t => t.id !== id)))
      .catch(() => alert('❌ Could not reject this trade.'));
  };

  if (loading) return <p className="trr__status">Loading your trades…</p>;
  if (error)   return <p className="trr__status trr__error">{error}</p>;

  return (
    <div className="trr">
      <h2 className="trr__title">📥 Incoming Trades</h2>
      {incoming.length === 0 ? (
        <p className="trr__status">No incoming requests.</p>
      ) : (
        <div className="trr__grid">
          {incoming.map(tr => (
            <div key={tr.id} className="trr__card">
              <div className="trr__images">
                <div className="trr__img-wrap">
                  <img src={imgUrl(tr.offered_card_id)} alt="offered" className="trr__img" />
                  <span className="trr__label">Offered to You</span>
                </div>
                <div className="trr__img-wrap">
                  <img src={imgUrl(tr.requested_card_id)} alt="requested" className="trr__img" />
                  <span className="trr__label">Your Card</span>
                </div>
              </div>
              <p className="trr__trade-id">Trade #{tr.id}</p>
              <div className="trr__actions">
                <button onClick={() => handleAccept(tr.id)} className="trr__btn trr__btn--accept">Accept</button>
                <button onClick={() => handleReject(tr.id)} className="trr__btn trr__btn--reject">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="trr__title">📤 Outgoing Trades</h2>
      {outgoing.length === 0 ? (
        <p className="trr__status">No outgoing requests.</p>
      ) : (
        <div className="trr__grid">
          {outgoing.map(tr => (
            <div key={tr.id} className="trr__card">
              <div className="trr__images">
                <div className="trr__img-wrap">
                  <img src={imgUrl(tr.offered_card_id)} alt="offered" className="trr__img" />
                  <span className="trr__label">You Offered</span>
                </div>
                <div className="trr__img-wrap">
                  <img src={imgUrl(tr.requested_card_id)} alt="requested" className="trr__img" />
                  <span className="trr__label">Requested</span>
                </div>
              </div>
              <p className="trr__trade-id">Trade #{tr.id}</p>
              <button onClick={() => handleRescind(tr.id)} className="trr__btn trr__btn--rescind">Rescind</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

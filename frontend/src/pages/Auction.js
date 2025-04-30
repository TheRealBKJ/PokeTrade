// frontend/src/pages/Auction.js
import React, { useEffect, useState } from 'react';
import api from '../axios';
import './Auction.css';

export default function Auction() {
  const [auctions, setAuctions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [balance,  setBalance]  = useState(null);
  const [bids,     setBids]     = useState({});

  useEffect(() => {
    (async () => {
      try {
        const [aucRes, profRes] = await Promise.all([
          api.get('marketplace/auctions/'),
          api.get('users/profile/')
        ]);
        setAuctions(aucRes.data);
        setBalance(profRes.data.currency_balance);
      } catch {
        setError('Failed to load auctions.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (id, val) => {
    setBids(bs => ({ ...bs, [id]: val }));
  };

  const placeBid = async (id, current) => {
    const amt = parseInt(bids[id], 10);
    if (isNaN(amt)) {
      alert('Enter a valid number.');
      return;
    }
    if (amt <= current) {
      alert(`Bid must exceed ${current}.`);
      return;
    }
    if (balance !== null && amt > balance) {
      alert('Not enough coins.');
      return;
    }
    try {
      await api.post(`marketplace/auctions/${id}/bid/`, { amount: amt });
      const [aucRes, profRes] = await Promise.all([
        api.get('marketplace/auctions/'),
        api.get('users/profile/')
      ]);
      setAuctions(aucRes.data);
      setBalance(profRes.data.currency_balance);
      setBids(bs => ({ ...bs, [id]: '' }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to place bid.');
    }
  };

  if (loading) return <p>Loading auctions…</p>;
  if (error)   return <p style={{color:'red'}}>{error}</p>;
  if (!auctions.length) return <p>No active auctions.</p>;

  return (
    <div className="auction-grid">
      {auctions.map(a => (
        <div key={a.id} className="auction-card">
          <img src={a.card_image_url} alt={a.card_name} className="auction-img" />
          <h3>{a.card_name}</h3>
          <p>Current Bid: {a.current_price} 🪙</p>
          <p>Ends: {new Date(a.end_time).toLocaleString()}</p>
          {balance !== null && <p>Your Balance: {balance} 🪙</p>}
          <input
            type="number"
            min={a.current_price + 1}
            placeholder={`>= ${a.current_price + 1}`}
            value={bids[a.id] || ''}
            onChange={e => handleChange(a.id, e.target.value)}
            className="auction-input"
          />
          <button
            className="auction-btn"
            onClick={() => placeBid(a.id, a.current_price)}
          >
            Place Bid
          </button>
        </div>
      ))}
    </div>
  );
}

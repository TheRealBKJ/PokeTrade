import React, { useEffect, useState } from 'react';
import api from '../axios'; // ✅ use your local axios instance
import './Auction.css';

const Auction = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const res = await api.get('/auctions/');
      setAuctions(res.data);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (id) => {
    if (!window.confirm('Are you sure you want to buy this card?')) return;
    try {
      await api.post(`/auctions/${id}/buy/`);
      alert('Purchase successful!');
      fetchAuctions();
    } catch (err) {
      console.error('Buy error:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Failed to buy card.');
    }
  };

  if (loading) return <p>Loading auctions...</p>;

  return (
    <div className="auction-page">
      <h1>Pokémon Auctions</h1>
      {auctions.length === 0 ? (
        <p>No auctions available right now.</p>
      ) : (
        <div className="auction-list">
          {auctions.map((auction) => (
            <div key={auction.id} className="auction-card">
              <img src={auction.card_image_url} alt={auction.card_name} />
              <h3>{auction.card_name}</h3>
              <p>Price: {auction.price} Coins</p>
              <button onClick={() => handleBuy(auction.id)}>Buy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Auction;

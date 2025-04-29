import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Auction.css';

export default function Auction() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await axios.get('/api/auctions/');
      setAuctions(response.data);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    }
  };

  const handlePlaceBid = async (id, currentBid) => {
    const newBid = prompt('Enter your bid amount:');
    const bidAmount = parseFloat(newBid);

    if (isNaN(bidAmount) || bidAmount <= 0) {
      alert('Please enter a valid positive number.');
      return;
    }
    if (bidAmount <= currentBid) {
      alert('Your bid must be higher than the current highest bid!');
      return;
    }

    try {
      // You may need to add Authorization headers if login required
      await axios.patch(`/api/auctions/${id}/`, { highest_bid: bidAmount });
      fetchAuctions(); // refresh auctions after bidding
      alert('Bid placed successfully!');
    } catch (error) {
      console.error('Failed to place bid:', error);
      alert('Something went wrong placing your bid.');
    }
  };

  return (
    <div className="auction-page">
      <div className="auction-container">
        <h1 className="auction-title">Pokémon Auctions</h1>
        <p className="auction-description">
          Bid on rare Pokémon and grow your collection!
        </p>

        <div className="auction-list">
          {auctions.map((auction) => (
            <div key={auction.id} className="auction-card">
              <h2 className="auction-pokemon">{auction.pokemon_name}</h2>
              <p className="auction-bid">Highest Bid: ${auction.highest_bid}</p>
              <button
                className="bid-button"
                onClick={() => handlePlaceBid(auction.id, auction.highest_bid)}
              >
                Place a Bid
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

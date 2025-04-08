// src/pages/TradeMarket.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Trademarket.css'; // Import the styles

const TradeMarket = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios
      .get('https://api.pokemontcg.io/v2/cards', {
        headers: {
          'X-Api-Key': 'YOUR_API_KEY_HERE', // Replace this!
        },
        params: {
          pageSize: 20,
        },
      })
      .then((res) => setCards(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page">
      <h1>Trade Market</h1>
      <div className="trade-grid">
        {cards.map((card) => (
        <div className="card-tile" key={card.id}>
          <img src={card.images.small} alt={card.name} />
          <h3 className="card-name">{card.name}</h3>
        </div>
        
        ))}
      </div>
    </div>
  );
};

export default TradeMarket;


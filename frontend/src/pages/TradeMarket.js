import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TradeMarket = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios
      .get('https://api.pokemontcg.io/v2/cards', {
        headers: {
          'X-Api-Key': 'YOUR_API_KEY_HERE',
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
      <div className="card-grid">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <img src={card.images.small} alt={card.name} />
            <h3>{card.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeMarket;


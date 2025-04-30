import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { Link } from 'react-router-dom';
import './TradeMarket.css'; // Import the styles

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
          <h3 className="card-name">
          <Link
            to={`/pokemon/${encodeURIComponent(
              card.name
                .replace(/\b(GX|VSTAR|V|EX)\b/gi, "")
                .trim()
                .toLowerCase()
            )}?cardName=${encodeURIComponent(card.name)}`}
          >
            {card.name}
          </Link>
          </h3>
        </div>
        ))}
      </div>
    </div>
  );
};

export default TradeMarket;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Collections.css'; // If you want custom styling

const Collection = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8000/collection/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCards(res.data);
      } catch (err) {
        console.error('Error fetching collection:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  if (loading) return <p>Loading your collection...</p>;

  if (cards.length === 0) {
    return <p>You have no Pokémon in your collection yet!</p>;
  }

  return (
    <div className="collection-page">
      <h1>My Pokémon Collection</h1>
      <div className="collection-grid">
        {cards.map((card) => (
          <div key={card.id} className="card-item">
            <img src={card.card_image} alt={card.card_name} className="card-image" />
            <h3 className="card-name">{card.card_name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;

import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './Collections.css'; // Optional for styling

const Collection = () => {
  const [myCards, setMyCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('api/collection/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMyCards(res.data);
      } catch (err) {
        console.error('Error fetching collection:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  if (loading) return <p>Loading your collection...</p>;

  return (
    <div className="collection-page">
      <h1>My Pokémon Collection</h1>
      {myCards.length === 0 ? (
        <p>You have no Pokémon cards yet! Go get some from the Marketplace!</p>
      ) : (
        <div className="collection-grid">
          {myCards.map(card => (
            <div key={card.id} className="collection-card">
              <img src={card.card_image_url} alt={card.card_name} />
              <h3>{card.card_name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;

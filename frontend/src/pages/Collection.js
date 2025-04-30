import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './Collections.css';

const Collection = () => {
  const [myCards, setMyCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('/usercollections/', {
          headers: { Authorization: `Bearer ${token}` }
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

  const handleSell = async (cardId) => {
    if (!window.confirm('Sell this card for 20 coins?')) return;
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.post(
        `/usercollections/${cardId}/sell/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Sold for ${res.data.amount} coins! New balance: ${res.data.new_balance}`);
      setMyCards(prev => prev.filter(card => card.id !== cardId));
    } catch (err) {
      console.error('Failed to sell card:', err);
      alert('Error selling card.');
    }
  };

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
              <h3>
                <a
                  href={`/collection/pokemon/${encodeURIComponent(
                    card.card_name.replace(/\b(GX|VSTAR|V|EX)\b/gi, "").trim().toLowerCase()
                  )}?cardName=${encodeURIComponent(card.card_name)}`}
                >
                  {card.card_name}
                </a>
              </h3>
              <button
                className="sell-button"
                onClick={() => handleSell(card.id)}
              >
                Sell for 20 Coins
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;

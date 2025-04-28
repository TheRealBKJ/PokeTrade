import React, { useState, useEffect } from 'react';
import axios from '../axios';
import './BrowseCollections.css';

const BrowseCollections = () => {
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get('/usercollections/all/');
        setCollections(res.data);
      } catch (err) {
        console.error('Failed to fetch collections:', err);
      }
    };

    fetchCollections();
  }, []);

  // Filter collections based on the search query
  const filteredCollections = collections.filter((card) =>
    card.card_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="browse-container">
      <h2>Browse All Pokémon Collections</h2>

      {/* 🔥 Search Bar */}
      <input
        type="text"
        placeholder="Search by Pokémon name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <div className="collection-grid">
        {filteredCollections.length > 0 ? (
          filteredCollections.map((card) => (
            <div key={card.id} className="card-item">
              <img src={card.card_image_url} alt={card.card_name} />
              <p>{card.card_name}</p>
              <p><strong>Owner:</strong> {card.user}</p> {/* optional if you add usernames */}
            </div>
          ))
        ) : (
            <div className="no-results">
            <p>No matching Pokémon found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCollections;

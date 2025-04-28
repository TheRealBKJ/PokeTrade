import React, { useState, useEffect } from 'react';
import axios from '../axios';
import './BrowseCollections.css';

const BrowseCollections = () => {
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUser, setFilterUser] = useState(''); // 🔥 Added

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

  // ✅ Filter collections based on searchQuery and filterUser
  const filteredCollections = collections.filter((card) =>
    card.card_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterUser === '' || (card.user && card.user.toLowerCase().includes(filterUser.toLowerCase())))
  );

  return (
    <div className="browse-container">
      <h2>Browse All Pokémon Collections</h2>

      {/* 🔥 Search Bars */}
      <div className="search-bars">
        <input
          type="text"
          placeholder="Search by Pokémon name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />

        <input
          type="text"
          placeholder="Filter by Trainer (username)..."
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="search-bar"
          style={{ marginTop: '10px' }}
        />
      </div>

      <div className="collection-grid">
        {filteredCollections.length > 0 ? (
          filteredCollections.map((card) => (
            <div key={card.id} className="card-item">
              <img src={card.card_image_url} alt={card.card_name} />
              <p>{card.card_name}</p>
              {card.user && <p><strong>Owner:</strong> {card.user}</p>}
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

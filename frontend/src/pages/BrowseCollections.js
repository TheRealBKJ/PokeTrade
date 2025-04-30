import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';  // ✅ import navigate
import './BrowseCollections.css';

const BrowseCollections = () => {
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedOwner, setSelectedOwner] = useState('');
  const navigate = useNavigate(); // ✅ useNavigate hook
  const currentUser = localStorage.getItem('user_id'); // ✅ get current user

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

  const filteredCollections = collections
    .filter(card =>
      card.card_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(card =>
      selectedOwner ? card.user === selectedOwner : true
    );

  const sortedCollections = [...filteredCollections].sort((a, b) => {
    if (sortOrder === 'newest') return b.id - a.id;
    if (sortOrder === 'oldest') return a.id - b.id;
    if (sortOrder === 'az') return a.card_name.localeCompare(b.card_name);
    if (sortOrder === 'za') return b.card_name.localeCompare(a.card_name);
    return 0;
  });

  const owners = [...new Set(collections.map(card => card.user))];

  return (
    <div className="browse-container">
      <h2>Browse All Pokémon Collections</h2>

      <input
        type="text"
        placeholder="Search by Pokémon name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="dropdown"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="az">A–Z Name</option>
        <option value="za">Z–A Name</option>
      </select>

      <select
        value={selectedOwner}
        onChange={(e) => setSelectedOwner(e.target.value)}
        className="dropdown"
      >
        <option value="">All Users</option>
        {owners.map((owner) => (
          <option key={owner} value={owner}>
            {owner}
          </option>
        ))}
      </select>

      <div className="collection-grid">
        {sortedCollections.length > 0 ? (
          sortedCollections.map((card) => (
            <div key={card.id} className="card-item">
              <img src={card.card_image_url} alt={card.card_name} />
              <p>{card.card_name}</p>
              <p><strong>Owner:</strong> {card.user}</p>

              {card.user !== currentUser && (
                <button
                  onClick={() =>
                    navigate(`/trade/new/${card.user}/${card.card_id}`)
                  }
                >
                  Propose Trade
                </button>
              )}
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

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // (we'll create this for styling)

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to PokeTrade! 🧢</h1>
        <p>Trade, collect, and explore the Pokémon world.</p>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          alt="Pikachu"
          className="home-image"
        />
        <Link to="/trade" className="home-button">
          Explore Marketplace
        </Link>
      </div>
    </div>
  );
};

export default Home;

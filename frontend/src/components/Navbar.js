// src/components/NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { SiPokemon } from 'react-icons/si';
import './Navbar.css';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="logo">
        <SiPokemon className="pokeball-icon" />
        PokeTrade
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
        <li><Link to="/trade" onClick={toggleMenu}>Trade</Link></li>
        <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>
        <li className="dropdown">
          <span>User ▼</span>
          <ul className="dropdown-content">
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

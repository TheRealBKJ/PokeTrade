// src/components/NavBar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaTimes } from 'react-icons/fa';
import { SiPokemon } from 'react-icons/si';
import './Navbar.css';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState('');

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:8000/api/users/profile/', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUsername(res.data.username);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        }
      }
    };

    fetchProfile();
  }, []);

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
        <li><Link to="/collection" onClick={toggleMenu}>Collection</Link></li>
        <li><Link to="/trade" onClick={toggleMenu}>Marketplace</Link></li>
        <li><Link to="/trade/requests" onClick={toggleMenu}>Trade Requests</Link></li>
        <li><Link to="/trade/new" onClick={toggleMenu}>Make a Trade</Link></li>
        <li><Link to="/notifications" onClick={toggleMenu}>Notifications</Link></li>
        <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>

        <li className="dropdown">
          <span>User ▼</span>
          <ul className="dropdown-content">
            {username ? (
              <>
                <li style={{ fontWeight: 'bold', textAlign: 'center' }}>Welcome, {username}</li>
                <li><Link to="/settings" onClick={toggleMenu}>Settings</Link></li>
                <li><Link to="/logout" onClick={toggleMenu}>Logout</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                <li><Link to="/register" onClick={toggleMenu}>Register</Link></li>
              </>
            )}
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

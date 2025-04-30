// frontend/src/components/NavBar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axios';
import { FaBars, FaTimes } from 'react-icons/fa';
import { SiPokemon } from 'react-icons/si';
import './Navbar.css';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currencyBalance, setCurrencyBalance] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleNav = (e, path, authRequired = false) => {
    e.preventDefault();
    setMenuOpen(false);
    if (authRequired && !token) {
      navigate('/login', { replace: true });
    } else {
      navigate(path);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('access_token');
    setMenuOpen(false);
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const { data: curr } = await axios.get('/api/profile/currency/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrencyBalance(curr.currency_balance);
      } catch (err) {
        console.error('Failed to fetch currency:', err);
      }
    })();
  }, [token]);

  return (
    <nav className="navbar">
      <div className="logo">
        <SiPokemon className="pokeball-icon" />
        PokeTrade
      </div>

      {currencyBalance !== null && (
        <div className="currency-display">
          💰 {currencyBalance} Coins
        </div>
      )}

      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" onClick={(e) => handleNav(e, '/', false)}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/collection" onClick={(e) => handleNav(e, '/collection', true)}>
            Collection
          </Link>
        </li>
        <li>
          <Link to="/daily-challenges" onClick={(e) => handleNav(e, '/daily-challenges', true)}>
            Daily Challenges
          </Link>
        </li>
        <li>
          <Link to="/browse" onClick={(e) => handleNav(e, '/browse', true)}>
            Browse Collections
          </Link>
        </li>
        <li>
          <Link to="/trade" onClick={(e) => handleNav(e, '/trade', true)}>
            Marketplace
          </Link>
        </li>
        <li>
          <Link to="/trade/requests" onClick={(e) => handleNav(e, '/trade/requests', true)}>
            Trade Requests
          </Link>
        </li>
        <li>
          <Link to="/auctions" onClick={(e) => handleNav(e, '/auctions', true)}>
            Auction
          </Link>
        </li>
        <li>
          <Link to="/trade/history" onClick={(e) => handleNav(e, '/trade/history', true)}>
            Trade History
          </Link>
        </li>
        <li>
          <Link to="/messages" onClick={(e) => handleNav(e, '/messages', true)}>
            Messages
          </Link>
        </li>
        <li>
          <Link to="/notifications" onClick={(e) => handleNav(e, '/notifications', true)}>
            Notifications
          </Link>
        </li>
        <li>
          <Link to="/profile" onClick={(e) => handleNav(e, '/profile', true)}>
            Profile
          </Link>
        </li>
        <li>
          {token ? (
            <a href="/logout" onClick={handleLogout}>
              Sign Out
            </a>
          ) : (
            <Link to="/login" onClick={toggleMenu}>
              Sign In
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

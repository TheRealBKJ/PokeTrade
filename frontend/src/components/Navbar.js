import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // optional

const NavBar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">PokeTrade</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/trade">Trade</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;

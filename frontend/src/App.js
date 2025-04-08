import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';

import Home from './pages/Home';
import Profile from './pages/Profile';
import TradeMarket from './pages/TradeMarket';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/trade" element={<TradeMarket />} />
      </Routes>
    </>
  );
}

export default App;

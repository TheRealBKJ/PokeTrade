import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import PokemonDetail from "./pages/PokemonDetail";

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
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </>
  );
}


export default App;

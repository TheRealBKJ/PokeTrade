import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import PrivateRoute from "./components/PrivateRoute";

import Home              from "./pages/Home";
import Login             from "./pages/Login";
import Register          from "./pages/Register";
import Logout            from "./pages/Logout";
import Profile           from "./pages/Profile";
import Settings          from "./pages/Settings";
import NotificationInbox from "./pages/NotificationInbox";
import Collection        from "./pages/Collection";
import BrowseCollections from "./pages/BrowseCollections";
import TradeMarket       from "./pages/TradeMarket";
import TradeRequests     from "./pages/TradeRequests";
import TradeRequestForm  from "./pages/TradeRequestForm";
import TradeHistory      from "./pages/TradeHistory";
import DailyChallenges   from "./pages/DailyChallenges";
import Messages          from "./pages/Messages";
import PokemonDetail     from "./pages/PokemonDetail";
import Auction           from "./pages/Auction";
import CollectionPokemonDetail from "./pages/CollectionPokemonDetail"
import BrowsePokemonDetail from "./pages/BrowsePokemonDetail";

import "./App.css";

const App = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-6">
      <Routes>
        {/* Public */}
        <Route path="/"              element={<Home />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/logout"        element={<Logout />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="/collection/pokemon/:name" element={<CollectionPokemonDetail />} />
        <Route path="/browse/pokemon/:name" element={<BrowsePokemonDetail />} />

        {/* Private */}
        <Route path="/profile"          element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/settings"         element={<PrivateRoute><Settings/></PrivateRoute>} />
        <Route path="/notifications"    element={<PrivateRoute><NotificationInbox/></PrivateRoute>} />
        <Route path="/collection"       element={<PrivateRoute><Collection/></PrivateRoute>} />
        <Route path="/browse"           element={<PrivateRoute><BrowseCollections/></PrivateRoute>} />
        <Route path="/daily-challenges" element={<PrivateRoute><DailyChallenges/></PrivateRoute>} />
        <Route path="/auctions"         element={<PrivateRoute><Auction/></PrivateRoute>} />
        <Route path="/messages"         element={<PrivateRoute><Messages/></PrivateRoute>} />

        {/* Trading */}
        <Route path="/trade"                  element={<TradeMarket />} />
        <Route path="/trade/requests"         element={<PrivateRoute><TradeRequests/></PrivateRoute>} />
        <Route
          path="/trade/new/:ownerId/:cardId"
          element={
            <PrivateRoute>
              <TradeRequestForm />
            </PrivateRoute>
          }
        />

        <Route path="/trade/history"         element={<PrivateRoute><TradeHistory/></PrivateRoute>} />
      </Routes>
    </main>
    <div className="fixed bottom-4 right-4 z-50"><Chatbot /></div>
  </div>
);

export default App;

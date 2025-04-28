import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot"; // 🛠 import Chatbot

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import TradeMarket from "./pages/TradeMarket";
import TradeRequests from "./pages/TradeRequests";
import TradeRequestForm from "./pages/TradeRequestForm";
import PokemonDetail from "./pages/PokemonDetail";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import NotificationInbox from "./pages/NotificationInbox";
import Register from './pages/Register';
import Collection from "./pages/Collection";
import "./App.css"; // Your global styles
import TradeHistory from './pages/TradeHistory';
import BrowseCollections from './pages/BrowseCollections';
import DailyChallenges from './pages/DailyChallenges';
import Messages        from './pages/Messages';
// Wrapper
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />

        {/* Trade Section */}
        <Route path="/trade" element={<TradeMarket />} />
        <Route
          path="/trade/requests"
          element={
            <PrivateRoute>
              <TradeRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/trade/new"
          element={
            <PrivateRoute>
              <TradeRequestForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/trade/history"
          element={
            <PrivateRoute>
              <TradeHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <PrivateRoute>
              <BrowseCollections />
            </PrivateRoute>
          }
        />

        {/* Profile and settings */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationInbox />
            </PrivateRoute>
          }
        />

        {/* Collection */}
        <Route
          path="/collection"
          element={
            <PrivateRoute>
              <Collection />
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          }       
        />

        {/* Daily Challenges */}
        <Route
          path="/daily-challenges"
          element={
            <PrivateRoute>
              <DailyChallenges />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* 🛠 Global floating Chatbot */}
      <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 50 }}>
        <Chatbot />
      </div>
    </>
  );
};

export default App;

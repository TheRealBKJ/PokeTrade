import React from "react";
import {Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

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



// Wrapper
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <>
      <Navbar/>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
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

        {/* Profile & settings (protected) */}
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

        {/* ✅ Notifications */}
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationInbox />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;


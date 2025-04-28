import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './TradeRequests.css';

const TradeRequests = () => {
  const [incomingTrades, setIncomingTrades] = useState([]);
  const [outgoingTrades, setOutgoingTrades] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const userIdFromStorage = localStorage.getItem('user_id');
        setUserId(userIdFromStorage);

        const res = await axios.get('trades/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const incoming = res.data.filter(trade => trade.recipient == userIdFromStorage);
        const outgoing = res.data.filter(trade => trade.trader == userIdFromStorage);

        setIncomingTrades(incoming);
        setOutgoingTrades(outgoing);
      } catch (err) {
        console.error('Error fetching trades:', err);
      }
    };

    fetchTrades();
  }, []);

  const handleAccept = async (tradeId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`trades/${tradeId}/accept/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      window.location.reload();
    } catch (err) {
      console.error('Error accepting trade:', err);
    }
  };

  const handleReject = async (tradeId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`trades/${tradeId}/reject/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      window.location.reload();
    } catch (err) {
      console.error('Error rejecting trade:', err);
    }
  };

  return (
    <div className="trade-requests">
      <h1>My Trade Requests</h1>

      <h2>Incoming Trades</h2>
      {incomingTrades.length === 0 ? (
        <p>No incoming trade offers yet.</p>
      ) : (
        incomingTrades.map(trade => (
          <div key={trade.id} className="trade-card">
            <p><strong>Someone offered:</strong> {trade.offered_card_id}</p>
            <p><strong>They want:</strong> {trade.requested_card_id}</p>
            <p>Status: {trade.status}</p>
            {trade.status === 'pending' && (
              <div>
                <button onClick={() => handleAccept(trade.id)}>Accept</button>
                <button onClick={() => handleReject(trade.id)}>Reject</button>
              </div>
            )}
          </div>
        ))
      )}

      <h2>Outgoing Trades</h2>
      {outgoingTrades.length === 0 ? (
        <p>No outgoing trades yet.</p>
      ) : (
        outgoingTrades.map(trade => (
          <div key={trade.id} className="trade-card">
            <p><strong>You offered:</strong> {trade.offered_card_id}</p>
            <p><strong>You want:</strong> {trade.requested_card_id}</p>
            <p>Status: {trade.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default TradeRequests;

    
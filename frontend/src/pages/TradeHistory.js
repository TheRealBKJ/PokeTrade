import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './TradeHistory.css'; // we'll make this next

const TradeHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCardName = async (cardId) => {
    try {
      const res = await axios.get(`https://api.pokemontcg.io/v2/cards/${cardId}`);
      return res.data.data.name;
    } catch (err) {
      console.error('Failed to fetch card name for', cardId, err);
      return cardId; // fallback if API fails
    }
  };

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('/trades/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const completedTrades = res.data.filter(trade => trade.status !== 'pending');

        // 🔥 Map to fetch names
        const tradesWithNames = await Promise.all(completedTrades.map(async (trade) => {
          const offeredName = await fetchCardName(trade.offered_card_id);
          const requestedName = await fetchCardName(trade.requested_card_id);
          return {
            ...trade,
            offered_card_name: offeredName,
            requested_card_name: requestedName,
          };
        }));

        setHistory(tradesWithNames);
      } catch (err) {
        console.error('Failed to fetch trade history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  if (loading) return <p>Loading trade history...</p>;

  return (
    <div className="trade-history-container">
      <h2>Trade History</h2>
      {history.length === 0 ? (
        <p>No completed trades yet.</p>
      ) : (
        <table className="trade-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Offered Card</th>
              <th>Requested Card</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((trade) => (
              <tr key={trade.id}>
                <td>{new Date(trade.created_at).toLocaleDateString()}</td>
                <td>{trade.offered_card_name}</td>
                <td>{trade.requested_card_name}</td>
                <td style={{ color: trade.status === 'accepted' ? 'green' : 'red' }}>
                  {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TradeHistory;

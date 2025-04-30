import React, { useEffect, useState } from "react";
import axios from "../axios";

export default function TradeRequests() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("trades/");
        setTrades(data);
      } catch (err) {
        console.error("Failed to load trade requests:", err);
        alert("Couldn’t load trade requests.");
      }
    })();
  }, []);

  if (!trades.length) return <p>No trade requests.</p>;
  return (
    <ul className="trade-requests-list">
      {trades.map((t) => (
        <li key={t.id} className="trade-item">
          <strong>#{t.id}</strong> — you offered <em>{t.offered_card_id}</em> for <em>{t.requested_card_id}</em>{" "}
          <span className="text-sm">[{t.status}]</span>
        </li>
      ))}
    </ul>
  );
}

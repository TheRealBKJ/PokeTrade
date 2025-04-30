import React, { useState, useEffect } from "react";
import axios from "../axios";
import { useNavigate, useParams } from "react-router-dom";

export default function TradeRequestForm() {
  const navigate = useNavigate();
  const { ownerId, cardId } = useParams();

  const [myCards, setMyCards]         = useState([]);
  const [selectedCardId, setSelected] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("usercollections/");
        setMyCards(data);
      } catch (err) {
        console.error("Failed to load your cards:", err);
        alert("Unable to load your cards—see console.");
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCardId) {
      alert("Please select one of your cards to offer.");
      return;
    }

    try {
      await axios.post("trades/", {
        recipient:         Number(ownerId),
        offered_card_id:   selectedCardId,
        requested_card_id: cardId,
      });
      alert("✅ Trade offer sent!");
      navigate("/trade/requests");
    } catch (err) {
      console.error("Trade request error:", err);
      const msg =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        err.message ||
        "NO_RESPONSE";
      alert(`❌ Failed to send trade: ${msg}`);
    }
  };

  return (
    <div className="trade-form-container">
      <h2>Propose a Trade</h2>
      {!ownerId || !cardId ? (
        <p style={{ color: "red" }}>
          Missing parameters—go via the “Make a Trade” button on a card detail page.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="card-select">Select one of your cards to offer:</label>
          <select
            id="card-select"
            value={selectedCardId}
            onChange={(e) => setSelected(e.target.value)}
            required
          >
            <option value="">-- select --</option>
            {myCards.map(({ id, card_id, card_name }) => (
              <option key={id} value={card_id}>
                {card_name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary mt-4">
            Send Trade Offer
          </button>
        </form>
      )}
    </div>
  );
}

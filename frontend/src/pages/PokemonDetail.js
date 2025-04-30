import React, { useEffect, useState } from "react";
import axios from "../axios";
import { Link, useParams } from "react-router-dom";

export default function PokemonDetail() {
  const { name } = useParams();  // this should match card_name.toLowerCase()
  const [card, setCard] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // fetch all collections; find the one whose card_name matches the URL
        const { data } = await axios.get("usercollections/all/");
        const found = data.find(
          (c) => c.card_name.toLowerCase() === name.toLowerCase()
        );
        setCard(found);
      } catch (err) {
        console.error("Failed to load card details:", err);
      }
    })();
  }, [name]);

  if (!card) return <p>Loading…</p>;

  const { card_id, card_name, card_image_url, user_id } = card;

  return (
    <div className="pokemon-detail">
      <h2>{card_name}</h2>
      {card_image_url && (
        <img src={card_image_url} alt={card_name} className="max-w-xs mx-auto" />
      )}
      <Link to={`/trade/new/${user_id}/${card_id}`}>
        <button className="btn btn-primary mt-4">Make a Trade</button>
      </Link>
    </div>
  );
}

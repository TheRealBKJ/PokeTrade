import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from '../axios';
import "./PokemonDetail.css";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const capitalizeWords = (str) =>
  str.split("-").map(word => capitalize(word)).join(" ");

const PokemonDetail = () => {
  const { name } = useParams(); // e.g., "celebi & venusaur"
  const [searchParams] = useSearchParams();
  const cardTitle = searchParams.get("cardName"); // e.g., "Celebi & Venusaur-GX"

  const [pokemonList, setPokemonList] = useState([]);
  const [cardImage, setCardImage] = useState(null);
  const [rarity, setRarity] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const decodedName = decodeURIComponent(name);

    const pokemonNames = decodedName
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 1);

    const fetchValidPokemon = async () => {
      const validPokemon = [];

      for (let word of pokemonNames) {
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${word}`);
          if (res.ok) {
            const data = await res.json();
            validPokemon.push(data);
          }
        } catch (err) {
          console.warn(`Skipping non-Pokémon word: ${word}`);
        }
      }

      setPokemonList(validPokemon);
    };

    fetchValidPokemon();

    if (cardTitle) {
      axios
        .get("https://api.pokemontcg.io/v2/cards", {
          headers: {
            "X-Api-Key": "YOUR_API_KEY_HERE", // <-- Replace with your actual key
          },
          params: {
            q: `name:"${cardTitle}" supertype:pokemon`,
            pageSize: 1,
          },
        })
        .then((res) => {
          if (res.data.data.length > 0) {
            const card = res.data.data[0];
            setCardImage(card.images.large);
            setRarity(card.rarity);
          } else {
            console.warn("No exact card match found for:", cardTitle);
          }
        })
        .catch((err) => console.error("TCG API error:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [name]);

  const handleMakeTrade = () => {
    const names = pokemonList.map(p => p.name).join(",");
    navigate(`/trade/new?pokemon=${names}&card=${encodeURIComponent(cardTitle)}`);
  };

  if (loading) return <p>Loading...</p>;
  if (pokemonList.length === 0) return <p>No Pokémon found in this card name.</p>;

  return (
    <div className="detail-container">
      <h1>{pokemonList.map(p => capitalize(p.name)).join(" & ")}</h1>

      {cardImage && (
        <img
          src={cardImage}
          alt="TCG Card"
          style={{ width: "300px", borderRadius: "8px", marginBottom: "1rem" }}
        />
      )}

      <div className="pokemon-info-wrapper">
        {pokemonList.map((pokemon) => (
          <div key={pokemon.name} className="pokemon-info">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="pokemon-sprite"
            />
            <ul className="pokemon-stats">
              <li><strong>Name:</strong> {capitalize(pokemon.name)}</li>
              <li><strong>Height:</strong> {(pokemon.height / 10).toFixed(1)} m</li>
              <li><strong>Weight:</strong> {(pokemon.weight / 10).toFixed(1)} kg</li>
              <li><strong>Abilities:</strong> {pokemon.abilities.map(ab => capitalizeWords(ab.ability.name)).join(", ")}</li>
              <li><strong>Type(s):</strong> {pokemon.types.map(tp => capitalize(tp.type.name)).join(" and ")}</li>
            </ul>
          </div>
        ))}
      </div>

      {rarity && <p><strong>Rarity:</strong> {capitalize(rarity)}</p>}

      <button onClick={handleMakeTrade} className="make-trade-button">
        Make a Trade
      </button>
    </div>
  );
};

export default PokemonDetail;

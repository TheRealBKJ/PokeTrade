import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axios";
import "./PokemonDetail.css";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const capitalizeWords = (str) =>
  str.split("-").map(word => capitalize(word)).join(" ");

export default function BrowsePokemonDetail() {
  const { name } = useParams();

  const [pokemonList, setPokemonList] = useState([]);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = localStorage.getItem("user_id");

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

    const fetchCardDetails = async () => {
      try {
        const { data } = await axios.get("/usercollections/all/");
        const found = data.find(
          (c) => c.card_name.toLowerCase() === name.toLowerCase()
        );
        setCard(found);
      } catch (err) {
        console.error("Failed to load card details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchValidPokemon();
    fetchCardDetails();
  }, [name]);

  if (loading) return <p>Loading…</p>;
  if (!card) return <p>No card found for this Pokémon.</p>;
  if (pokemonList.length === 0) return <p>No Pokémon found in this card name.</p>;

  const { card_id, card_name, card_image_url, user } = card;

  return (
    <div className="detail-container">
      <div className="pokemon-detail">
        <h2>{card_name}</h2>
        {card_image_url && (
          <img src={card_image_url} alt={card_name} className="max-w-xs mx-auto" />
        )}
      </div>

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

      {user !== currentUser && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link to={`/trade/new/${user}/${card_id}`}>
            <button className="btn btn-primary">Propose Trade</button>
          </Link>
        </div>
      )}
    </div>
  );
}
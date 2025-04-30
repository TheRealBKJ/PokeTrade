// frontend/src/tcgClient.js

import axios from 'axios';

// ———————————————————————————————
// External TCG API client
// ———————————————————————————————

// 1) Base URL for the public Pokémon TCG API
const tcgClient = axios.create({
  baseURL: 'https://api.pokemontcg.io/v2/',
});

// 2) Always send JSON
tcgClient.defaults.headers.common['Content-Type'] = 'application/json';

// 3) Attach your TCG API key
tcgClient.defaults.headers.common['X-Api-Key'] = 'YOUR_API_KEY_HERE'; // ← replace!

export default tcgClient;

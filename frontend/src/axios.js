// frontend/src/axios.js
import axios from 'axios';

<<<<<<< Updated upstream
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: { 'Content-Type': 'application/json' }
});

// On app load, read any saved token and set the Authorization header
const token = localStorage.getItem('access_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
=======
const instance = axios.create({
  baseURL: '/api/',   // 👈 This is the critical part
});

export default instance;

>>>>>>> Stashed changes

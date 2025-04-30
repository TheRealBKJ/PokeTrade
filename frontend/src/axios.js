// frontend/src/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // adjust if your backend runs elsewhere
});

// Add JWT to every request if present
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;

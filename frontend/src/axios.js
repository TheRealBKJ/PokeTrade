// frontend/src/axios.js
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/api/';
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axios;

// frontend/src/axios.js

import axios from 'axios';

// 1) All API calls go to this root (note trailing slash)
axios.defaults.baseURL = 'http://localhost:8000/api/';

// 2) Always send JSON
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 3) Attach any stored JWT on every request via interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;

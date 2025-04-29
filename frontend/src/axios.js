// frontend/src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api/',   // 👈 This is the critical part
});

export default instance;


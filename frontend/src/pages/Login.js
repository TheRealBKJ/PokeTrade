import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import './Login.css';

// Helper to turn DRF error payloads into a single string
function formatErrorData(data) {
  const parts = [];
  Object.entries(data).forEach(([field, val]) => {
    if (Array.isArray(val)) {
      val.forEach(item => {
        if (typeof item === 'string') {
          parts.push(`${field}: ${item}`);
        } else if (item && typeof item.message === 'string') {
          parts.push(`${field}: ${item.message}`);
        } else {
          parts.push(`${field}: ${JSON.stringify(item)}`);
        }
      });
    } else if (typeof val === 'string') {
      parts.push(`${field}: ${val}`);
    } else if (val && typeof val.message === 'string') {
      parts.push(`${field}: ${val.message}`);
    } else {
      parts.push(`${field}: ${JSON.stringify(val)}`);
    }
  });
  return parts.join(' ');
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError]       = useState('');

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('users/token/', formData);
      const { access } = res.data;
      localStorage.setItem('access_token', access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      navigate('/profile');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(formatErrorData(err.response.data));
      } else if (err.response) {
        setError('Invalid credentials.');
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="auth-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

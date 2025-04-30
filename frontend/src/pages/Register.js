// frontend/src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';        // ← your configured instance
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ── CLIENT-SIDE VALIDATION ──
    if (!formData.username.trim()) {
      setError('Username is required.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      // only runs if client-side checks pass
      await api.post('users/register/', formData);
      setSuccess('Registration successful! Redirecting to login…');
      setFormData({ username: '', password: '' });

      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
      // robustly parse DRF field errors or detail strings:
      if (err.response?.data) {
        const data = err.response.data;
        // if it's an object of arrays
        if (typeof data === 'object') {
          const messages = Object.entries(data)
            .map(([field, msgs]) => {
              if (Array.isArray(msgs)) return msgs.join(' ');
              return String(msgs);
            })
            .join(' ');
          setError(messages);
        } else {
          setError(String(data));
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <p>Create your new PokeTrade account.</p>

      {error   && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

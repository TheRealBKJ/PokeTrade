import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import './Register.css';

// Same helper for parsing errors
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

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('users/register/', formData);
      setSuccess('Registration successful! Redirecting to login...');
      setFormData({ username: '', password: '' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(formatErrorData(err.response.data));
      } else if (err.response) {
        setError('Server error. Please try again later.');
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
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

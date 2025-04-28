import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';        // ← import your configured instance
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

    try {
      // POST now goes to http://localhost:8000/api/users/register/
      await api.post('users/register/', formData);
      setSuccess('Registration successful! Redirecting to login...');
      setFormData({ username: '', password: '' });

      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        // Build a message from whatever field errors DRF returned
        const messages = Object.entries(err.response.data)
          .map(([field, msgs]) => `${field}: ${msgs.join(' ')}`)
          .join(' ');
        setError(messages);
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
        <button type="submit" className="auth-button">Register</button>
      </form>
    </div>
  );
};

export default Register;

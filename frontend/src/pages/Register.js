import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:8000/api/register/', formData);
      // After registering, immediately navigate to login
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <p>Create your new PokeTrade account.</p>
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
        <button type="submit" className="auth-button">Register</button>
      </form>
    </div>
  );
};

export default Register;

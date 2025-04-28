import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // same CSS you're using now

const Login = () => {
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
      const res = await axios.post('http://localhost:8000/api/token/', formData);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      localStorage.setItem('user_id', res.data.user_id); // 🔥 ADD THIS
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
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
        <button type="submit" className="auth-button">Login</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don't have an account? <a href="/register" style={{ color: '#0070f3' }}>Register here</a>
      </p>
    </div>
  );
};

export default Login;

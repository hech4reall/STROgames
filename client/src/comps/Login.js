import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './compte.css'; // Assuming compte.css is in src/comps

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // --- API fetch logic ignored as requested ---
    // In a real app, you'd send username and password to your backend
    console.log('Login attempt:', { username, password });

    // Mock login success/failure
    if (username === 'test' && password === 'password') {
      console.log('Login successful (mock)');
      navigate('/acceuil'); // Navigate to home on success
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="logo">SOTREGAMES</div>
      </header>
      <h1>log in</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">username:</label>
          <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">log in</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </>
  );
}

export default Login;
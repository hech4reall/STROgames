import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for login link
import './compte.css'; // Make sure this CSS file is in src/comps

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log('Sign Up Data:', { username, email, password });
    setError('');
    alert('Sign Up attempted (check console)!'); // Indicate a mock action
    // In a real app, you would typically send formData to your backend here.
  };

  return (
    <>
      <header className="navbar">
        <div className="logo">SOTREGAMES</div>
      </header>
      <h1>sign up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit">Sign Up</button>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>

      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </>
  );
}

export default SignUp;
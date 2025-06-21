import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // For navigation and links
import './distination.css'; // Assuming distination.css is in src/comps

function DestinationSearch() {
  const [selectedDestination, setSelectedDestination] = useState('');
  const navigate = useNavigate();

  // This effect would mimic the test.js behavior if you wanted to auto-update the button link
  // However, for React Router, it's often better to just navigate on button click.
  // useEffect(() => {
  //   if (selectedDestination) {
  //     // You could set a dynamic link here if you had complex logic,
  //     // but for simple navigation, the button click handler is more direct.
  //   }
  // }, [selectedDestination]);

  const handleSearchClick = () => {
    if (selectedDestination) {
      navigate(`/${selectedDestination}`); // Navigate to e.g., /sfax
    } else {
      alert('Veuillez choisir une destination.'); // Or show a more elegant error
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="logo">SOTREGAMES</div>
        <nav>
          <ul>
            <li><Link to="/acceuil">🚆 Voyager</Link></li> {/* Changed to acceuil from empty link */}
            <li><Link to="/offre">📄 Offres</Link></li>
            <li><Link to="/compte">👤 Compte</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="section">
          <h1>Recherchez une destination</h1>
          <div className="barre-recherche">
            <select
              className="destination-select"
              id="destination-select"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
            >
              <option value="">Choisissez une destination</option>
              <option value="sfax">Sfax</option>
              <option value="mednine">Mednine</option>
              <option value="djerba">Djerba</option>
              <option value="touzeur">Touzeur</option>
            </select>
            <button id="btn" onClick={handleSearchClick}>🔍</button> {/* Changed to button with onClick */}
          </div>
        </section>
      </main>
    </>
  );
}

export default DestinationSearch;
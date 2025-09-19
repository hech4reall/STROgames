import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './distination.css'; 

function DestinationSearch() {
  const [selectedDestination, setSelectedDestination] = useState('');
  const navigate = useNavigate();



  const handleSearchClick = () => {
    if (selectedDestination) {
      navigate(`/${selectedDestination}`); 
    } else {
      alert('Veuillez choisir une destination.'); 
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="logo">SOTREGAMES</div>
        <nav>
          <ul>
            <li><Link to="/acceuil">🚆 Voyager</Link></li> {}
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

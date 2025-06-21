import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './acceuil.css'; // Assuming you have acceuil.css

function Accueil() {
  return (
    <>
      <header className="navbar">
        <div className="logo">SOTREGAMES</div>
        <nav>
          <ul>
            <li><Link to="/acceuil">🏠 Acceuil</Link></li>
            <li><Link to="/offre">📄 Offres</Link></li>
            <li><Link to="/compte">👤 Compte</Link></li>
            <li><Link to="/contact">📞 Contact</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="main-section">
          <h1>Bienvenue dans notre service</h1>
          <div className="action-group">
            <div className="action-item">
              <label htmlFor="bus-location">Bus location :</label>
              <Link className="action-link" to="/pagep">Location</Link> {/* Use Link */}
            </div>
            <div className="action-item">
              <label htmlFor="reservation">Réservation d'une place :</label>
              <Link className="action-link" to="/distination">Réserver</Link> {/* Use Link */}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Accueil;
import React, { useState } from 'react';
import './stylesp.css'; // Assuming stylesp.css is in src/comps

function BusLocationForm() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    destination: '',
    typeDuBus: '',
    dateDepart: '',
    dateRetour: '',
    nbPlaces: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire de location de bus soumis:', formData);
    alert('Formulaire soumis! (Vérifiez la console)');
    // In a real app, you'd send this data to a backend API
  };

  return (
    <>
      <div className="logo">SOTREGAMES</div>
      <form className="bus-location" onSubmit={handleSubmit}>
        <h2>formulaire de location de bus</h2>
        <div className="form-group">
          <label htmlFor="nom">Nom complet :</label>
          <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">email :</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="telephone">telephone :</label>
          <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="destination">destination :</label>
          <select id="destination" name="destination" value={formData.destination} onChange={handleChange} required>
            <option value="">choisissez une destination</option>
            <option value="sfax">sfax</option>
            <option value="mednine">mednine</option>
            <option value="djerba">djerba</option>
            <option value="touzeur">touzeur</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="typeDuBus">Type du bus :</label>
          <select id="typeDuBus" name="typeDuBus" value={formData.typeDuBus} onChange={handleChange} required>
            <option value="">choisissez le type du bus:</option>
            <option value="comfort">mini bus</option>
            <option value="simple">normale</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dateDepart">Date de départ :</label>
          <input type="datetime-local" id="dateDepart" name="dateDepart" value={formData.dateDepart} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="dateRetour">Date de retour :</label>
          <input type="datetime-local" id="dateRetour" name="dateRetour" value={formData.dateRetour} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="nbPlaces">Nombre de places :</label>
          <input type="number" id="nbPlaces" name="nbPlaces" min="1" max="50" value={formData.nbPlaces} onChange={handleChange} required />
        </div>
        <button type="submit">Réserver</button>
      </form>
    </>
  );
}

export default BusLocationForm;
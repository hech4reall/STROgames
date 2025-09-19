import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './stylesp.css';

function TicketBookingForm({ destination }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    type: '',
    date: '',
    nbplaces: '',
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
    console.log(`Réservation de ticket pour ${destination}:`, formData);

   
    const params = new URLSearchParams(formData).toString();
    navigate(`/reservation?${params}`);
  };

  return (
    <>
      {/* Assuming no navbar for these specific pages based on original HTML */}
      <form className="bus-location" onSubmit={handleSubmit}>
        <h2>Reservez votre ticket</h2>
        <h3>distination {destination}</h3> {/* Dynamic destination */}
        <div className="form-group">
          <label htmlFor="nom">Nom complet :</label>
          <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="telephone">telephone :</label>
          <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type du bus :</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} required>
            <option value="">choisissez le type du bus:</option>
            <option value="comfort">comfort</option>
            <option value="simple">simple</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date">Date de départ :</label>
          <input type="datetime-local" id="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="nbplaces">Nombre de places disponible:</label>
          <input type="number" id="nbplaces" name="nbplaces" min="1" max="4" value={formData.nbplaces} onChange={handleChange} required />
        </div>
        <button type="submit">Réserver</button>
      </form>
      <div id="reservation-info"></div>
    </>
  );
}

export default TicketBookingForm;

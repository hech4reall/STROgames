import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // For accessing URL query params
import './reservation.css'; // Assuming reservation.css is in src/comps

function ReservationConfirm() {
  const location = useLocation();
  const [reservationDetails, setReservationDetails] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setReservationDetails({
      nom: params.get('nom'),
      telephone: params.get('telephone'),
      type: params.get('type'),
      date: params.get('date'),
      nbplaces: params.get('nbplaces'),
    });
  }, [location.search]); // Re-run effect if URL search params change

  const handlePrint = () => {
    window.print(); // Triggers browser's print dialog
  };

  return (
    <>
      <h2>Informations de réservation</h2>
      <ul id="reservation-details">
        <li><strong>Nom :</strong> {reservationDetails.nom || ''}</li>
        <li><strong>Téléphone :</strong> {reservationDetails.telephone || ''}</li>
        <li><strong>Type du bus :</strong> {reservationDetails.type || ''}</li>
        <li><strong>Date de départ :</strong> {reservationDetails.date || ''}</li>
        <li><strong>Nombre de places :</strong> {reservationDetails.nbplaces || ''}</li>
        <img src="/download.png" alt="QR Code or Confirmation Image" width="200" height="150" /> {/* Relative path from public folder */}
        <div>
          <button type="button" onClick={handlePrint}>imprimer</button> {/* Changed to type="button" */}
        </div>
      </ul>
    </>
  );
}

export default ReservationConfirm;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all your new React components
import Accueil from './comps/Accueil';
import BusLocationForm from './comps/BusLocationForm';
import DestinationSearch from './comps/DestinationSearch';
import Login from './comps/Login';
import SignUp from './comps/SignUp'; // Assuming you have a SignUp component already
import Contact from './comps/Contact'; // Assuming you have a Contact component already
import TicketBookingForm from './comps/TicketBookingForm'; // For destination-specific bookings
import ReservationConfirm from './comps/ReservationConfirm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} /> {/* Default route */}
        <Route path="/acceuil" element={<Accueil />} />
        <Route path="/offre" element={<div><h1>Offres Page (Placeholder)</h1></div>} /> {/* Placeholder for now */}
        <Route path="/compte" element={<SignUp />} /> {/* SignUp is the primary 'Compte' page for now */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pagep" element={<BusLocationForm />} /> {/* Bus Location form */}
        <Route path="/distination" element={<DestinationSearch />} /> {/* Destination search page */}

        {/* Routes for specific destination ticket bookings */}
        <Route path="/sfax" element={<TicketBookingForm destination="sfax" />} />
        <Route path="/mednine" element={<TicketBookingForm destination="mednine" />} />
        <Route path="/djerba" element={<TicketBookingForm destination="djerba" />} />
        <Route path="/touzeur" element={<TicketBookingForm destination="touzeur" />} />

        <Route path="/reservation" element={<ReservationConfirm />} /> {/* Final reservation details */}

        {/* Add a catch-all for 404 Not Found pages if desired */}
        <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;
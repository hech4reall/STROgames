"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentUser } from "./redux/slices/authSlice" // Corrected path

// Import components
import Accueil from "./comps/Accueil"
import BusLocationForm from "./comps/BusLocationForm"
import DestinationSearch from "./comps/DestinationSearch"
import Login from "./comps/Login"
import SignUp from "./comps/SignUp"
import Contact from "./comps/Contact"
import TicketBookingForm from "./comps/TicketBookingForm" // To be ignored as per request, but keeping route for now
import ReservationConfirm from "./comps/ReservationConfirm"
import AdminDashboard from "./comps/AdminDashboard"
import UserProfile from "./comps/UserProfile"

// Basic styling for overall app layout (can be moved to App.css or index.css)
import "./App.css"

// Helper for protected routes
const ProtectedRoute = ({ children, roleRequired }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/acceuil" replace /> // Or an unauthorized page
  }

  return children
}

function App() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, token])

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Accueil />} />
        <Route path="/acceuil" element={<Accueil />} />
        <Route
          path="/offre"
          element={
            <div>
              <h1>Offres Page (Placeholder)</h1>
            </div>
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/compte" element={<SignUp />} /> {/* Assuming /compte is for sign-up */}
        <Route path="/distination" element={<DestinationSearch />} />
        <Route path="/reservation" element={<ReservationConfirm />} />
        {/* Ticket booking routes (to be ignored but kept for structure) */}
        <Route path="/sfax" element={<TicketBookingForm destination="sfax" />} />
        <Route path="/mednine" element={<TicketBookingForm destination="mednine" />} />
        <Route path="/djerba" element={<TicketBookingForm destination="djerba" />} />
        <Route path="/touzeur" element={<TicketBookingForm destination="touzeur" />} />
        {/* Protected Routes */}
        <Route
          path="/pagep" // Bus Location form
          element={
            <ProtectedRoute>
              <BusLocationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Catch-all for 404 Not Found pages */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1>404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

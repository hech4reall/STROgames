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
import TicketBookingForm from "./comps/TicketBookingForm"
import ReservationConfirm from "./comps/ReservationConfirm"
import AdminDashboard from "./comps/AdminDashboard"
import UserProfile from "./comps/UserProfile"
import NavBar from "./comps/NavBar"
import Users from "./comps/Users"
import "./App.css"

const ProtectedRoute = ({ children, roleRequired }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/acceuil" replace /> 
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
    <div>      
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/acceuil" element={<Accueil />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/compte" element={<SignUp />} /> 
          <Route path="/distination" element={<DestinationSearch />} />
          <Route path="/reservation" element={<ReservationConfirm />} />
          <Route path="/sfax" element={<TicketBookingForm destination="sfax" />} />
          <Route path="/mednine" element={<TicketBookingForm destination="mednine" />} />
          <Route path="/djerba" element={<TicketBookingForm destination="djerba" />} />
          <Route path="/touzeur" element={<TicketBookingForm destination="touzeur" />} />
          <Route
            path="/pagep"
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
          <Route
            path="/users"
            element={
              <ProtectedRoute roleRequired="admin">
                <Users />
              </ProtectedRoute>
            }
          />
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
    </div>
    
  )
}

export default App

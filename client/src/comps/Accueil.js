import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/slices/authSlice" // Corrected path
import "./acceuil.css"

function Accueil() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <>
      <main>
        <section className="main-section">
          <h1>Bienvenue dans notre service de transport</h1>
          <p className="subtitle">Planifiez vos voyages et locations de bus facilement.</p>
          <div className="action-group">
            <div className="action-item">
              <label htmlFor="bus-location">Location de bus :</label>
              <Link className="action-link" to="/pagep">
                Louer un bus
              </Link>
            </div>
            <div className="action-item">
              <label htmlFor="reservation">Réservation de place :</label>
              <Link className="action-link" to="/distination">
                Réserver une place
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} SOTREGAMES. Tous droits réservés.</p>
      </footer>
    </>
  )
}

export default Accueil

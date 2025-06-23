import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../redux/slices/authSlice"
import { useSelector, useDispatch } from "react-redux"

function NavBar() {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const handleLogout = () => {
        dispatch(logout())
        navigate("/login")
    }
  return (
    <header className="navbar">
          <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '3px'}}>SOTREGAMES</div>
          <nav>
            <ul>
              <li>
                <Link to="/acceuil">🏠 Accueil</Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/profile">👤 Profil</Link>
                  </li>
                  {user?.role === "admin" && (
                    <>
                        <li>
                            <Link to="/admin-dashboard">🛠️ Admin</Link>
                        </li>
                        <li>
                            <Link to="/users">👥 Users</Link>
                        </li>
                        <li>
                            <Link to="/ligne">🌍 Ligne</Link>
                        </li>
                    </>
                  )}
                  <li>
                    <button onClick={handleLogout} className="nav-button logout-button">
                      🚪 Déconnexion
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/compte">👤 Compte</Link>
                  </li>{" "}
                  {/* Links to SignUp */}
                  <li>
                    <Link to="/login" className="nav-button login-button">
                      🔑 Connexion
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/contact">📞 Contact</Link>
              </li>
            </ul>
          </nav>
      </header>
  )
}

export default NavBar
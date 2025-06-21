import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { registerUser, clearError } from "../redux/slices/authSlice" // Corrected path
import "./compte.css"

function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordsMatchError, setPasswordsMatchError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    // Clear previous errors when component mounts
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/acceuil") // Navigate to home on successful registration
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (event) => {
    event.preventDefault()
    setPasswordsMatchError("")
    dispatch(clearError())

    if (password !== confirmPassword) {
      setPasswordsMatchError("Les mots de passe ne correspondent pas.")
      return
    }
    dispatch(registerUser({ email, password }))
  }

  return (
    <div className="auth-container">
      <header className="auth-navbar">
        <Link to="/acceuil" className="logo-text">
          SOTREGAMES
        </Link>
      </header>
      <div className="auth-form-wrapper">
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="exemple@domaine.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimum 6 caractères"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirmer le mot de passe :</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Retapez votre mot de passe"
            />
          </div>
          {passwordsMatchError && <div className="error-message">{passwordsMatchError}</div>}
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>
        <p className="auth-switch-link">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp

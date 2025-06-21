import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createBusBooking, clearBusError, clearBusSuccess } from "../redux/slices/busSlice"
import "./stylesp.css"

function BusLocationForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { loading, error, successMessage } = useSelector((state) => state.bus)

  const [formData, setFormData] = useState({
    nomComplet: "",
    email: "",
    telephone: "",
    destination: "",
    typeDuBus: "",
    dateDepart: "",
    dateRetour: "",
    nbPlaces: "1",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
    dispatch(clearBusError())
    dispatch(clearBusSuccess())
  }, [isAuthenticated, navigate, dispatch])

  useEffect(() => {
    if (successMessage) {
      alert("Location de bus demandée avec succès ! Votre demande est en attente de validation.")
      dispatch(clearBusSuccess())
      navigate("/acceuil")
    }
  }, [successMessage, dispatch, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user || !user._id) {
      alert("Utilisateur non identifié. Veuillez vous reconnecter.")
      return
    }

    const bookingData = {
      ...formData,
      userId: user._id,
      nbPlaces: Number.parseInt(formData.nbPlaces, 10),
    }
    dispatch(createBusBooking(bookingData))
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <div className="form-logo">
          <span className="logo-text-form">SOTREGAMES</span>
          <div className="logo-gradient"></div>
        </div>
        <div className="form-intro">
          <h2>Formulaire de Location de Bus</h2>
          <p>Remplissez les détails de votre voyage pour obtenir une location de bus personnalisée</p>
        </div>
      </div>
      
      <form className="bus-location-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nomComplet">
              <span className="label-icon">👤</span> Nom complet du responsable
            </label>
            <input
              type="text"
              id="nomComplet"
              name="nomComplet"
              value={formData.nomComplet}
              onChange={handleChange}
              required
              placeholder="Jean Dupont"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <span className="label-icon">✉️</span> Email de contact
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="contact@exemple.com"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telephone">
              <span className="label-icon">📱</span> Téléphone
            </label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
              placeholder="0612345678"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="destination">
              <span className="label-icon">📍</span> Destination
            </label>
            <select 
              id="destination" 
              name="destination" 
              value={formData.destination} 
              onChange={handleChange} 
              required
            >
              <option value="">Choisissez une destination</option>
              <option value="Sfax">Sfax</option>
              <option value="Mednine">Mednine</option>
              <option value="Djerba">Djerba</option>
              <option value="Touzeur">Touzeur</option>
              <option value="Autre">Autre (à préciser)</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="typeDuBus">
              <span className="label-icon">🚌</span> Type du bus
            </label>
            <select 
              id="typeDuBus" 
              name="typeDuBus" 
              value={formData.typeDuBus} 
              onChange={handleChange} 
              required
            >
              <option value="">Choisissez le type du bus</option>
              <option value="comfort">Mini Bus (Confort)</option>
              <option value="simple">Bus Normal (Simple)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="nbPlaces">
              <span className="label-icon">👥</span> Nombre de places
            </label>
            <div className="number-input-container">
              <button 
                type="button" 
                className="number-btn" 
                onClick={() => setFormData(prev => ({
                  ...prev, 
                  nbPlaces: Math.max(1, parseInt(prev.nbPlaces) - 1)
                }))}
              >
                -
              </button>
              <input
                type="number"
                id="nbPlaces"
                name="nbPlaces"
                min="1"
                max="50"
                value={formData.nbPlaces}
                onChange={handleChange}
                required
                className="number-input"
              />
              <button 
                type="button" 
                className="number-btn" 
                onClick={() => setFormData(prev => ({
                  ...prev, 
                  nbPlaces: Math.min(50, parseInt(prev.nbPlaces) + 1)
                }))}
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateDepart">
              <span className="label-icon">⏱️</span> Date et heure de départ
            </label>
            <input
              type="datetime-local"
              id="dateDepart"
              name="dateDepart"
              value={formData.dateDepart}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dateRetour">
              <span className="label-icon">⏱️</span> Date et heure de retour
            </label>
            <input
              type="datetime-local"
              id="dateRetour"
              name="dateRetour"
              value={formData.dateRetour}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && (
          <div className="error-message form-error">
            <span className="error-icon">⚠️</span> {error}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center"}}>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <span className="submit-icon">🚌</span> 
                Demander la location
              </>
            )}
          </button>
        </div>

        
      </form>
    </div>
  )
}

export default BusLocationForm
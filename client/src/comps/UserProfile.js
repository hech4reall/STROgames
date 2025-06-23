import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getUserOffers, clearError, acceptUserOffer, rejectUserOffer } from "../redux/slices/authSlice"
import "./UserProfile.css"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../redux/slices/authSlice"


const UserProfile = () => {
  const dispatch = useDispatch()
  const { user, userOffers, loading, error, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated && user && user._id) {
      dispatch(getUserOffers(user._id))
    }
    return () => {
      dispatch(clearError())
    }
  }, [user, dispatch, isAuthenticated]);

  const handleAcceptOffer = (offerId) => {
    dispatch(acceptUserOffer(offerId));
  }
  
  const handleRejectOffer = (offerId) => {
    dispatch(rejectUserOffer(offerId));
  }

  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  if (!isAuthenticated) {
    return (
      <div className="info-message">
        <h3>Connexion Requise</h3>
        <p>Veuillez vous connecter pour accéder à votre profil</p>
      </div>
    )
  }

  if (loading && !userOffers.length) {
    return (
      <div className="loading-message">
        <div className="loading-spinner"></div>
        <p>Chargement de vos offres...</p>
      </div>
    )
  }

  return (
    <>    
    <div className="user-profile-container">
      <header className="profile-header">
        <h2>Bonjour, {user?.email} 👋</h2>
        <p>Gérez vos offres et suivez leur statut</p>
      </header>

      {error && <div className="profile-error">⚠️ Erreur: {error}</div>}

      <section className="offers-section">
        <div className="section-header">
          <h3>📬 Vos Offres Envoyées</h3>
          <p className="section-subtitle">
            {userOffers.length} offre{userOffers.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        
        {userOffers.length === 0 ? (
          <div className="empty-state-profile">
            <div className="empty-icon">📭</div>
            <h4>Aucune offre envoyée</h4>
            <p>Vous n'avez pas encore soumis d'offres pour vos réservations</p>
          </div>
        ) : (
          <ul className="offer-list-profile">
            {userOffers.map((offer) => (
              <li key={offer._id} className={`offer-item-profile status-${offer.status?.toLowerCase()}`}>
                <div className="offer-header">
                  <div className="offer-id">#{offer._id}</div>
                  <span className={`status-badge-profile status-${offer.status?.toLowerCase()}`}>
                    {offer.status === "pending" && "⏳ En attente"}
                    {offer.status === "accepted" && "✅ Acceptée"}
                    {offer.status === "rejected" && "❌ Rejetée"}
                  </span>
                </div>
                
                <div className="offer-details">
                  <div className="detail-row">
                    <div className="detail-label">Destination</div>
                    <div className="detail-value">{offer.booking?.destination || 'N/A'}</div>
                  </div>
                  
                  <div className="detail-row">
                    <div className="detail-label">Dates</div>
                    <div className="detail-value">
                      {offer.booking?.dateDepart ? new Date(offer.booking.dateDepart).toLocaleDateString() : 'N/A'} -{' '}
                      {offer.booking?.dateRetour ? new Date(offer.booking.dateRetour).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="detail-row">
                    <div className="detail-label">Prix proposé</div>
                    <div className="detail-value price-value">
                      {offer.prix ? `${offer.prix} €` : "N/A"}
                    </div>
                  </div>
                </div>
                
                {offer.status === "pending" && (
                  <div className="offer-actions-profile">
                    <button 
                      onClick={() => handleAcceptOffer(offer._id)} 
                      className="action-button accept-button"
                    >
                      ✓ Accepter
                    </button>
                    <button 
                      onClick={() => handleRejectOffer(offer._id)} 
                      className="action-button reject-button"
                    >
                      ✗ Rejeter
                    </button>
                  </div>
                )}
                
                {offer.status !== "pending" && (
                  <div className="offer-status-message">
                    <p className={`action-note ${offer.status === "accepted" ? 'success-note' : 'error-note'}`}>
                      {offer.status === "accepted" 
                        ? "✓ Vous avez accepté cette offre" 
                        : "✗ Vous avez rejeté cette offre"}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
    </>
  )
}

export default UserProfile
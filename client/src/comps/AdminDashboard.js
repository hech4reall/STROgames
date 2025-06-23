"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../redux/slices/authSlice"
import { useSelector, useDispatch } from "react-redux"
import {
  getAllBookings,
  approveBooking,
  rejectBooking,
  deleteBooking,
  clearBusError,
  clearBusSuccess,
} from "../redux/slices/busSlice"
import { getAllOffers, deleteOffer, clearOfferError, clearOfferSuccess } from "../redux/slices/offerSlice"
import "./AdminDashboard.css"

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const {
    bookings,
    loading: busLoading,
    error: busError,
    successMessage: busSuccess,
  } = useSelector((state) => state.bus)
  const {
    offers,
    loading: offerLoading,
    error: offerError,
    successMessage: offerSuccess,
  } = useSelector((state) => state.offer)

  const [bookingPrices, setBookingPrices] = useState({})
  const { isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }
  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(getAllBookings())
      dispatch(getAllOffers())
    }
    return () => {
      dispatch(clearBusError())
      dispatch(clearBusSuccess())
      dispatch(clearOfferError())
      dispatch(clearOfferSuccess())
    }
  }, [user, dispatch])

  const handlePriceChange = (bookingId, price) => {
    setBookingPrices((prev) => ({ ...prev, [bookingId]: price }))
  }

  const handleApproveBooking = (bookingId) => {
    const price = bookingPrices[bookingId]
    if (!price || isNaN(Number.parseFloat(price)) || Number.parseFloat(price) <= 0) {
      alert("Veuillez entrer un prix valide pour l'approbation.")
      return
    }
    dispatch(approveBooking({ bookingId, prix: Number.parseFloat(price) }))
  }

  const handleRejectBooking = (bookingId) => {
    dispatch(rejectBooking(bookingId))
  }

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      dispatch(deleteBooking(bookingId))
    }
  }

  const handleDeleteOffer = (offerId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      dispatch(deleteOffer(offerId))
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="unauthorized-message">
        <h2>Accès Refusé</h2>
        <p>Vous n'avez pas les autorisations nécessaires pour accéder à cette page</p>
      </div>
    )
  }

  if (busLoading || offerLoading) {
    return (
      <div className="loading-message">
        <div className="loading-spinner"></div>
        <p>Chargement des données du tableau de bord...</p>
      </div>
    )
  }

  return (
    <>      
      <div className="admin-dashboard-container">
        
        <header className="dashboard-header">
          <h1 style={{color: "white"}}>Tableau de Bord Administrateur</h1>
        </header>

        {busError && <div className="admin-error">🚨 Erreur Réservations: {busError}</div>}
        {busSuccess && <div className="admin-success">✅ Action Réservations: {busSuccess}</div>}
        {offerError && <div className="admin-error">🚨 Erreur Offres: {offerError}</div>}
        {offerSuccess && <div className="admin-success">✅ Action Offres: {offerSuccess}</div>}

        <section className="dashboard-section">
          <h3>📍 Toutes les Locations de Bus (Réservations)</h3>
          {bookings.length === 0 ? (
            <p className="empty-state">Aucune location de bus trouvée</p>
          ) : (
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Nom Contact</th>
                    <th>Destination</th>
                    <th>Type Bus</th>
                    <th>Dates</th>
                    <th>Places</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      
                      <td>{booking.email}</td>
                      <td>{booking.nomComplet}</td>
                      <td>{booking.destination}</td>
                      <td>{booking.typeDuBus}</td>
                      <td>
                        <div className="date-group">
                          <div>{new Date(booking.dateDepart).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.dateDepart).toLocaleTimeString()}
                          </div>
                          <div className="text-sm">au</div>
                          <div>{new Date(booking.dateRetour).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.dateRetour).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td>{booking.nbPlaces}</td>
                      <td>
                        <span className={`status-badge status-${booking.status}`}>
                          {booking.status === "pending" && "⏳ En attente"}
                          {booking.status === "approved" && "✅ Approuvé"}
                          {booking.status === "rejected" && "❌ Rejeté"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        {booking.status === "pending" && (
                          <div className="action-group-inline">
                            <input
                              type="number"
                              placeholder="Prix (€)"
                              value={bookingPrices[booking._id] || ""}
                              onChange={(e) => handlePriceChange(booking._id, e.target.value)}
                              className="price-input"
                              min="1"
                            />
                            <button onClick={() => handleApproveBooking(booking._id)} className="action-button approve">
                              ✓ Approuver
                            </button>
                            <button onClick={() => handleRejectBooking(booking._id)} className="action-button reject">
                              ✗ Rejeter
                            </button>
                          </div>
                        )}
                        {booking.status === "approved" && (
                          <div className="font-bold text-green-700">
                            {booking.prix || "N/A"} €
                          </div>
                        )}
                        <button onClick={() => handleDeleteBooking(booking._id)} className="action-button delete mt-2">
                          🗑️ Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h3>💼 Toutes les Offres Utilisateurs</h3>
          {offers.length === 0 ? (
            <p className="empty-state">Aucune offre trouvée</p>
          ) : (
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID Offre</th>
                    <th>Utilisateur</th>
                    <th>Prix Offert</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer._id}>
                      <td>{offer._id.substring(0, 8)}...</td>
                      <td>{offer.userId?.email || 'N/A'}</td>
                      <td className="font-bold">{offer.prix ? `${offer.prix} €` : "N/A"}</td>
                      <td>
                        <span className={`status-badge status-${offer.status?.toLowerCase()}`}>
                          {offer.status === "pending" && "⏳ En attente"}
                          {offer.status === "accepted" && "✅ Accepté"}
                          {offer.status === "rejected" && "❌ Rejeté"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button onClick={() => handleDeleteOffer(offer._id)} className="action-button delete">
                          🗑️ Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default AdminDashboard
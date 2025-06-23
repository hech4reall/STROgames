// AdminDestinations.js
"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  fetchDestinations,
  addDestination,
  deleteDestination,
} from "../redux/slices/destinationsSlice" // Adjust path as needed
import './AdminDestinations.css' // Import the new CSS file

const AdminDestinations = () => {
  const dispatch = useDispatch()
  const { destinations, loading, error } = useSelector(
    (state) => state.destinations
  )
  const [newDestinationCity, setNewDestinationCity] = useState("")

  useEffect(() => {
    dispatch(fetchDestinations())
  }, [dispatch])

  const handleAddDestination = (e) => {
    e.preventDefault()
    if (newDestinationCity.trim()) {
      dispatch(addDestination({ city: newDestinationCity.trim() }))
      setNewDestinationCity("")
    } else {
      alert("Veuillez entrer un nom de ville pour la destination.")
    }
  }

  const handleDeleteDestination = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette destination ?")) {
      dispatch(deleteDestination(id))
    }
  }

  if (loading) {
    return (
      <div className="dest-loading-message">
        <div className="dest-loading-spinner"></div>
        <p>Chargement des destinations...</p>
      </div>
    )
  }

  return (
    <div className="dest-container">
      <header className="dest-header">
        <h1 style={{ color: 'white'}}>Gestion des Destinations</h1>
      </header>

      {error && <div className="dest-error">🚨 Erreur: {error.message || error}</div>}

      <section className="dest-section add-section">
        <h2>Ajouter une Nouvelle Destination</h2>
        <form onSubmit={handleAddDestination} className="dest-form">
          <input
            type="text"
            placeholder="Nom de la ville (ex: Paris)"
            value={newDestinationCity}
            onChange={(e) => setNewDestinationCity(e.target.value)}
            className="dest-input"
            required
          />
          <button type="submit" className="dest-button primary">
            Ajouter Destination
          </button>
        </form>
      </section>

      <section className="dest-section list-section">
        <h2>Toutes les Destinations</h2>
        {destinations.length === 0 ? (
          <p className="dest-empty-state">Aucune destination trouvée.</p>
        ) : (
          <div className="dest-table-responsive">
            <table className="dest-table">
              <thead>
                <tr>
                  <th>Ville</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((destination) => (
                  <tr key={destination._id}>
                    <td>{destination.city}</td>
                    <td className="dest-actions-cell">
                      <button
                        onClick={() => handleDeleteDestination(destination._id)}
                        className="dest-button delete"
                      >
                        Supprimer
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
  )
}

export default AdminDestinations;
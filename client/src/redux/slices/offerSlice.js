import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:2000"

// Async thunks
export const getAllOffers = createAsyncThunk("offer/getAllOffers", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token
    if (!token) return rejectWithValue("Not authenticated")

    const response = await axios.get(`${API_BASE_URL}/book/offers`, {
      // API endpoint from original code
      headers: { Authorization: token },
    })
    return response.data.offers || response.data // Adjust based on actual API response
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to get offers")
  }
})

export const deleteOffer = createAsyncThunk("offer/deleteOffer", async (offerId, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token
    if (!token) return rejectWithValue("Not authenticated")

    await axios.delete(`${API_BASE_URL}/book/offer/${offerId}`, {
      // API endpoint from original code
      headers: { Authorization: token },
    })
    return { offerId }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to delete offer")
  }
})

const initialOfferState = {
  offers: [],
  loading: false,
  error: null,
  successMessage: null,
}

const offerSlice = createSlice({
  name: "offer",
  initialState: initialOfferState,
  reducers: {
    clearOfferError: (state) => {
      state.error = null
    },
    clearOfferSuccess: (state) => {
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Offers
      .addCase(getAllOffers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllOffers.fulfilled, (state, action) => {
        state.loading = false
        state.offers = action.payload
      })
      .addCase(getAllOffers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Offer
      .addCase(deleteOffer.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.loading = false
        state.offers = state.offers.filter((offer) => offer._id !== action.payload.offerId)
        state.successMessage = "Offre supprimée avec succès"
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearOfferError, clearOfferSuccess } = offerSlice.actions
export default offerSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_LINK

export const createBusBooking = createAsyncThunk("bus/createBooking", async (bookingData, { rejectWithValue }) => {
  try {
    const dataToSend = {
      ...bookingData,
      nbPlaces: Number.parseInt(bookingData.nbPlaces, 10),
    }
    const response = await axios.post(`${API_BASE_URL}/book/`, dataToSend) // API endpoint from original code
    return (
      response.data.booking || {
        ...dataToSend,
        _id: response.data.id,
        status: "pending",
        createdAt: new Date().toISOString(),
        prix: null,
      }
    )
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to create booking")
  }
})

export const getAllBookings = createAsyncThunk("bus/getAllBookings", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/book/`) // API endpoint from original code
    return response.data.booking || response.data // Adjust based on actual API response structure
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to get bookings")
  }
})

export const approveBooking = createAsyncThunk(
  "bus/approveBooking",
  async ({ bookingId, prix }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/book/approve/${prix}/${bookingId}`) // API endpoint from original code
      return { bookingId, prix, updatedBooking: response.data.booking || response.data } // Adjust based on actual API response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || "Failed to approve booking",
      )
    }
  },
)

export const rejectBooking = createAsyncThunk("bus/rejectBooking", async (bookingId, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/book/reject/${bookingId}`) // API endpoint from original code
    return { bookingId, updatedBooking: response.data.booking || response.data } // Adjust based on actual API response
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to reject booking")
  }
})

export const deleteBooking = createAsyncThunk("bus/deleteBooking", async (bookingId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE_URL}/book/${bookingId}`) // API endpoint from original code
    return { bookingId }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to delete booking")
  }
})

const initialBusState = {
  bookings: [],
  loading: false,
  error: null,
  successMessage: null,
}

const busSlice = createSlice({
  name: "bus",
  initialState: initialBusState,
  reducers: {
    clearBusError: (state) => {
      state.error = null
    },
    clearBusSuccess: (state) => {
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBusBooking.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(createBusBooking.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = "Location de bus demandée avec succès !"
        state.bookings.unshift(action.payload) // Add the new booking to the list
      })
      .addCase(createBusBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get All Bookings
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Approve Booking
      .addCase(approveBooking.pending, (state) => {
        state.loading = true
      })
      .addCase(approveBooking.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload.bookingId
            ? { ...action.payload.updatedBooking, status: "approved", prix: action.payload.prix } // Ensure status and price are updated
            : booking,
        )
        state.successMessage = "Réservation approuvée avec succès"
      })
      .addCase(approveBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Reject Booking
      .addCase(rejectBooking.pending, (state) => {
        state.loading = true
      })
      .addCase(rejectBooking.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload.bookingId
            ? { ...action.payload.updatedBooking, status: "rejected" } // Ensure status is updated
            : booking,
        )
        state.successMessage = "Réservation rejetée avec succès"
      })
      .addCase(rejectBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = state.bookings.filter((booking) => booking._id !== action.payload.bookingId)
        state.successMessage = "Réservation supprimée avec succès"
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearBusError, clearBusSuccess } = busSlice.actions
export default busSlice.reducer

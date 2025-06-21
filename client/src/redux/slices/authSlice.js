import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_BASE_URL = "http://localhost:2000"

// Async thunks
export const registerUser = createAsyncThunk("auth/register", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/register`, {
      email,
      password,
    })

    if (response.data.error || !response.data.token) {
      // Check for error or missing token
      return rejectWithValue(response.data.error || "Registration failed: No token received")
    }

    localStorage.setItem("token", response.data.token)
    return response.data // Should contain { user, token }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Registration failed")
  }
})

export const loginUser = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, {
      email,
      password,
    })

    if (response.data.error || !response.data.token) {
      // Check for error or missing token
      return rejectWithValue(response.data.error || "Login failed: No token received")
    }

    localStorage.setItem("token", response.data.token)
    return response.data // Should contain { user, token }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Login failed")
  }
})

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async (_, { rejectWithValue, getState }) => {
  // Added getState
  try {
    const token = getState().auth.token || localStorage.getItem("token") // Prefer token from state
    if (!token) {
      return rejectWithValue("No token found")
    }

    const response = await axios.get(`${API_BASE_URL}/user/current`, {
      headers: {
        Authorization: token, // Assuming backend expects 'Bearer <token>' or just '<token>'
      },
    })

    return response.data // Should contain { user }
  } catch (error) {
    // If token is invalid (e.g., 401 Unauthorized), clear it
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token")
      return rejectWithValue("Invalid token. Please log in again.")
    }
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to get user")
  }
})

export const getUserOffers = createAsyncThunk("auth/getUserOffers", async (userId, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token
    if (!token) return rejectWithValue("Not authenticated")

    const response = await axios.get(`${API_BASE_URL}/user/offer/${userId}`, {
      // API endpoint from original code
      headers: { Authorization: token },
    })
    return response.data.offers || response.data // Adjust based on actual API response
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to get user offers")
  }
})

export const acceptUserOffer = createAsyncThunk("auth/acceptOffer", async (offerId, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token
    if (!token) return rejectWithValue("Not authenticated")

    const response = await axios.post(
      `${API_BASE_URL}/user/accept/${offerId}`,
      {},
      {
        // API endpoint from original code
        headers: { Authorization: token },
      },
    )
    return { offerId, updatedOffer: response.data.offer || response.data } // Adjust based on actual API response
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to accept offer")
  }
})

export const rejectUserOffer = createAsyncThunk("auth/rejectOffer", async (offerId, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token
    if (!token) return rejectWithValue("Not authenticated")

    const response = await axios.post(
      `${API_BASE_URL}/user/reject/${offerId}`,
      {},
      {
        // API endpoint from original code
        headers: { Authorization: token },
      },
    )
    return { offerId, updatedOffer: response.data.offer || response.data } // Adjust based on actual API response
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to reject offer")
  }
})

const initialAuthState = {
  user: null,
  token: localStorage.getItem("token"), // Initialize token from localStorage
  userOffers: [],
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"), // Initialize isAuthenticated based on token presence
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.userOffers = []
      state.error = null // Clear error on logout
      localStorage.removeItem("token")
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false // Ensure not authenticated on rejection
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false // Ensure not authenticated on rejection
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null // Clear error while fetching
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null // Clear user on rejection
        state.token = null // Clear token if invalid
      })
      // Get User Offers
      .addCase(getUserOffers.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserOffers.fulfilled, (state, action) => {
        state.loading = false
        state.userOffers = action.payload
      })
      .addCase(getUserOffers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Accept Offer
      .addCase(acceptUserOffer.pending, (state) => {
        state.loading = true // Or a specific loading state for offers
      })
      .addCase(acceptUserOffer.fulfilled, (state, action) => {
        state.loading = false
        state.userOffers = state.userOffers.map((offer) =>
          offer._id === action.payload.offerId
            ? { ...action.payload.updatedOffer, status: "accepted" } // Ensure status is updated
            : offer,
        )
      })
      .addCase(acceptUserOffer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload // Or a specific error state for offers
      })
      // Reject Offer
      .addCase(rejectUserOffer.pending, (state) => {
        state.loading = true // Or a specific loading state for offers
      })
      .addCase(rejectUserOffer.fulfilled, (state, action) => {
        state.loading = false
        state.userOffers = state.userOffers.map((offer) =>
          offer._id === action.payload.offerId
            ? { ...action.payload.updatedOffer, status: "Rejected" } // Ensure status is updated
            : offer,
        )
      })
      .addCase(rejectUserOffer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload // Or a specific error state for offers
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer

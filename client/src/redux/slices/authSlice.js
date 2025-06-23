import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_LINK;

export const registerUser = createAsyncThunk("auth/register", async ({ email, password, numero }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/register`, {
      email,
      password,
      numero
    })

    if (response.data.error || !response.data.token) {
      return rejectWithValue(response.data.error || "Registration failed: No token received")
    }

    localStorage.setItem("token", response.data.token)
    return response.data
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
      return rejectWithValue(response.data.error || "Login failed: No token received")
    }

    localStorage.setItem("token", response.data.token)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Login failed")
  }
})

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token || localStorage.getItem("token")
    if (!token) {
      return rejectWithValue("No token found")
    }

    const response = await axios.get(`${API_BASE_URL}/user/current`, {
      headers: {
        Authorization: token,
      },
    })

    return response.data
  } catch (error) {
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
      headers: { Authorization: token },
    })
    return response.data.offers || response.data
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
        headers: { Authorization: token },
      },
    )
    return { offerId, updatedOffer: response.data.offer || response.data }
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
        headers: { Authorization: token },
      },
    )
    return { offerId, updatedOffer: response.data.offer || response.data }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to reject offer")
  }
})

export const GetAllUsers = createAsyncThunk("auth/getAllusers", async() => {
  try {
    const response = await axios.get(API_BASE_URL + "/user/all")
    return response.data;
  } catch (error) {
    console.log(error)
  }
})

export const updateUserRole = createAsyncThunk("auth/updateUserRole", async ({ userId, role }, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Not authenticated");
    const response = await axios.patch(`${API_BASE_URL}/user/${role}/${userId}`, {}, {
      headers: { Authorization: token },
    });
    return { userId, role };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to update user role");
  }
});

export const deleteUser = createAsyncThunk("auth/deleteUser", async (userId, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Not authenticated");
    await axios.delete(`${API_BASE_URL}/user/${userId}`, {
      headers: { Authorization: token },
    });
    return userId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to delete user");
  }
});

const initialAuthState = {
  user: null,
  users: [],
  token: localStorage.getItem("token"),
  userOffers: [],
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
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
      state.error = null
      localStorage.removeItem("token")
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.isAuthenticated = false
      })
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
        state.isAuthenticated = false
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
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
        state.user = null
        state.token = null
      })
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
      .addCase(acceptUserOffer.pending, (state) => {
        state.loading = true
      })
      .addCase(acceptUserOffer.fulfilled, (state, action) => {
        state.loading = false
        state.userOffers = state.userOffers.map((offer) =>
          offer._id === action.payload.offerId
            ? { ...action.payload.updatedOffer, status: "accepted" }
            : offer,
        )
      })
      .addCase(acceptUserOffer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(rejectUserOffer.pending, (state) => {
        state.loading = true
      })
      .addCase(rejectUserOffer.fulfilled, (state, action) => {
        state.loading = false
        state.userOffers = state.userOffers.map((offer) =>
          offer._id === action.payload.offerId
            ? { ...action.payload.updatedOffer, status: "Rejected" }
            : offer,
        )
      })
      .addCase(rejectUserOffer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })


      .addCase(GetAllUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(GetAllUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(GetAllUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map(user =>
          user._id === action.payload.userId ? { ...user, role: action.payload.role } : user
        );
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
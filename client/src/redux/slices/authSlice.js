import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:2000'; // Define your API base URL

// Async Thunks
export const userRegister = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/register`, userData);
      return response.data; // Expecting { user, token }
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.error || 'Registration failed');
      }
      return rejectWithValue('Network error or server unavailable');
    }
  }
);

export const userLogin = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, userData);
      return response.data; // Expecting { user, token }
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.error || 'Login failed');
      }
      return rejectWithValue('Network error or server unavailable');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    const token = localStorage.getItem('token');
    

    try {
      // Assuming your backend expects 'x-auth-token' or 'Authorization: Bearer <token>'
      // Based on your previous backend snippet (token: `bearer ${token}`),
      // we'll use `Authorization: Bearer <token_value>`
      const actualToken = token.startsWith('bearer ') ? token.split(' ')[1] : token; // Extract token value
      const response = await axios.get(`${API_BASE_URL}/user/current`, {
        headers: {
          'Authorization': `Bearer ${actualToken}`, // Use 'Authorization' header with 'Bearer' prefix
        },
      });
      return response.data.user; // Expecting { user: {...} }
    } catch (error) {
      if (error.response && error.response.data) {
        // Clear invalid token if auth error
        localStorage.removeItem('token');
        return rejectWithValue(error.response.data.error || 'Authentication error');
      }
      localStorage.removeItem('token'); // Clear token on network/server error
      return rejectWithValue('Network error or server unavailable');
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    user: null,
    error: null,
  },
  reducers: {
    // Reducer to clear authentication errors
    clearAuthErrors: (state) => {
      state.error = null;
    },
    // Reducer for logout
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Payload is the error message from rejectWithValue
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
      })
      // Login
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload; // Payload is the user object
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null; // Ensure token is cleared if fetch fails
        state.error = action.payload;
        localStorage.removeItem('token');
      });
  },
});

export const { clearAuthErrors, logout } = authSlice.actions; // Export sync actions
export default authSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:2000'; // Define your API base URL

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/book`, bookingData, {
        headers: {
          // If booking route needs authentication, pass the token here
          // 'Authorization': `Bearer ${localStorage.getItem('token').split(' ')[1]}`,
        },
      });
      return response.data; // Backend sends "c bon" as text, axios will parse it.
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data); // Backend sends plain text error or JSON
      }
      return rejectWithValue('Network error or server unavailable');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearBookingStatus: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload; // "c bon"
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
});

export const { clearBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_LINK + '/destination';

export const fetchDestinations = createAsyncThunk(
    'destinations/fetchDestinations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data.destinations;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addDestination = createAsyncThunk(
    'destinations/addDestination',
    async (cityData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, cityData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteDestination = createAsyncThunk(
    'destinations/deleteDestination',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    destinations: [],
    loading: false,
    error: null,
};

const destinationsSlice = createSlice({
    name: 'destinations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDestinations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDestinations.fulfilled, (state, action) => {
                state.loading = false;
                state.destinations = action.payload;
            })
            .addCase(fetchDestinations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addDestination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDestination.fulfilled, (state, action) => {
                state.loading = false;
                state.destinations.push(action.payload);
            })
            .addCase(addDestination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteDestination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDestination.fulfilled, (state, action) => {
                state.loading = false;
                state.destinations = state.destinations.filter(
                    (destination) => destination._id !== action.payload
                );
            })
            .addCase(deleteDestination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default destinationsSlice.reducer;
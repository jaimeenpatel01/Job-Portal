import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    loading: false,
    savedJobs: []
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setSavedJobs: (state, action) => {
            state.savedJobs = action.payload;
        },
        addSavedJob: (state, action) => {
            if (!state.savedJobs.find(job => job._id === action.payload._id)) {
                state.savedJobs.push(action.payload);
            }
        },
        removeSavedJob: (state, action) => {
            state.savedJobs = state.savedJobs.filter(job => job._id !== action.payload);
        }
    }
})

export const { setUser, setLoading, setSavedJobs, addSavedJob, removeSavedJob } = authSlice.actions;
export default authSlice.reducer;
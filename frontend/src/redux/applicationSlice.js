import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name:'application',
    initialState:{
        applicants:null,
    },
    reducers:{
        setAllApplicants:(state,action) => {
            state.applicants = action.payload;
        },
        updateApplicationStatus:(state,action) => {
            const { applicationId, status } = action.payload;
            if (state.applicants && state.applicants.applications) {
                const application = state.applicants.applications.find(app => app._id === applicationId);
                if (application) {
                    application.status = status;
                }
            }
        }
    }
});
export const {setAllApplicants, updateApplicationStatus} = applicationSlice.actions;
export default applicationSlice.reducer;
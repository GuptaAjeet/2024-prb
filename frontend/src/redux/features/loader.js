import { createSlice } from "@reduxjs/toolkit";
const initialState = { show: "", display:'none','nav':false,'listingReloader':false,'reRender':false,'optional':0,logout:false};

export const loader = createSlice({
    name: "loader",
    initialState,
    reducers: {
        showLoader: (state) => {
          
            state.show      = 'show';
            state.display   = 'block';
        },
        hideLoader: (state) => {
            state.show      = '';
            state.display   = 'none';
        },
        navReloader: (state) => {
            state.nav      = true;
        },
        listingReloader: (state) => {
            state.nav      = true;
        },
        reRender: (state, action) => {
            state.reRender = action.payload.render;
            state.optional = (action.payload.optional !== undefined) ? action.payload.optional : '';
        },
        logout: (state) => {
            state.logout      = true;
        }
    }
});

export const { showLoader, hideLoader,navReloader,listingReloader,reRender,logout } = loader.actions;
export default loader.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = { page:1, limit:5, reload:0};

export const preference = createSlice({
    name: "preference",
    initialState,
    reducers: {
        makepreferenceHandler : (state, action) => {
            state.page      = (action.payload.page !== undefined) ? action.payload.page : 1;
            state.limit     = (action.payload.limit !== undefined) ? action.payload.limit : 5;
            state.reload    = (action.payload.reload !== undefined) ? action.payload.reload : 0;
            state.where     = (action.payload.where !== undefined) ? action.payload.where : {};
        }
    }
});

export const { makepreferenceHandler} = preference.actions;
export default preference.reducer;
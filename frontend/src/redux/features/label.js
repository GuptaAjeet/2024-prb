import { createSlice } from "@reduxjs/toolkit";

const title  = localStorage.getItem('label');
const optional = localStorage.getItem('optional');

const initialState = { title:title, optional:optional };

export const label = createSlice({
    name: "title",
    initialState,
    reducers: {
        setLabel: (state, action) => {
            state.title = action.payload.title;
            state.optional = action.payload.optional;
        },
        getLabel: (state, action) => {
            state.title = action.payload.title;
            state.optional = action.payload.optional;
        }
    },
});

export const { setLabel, getLabel } = label.actions;
export default label.reducer;
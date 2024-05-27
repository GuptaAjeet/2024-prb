
import { createSlice } from "@reduxjs/toolkit";
const initialState = [];

export const menu = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setMenu: (state,action) => {
            state = action.payload.payload;
            return state;
        },
        getMenu: (state) => {
            return state;
        }
    }
});

export const { setMenu, getMenu } = menu.actions;
export default menu.reducer;
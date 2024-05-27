import { createSlice } from "@reduxjs/toolkit";

const initialState = { page: 1, limit: 10, reload: 0, where: { value: "" } };

export const handler = createSlice({
    name: "handler",
    initialState,
    reducers: {
        makeHandler: (state, action) => {
            state.page = (action.payload.page !== undefined) ? action.payload.page : 1;
            state.limit = (action.payload.limit !== undefined) ? action.payload.limit : 10;
            state.reload = (action.payload.reload !== undefined) ? action.payload.reload : 0;
            state.where = (action.payload.where !== undefined) ? action.payload.where : state.where;
        }
    }
});

export const { makeHandler } = handler.actions;
export default handler.reducer;
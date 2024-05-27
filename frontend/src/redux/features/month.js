import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  month: localStorage.getItem("progress_month") || `1`,
};
export const month = createSlice({
  name: "month",
  initialState,
  reducers: {
    setMonth: (state, action) => {
      state.month = action.payload.month;
    },
    getMonth: (state) => state.month,
  },
});

export const { setMonth, getMonth } = month.actions;
export default month.reducer;

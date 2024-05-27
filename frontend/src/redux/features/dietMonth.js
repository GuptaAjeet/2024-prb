import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  month: localStorage.getItem("diet_progress_month") || `1`,
};
export const month = createSlice({
  name: "month",
  initialState,
  reducers: {
    setDietMonth: (state, action) => {
      state.month = action.payload.month;
    },
    getDietMonth: (state) => state.month,
  },
});

export const { setDietMonth, getDietMonth } = month.actions;
export default month.reducer;

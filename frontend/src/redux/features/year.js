import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  year: `2024-2025`,
};
export const year = createSlice({
  name: "year",
  initialState,
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload.year;
    },
    getYear: (state) => state.year,
  },
});

export const { setYear, getYear } = year.actions;
export default year.reducer;

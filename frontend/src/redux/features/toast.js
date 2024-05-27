import { createSlice } from "@reduxjs/toolkit";
const initialState = { show: "", message: "", flag: "success" };
export const toast = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.flag = action.payload.flag;
      state.show = "show";
    },
    hideToast: (state) => {
      state.message = "";
      state.flag = "";
      state.show = "";
    },
  },
});

export const { showToast, hideToast } = toast.actions;
export default toast.reducer;

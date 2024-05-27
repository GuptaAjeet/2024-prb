import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  view: false,
  show: "",
  display: "none",
  title: "",
  btntext: "",
  size: "lg",
  footer: false,
};

export const modal = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal: (state, action) => {
      state.view = true;
      state.show = "show";
      state.display = "block";
      state.title = action.payload.title;
      state.btntext = action.payload.btntext;
      state.size = action.payload.size !== undefined ? action.payload.size : "lg";
      state.footer = action.payload.footer !== undefined ? action.payload.footer : false;
    },
    hideModal: (state) => {
      state.view = false;
      state.show = "";
      state.display = "none";
      state.title = "";
      state.size = "lg";
      state.footer = false;
    },
  },
});

export const { showModal, hideModal } = modal.actions;
export default modal.reducer;

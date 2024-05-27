import { createSlice } from "@reduxjs/toolkit";

let oldModule = localStorage.getItem("module");
const initialState = {
  module: oldModule,
};
export const module = createSlice({
  name: "module",
  initialState,
  reducers: {
    setModule: (state, action) => {
      localStorage.setItem("module", action.payload.module);
      state.module = action.payload.module;
    },
    getModule: (state) => state.module,
  },
});

export const { setModule, getModule } = module.actions;
export default module.reducer;

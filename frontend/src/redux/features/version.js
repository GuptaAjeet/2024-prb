import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  version: `V1`,
};
export const version = createSlice({
  name: "version",
  initialState,
  reducers: {
    setVersion: (state, action) => {
      state.version = action.payload.version;
    },
    getVersion: (state) => state.version,
  },
});

export const { setVersion, getVersion } = version.actions;
export default version.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "../Types";

const initialState: InitialState = {
  user: null,
  displayName: "",
  photo: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

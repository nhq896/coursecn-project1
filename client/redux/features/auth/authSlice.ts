import { User } from "@/app/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string;
  user: User | null;
}

const initialState: UserState = {
  token: "",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    login: (
      state,
      action: PayloadAction<{ accessToken: string; user: User }>,
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = "";
      state.user = null;
    },
  },
});

export const { registerUser, login, logout } = authSlice.actions;

export default authSlice.reducer;

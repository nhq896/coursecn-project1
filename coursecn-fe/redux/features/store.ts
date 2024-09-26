"use client";

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authSlice from "./auth/authSlice";

// Khởi tạo Redux store
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

// Tải thông tin người dùng khi trang được tải
const initializeApp = async () => {
  await store.dispatch(apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }));
};

initializeApp();

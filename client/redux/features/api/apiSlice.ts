import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { login } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  }),
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "/refresh",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getUserInfo: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            login({
              accessToken: result.data.accessToken,
              user: result.data.user,
            }),
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useGetUserInfoQuery } = apiSlice;

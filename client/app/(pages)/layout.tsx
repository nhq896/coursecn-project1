"use client";

import "../globals.css";
import { Poppins, Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { useGetUserInfoQuery } from "@/redux/features/api/apiSlice";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${josefin.variable} custom-scrollbar antialiased duration-100`}
      >
        <Provider store={store}>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <Custom>{children}</Custom>
              <Toaster position="top-right" richColors theme="light" />
            </ThemeProvider>
          </SessionProvider>
        </Provider>
      </body>
    </html>
  );
}

const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showing, setShowing] = useState(false);
  const { isLoading } = useGetUserInfoQuery({});

  useEffect(() => {
    setShowing(true);
  }, []);

  if (!showing || isLoading) {
    return <Loader />;
  }

  return children;
};

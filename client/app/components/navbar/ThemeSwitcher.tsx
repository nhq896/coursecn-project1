"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunMedium, Moon } from "lucide-react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="mx-4 flex items-center justify-center">
      {theme === "dark" ? (
        <Moon
          className="cursor-pointer"
          fill="black"
          size={24}
          onClick={() => setTheme("light")}
        />
      ) : (
        <SunMedium
          className="cursor-pointer"
          size={24}
          onClick={() => setTheme("dark")}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;

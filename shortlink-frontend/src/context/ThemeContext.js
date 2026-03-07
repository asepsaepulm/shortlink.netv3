'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setDark(true);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      localStorage.setItem('theme', !prev ? 'dark' : 'light');
      return !prev;
    });
  };

  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

import { createContext, useState, type ReactNode } from "react";
import { getTheme, saveTheme, applyTheme, type Theme } from "../utils/theme";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(getTheme);
  console.error();

  const toggleTheme = () => {
    const newTheme = theme === "Dark" ? "Light" : "Dark";

    setTheme(newTheme);
    saveTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };

export type Theme = "Light" | "Dark";

const getTheme = () => {
  return (localStorage.getItem("Theme") as Theme) ?? "Light";
};

const saveTheme = (Theme: Theme): void => {
  localStorage.setItem(Theme, Theme);
};

const applyTheme = (Theme: Theme) => {
  document.documentElement.classList.toggle("dark", Theme === "Dark");
};

export { getTheme, saveTheme, applyTheme };

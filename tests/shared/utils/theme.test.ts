import { getTheme, saveTheme, applyTheme } from "@/shared/utils/theme";

/* - Limpando o localStorage entre os testes para evitar erros - */

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

/* - Testando o getTheme - */

test("should return 'Light' when there is no theme in localStorage", () => {
  expect(getTheme()).toBe("Light");
});

test("should return 'Dark' when theme is 'Dark' in localStorage", () => {
  localStorage.setItem("Theme", "Dark");
  expect(getTheme()).toBe("Dark");
});

test("should return 'Light' when theme is 'Light' in localStorage", () => {
  localStorage.setItem("Theme", "Light");
  expect(getTheme()).toBe("Light");
});

/* - Testando o saveTheme - */

test("should save 'Dark' theme in localStorage", () => {
  saveTheme("Dark");
  expect(localStorage.getItem("Dark")).toBe("Dark");
});

test("should save 'Light' theme in localStorage", () => {
  saveTheme("Light");
  expect(localStorage.getItem("Light")).toBe("Light");
});

/* - Testando o applyTheme - */

test("should add 'dark' class to documentElement when theme is 'Dark'", () => {
  applyTheme("Dark");
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});

test("should remove 'dark' class from documentElement when theme is 'Light'", () => {
  document.documentElement.classList.add("dark");
  applyTheme("Light");
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});

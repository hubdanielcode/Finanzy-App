import { renderHook, act } from "@testing-library/react";
import { ThemeContext, ThemeProvider } from "@/shared/context/ThemeContext";
import { useContext, createElement, type ReactNode } from "react";
import { vi } from "vitest";

/* - Criando os mocks das funções de tema - */

vi.mock("@/shared/utils/theme", () => ({
  getTheme: vi.fn(() => "Light"),
  saveTheme: vi.fn(),
  applyTheme: vi.fn(),
}));

/* - Importando os mocks para verificar chamadas - */

import { saveTheme, applyTheme } from "@/shared/utils/theme";

/* - Limpando os mocks entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Criando o wrapper com o provider - */

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(ThemeProvider, null, children);

/* - Testando o valor inicial do tema - */

test("should return 'Light' as initial theme", () => {
  const { result } = renderHook(() => useContext(ThemeContext), { wrapper });

  expect(result.current?.theme).toBe("Light");
});

/* - Testando o toggleTheme de Light para Dark - */

test("should toggle theme from 'Light' to 'Dark'", () => {
  const { result } = renderHook(() => useContext(ThemeContext), { wrapper });

  act(() => {
    result.current?.toggleTheme();
  });

  expect(result.current?.theme).toBe("Dark");
});

/* - Testando o toggleTheme de Dark para Light - */

test("should toggle theme from 'Dark' to 'Light'", () => {
  const { result } = renderHook(() => useContext(ThemeContext), { wrapper });

  act(() => {
    result.current?.toggleTheme();
  });

  act(() => {
    result.current?.toggleTheme();
  });

  expect(result.current?.theme).toBe("Light");
});

/* - Testando se o saveTheme é chamado ao alternar o tema - */

test("should call saveTheme with 'Dark' when toggling from 'Light'", () => {
  const { result } = renderHook(() => useContext(ThemeContext), { wrapper });

  act(() => {
    result.current?.toggleTheme();
  });

  expect(saveTheme).toHaveBeenCalledWith("Dark");
});

/* - Testando se o applyTheme é chamado ao alternar o tema - */

test("should call applyTheme with 'Dark' when toggling from 'Light'", () => {
  const { result } = renderHook(() => useContext(ThemeContext), { wrapper });

  act(() => {
    result.current?.toggleTheme();
  });

  expect(applyTheme).toHaveBeenCalledWith("Dark");
});

/* - Testando se o contexto lança erro fora do provider - */

test("should return null when used outside the provider", () => {
  const { result } = renderHook(() => useContext(ThemeContext));

  expect(result.current).toBeNull();
});

import { renderHook } from "@testing-library/react";
import { useThemeContext } from "@/shared/hooks/useThemeContext";
import { ThemeContext } from "@/shared/context/ThemeContext";
import { createElement, type ReactNode } from "react";
import { vi } from "vitest";

/* - Criando o mock do contexto - */

const mockContextValue = {
  theme: "Light" as const,
  toggleTheme: vi.fn(),
};

/* - Criando o wrapper com o provider - */

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(ThemeContext.Provider, { value: mockContextValue }, children);

/* - Testando o retorno do contexto - */

test("should return the context value when used inside the provider", () => {
  const { result } = renderHook(() => useThemeContext(), { wrapper });

  expect(result.current).toEqual(mockContextValue);
});

/* - Testando o erro ao usar fora do provider - */

test("should throw an error when used outside the provider", () => {
  expect(() => renderHook(() => useThemeContext())).toThrow(
    "useThemeContext must be used within a ThemeProvider",
  );
});

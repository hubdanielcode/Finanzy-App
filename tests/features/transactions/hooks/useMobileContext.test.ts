import { renderHook } from "@testing-library/react";
import { MobileContext } from "@/features/transactions/context/MobileContext";
import { useMobileContext } from "@/features/transactions/hooks/useMobileContext";
import { createElement, type ReactNode } from "react";
import { vi } from "vitest";

/* - Criando o mock do contexto - */

const mockContextValue = {
  isMobile: true,
  isLandscape: false,
  isMobileFormOpen: false,
  setIsMobileFormOpen: vi.fn(),
  isMobileTransactionListOpen: false,
  setIsMobileTransactionListOpen: vi.fn(),
  isMobileChartOpen: false,
  setIsMobileChartOpen: vi.fn(),
};

/* - Criando o wrapper com o provider - */

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(MobileContext.Provider, { value: mockContextValue }, children);

/* - Testando o retorno do contexto - */

test("should return the context value when used inside the provider", () => {
  const { result } = renderHook(() => useMobileContext(), { wrapper });

  expect(result.current).toEqual(mockContextValue);
});

/* - Testando o erro ao usar fora do provider - */

test("should throw an error when used outside the provider", () => {
  expect(() => renderHook(() => useMobileContext())).toThrow(
    "useMobileContext must be used within a MobileProvider",
  );
});

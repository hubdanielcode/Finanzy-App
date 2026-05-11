import { renderHook } from "@testing-library/react";
import { useTransactionContext } from "@/features/transactions";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import type { Transaction } from "@/features/transactions/model/transactionTypes";
import React from "react";
import { vi } from "vitest";

/* - Criando o mock para simular o TransactionContext nos testes - */

const fakeTransaction: Transaction = {
  id: "1",
  title: "Pagamento",
  amount: 5000,
  type: "Entrada",
  date: "2024-01-01",
  period: "Mais de um ano",
  category: "Salário",
  user_id: "user-123",
};

const fakeContextValue = {
  transactions: [] as Transaction[],
  handleAddTransaction: vi.fn(),
  handleUpdateTransaction: vi.fn(),
  handleDeleteTransaction: vi.fn(),
  totalIncome: 0,
  totalExpense: 0,
  availableMoney: 0,
  fetchTransactions: vi.fn(),
  isLoading: false,
  isWidgetOpen: false,
  setIsWidgetOpen: vi.fn(),
};

const createWrapper =
  (contextValue: typeof fakeContextValue | null) =>
  ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      TransactionContext.Provider,
      { value: contextValue },
      children,
    );

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando o useTransactionContext - */

test("should return context value when used within a provider", () => {
  const { result } = renderHook(() => useTransactionContext(), {
    wrapper: createWrapper(fakeContextValue),
  });

  expect(result.current).toEqual(fakeContextValue);
});

test("should throw an error when used outside of a ContextProvider", () => {
  expect(() =>
    renderHook(() => useTransactionContext(), {
      wrapper: createWrapper(null),
    }),
  ).toThrow("TransactionContext must be used within a ContextProvider");
});

test("should return transactions list from context", () => {
  const contextWithTransactions = {
    ...fakeContextValue,
    transactions: [fakeTransaction],
  };

  const { result } = renderHook(() => useTransactionContext(), {
    wrapper: createWrapper(contextWithTransactions),
  });

  expect(result.current.transactions).toHaveLength(1);
  expect(result.current.transactions[0].id).toBe("1");
});

test("should return correct totalIncome from context", () => {
  const { result } = renderHook(() => useTransactionContext(), {
    wrapper: createWrapper({ ...fakeContextValue, totalIncome: 5000 }),
  });

  expect(result.current.totalIncome).toBe(5000);
});

test("should return correct totalExpense from context", () => {
  const { result } = renderHook(() => useTransactionContext(), {
    wrapper: createWrapper({ ...fakeContextValue, totalExpense: 1500 }),
  });

  expect(result.current.totalExpense).toBe(1500);
});

test("should return correct availableMoney from context", () => {
  const { result } = renderHook(() => useTransactionContext(), {
    wrapper: createWrapper({ ...fakeContextValue, availableMoney: 3500 }),
  });

  expect(result.current.availableMoney).toBe(3500);
});

test("should return isLoading as false by default", () => {
  const { result } = renderHook(() => useTransactionContext(), {
    wrapper: createWrapper(fakeContextValue),
  });

  expect(result.current.isLoading).toBe(false);
});

test("should return isLoading as true when loading", () => {
  const { result } = renderHook(() => useTransactionContext(), {
    wrapper: createWrapper({ ...fakeContextValue, isLoading: true }),
  });

  expect(result.current.isLoading).toBe(true);
});

test("should have access to handleAddTransaction function from context", () => {
  const { result } = renderHook(() => useTransactionContext(), {
    wrapper: createWrapper(fakeContextValue),
  });

  expect(result.current.handleAddTransaction).toBeInstanceOf(Function);
});

test("should have access to handleUpdateTransaction function from context", () => {
  const { result } = renderHook(() => useTransactionContext(), {
    wrapper: createWrapper(fakeContextValue),
  });

  expect(result.current.handleUpdateTransaction).toBeInstanceOf(Function);
});

test("should have access to handleDeleteTransaction function from context", () => {
  const { result } = renderHook(() => useTransactionContext(), {
    wrapper: createWrapper(fakeContextValue),
  });

  expect(result.current.handleDeleteTransaction).toBeInstanceOf(Function);
});

test("should have access to fetchTransactions function from context", () => {
  const { result } = renderHook(() => useTransactionContext(), {
    wrapper: createWrapper(fakeContextValue),
  });

  expect(result.current.fetchTransactions).toBeInstanceOf(Function);
});

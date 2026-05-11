import React, { type ReactNode } from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import {
  TransactionContext,
  TransactionProvider,
} from "@/features/transactions/context/TransactionContext";

import type {
  Transaction,
  NewTransaction,
} from "@/features/transactions/model/transactionTypes";

import * as transactionService from "@/features/transactions/services/transactionService";

/* - Mockando os serviços das transações - */

vi.mock("@/features/transactions/services/transactionService", () => ({
  getTransactions: vi.fn(),
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
}));

/* - Criando dados falsos para os testes - */

const fakeTransactions: Transaction[] = [
  {
    id: "1",
    title: "Salário",
    amount: 5000,
    type: "Entrada",
    category: "Salário",
    date: "2026-01-10",
    period: "Último Mês",
    user_id: "user-1",
  },
  {
    id: "2",
    title: "Aluguel",
    amount: 2000,
    type: "Saída",
    category: "Moradia",
    date: "2026-01-15",
    period: "Último Mês",
    user_id: "user-1",
  },
];

const fakeNewTransaction: NewTransaction = {
  title: "Freelance",
  amount: 1500,
  type: "Entrada",
  category: "Extra",
  date: "2026-01-20",
  period: "Último Mês",
};

/* - Criando wrapper do provider - */

const wrapper = ({ children }: { children: ReactNode }) => (
  <TransactionProvider>{children}</TransactionProvider>
);

/* - Hook auxiliar para consumir o contexto - */

const useTransactionContext = () => {
  const context = React.useContext(TransactionContext);

  if (!context) {
    throw new Error(
      "TransactionContext must be used within TransactionProvider",
    );
  }

  return context;
};

/* - Limpando os mocks entre os testes - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Agrupando os testes do contexto - */

describe("TransactionContext", () => {
  /* - Testando os valores iniciais - */

  test("should initialize with default values", async () => {
    vi.mocked(transactionService.getTransactions).mockResolvedValue([]);

    const { result } = renderHook(() => useTransactionContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.transactions).toEqual([]);
    });

    expect(result.current.totalIncome).toBe(0);
    expect(result.current.totalExpense).toBe(0);
    expect(result.current.availableMoney).toBe(0);
    expect(result.current.isWidgetOpen).toBe(false);
  });

  /* - Testando a busca de transações ao montar o provider - */

  test("should fetch transactions on mount", async () => {
    vi.mocked(transactionService.getTransactions).mockResolvedValue(
      fakeTransactions,
    );

    const { result } = renderHook(() => useTransactionContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.transactions).toEqual(fakeTransactions);
    });

    expect(transactionService.getTransactions).toHaveBeenCalledTimes(1);
  });

  /* - Testando os cálculos financeiros - */

  test("should calculate totals correctly", async () => {
    vi.mocked(transactionService.getTransactions).mockResolvedValue(
      fakeTransactions,
    );

    const { result } = renderHook(() => useTransactionContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.totalIncome).toBe(5000);
      expect(result.current.totalExpense).toBe(2000);
      expect(result.current.availableMoney).toBe(3000);
    });
  });

  /* - Testando a adição de transação - */

  test("should call createTransaction and refetch on handleAddTransaction", async () => {
    vi.mocked(transactionService.getTransactions).mockResolvedValue(
      fakeTransactions,
    );

    vi.mocked(transactionService.createTransaction).mockResolvedValue(
      fakeTransactions[0],
    );

    const { result } = renderHook(() => useTransactionContext(), { wrapper });

    await act(async () => {
      await result.current.handleAddTransaction(fakeNewTransaction);
    });

    expect(transactionService.createTransaction).toHaveBeenCalledWith(
      fakeNewTransaction,
    );

    expect(transactionService.getTransactions).toHaveBeenCalledTimes(2);
  });

  /* - Testando a atualização de transação - */

  test("should call updateTransaction and refetch on handleUpdateTransaction", async () => {
    vi.mocked(transactionService.getTransactions).mockResolvedValue(
      fakeTransactions,
    );

    vi.mocked(transactionService.updateTransaction).mockResolvedValue(
      fakeTransactions[0],
    );

    const { result } = renderHook(() => useTransactionContext(), { wrapper });

    await act(async () => {
      await result.current.handleUpdateTransaction(
        fakeTransactions[0] as Transaction,
      );
    });

    expect(transactionService.updateTransaction).toHaveBeenCalledWith(
      fakeTransactions[0] as Transaction,
    );

    expect(transactionService.getTransactions).toHaveBeenCalledTimes(2);
  });

  /* - Testando a deleção de transação - */

  test("should call deleteTransaction and refetch on handleDeleteTransaction", async () => {
    vi.mocked(transactionService.getTransactions).mockResolvedValue(
      fakeTransactions,
    );

    vi.mocked(transactionService.deleteTransaction).mockResolvedValue(
      undefined,
    );

    const { result } = renderHook(() => useTransactionContext(), { wrapper });

    await act(async () => {
      await result.current.handleDeleteTransaction("1");
    });

    expect(transactionService.deleteTransaction).toHaveBeenCalledWith("1");

    expect(transactionService.getTransactions).toHaveBeenCalledTimes(2);
  });

  /* - Testando o estado de loading - */

  test("should update loading state while fetching transactions", async () => {
    vi.mocked(transactionService.getTransactions).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(fakeTransactions), 100),
        ),
    );

    const { result } = renderHook(() => useTransactionContext(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  /* - Testando o estado do widget - */

  test("should update widget state correctly", async () => {
    vi.mocked(transactionService.getTransactions).mockResolvedValue([]);

    const { result } = renderHook(() => useTransactionContext(), { wrapper });

    act(() => {
      result.current.setIsWidgetOpen(true);
    });

    expect(result.current.isWidgetOpen).toBe(true);
  });

  /* - Testando erro ao buscar transações - */

  test("should handle fetch transactions error gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(transactionService.getTransactions).mockRejectedValue(
      new Error("Fetch error"),
    );

    renderHook(() => useTransactionContext(), {
      wrapper,
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  /* - Testando erro ao adicionar transação - */

  test("should handle add transaction error gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(transactionService.getTransactions).mockResolvedValue([]);

    vi.mocked(transactionService.createTransaction).mockRejectedValue(
      new Error("Create error"),
    );

    const { result } = renderHook(() => useTransactionContext(), { wrapper });

    await act(async () => {
      await result.current.handleAddTransaction(fakeNewTransaction);
    });

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

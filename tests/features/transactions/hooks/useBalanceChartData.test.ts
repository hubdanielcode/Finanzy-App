import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useBalanceChartData } from "@/features/transactions/hooks/useBalanceChartData";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import type { Transaction } from "@/features/transactions/model/transactionTypes";
import React from "react";

/* - Criando uma função para simular o TransactionContext - */

const fakeContextValue = (transactions: Transaction[] = []) => ({
  transactions,
  handleAddTransaction: vi.fn(),
  handleUpdateTransaction: vi.fn(),
  handleDeleteTransaction: vi.fn(),
  fetchTransactions: vi.fn(),
  totalIncome: 0,
  totalExpense: 0,
  availableMoney: 0,
  isLoading: false,
  isWidgetOpen: false,
  setIsWidgetOpen: vi.fn(),
});

/* - Envolvendo o hook no contexto para que ele possa funcionar - */

const renderWithTransactions = (transactions: Transaction[] = []) =>
  renderHook(() => useBalanceChartData(), {
    wrapper: ({ children }) =>
      React.createElement(
        TransactionContext.Provider,
        { value: fakeContextValue(transactions) },
        children,
      ),
  });

/* - Criando uma função para simular uma transação - */

const fakeTransaction = (
  overrides: Partial<Transaction> = {},
): Transaction => ({
  id: "1",
  title: "Transação",
  amount: 1000,
  type: "Entrada",
  date: "2024-01-15",
  period: "Mais de um ano",
  category: "Salário",
  user_id: "user-123",
  ...overrides,
});

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - useBalanceChartData - */

describe("useBalanceChartData", () => {
  /* - Retorno com dados vazios - */

  test("should return empty array when there are no transactions", () => {
    const { result } = renderWithTransactions([]);

    expect(result.current).toEqual([]);
  });

  /* - Agrupamento por mês - */

  test("should return one entry per month", () => {
    const transactions = [
      fakeTransaction({ id: "1", date: "2024-01-10" }),
      fakeTransaction({ id: "2", date: "2024-01-20" }),
      fakeTransaction({ id: "3", date: "2024-02-05" }),
    ];

    const { result } = renderWithTransactions(transactions);

    expect(result.current).toHaveLength(2);
  });

  test("should use short month name as key", () => {
    const transactions = [fakeTransaction({ date: "2024-03-10" })];

    const { result } = renderWithTransactions(transactions);

    expect(result.current[0].month).toBe("Mar");
  });

  /* - Cálculo do saldo - */

  test("should add 'Entrada' amount to 'Saldo'", () => {
    const transactions = [
      fakeTransaction({ type: "Entrada", amount: 3000, date: "2024-01-10" }),
    ];

    const { result } = renderWithTransactions(transactions);

    expect(result.current[0].Saldo).toBe(3000);
  });

  test("should subtract 'Saída' amount from 'Saldo'", () => {
    const transactions = [
      fakeTransaction({ type: "Saída", amount: 1000, date: "2024-01-10" }),
    ];

    const { result } = renderWithTransactions(transactions);

    expect(result.current[0].Saldo).toBe(-1000);
  });

  test("should compute 'Saldo' combining 'Entrada' and 'Saída' in same month", () => {
    const transactions = [
      fakeTransaction({
        id: "1",
        type: "Entrada",
        amount: 5000,
        date: "2024-01-10",
      }),

      fakeTransaction({
        id: "2",
        type: "Saída",
        amount: 2000,
        date: "2024-01-20",
      }),
    ];

    const { result } = renderWithTransactions(transactions);

    expect(result.current[0].Saldo).toBe(3000);
  });

  test("should accumulate multiple 'Entrada's transactions in the same month", () => {
    const transactions = [
      fakeTransaction({
        id: "1",
        type: "Entrada",
        amount: 1000,
        date: "2024-06-01",
      }),

      fakeTransaction({
        id: "2",
        type: "Entrada",
        amount: 2000,
        date: "2024-06-15",
      }),
    ];

    const { result } = renderWithTransactions(transactions);

    expect(result.current[0].Saldo).toBe(3000);
  });

  test("should accumulate multiple 'Saída's transactions in the same month", () => {
    const transactions = [
      fakeTransaction({
        id: "1",
        type: "Saída",
        amount: 500,
        date: "2024-06-01",
      }),

      fakeTransaction({
        id: "2",
        type: "Saída",
        amount: 300,
        date: "2024-06-15",
      }),
    ];

    const { result } = renderWithTransactions(transactions);

    expect(result.current[0].Saldo).toBe(-800);
  });

  /* - Ordenação - */

  test("should return months sorted in calendar order", () => {
    const transactions = [
      fakeTransaction({ id: "1", date: "2024-03-10" }),
      fakeTransaction({ id: "2", date: "2024-01-05" }),
      fakeTransaction({ id: "3", date: "2024-02-20" }),
    ];

    const { result } = renderWithTransactions(transactions);

    expect(result.current.map((d) => d.month)).toEqual(["Jan", "Fev", "Mar"]);
  });

  test("should place 'December' after 'November' in sorted order", () => {
    const transactions = [
      fakeTransaction({ id: "1", date: "2024-12-01" }),
      fakeTransaction({ id: "2", date: "2024-11-01" }),
    ];

    const { result } = renderWithTransactions(transactions);

    expect(result.current.map((d) => d.month)).toEqual(["Nov", "Dez"]);
  });

  /* - Independência entre meses - */

  test("should compute 'Saldo' independently for each month", () => {
    const transactions = [
      fakeTransaction({
        id: "1",
        type: "Entrada",
        amount: 5000,
        date: "2024-01-10",
      }),

      fakeTransaction({
        id: "2",
        type: "Saída",
        amount: 1000,
        date: "2024-02-10",
      }),
    ];

    const { result } = renderWithTransactions(transactions);

    expect(result.current[0]).toEqual({ month: "Jan", Saldo: 5000 });
    expect(result.current[1]).toEqual({ month: "Fev", Saldo: -1000 });
  });
});

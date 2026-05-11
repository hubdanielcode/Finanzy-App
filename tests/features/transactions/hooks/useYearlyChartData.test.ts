import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useYearlyChartData } from "@/features/transactions/hooks/useYearlyChartData";
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

const renderWithTransactions = (
  transactions: Transaction[] = [],
  params: Parameters<typeof useYearlyChartData>[0] = {},
) =>
  renderHook(() => useYearlyChartData(params), {
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

/* - Testando retorno com dados vazios - */

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
  const transactions = [fakeTransaction({ date: "2024-05-10" })];

  const { result } = renderWithTransactions(transactions);

  expect(result.current[0].month).toBe("Mai");
});

/* - Cálculo de Entrada e Saída - */

test("should accumulate Entrada amount for the month", () => {
  const transactions = [
    fakeTransaction({
      id: "1",
      type: "Entrada",
      amount: 3000,
      date: "2024-01-10",
    }),
    fakeTransaction({
      id: "2",
      type: "Entrada",
      amount: 2000,
      date: "2024-01-20",
    }),
  ];

  const { result } = renderWithTransactions(transactions);

  expect(result.current[0].Entrada).toBe(5000);
});

test("should accumulate Saída amount for the month", () => {
  const transactions = [
    fakeTransaction({
      id: "1",
      type: "Saída",
      amount: 500,
      date: "2024-01-10",
    }),
    fakeTransaction({
      id: "2",
      type: "Saída",
      amount: 300,
      date: "2024-01-20",
    }),
  ];

  const { result } = renderWithTransactions(transactions);

  expect(result.current[0].Saída).toBe(800);
});

test("should keep Entrada and Saída separate in the same month", () => {
  const transactions = [
    fakeTransaction({
      id: "1",
      type: "Entrada",
      amount: 5000,
      date: "2024-03-10",
    }),
    fakeTransaction({
      id: "2",
      type: "Saída",
      amount: 1500,
      date: "2024-03-20",
    }),
  ];

  const { result } = renderWithTransactions(transactions);

  expect(result.current[0].Entrada).toBe(5000);
  expect(result.current[0].Saída).toBe(1500);
});

test("should initialize Entrada as 0 when month only has Saída", () => {
  const transactions = [
    fakeTransaction({ type: "Saída", amount: 1000, date: "2024-04-10" }),
  ];

  const { result } = renderWithTransactions(transactions);

  expect(result.current[0].Entrada).toBe(0);
});

test("should initialize Saída as 0 when month only has Entrada", () => {
  const transactions = [
    fakeTransaction({ type: "Entrada", amount: 1000, date: "2024-04-10" }),
  ];

  const { result } = renderWithTransactions(transactions);

  expect(result.current[0].Saída).toBe(0);
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

/* - Filtro por ano - */

test("should return only transactions from the given year", () => {
  const transactions = [
    fakeTransaction({ id: "1", date: "2024-01-10" }),
    fakeTransaction({ id: "2", date: "2025-01-10" }),
  ];

  const { result } = renderWithTransactions(transactions, { year: 2024 });

  expect(result.current).toHaveLength(1);
});

test("should return empty array when no transactions match the given year", () => {
  const transactions = [fakeTransaction({ date: "2024-06-10" })];

  const { result } = renderWithTransactions(transactions, { year: 2099 });

  expect(result.current).toEqual([]);
});

test("should return all months when year is undefined", () => {
  const transactions = [
    fakeTransaction({ id: "1", date: "2024-01-10" }),
    fakeTransaction({ id: "2", date: "2025-03-10" }),
  ];

  const { result } = renderWithTransactions(transactions, {
    year: undefined,
  });

  expect(result.current).toHaveLength(2);
});

/* - Filtro por mês - */

test("should return only transactions from the given month", () => {
  const transactions = [
    fakeTransaction({ id: "1", date: "2024-01-10" }),
    fakeTransaction({ id: "2", date: "2024-03-10" }),
  ];

  const { result } = renderWithTransactions(transactions, {
    month: "Janeiro",
  });

  expect(result.current).toHaveLength(1);
  expect(result.current[0].month).toBe("Jan");
});

test("should return empty array when no transactions match the given month", () => {
  const transactions = [fakeTransaction({ date: "2024-01-10" })];

  const { result } = renderWithTransactions(transactions, { month: "Julho" });

  expect(result.current).toEqual([]);
});

/* - Filtro combinado de ano e mês - */

test("should filter by both year and month when both are provided", () => {
  const transactions = [
    fakeTransaction({ id: "1", date: "2024-06-10" }),
    fakeTransaction({ id: "2", date: "2025-06-10" }),
    fakeTransaction({ id: "3", date: "2024-01-10" }),
  ];

  const { result } = renderWithTransactions(transactions, {
    year: 2024,
    month: "Junho",
  });

  expect(result.current).toHaveLength(1);
  expect(result.current[0].month).toBe("Jun");
});

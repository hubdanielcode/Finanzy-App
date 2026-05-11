import { renderHook } from "@testing-library/react";
import { useCategoryChartData } from "@/features/transactions/hooks/useCategoryChartData";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import type { Transaction } from "@/features/transactions/model/transactionTypes";
import { vi } from "vitest";
import type { ReactNode } from "react";
import { createElement } from "react";

/* - Criando uma função para simular o TransactionContext - */

const fakeContextValue = (overrides = {}) => ({
  transactions: [] as Transaction[],
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
  ...overrides,
});

/* - Criando o wrapper para o hook - */

const createWrapper =
  (contextValue: ReturnType<typeof fakeContextValue>) =>
  ({ children }: { children: ReactNode }) =>
    createElement(
      TransactionContext.Provider,
      { value: contextValue },
      children,
    );

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando o retorno com lista vazia - */

test("should return empty array when there are no transactions", () => {
  const { result } = renderHook(() => useCategoryChartData("Entrada"), {
    wrapper: createWrapper(fakeContextValue()),
  });

  expect(result.current).toEqual([]);
});

/* - Testando a filtragem por tipo - */

test("should return only Entrada transactions when type is Entrada", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      title: "Pagamento",
      amount: 5000,
      type: "Entrada",
      date: "2024-01-15",
      period: "Mais de um ano",
      category: "Salário",
      user_id: "user-123",
    },
    {
      id: "2",
      title: "Morar é caro",
      amount: 1500,
      type: "Saída",
      date: "2024-01-10",
      period: "Mais de um ano",
      category: "Moradia",
      user_id: "user-123",
    },
  ];

  const { result } = renderHook(() => useCategoryChartData("Entrada"), {
    wrapper: createWrapper(fakeContextValue({ transactions })),
  });

  expect(result.current).toHaveLength(1);
  expect(result.current[0].type).toBe("Entrada");
});

test("should return only Saída transactions when type is Saída", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      title: "Pagamento",
      amount: 5000,
      type: "Entrada",
      date: "2024-01-15",
      period: "Mais de um ano",
      category: "Salário",
      user_id: "user-123",
    },
    {
      id: "2",
      title: "Morar é caro",
      amount: 1500,
      type: "Saída",
      date: "2024-01-10",
      period: "Mais de um ano",
      category: "Moradia",
      user_id: "user-123",
    },
  ];

  const { result } = renderHook(() => useCategoryChartData("Saída"), {
    wrapper: createWrapper(fakeContextValue({ transactions })),
  });

  expect(result.current).toHaveLength(1);
  expect(result.current[0].type).toBe("Saída");
});

/* - Testando o agrupamento e soma por categoria - */

test("should group and sum transactions of the same category", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      title: "Pagamento",
      amount: 3000,
      type: "Entrada",
      date: "2024-01-01",
      period: "Mais de um ano",
      category: "Salário",
      user_id: "user-123",
    },
    {
      id: "2",
      title: "Aumento",
      amount: 2000,
      type: "Entrada",
      date: "2024-01-15",
      period: "Mais de um ano",
      category: "Salário",
      user_id: "user-123",
    },
  ];

  const { result } = renderHook(() => useCategoryChartData("Entrada"), {
    wrapper: createWrapper(fakeContextValue({ transactions })),
  });

  expect(result.current).toHaveLength(1);
  expect(result.current[0].amount).toBe(5000);
  expect(result.current[0].category).toBe("Salário");
});

test("should return separate entries for different categories", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      title: "Morar é Caro",
      amount: 1500,
      type: "Saída",
      date: "2024-01-10",
      period: "Mais de um ano",
      category: "Moradia",
      user_id: "user-123",
    },
    {
      id: "2",
      title: "Mercado",
      amount: 800,
      type: "Saída",
      date: "2024-01-20",
      period: "Mais de um ano",
      category: "Mercado",
      user_id: "user-123",
    },
  ];

  const { result } = renderHook(() => useCategoryChartData("Saída"), {
    wrapper: createWrapper(fakeContextValue({ transactions })),
  });

  expect(result.current).toHaveLength(2);
});

/* - Testando a ordenação decrescente por valor - */

test("should return categories sorted by amount in descending order", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      title: "Comida",
      amount: 500,
      type: "Saída",
      date: "2024-01-05",
      period: "Mais de um ano",
      category: "Mercado",
      user_id: "user-123",
    },
    {
      id: "2",
      title: "Morar é caro",
      amount: 2000,
      type: "Saída",
      date: "2024-01-10",
      period: "Mais de um ano",
      category: "Moradia",
      user_id: "user-123",
    },
    {
      id: "3",
      title: "Uber",
      amount: 300,
      type: "Saída",
      date: "2024-01-15",
      period: "Mais de um ano",
      category: "Transporte",
      user_id: "user-123",
    },
  ];

  const { result } = renderHook(() => useCategoryChartData("Saída"), {
    wrapper: createWrapper(fakeContextValue({ transactions })),
  });

  expect(result.current.map((item) => item.amount)).toEqual([2000, 500, 300]);
});

/* - Testando o ícone padrão para categorias desconhecidas - */

test("should use fallback icon when category is not found in icons map", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      title: "Qualquer coisa",
      amount: 100,
      type: "Entrada",
      date: "2024-01-01",
      period: "Mais de um ano",
      category: "CategoriaInexistente",
      user_id: "user-123",
    },
  ];

  const { result } = renderHook(() => useCategoryChartData("Entrada"), {
    wrapper: createWrapper(fakeContextValue({ transactions })),
  });

  expect(result.current[0].icon).toBe("➕");
});

/* - Testando a categoria "Outros" para cada tipo - */

test("should sum 'Outros' Entrada transactions separately from 'Outros' Saída", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      title: "Outros ganhos",
      amount: 1000,
      type: "Entrada",
      date: "2024-01-01",
      period: "Mais de um ano",
      category: "Outros",
      user_id: "user-123",
    },
    {
      id: "2",
      title: "Mais outros ganhos",
      amount: 500,
      type: "Entrada",
      date: "2024-01-15",
      period: "Mais de um ano",
      category: "Outros",
      user_id: "user-123",
    },
    {
      id: "3",
      title: "Outros gastos",
      amount: 200,
      type: "Saída",
      date: "2024-01-10",
      period: "Mais de um ano",
      category: "Outros",
      user_id: "user-123",
    },
  ];

  const { result: entradaResult } = renderHook(
    () => useCategoryChartData("Entrada"),
    { wrapper: createWrapper(fakeContextValue({ transactions })) },
  );

  const { result: saidaResult } = renderHook(
    () => useCategoryChartData("Saída"),
    { wrapper: createWrapper(fakeContextValue({ transactions })) },
  );

  expect(entradaResult.current).toHaveLength(1);
  expect(entradaResult.current[0]).toEqual({
    type: "Entrada",
    category: "Outros",
    amount: 1500,
    icon: "➕",
  });

  expect(saidaResult.current).toHaveLength(1);
  expect(saidaResult.current[0]).toEqual({
    type: "Saída",
    category: "Outros",
    amount: 200,
    icon: "➕",
  });
});

test("should use ➕ icon for 'Outros' Entrada", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      title: "Outros ganhos",
      amount: 300,
      type: "Entrada",
      date: "2024-01-01",
      period: "Mais de um ano",
      category: "Outros",
      user_id: "user-123",
    },
  ];

  const { result } = renderHook(() => useCategoryChartData("Entrada"), {
    wrapper: createWrapper(fakeContextValue({ transactions })),
  });

  expect(result.current[0].icon).toBe("➕");
});

test("should use ➕ icon for 'Outros' Saída", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      title: "Outros gastos",
      amount: 300,
      type: "Saída",
      date: "2024-01-01",
      period: "Mais de um ano",
      category: "Outros",
      user_id: "user-123",
    },
  ];

  const { result } = renderHook(() => useCategoryChartData("Saída"), {
    wrapper: createWrapper(fakeContextValue({ transactions })),
  });

  expect(result.current[0].icon).toBe("➕");
});

/* - Testando se o erro é lançado sem o contexto - */

test("should throw an error when used outside of TransactionContext", () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => renderHook(() => useCategoryChartData("Entrada"))).toThrow(
    "TransactionContext must be used within a ContextProvider",
  );

  consoleError.mockRestore();
});

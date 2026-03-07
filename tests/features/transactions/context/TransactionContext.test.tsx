import { renderHook, act, waitFor } from "@testing-library/react";
import { useContext } from "react";
import { vi } from "vitest";
import {
  TransactionContext,
  TransactionProvider,
} from "@/features/transactions";

/* - Criando o mock para simular as chamadas do service nos testes - */

vi.mock("@/features/transactions/services/transactionService", () => ({
  getTransactions: vi.fn(),
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
}));

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/features/transactions/services/transactionService";

/* - Criando os objetos para evitar repetições - */

const fakeTransactions = [
  {
    id: "1",
    title: "Salário",
    type: "Entrada" as const,
    category: "Salário",
    amount: 5000,
    date: "2024-01-01",
    period: "Mais de um ano" as const,
    user_id: "user-1",
  },
  {
    id: "2",
    title: "Aluguel",
    type: "Saída" as const,
    category: "Moradia",
    amount: 1500,
    date: "2024-01-02",
    period: "Mais de um ano" as const,
    user_id: "user-1",
  },
];

const fakeNewTransaction = {
  title: "Freelance",
  type: "Entrada" as const,
  category: "Freelance",
  amount: 2000,
  date: "2024-01-03",
  period: "Último Mês" as const,
};

/* - Criando o wrapper e o helper para evitar repetições - */

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TransactionProvider>{children}</TransactionProvider>
);

const renderContext = () =>
  renderHook(() => useContext(TransactionContext), { wrapper });

/* - Limpando o mock entre os testes para evitar erro - */

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getTransactions).mockResolvedValue(fakeTransactions);
});

/* - Testando o fetchTransactions - */

test("should load transactions on mount", async () => {
  const { result } = renderContext();

  await waitFor(() => {
    expect(result.current?.transactions).toEqual(fakeTransactions);
  });
});

test("should set isLoading to false after fetching transactions", async () => {
  const { result } = renderContext();

  await waitFor(() => {
    expect(result.current?.isLoading).toBe(false);
  });
});

test("should keep transactions as empty array when getTransactions throws", async () => {
  vi.mocked(getTransactions).mockRejectedValue(
    new Error("Erro ao carregar transações"),
  );

  const { result } = renderContext();

  await waitFor(() => {
    expect(result.current?.transactions).toEqual([]);
  });
});

/* - Testando os cálculos derivados - */

test("should calculate totalIncome from Entrada transactions", async () => {
  const { result } = renderContext();

  await waitFor(() => {
    expect(result.current?.totalIncome).toBe(5000);
  });
});

test("should calculate totalExpense from Saída transactions", async () => {
  const { result } = renderContext();

  await waitFor(() => {
    expect(result.current?.totalExpense).toBe(1500);
  });
});

test("should calculate availableMoney as totalIncome minus totalExpense", async () => {
  const { result } = renderContext();

  await waitFor(() => {
    expect(result.current?.availableMoney).toBe(3500);
  });
});

/* - Testando o handleAddTransaction - */

test("should call createTransaction and refetch on handleAddTransaction", async () => {
  const { result } = renderContext();

  await waitFor(() =>
    expect(result.current?.transactions).toEqual(fakeTransactions),
  );

  await act(async () => {
    await result.current?.handleAddTransaction(fakeNewTransaction);
  });

  expect(createTransaction).toHaveBeenCalledWith(fakeNewTransaction);
  expect(getTransactions).toHaveBeenCalledTimes(2);
});

test("should not throw when createTransaction fails on handleAddTransaction", async () => {
  vi.mocked(createTransaction).mockRejectedValue(
    new Error("Erro ao adicionar transação"),
  );

  const { result } = renderContext();

  await waitFor(() =>
    expect(result.current?.transactions).toEqual(fakeTransactions),
  );

  await expect(
    act(async () => {
      await result.current?.handleAddTransaction(fakeNewTransaction);
    }),
  ).resolves.not.toThrow();
});

/* - Testando o handleUpdateTransaction - */

test("should call updateTransaction and refetch on handleUpdateTransaction", async () => {
  const { result } = renderContext();

  await waitFor(() =>
    expect(result.current?.transactions).toEqual(fakeTransactions),
  );

  await act(async () => {
    await result.current?.handleUpdateTransaction(fakeTransactions[0]);
  });

  expect(updateTransaction).toHaveBeenCalledWith(fakeTransactions[0]);
  expect(getTransactions).toHaveBeenCalledTimes(2);
});

test("should not throw when updateTransaction fails on handleUpdateTransaction", async () => {
  vi.mocked(updateTransaction).mockRejectedValue(
    new Error("Erro ao atualizar transação"),
  );

  const { result } = renderContext();

  await waitFor(() =>
    expect(result.current?.transactions).toEqual(fakeTransactions),
  );

  await expect(
    act(async () => {
      await result.current?.handleUpdateTransaction(fakeTransactions[0]);
    }),
  ).resolves.not.toThrow();
});

/* - Testando o handleDeleteTransaction - */

test("should call deleteTransaction and refetch on handleDeleteTransaction", async () => {
  const { result } = renderContext();

  await waitFor(() =>
    expect(result.current?.transactions).toEqual(fakeTransactions),
  );

  await act(async () => {
    await result.current?.handleDeleteTransaction("1");
  });

  expect(deleteTransaction).toHaveBeenCalledWith("1");
  expect(getTransactions).toHaveBeenCalledTimes(2);
});

test("should not throw when deleteTransaction fails on handleDeleteTransaction", async () => {
  vi.mocked(deleteTransaction).mockRejectedValue(
    new Error("Erro ao deletar transação"),
  );

  const { result } = renderContext();

  await waitFor(() =>
    expect(result.current?.transactions).toEqual(fakeTransactions),
  );

  await expect(
    act(async () => {
      await result.current?.handleDeleteTransaction("1");
    }),
  ).resolves.not.toThrow();
});

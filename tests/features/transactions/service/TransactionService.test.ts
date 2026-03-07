import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "@/features/transactions";
import { vi } from "vitest";

/* - Criando o mock para simular a chamada do supabase nos testes - */

const { fakeGetUser, fakeOrder, fakeSingle } = vi.hoisted(() => ({
  fakeGetUser: vi.fn(),
  fakeOrder: vi.fn(),
  fakeSingle: vi.fn(),
}));

vi.mock("@/supabase/supabase", () => ({
  supabase: {
    auth: {
      getUser: fakeGetUser,
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: fakeOrder }) }),
      insert: () => ({ select: () => ({ single: fakeSingle }) }),
      update: () => ({
        eq: () => ({ select: () => ({ single: fakeSingle }) }),
      }),
      delete: () => ({ eq: fakeOrder }),
    }),
  },
}));

/* - Criando os objetos para evitar repetições - */

const fakeUserId = { id: "user-1" };

const fakeTransaction = {
  id: "1",
  title: "Pagamento",
  type: "Entrada" as const,
  category: "Salário",
  amount: 5000,
  date: "2024-01-01",
  period: "Mais de um ano" as const,
  user_id: "user-1",
};

const fakeNewTransaction = {
  title: "Pagamento",
  type: "Entrada" as const,
  category: "Salário",
  amount: 5000,
  date: "2024-01-01",
  period: "Mais de um ano" as const,
};

/* - Limpando o mock entre os testes para evitar erros - */

beforeEach(() => {
  vi.clearAllMocks();
  fakeGetUser.mockResolvedValue({ data: { user: fakeUserId } });
});

/* - Testando o createTransaction - */

test("should should create and return a new transaction for authenticated user", async () => {
  fakeSingle.mockResolvedValue({ data: fakeTransaction, error: null });

  const result = await createTransaction(fakeNewTransaction);

  expect(result).toMatchObject({
    title: "Pagamento",
    type: "Entrada" as const,
    category: "Salário",
    amount: 5000,
    date: "2024-01-01",
    period: "Mais de um ano" as const,
  });
});

test("should throw an error when user is not authenticated on createTransaction", async () => {
  fakeGetUser.mockResolvedValue({ data: { user: null } });

  await expect(createTransaction(fakeNewTransaction)).rejects.toThrow(
    "Usuário não autenticado",
  );
});

test("should throw an error when supabase does not return created transaction", async () => {
  fakeSingle.mockResolvedValue({ data: null, error: null });

  await expect(createTransaction(fakeNewTransaction)).rejects.toThrow(
    "Erro ao retornar a transação criada",
  );
});

/* - Testando o getTransaction - */

test("should return all of user's transactions if user is authenticated", async () => {
  fakeOrder.mockResolvedValue({
    data: fakeTransaction,
    error: null,
  });

  const result = await getTransactions();

  expect(result).toEqual(fakeTransaction);
});

test("should return an empty array when user is authenticated and have no transactions", async () => {
  fakeOrder.mockResolvedValue({
    data: null,
    error: null,
  });

  const result = await getTransactions();

  expect(result).toEqual([]);
});

test("should throw an error when user is not authenticated on getTransaction", async () => {
  fakeGetUser.mockResolvedValue({
    data: { user: null },
  });

  await expect(getTransactions()).rejects.toThrow("Usuário não autenticado.");
});

test("should throw an error when supabase does not return transactions", async () => {
  fakeOrder.mockResolvedValue({
    data: null,
    error: { message: "Erro ao carregar transações" },
  });

  await expect(getTransactions()).rejects.toThrow(
    "Erro ao carregar transações",
  );
});

/* - Testando o updateTransactions - */

test("should update and return the updated transaction", async () => {
  fakeSingle.mockResolvedValue({
    data: fakeTransaction,
    error: null,
  });

  const result = await updateTransaction(fakeTransaction);

  expect(result).toEqual(fakeTransaction);
});

test("should throw an error when user has no ID on updateTransaction", async () => {
  const transactionWithoutId = { ...fakeTransaction, id: "" };

  await expect(updateTransaction(transactionWithoutId)).rejects.toThrow(
    "ID obrigatório para atualizar transação",
  );
});

test("should throw when supabase returns an error on updateTransaction", async () => {
  fakeSingle.mockResolvedValue({
    data: null,
    error: { message: "Erro ao atualizar transação" },
  });

  await expect(updateTransaction(fakeTransaction)).rejects.toThrow(
    "Erro ao atualizar transação",
  );
});

/* - Testando o deleteTransaction - */

test("should delete a transaction without throwing", async () => {
  fakeOrder.mockResolvedValue({ error: null, data: null });

  await expect(deleteTransaction("1")).resolves.not.toThrow();
});

test("should throw an error when supabase does not delete the transaction", async () => {
  fakeOrder.mockResolvedValue({
    error: { message: "Erro ao deletar transação" },
    data: null,
  });

  await expect(deleteTransaction("1")).rejects.toThrow(
    "Erro ao deletar transação",
  );
});

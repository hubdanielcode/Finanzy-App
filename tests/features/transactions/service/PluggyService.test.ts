import { vi } from "vitest";
import { supabase } from "@/../supabase/supabase";
import { syncTransactionsFromBank } from "@/features/transactions/services/pluggyService";

/* - Criando upsertMock fora do vi.mock para ser acessível nos testes - */

const upsertMock = vi.fn(() => Promise.resolve({ error: null }));

/* - Criando mock para simular as chamadas do supabase nos testes - */

vi.mock("@/../supabase/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({
          data: { user: { id: "user-123" } },
          error: null,
        }),
      ),
    },
    functions: {
      invoke: vi.fn(() =>
        Promise.resolve({
          data: { apiKey: "mock-api-key", connectToken: "mock-connect-token" },
          error: null,
        }),
      ),
    },
    from: vi.fn(() => ({
      upsert: upsertMock,
    })),
  },
}));

/* - Criando fetch padrão para os testes - */

const defaultFetchMock = () =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        results: [
          {
            id: "tx-123",
            description: "Pagamento de boleto",
            amount: -100,
            type: "DEBIT",
            date: "2026-03-15",
            category: "Services",
          },
        ],
      }),
  });

globalThis.fetch = vi.fn(defaultFetchMock) as unknown as typeof fetch;

/* - Limpando o mock entre os testes para evitar erro - */

afterEach(() => {
  upsertMock.mockClear();
  vi.mocked(supabase.functions.invoke).mockClear();
  vi.mocked(supabase.auth.getUser).mockClear();
  vi.mocked(supabase.from).mockClear();
  globalThis.fetch = vi.fn(defaultFetchMock) as unknown as typeof fetch;
});

/* - Testando se o usuário está autenticado - */

test("should throw an error if user is not authenticated", async () => {
  vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
    data: { user: null },
    error: null,
  } as any);

  await expect(syncTransactionsFromBank("account-123")).rejects.toThrow(
    "Usuário não autenticado.",
  );
});

/* - Testando se a Edge Function é chamada corretamente - */

test("should call pluggy-auth Edge Function to get apiKey", async () => {
  await syncTransactionsFromBank("account-123");

  expect(supabase.functions.invoke).toHaveBeenCalledWith("pluggy-auth");
});

/* - Testando se o fetch é chamado com o accountId correto - */

test("should fetch transactions from Pluggy with correct accountId", async () => {
  await syncTransactionsFromBank("account-123");

  expect(globalThis.fetch).toHaveBeenCalledWith(
    "https://api.pluggy.ai/transactions?accountId=account-123",
    { headers: { "X-API-KEY": "mock-api-key" } },
  );
});

/* - Testando se o upsert é chamado com os dados mapeados corretamente - */

test("should upsert transaction with correct mapped data", async () => {
  await syncTransactionsFromBank("account-123");

  expect(supabase.from).toHaveBeenCalledWith("transactions");
  expect(upsertMock).toHaveBeenCalled();
});

/* - Testando o mapeamento de categoria - */

test("should map 'Services' category to 'Outros'", async () => {
  await syncTransactionsFromBank("account-123");

  expect(upsertMock).toHaveBeenCalledWith(
    expect.objectContaining({ category: "Outros" }),
    { onConflict: "external_id" },
  );
});

/* - Testando o mapeamento de tipo DEBIT para Saída - */

test("should map 'DEBIT' type to 'Saída'", async () => {
  await syncTransactionsFromBank("account-123");

  expect(upsertMock).toHaveBeenCalledWith(
    expect.objectContaining({ type: "Saída" }),
    { onConflict: "external_id" },
  );
});

/* - Testando o mapeamento de tipo CREDIT para Entrada - */

test("should map 'CREDIT' type to 'Entrada'", async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            {
              id: "tx-456",
              description: "Salário",
              amount: 5000,
              type: "CREDIT",
              date: "2026-03-15",
              category: "Salary",
            },
          ],
        }),
    }),
  ) as unknown as typeof fetch;

  await syncTransactionsFromBank("account-123");

  expect(upsertMock).toHaveBeenCalledWith(
    expect.objectContaining({ type: "Entrada", category: "Salário" }),
    { onConflict: "external_id" },
  );
});

/* - Testando se o amount sempre vem positivo - */

test("should always save amount as positive number", async () => {
  await syncTransactionsFromBank("account-123");

  expect(upsertMock).toHaveBeenCalledWith(
    expect.objectContaining({ amount: 100 }),
    { onConflict: "external_id" },
  );
});

/* - Testando se lança erro quando o fetch falha - */

test("should throw error when Pluggy API returns not ok", async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({ ok: false }),
  ) as unknown as typeof fetch;

  await expect(syncTransactionsFromBank("account-123")).rejects.toThrow(
    "Falha ao buscar transações na Pluggy",
  );
});

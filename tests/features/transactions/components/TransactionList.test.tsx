import { render, screen } from "@testing-library/react";
import { TransactionList } from "@/features/transactions";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import type { Transaction } from "@/features/transactions/model/TransactionTypes";
import { vi } from "vitest";

/* - Criando uma função para simular o TransactionContext - */

const fakeContextValue = (overrides = {}) => ({
  transactions: [],
  handleAddTransaction: vi.fn(),
  handleUpdateTransaction: vi.fn(),
  handleDeleteTransaction: vi.fn(),
  fetchTransactions: vi.fn(),
  totalIncome: 0,
  totalExpense: 0,
  availableMoney: 0,
  isLoading: false,
  ...overrides,
});

/* - Criando uma função para simular uma transação - */

const fakeTransaction = (overrides = {}): Transaction => ({
  id: "1",
  title: "Pagamento",
  amount: 3000,
  type: "Entrada",
  category: "Salário",
  date: "2025-01-01",
  period: "Último Ano",
  user_id: "user-1",
  ...overrides,
});

/* - Criando a função para renderizar o componente - */

const renderComponent = (
  transactions: Transaction[] = [],
  contextValues = fakeContextValue(),
) =>
  render(
    <TransactionContext.Provider value={contextValues}>
      <TransactionList transactions={transactions} />
    </TransactionContext.Provider>,
  );

/* - Testando o título da lista - */

test("should render the title 'Histórico de Transações'", () => {
  renderComponent();

  expect(screen.getByText("Histórico de Transações")).toBeInTheDocument();
});

/* - Testando a mensagem de lista vazia - */

test("should render empty state message when there are no transactions", () => {
  renderComponent();

  expect(
    screen.getByText("Ainda não há transações na lista."),
  ).toBeInTheDocument();
});

/* - Testando se a mensagem de carregamento é exibida - */

test("should render loading message when isLoading is true", () => {
  renderComponent([], fakeContextValue({ isLoading: true }));

  expect(
    screen.getByText("Carregando lista de transações..."),
  ).toBeInTheDocument();
});

/* - Testando se a lista de transações é renderizada - */

test("should render transactions when there are transactions", () => {
  renderComponent([fakeTransaction()]);

  expect(screen.getAllByText("Pagamento")[0]).toBeInTheDocument();
});

/* - Testando se múltiplas transações são renderizadas - */

test("should render all transactions in the list", () => {
  renderComponent([
    fakeTransaction({ id: "1", title: "Pagamento" }),
    fakeTransaction({ id: "2", title: "Freelance" }),
    fakeTransaction({ id: "3", title: "Aluguel" }),
  ]);

  expect(screen.getAllByText("Pagamento")[0]).toBeInTheDocument();
  expect(screen.getByText("Freelance")).toBeInTheDocument();
  expect(screen.getByText("Aluguel")).toBeInTheDocument();
});

/* - Testando se a mensagem de vazia não aparece quando há transações - */

test("should not render empty state message when there are transactions", () => {
  renderComponent([fakeTransaction()]);

  expect(
    screen.queryByText("Ainda não há transações na lista."),
  ).not.toBeInTheDocument();
});

/* - Testando se o loading não aparece quando isLoading é false - */

test("should not render loading message when isLoading is false", () => {
  renderComponent([fakeTransaction()]);

  expect(
    screen.queryByText("Carregando lista de transações..."),
  ).not.toBeInTheDocument();
});

/* - Testando se a paginação é renderizada quando há transações - */

test("should render pagination when there are transactions", () => {
  renderComponent([fakeTransaction()]);

  expect(screen.getByRole("list")).toBeInTheDocument();
});

/* - Testando se as transações são ordenadas por data decrescente - */

test("should render transactions sorted by date descending", () => {
  renderComponent([
    fakeTransaction({ id: "1", title: "Primeira", date: "2025-01-01" }),
    fakeTransaction({ id: "2", title: "Terceira", date: "2025-03-01" }),
    fakeTransaction({ id: "3", title: "Segunda", date: "2025-02-01" }),
  ]);

  const container = screen.getByRole("list").parentElement!;
  const html = container.innerHTML;

  expect(html.indexOf("Terceira")).toBeLessThan(html.indexOf("Segunda"));
  expect(html.indexOf("Segunda")).toBeLessThan(html.indexOf("Primeira"));
});

/* - Testando se o erro é lançado sem o contexto - */

test("should throw an error when used outside of TransactionContext", () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => render(<TransactionList transactions={[]} />)).toThrow(
    "TransactionContext must be used within a TransactionProvider",
  );

  consoleError.mockRestore();
});

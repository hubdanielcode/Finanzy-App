import { render, screen } from "@testing-library/react";
import { MobileTransactionList } from "@/features/transactions";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import type { Transaction } from "@/features/transactions";

/* - Criando uma função para representar as transações - */

const makeTransaction = (
  overrides: Partial<Transaction> = {},
): Transaction => ({
  id: "1",
  title: "Transação Teste",
  amount: 1000,
  type: "Entrada",
  category: "Salário",
  date: "2024-01-01",
  period: "Mais de um ano",
  user_id: "123",
  ...overrides,
});

/* - Criando um objeto para simular o TransactionContext - */

const fakeContextValue = {
  transactions: [],
  handleAddTransaction: vi.fn(() => Promise.resolve()),
  handleUpdateTransaction: vi.fn(() => Promise.resolve()),
  handleDeleteTransaction: vi.fn(() => Promise.resolve()),
  totalIncome: 0,
  totalExpense: 0,
  availableMoney: 0,
  fetchTransactions: vi.fn(() => Promise.resolve()),
  isLoading: false,
};

/* - Função para renderizar o componente - */

const renderComponent = (overrides = {}, contextOverrides = {}) => {
  const props = {
    transactions: [] as Transaction[],
    searchQuery: "",
    setSearchQuery: vi.fn(),
    filteredTransactions: [] as Transaction[],
    type: null,
    setType: vi.fn(),
    period: null,
    setPeriod: vi.fn(),
    category: "",
    setCategory: vi.fn(),
    isMobileTransactionListOpen: true,
    setIsMobileTransactionListOpen: vi.fn(),
    ...overrides,
  };

  render(
    <TransactionContext.Provider
      value={{ ...fakeContextValue, ...contextOverrides }}
    >
      <MobileTransactionList {...props} />
    </TransactionContext.Provider>,
  );

  return { ...props };
};

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando o título - */

test("should render the title 'Histórico de Transações'", () => {
  renderComponent();

  expect(screen.getByText("Histórico de Transações")).toBeInTheDocument();
});

/* - Testando o estado de carregamento - */

test("should show loading message when isLoading is true", () => {
  renderComponent({}, { isLoading: true });

  expect(
    screen.getByText("Carregando lista de transações..."),
  ).toBeInTheDocument();
});

/* - Testando lista vazia - */

test("should show empty message when there are no transactions", () => {
  renderComponent({ transactions: [] });

  expect(
    screen.getByText("Ainda não há transações na lista."),
  ).toBeInTheDocument();
});

test("should not show empty message when there are transactions", () => {
  renderComponent({
    transactions: [makeTransaction()],
  });

  expect(
    screen.queryByText("Ainda não há transações na lista."),
  ).not.toBeInTheDocument();
});

/* - Testando renderização das transações - */

test("should render transactions when list is not empty", () => {
  renderComponent({
    transactions: [makeTransaction({ title: "Pagamento Recebido" })],
  });

  expect(screen.getByText("Pagamento Recebido")).toBeInTheDocument();
});

test("should render multiple transactions", () => {
  renderComponent({
    transactions: [
      makeTransaction({ id: "1", title: "Pagamento Recebido" }),
      makeTransaction({
        id: "2",
        title: "Conta de Luz",
        type: "Saída",
        category: "Moradia",
      }),
    ],
  });

  expect(screen.getByText("Pagamento Recebido")).toBeInTheDocument();
  expect(screen.getByText("Conta de Luz")).toBeInTheDocument();
});

/* - Testando ordenação por data - */

test("should render transactions sorted by date descending", () => {
  renderComponent({
    transactions: [
      makeTransaction({ id: "1", title: "Primeira", date: "2024-01-01" }),
      makeTransaction({ id: "2", title: "Segunda", date: "2024-01-03" }),
    ],
  });

  const titles = screen.getAllByText(/Primeira|Segunda/);

  expect(titles[0]).toHaveTextContent("Segunda");
  expect(titles[1]).toHaveTextContent("Primeira");
});

/* - Testando paginação - */

test("should render pagination when there are more than 10 transactions", () => {
  renderComponent({
    transactions: Array.from({ length: 11 }, (_, i) =>
      makeTransaction({ id: String(i + 1), title: `Transação ${i + 1}` }),
    ),
  });

  expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
});

test("should show only 10 transactions per page by default", () => {
  renderComponent({
    transactions: Array.from({ length: 11 }, (_, i) =>
      makeTransaction({ id: String(i + 1), title: `Transação ${i + 1}` }),
    ),
  });

  expect(screen.queryByText("Transação 11")).not.toBeInTheDocument();
});

test("should navigate to the next page when page button is clicked", async () => {
  renderComponent({
    transactions: Array.from({ length: 11 }, (_, i) =>
      makeTransaction({
        id: String(i + 1),
        title: `Transação ${i + 1}`,
        date: `2024-01-${String(i + 1).padStart(2, "0")}`,
      }),
    ),
  });

  await userEvent.click(screen.getByRole("button", { name: "2" }));

  expect(screen.getByText("Transação 1")).toBeInTheDocument();
});

/* - Testando o MobileFilter integrado - */

test("should render the MobileFilter search input", () => {
  renderComponent();

  expect(
    screen.getByPlaceholderText("Buscar transação por título..."),
  ).toBeInTheDocument();
});

test("should call setIsMobileTransactionListOpen with false when filter close button is clicked", async () => {
  const { setIsMobileTransactionListOpen } = renderComponent();

  const closeButton = screen.getByRole("button", { name: "" });
  await userEvent.click(closeButton);

  expect(setIsMobileTransactionListOpen).toHaveBeenCalledWith(false);
});

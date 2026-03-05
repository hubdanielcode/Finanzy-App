import { render, screen } from "@testing-library/react";
import { TransactionCards } from "@/features/transactions";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
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

/* - Limpando o mock entre os testes para eviter erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Criando a função para renderizar o componente - */

const renderComponent = (
  isPrivate: boolean = false,
  contextValues = fakeContextValue(),
) =>
  render(
    <TransactionContext.Provider value={contextValues}>
      <TransactionCards isPrivate={isPrivate} />
    </TransactionContext.Provider>,
  );

/* - Testando se os títulos dos cartões são renderizados - */

test("should render 'Entradas', 'Saídas' and 'Saldo' cards", () => {
  renderComponent();

  expect(screen.getByText("Entradas")).toBeInTheDocument();
  expect(screen.getByText("Saídas")).toBeInTheDocument();
  expect(screen.getByText("Saldo")).toBeInTheDocument();
});

/* - Testando se os valores formatados são exibidos quando isPrivate === false - */

test("should render formatted income value when isPrivate is false", () => {
  renderComponent(false, fakeContextValue({ totalIncome: 1000 }));

  expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
});

test("should render formatted expense value when isPrivate is false", () => {
  renderComponent(false, fakeContextValue({ totalExpense: 500 }));

  expect(screen.getByText("R$ 500,00")).toBeInTheDocument();
});

test("should render formatted balance value when isPrivate is false", () => {
  renderComponent(false, fakeContextValue({ availableMoney: 500 }));

  expect(screen.getByText("R$ 500,00")).toBeInTheDocument();
});

/* - Testando se os valores são ocultados quando isPrivate === true - */

test("should render 'R$ *****' for all values when isPrivate is true", () => {
  renderComponent(
    true,
    fakeContextValue({
      totalIncome: 1000,
      totalExpense: 500,
      availableMoney: 500,
    }),
  );

  const hiddenValues = screen.getAllByText("R$ *****");

  expect(hiddenValues).toHaveLength(3);
});

/* - Testando se o saldo positivo exibe cor verde - */

test("should render Saldo value with green color when availableMoney > 0", () => {
  renderComponent(false, fakeContextValue({ availableMoney: 500 }));

  const saldoValue = screen.getByTestId("saldo");

  expect(saldoValue).toHaveClass("text-green-300");
});

/* - Testando se o saldo negativo exibe cor vermelha - */

test("should render Saldo value with red color when availableMoney < 0", () => {
  renderComponent(false, fakeContextValue({ availableMoney: -100 }));

  const saldoValue = screen.getByTestId("saldo");

  expect(saldoValue).toHaveClass("text-red-300");
});

/* - Testando se o saldo zero exibe cor branca - */

test("should render Saldo value with white color when availableMoney === 0", () => {
  renderComponent(false, fakeContextValue({ availableMoney: 0 }));

  const saldoValue = screen.getByTestId("saldo");

  expect(saldoValue).toHaveClass("text-white");
});

/* - Testando se o erro é lançado sem o contexto - */

test("should throw an error when used outside of TransactionContext", () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => render(<TransactionCards isPrivate={false} />)).toThrow(
    "TransactionContext must be used within a ContextProvider",
  );

  consoleError.mockRestore();
});

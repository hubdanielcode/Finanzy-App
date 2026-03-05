import { render, screen } from "@testing-library/react";
import { TransactionForm } from "@/features/transactions";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

/* - Criando o mock para simular a chamada do supabase nos testes - */

vi.mock("@/supabase/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-1" } },
      }),
    },
  },
}));

/* - Mockando o serviço de transações - */

vi.mock("@/features/transactions/services/transactionService", () => ({
  createTransaction: vi.fn().mockResolvedValue({}),
}));

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

/* - Criando defaultProps para evitar repetição - */

const defaultProps = {
  title: "",
  setTitle: vi.fn(),
  amount: "",
  setAmount: vi.fn(),
  date: "",
  setDate: vi.fn(),
};

/* - Criando a função para renderizar o componente - */

const renderComponent = (props = {}, contextValues = fakeContextValue()) =>
  render(
    <TransactionContext.Provider value={contextValues}>
      <TransactionForm
        {...defaultProps}
        {...props}
      />
    </TransactionContext.Provider>,
  );

/* - Limpando mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando o título - */

test("should render the form title 'Nova Transação'", () => {
  renderComponent();

  expect(screen.getByText("Nova Transação")).toBeInTheDocument();
});

/* - Testando se os campos são renderizados - */

test("should render title, amount, type, category and date fields", () => {
  renderComponent();

  expect(screen.getByPlaceholderText(/salário/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText("0,00")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Entrada" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Saída" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument();
});

/* - Testando se setTitle é chamado ao digitar no campo de título - */

test("should call setTitle when typing in the title input", async () => {
  const setTitle = vi.fn();
  renderComponent({ setTitle });

  await userEvent.type(screen.getByPlaceholderText(/salário/i), "Freelance");

  expect(setTitle).toHaveBeenCalled();
});

/* - Testando se setAmount é chamado ao digitar no campo de valor - */

test("should call setAmount when typing a valid value in the amount input", async () => {
  const setAmount = vi.fn();
  renderComponent({ setAmount });

  await userEvent.type(screen.getByPlaceholderText("0,00"), "100");

  expect(setAmount).toHaveBeenCalled();
});

/* - Testando se caracteres inválidos no campo de valor são ignorados - */

test("should ignore invalid characters in the amount input", async () => {
  const setAmount = vi.fn();
  renderComponent({ setAmount });

  await userEvent.type(screen.getByPlaceholderText("0,00"), "abc");

  expect(setAmount).not.toHaveBeenCalled();
});

/* - Testando se o botão Entrada fica ativo ao ser clicado - */

test("should highlight 'Entrada' button when clicked", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));

  expect(screen.getByRole("button", { name: "Entrada" })).toHaveClass(
    "text-green-600",
  );
});

/* - Testando se o botão Saída fica ativo ao ser clicado - */

test("should highlight 'Saída' button when clicked", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Saída" }));

  expect(screen.getByRole("button", { name: "Saída" })).toHaveClass(
    "text-red-600",
  );
});

/* - Testando se o campo de categoria está desabilitado antes de selecionar o tipo - */

test("should disable category input before selecting a type", () => {
  renderComponent();

  expect(
    screen.getByPlaceholderText("Selecione o tipo primeiro"),
  ).toBeDisabled();
});

/* - Testando se o campo de categoria é habilitado após selecionar o tipo - */

test("should enable category input after selecting a type", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));

  expect(
    screen.getByPlaceholderText("Selecione uma categoria"),
  ).not.toBeDisabled();
});

/* - Testando se as opções de Entrada aparecem ao abrir o dropdown - */

test("should render income options when 'Entrada' is selected and category is clicked", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));
  await userEvent.click(screen.getByPlaceholderText("Selecione uma categoria"));

  expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
});

/* - Testando se as opções de Saída aparecem ao abrir o dropdown - */

test("should render expense options when 'Saída' is selected and category is clicked", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Saída" }));
  await userEvent.click(screen.getByPlaceholderText("Selecione uma categoria"));

  expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
});

/* - Testando se a categoria é preenchida ao selecionar uma opção - */

test("should fill category input when an option is selected", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));
  await userEvent.click(screen.getByPlaceholderText("Selecione uma categoria"));

  const firstOption = screen.getAllByRole("listitem")[0];
  const optionText = firstOption.textContent ?? "";
  await userEvent.click(firstOption);

  expect(screen.getByDisplayValue(optionText)).toBeInTheDocument();
});

/* - Testando se o fetchTransactions é chamado após o submit - */

test("should call fetchTransactions when form is submitted", async () => {
  const fetchTransactions = vi.fn();
  renderComponent(
    { title: "Pagamento", amount: "100", date: "2025-01-01" },
    fakeContextValue({ fetchTransactions }),
  );

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));
  await userEvent.click(screen.getByPlaceholderText("Selecione uma categoria"));
  await userEvent.click(screen.getAllByRole("listitem")[0]);
  await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

  expect(fetchTransactions).toHaveBeenCalled();
});

/* - Testando se o erro é lançado sem o contexto - */

test("should throw an error when used outside of TransactionContext", () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => render(<TransactionForm {...defaultProps} />)).toThrow(
    "TransactionForm deve estar dentro do TransactionProvider",
  );

  consoleError.mockRestore();
});

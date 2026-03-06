import { render, screen, waitFor } from "@testing-library/react";
import { MobileTransactionForm } from "@/features/transactions";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";

/* - Criando o mock para simular o Supabase - */

vi.mock("@/supabase/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({
          data: {
            user: {
              id: "123",
              email: "user@gmail.com",
            },
          },
        }),
      ),
    },
  },
}));

/* - Criando o mock para simular o TransactionService - */

vi.mock("@/features/transactions/services/transactionService", () => ({
  createTransaction: vi.fn(() => Promise.resolve()),
}));

/* - Função para renderizar o componente - */

const renderComponent = (overrides = {}) => {
  const props = {
    title: "",
    setTitle: vi.fn(),
    amount: "",
    setAmount: vi.fn(),
    date: "",
    setDate: vi.fn(),
    isMobileFormOpen: true,
    setIsMobileFormOpen: vi.fn(),
    ...overrides,
  };

  const fakecontextValue = {
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

  render(
    <TransactionContext.Provider value={fakecontextValue}>
      <MobileTransactionForm {...props} />
    </TransactionContext.Provider>,
  );

  return { ...props, ...fakecontextValue };
};

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando o título - */

test("should render the title 'Nova Transação'", () => {
  renderComponent();

  expect(screen.getByText("Nova Transação")).toBeInTheDocument();
});

/* - Testando o botão de fechar - */

test("should call setIsMobileFormOpen with false when close button is clicked", async () => {
  const { setIsMobileFormOpen } = renderComponent();

  const closeButton = screen.getByRole("button", { name: "" });
  await userEvent.click(closeButton);

  expect(setIsMobileFormOpen).toHaveBeenCalledWith(false);
});

test("should call setIsMobileFormOpen exactly once when close button is clicked", async () => {
  const { setIsMobileFormOpen } = renderComponent();

  const closeButton = screen.getByRole("button", { name: "" });
  await userEvent.click(closeButton);

  expect(setIsMobileFormOpen).toHaveBeenCalledTimes(1);
});

/* - Testando o input de título - */

test("should render an input with text 'Título'", () => {
  renderComponent();

  expect(
    screen.getByPlaceholderText("Ex: Salário, Aluguel..."),
  ).toBeInTheDocument();
});

test("should call setTitle when user types in the title input", async () => {
  const { setTitle } = renderComponent();

  const titleInput = screen.getByPlaceholderText("Ex: Salário, Aluguel...");
  await userEvent.type(titleInput, "Salário");

  expect(setTitle).toHaveBeenCalled();
});

/* - Testando o input de valor - */

test("should render an input with text 'Valor'", () => {
  renderComponent();

  expect(screen.getByPlaceholderText("0,00")).toBeInTheDocument();
});

test("should call setAmount when user types in the amount input", async () => {
  const { setAmount } = renderComponent();

  const amountInput = screen.getByPlaceholderText("0,00");
  await userEvent.type(amountInput, "100");

  expect(setAmount).toHaveBeenCalled();
});

/* - Testando os botões de tipo - */

test("should render the 'Entrada' type button", () => {
  renderComponent();

  expect(screen.getByRole("button", { name: "Entrada" })).toBeInTheDocument();
});

test("should render the 'Saída' type button", () => {
  renderComponent();

  expect(screen.getByRole("button", { name: "Saída" })).toBeInTheDocument();
});

test("should highlight 'Entrada' button when clicked", async () => {
  renderComponent();

  const entradaButton = screen.getByRole("button", { name: "Entrada" });
  await userEvent.click(entradaButton);

  expect(entradaButton).toHaveClass("bg-green-100");
});

test("should highlight 'Saída' button when clicked", async () => {
  renderComponent();

  const saidaButton = screen.getByRole("button", { name: "Saída" });
  await userEvent.click(saidaButton);

  expect(saidaButton).toHaveClass("bg-red-100");
});

/* - Testando o input de categoria - */

test("should render the 'Categoria' input as disabled when no type is selected", () => {
  renderComponent();

  expect(
    screen.getByPlaceholderText("Selecione o tipo primeiro"),
  ).toBeDisabled();
});

test("should enable the 'Categoria' input when a type is selected", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));

  expect(
    screen.getByPlaceholderText("Selecione uma categoria"),
  ).not.toBeDisabled();
});

test("should open the category dropdown when 'Categoria' input is clicked", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));
  await userEvent.click(screen.getByPlaceholderText("Selecione uma categoria"));

  expect(screen.getByRole("list")).toBeInTheDocument();
});

test("should show income categories when type is 'Entrada'", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));
  await userEvent.click(screen.getByPlaceholderText("Selecione uma categoria"));

  expect(screen.getByText("Salário")).toBeInTheDocument();
});

test("should update category when an option is selected", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));
  await userEvent.click(screen.getByPlaceholderText("Selecione uma categoria"));
  await userEvent.click(screen.getByText("Salário"));

  expect(screen.getByDisplayValue("Salário")).toBeInTheDocument();
});

test("should close the category dropdown when an option is selected", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));
  await userEvent.click(screen.getByPlaceholderText("Selecione uma categoria"));
  await userEvent.click(screen.getByText("Salário"));

  await waitFor(() => {
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

test("should reset category when type is changed", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));
  await userEvent.click(screen.getByPlaceholderText("Selecione uma categoria"));
  await userEvent.click(screen.getByText("Salário"));

  await userEvent.click(screen.getByRole("button", { name: "Saída" }));

  expect(screen.getByPlaceholderText("Selecione uma categoria")).toHaveValue(
    "",
  );
});

/* - Testando o input de data - */

test("should render an input with text 'Data'", () => {
  renderComponent();

  expect(document.querySelector('input[type="date"]')).toBeInTheDocument();
});

test("should call setDate when user selects a date", async () => {
  const { setDate } = renderComponent();

  const dateInput = document.querySelector('input[type="date"]') as HTMLElement;
  await userEvent.type(dateInput, "2024-01-01");

  expect(setDate).toHaveBeenCalled();
});

/* - Testando o botão de enviar - */

test("should render the 'Enviar' button", () => {
  renderComponent();

  expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument();
});

/* - Testando validação de campos obrigatórios - */

test("should show alert if type or category is missing on submit", async () => {
  renderComponent({ title: "Salário", amount: "1000", date: "2024-01-01" });

  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

  expect(alertMock).toHaveBeenCalledWith("Todos os campos são obrigatórios");

  alertMock.mockRestore();
});

/* - Testando envio bem-sucedido - */

test("should call fetchTransactions after successful form submission", async () => {
  const { fetchTransactions } = renderComponent({
    title: "Salário",
    amount: "1000",
    date: "2024-01-01",
  });

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));
  await userEvent.click(screen.getByPlaceholderText("Selecione uma categoria"));
  await userEvent.click(screen.getByText("Salário"));
  await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

  await waitFor(() => {
    expect(fetchTransactions).toHaveBeenCalledTimes(1);
  });
});

test("should call setIsMobileFormOpen with false after successful form submission", async () => {
  const { setIsMobileFormOpen } = renderComponent({
    title: "Salário",
    amount: "1000",
    date: "2024-01-01",
  });

  await userEvent.click(screen.getByRole("button", { name: "Entrada" }));
  await userEvent.click(screen.getByPlaceholderText("Selecione uma categoria"));
  await userEvent.click(screen.getByText("Salário"));
  await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

  await waitFor(() => {
    expect(setIsMobileFormOpen).toHaveBeenCalledWith(false);
  });
});

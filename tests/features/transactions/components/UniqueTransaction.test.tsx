import { render, screen } from "@testing-library/react";
import {
  UniqueTransaction,
  TransactionContext,
  type Transaction,
} from "@/features/transactions";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {
  ExpenseIcons,
  IncomeIcons,
} from "@/features/transactions/model/CategoryIcons";

/* - Criando uma função para simular o TransactionContext - */

const fakeContextValue = {
  transactions: [],
  handleAddTransaction: vi.fn(),
  handleUpdateTransaction: vi.fn(),
  handleDeleteTransaction: vi.fn(),
  fetchTransactions: vi.fn(),
  totalIncome: 0,
  totalExpense: 0,
  availableMoney: 0,
  isLoading: false,
};

/* - Criando os objetos para simular as transações - */

const fakeIncomeTransaction: Transaction = {
  id: "1",
  title: "Pagamento",
  amount: 3000,
  type: "Entrada",
  category: "Salário",
  date: "2025-01-01",
  period: "Último Ano",
  user_id: "user-1",
};

const fakeExpenseTransaction: Transaction = {
  id: "2",
  title: "Comidinhas",
  amount: 800,
  type: "Saída",
  category: "Mercado",
  date: "2025-02-02",
  period: "Último Ano",
  user_id: "user-1",
};

/* - Criando as funções para renderizar os componentes - */

const renderIncomeComponent = () =>
  render(
    <MemoryRouter>
      <TransactionContext.Provider value={fakeContextValue}>
        <UniqueTransaction
          transaction={fakeIncomeTransaction}
          ExpenseOptions={["Mercado", "Lazer"]}
          IncomeOptions={["Salário", "Freelance"]}
        />
      </TransactionContext.Provider>
    </MemoryRouter>,
  );

const renderExpenseComponent = () =>
  render(
    <MemoryRouter>
      <TransactionContext.Provider value={fakeContextValue}>
        <UniqueTransaction
          transaction={fakeExpenseTransaction}
          ExpenseOptions={["Mercado", "Lazer"]}
          IncomeOptions={["Salário", "Freelance"]}
        />
      </TransactionContext.Provider>
    </MemoryRouter>,
  );

/* - Limpando mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando a data - */

test("should render a text with the date the income transaction was added", () => {
  renderIncomeComponent();

  expect(screen.getByText(/quarta-feira/i)).toBeInTheDocument();
});

test("should render a text with the date the expense transaction was added", () => {
  renderExpenseComponent();

  expect(screen.getByText(/domingo/i)).toBeInTheDocument();
});

/* - Testando o título - */

test("should render a title with text 'Pagamento'", () => {
  renderIncomeComponent();

  expect(screen.getByText("Pagamento")).toBeInTheDocument();
});

test("should render a title with text 'Comidinhas'", () => {
  renderExpenseComponent();

  expect(screen.getByText("Comidinhas")).toBeInTheDocument();
});

/* - Testando o sub-título - */

test("should render a paragraph with texts 'Salário' and '01/01/2025' with a dot in between", () => {
  renderIncomeComponent();

  expect(screen.getByText(/salário/i)).toBeInTheDocument();
  expect(screen.getByText("01/01/2025")).toBeInTheDocument();
});

test("should render a paragraph with texts 'Mercado' and '02/02/2025 with a dot in between", () => {
  renderExpenseComponent();

  expect(screen.getByText(/mercado/i)).toBeInTheDocument();
  expect(screen.getByText("02/02/2025")).toBeInTheDocument();
});

/* - Testando os ícones - */

test("should render the income category icon", () => {
  renderIncomeComponent();

  expect(screen.getByTestId("category-icon")).toBeInTheDocument();
});

test("should render the expense category icon", () => {
  renderExpenseComponent();

  expect(screen.getByTestId("category-icon")).toBeInTheDocument();
});

test("should render the income icon for 'Salário' category", () => {
  renderIncomeComponent();

  const icon = screen.getByTestId("category-icon");

  expect(icon).toHaveTextContent(IncomeIcons["Salário"].icon);
});

test("should render the expense icon for 'Mercado' category", () => {
  renderExpenseComponent();

  const icon = screen.getByTestId("category-icon");

  expect(icon).toHaveTextContent(ExpenseIcons["Mercado"].icon);
});

/* - Testando o valor - */

test("should render a text with the right amount", () => {
  renderIncomeComponent();

  expect(screen.getByText(/3\.000,00/)).toBeInTheDocument();
});

test("should not allow income to have an amount lesser than 0", () => {
  renderIncomeComponent();

  expect(fakeIncomeTransaction.amount).toBeGreaterThan(0);
});

test("should not allow expense to have an amount lesser than 0", () => {
  renderExpenseComponent();

  expect(fakeExpenseTransaction.amount).toBeGreaterThan(0);
});

test("should render the amount text in green", () => {
  renderIncomeComponent();

  const amount = screen.getByText(/3\.000,00/);

  expect(amount).toHaveClass("text-green-600");
});

test("should render the amount text in red", () => {
  renderExpenseComponent();

  const amount = screen.getByText(/800,00/);

  expect(amount).toHaveClass("text-red-600");
});

/* - Testando o label de tipo - */

test("should render a paragraph with text 'Entrada'", () => {
  renderIncomeComponent();

  expect(screen.getByText("Entrada")).toBeInTheDocument();
});

test("should render the text 'Entrada' in green", () => {
  renderIncomeComponent();

  const badge = screen.getByText("Entrada");

  expect(badge).toHaveClass("text-green-600");
  expect(badge).toHaveClass("border-green-600");
  expect(badge).toHaveClass("hover:border-green-800");
  expect(badge).toHaveClass("bg-green-200");
  expect(badge).toHaveClass("hover:bg-green-300");
});

test("should render a paragraph with the text 'Saída'", () => {
  renderExpenseComponent();

  expect(screen.getByText("Saída")).toBeInTheDocument();
});

test("should render the text 'Saída' in red", () => {
  renderExpenseComponent();

  const badge = screen.getByText("Saída");

  expect(badge).toHaveClass("text-red-600");
  expect(badge).toHaveClass("border-red-600");
  expect(badge).toHaveClass("hover:border-red-800");
  expect(badge).toHaveClass("bg-red-200");
  expect(badge).toHaveClass("hover:bg-red-300");
});

/* - Testando o botão de editar - */

test("should render a button to allow users to edit their listed transactions", () => {
  renderIncomeComponent();

  expect(screen.getByLabelText("edit-button")).toBeInTheDocument();
});

test("should render edit button with a pen icon", () => {
  renderIncomeComponent();

  const editButtonIcon = screen.getByTestId("FaPenAlt");

  expect(editButtonIcon).toHaveClass("hover:bg-gray-200");
  expect(editButtonIcon).toHaveClass("hover:text-blue-600");
  expect(editButtonIcon).toHaveClass("hover:border");
  expect(editButtonIcon).toHaveClass("hover:border-gray-100");
});

test("should open modal when button is clicked", async () => {
  renderIncomeComponent();

  const editButton = screen.getByLabelText("edit-button");

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  await userEvent.click(editButton);

  expect(screen.getByRole("dialog")).toBeInTheDocument();
});

test("should close modal when onClose is called", async () => {
  renderIncomeComponent();

  await userEvent.click(screen.getByLabelText("edit-button"));
  expect(screen.getByRole("dialog")).toBeInTheDocument();

  await userEvent.click(screen.getByLabelText("close-modal"));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("should call handleUpdateTransaction when 'Salvar' is clicked in the modal", async () => {
  renderIncomeComponent();

  await userEvent.click(screen.getByLabelText("edit-button"));
  await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

  expect(fakeContextValue.handleUpdateTransaction).toHaveBeenCalledWith(
    expect.objectContaining({ id: "1" }),
  );
});

/* - Testando o botão de deletar - */

test("should render a button to allow users to delete their listed transactions", () => {
  renderIncomeComponent();

  expect(screen.getByLabelText("delete-button")).toBeInTheDocument();
});

test("should render delete button with a trash icon", () => {
  renderIncomeComponent();

  const deleteButtonIcon = screen.getByTestId("FaTrashAlt");

  expect(deleteButtonIcon).toHaveClass("hover:bg-gray-200");
  expect(deleteButtonIcon).toHaveClass("hover:text-red-600");
  expect(deleteButtonIcon).toHaveClass("hover:border");
  expect(deleteButtonIcon).toHaveClass("hover:border-gray-100");
});

test("should call handleDeleteTransaction with correct id", async () => {
  renderIncomeComponent();

  const deleteButton = screen.getByLabelText("delete-button");

  await userEvent.click(deleteButton);

  expect(fakeContextValue.handleDeleteTransaction).toHaveBeenCalledWith("1");
});

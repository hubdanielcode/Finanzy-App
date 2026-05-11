import { render, screen } from "@testing-library/react";
import { LandscapeUniqueTransaction } from "@/features/transactions";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

/* - Criando mocks para simular as chamadas do contexto nos testes - */

const mockHandleDeleteTransaction = vi.fn();
const mockHandleUpdateTransaction = vi.fn();

vi.mock("@/features/transactions/hooks/useTransactionContext", () => ({
  useTransactionContext: vi.fn(() => ({
    handleDeleteTransaction: mockHandleDeleteTransaction,
    handleUpdateTransaction: mockHandleUpdateTransaction,
  })),
}));

/* - Criando mock para o Modal pelo path absoluto - */

vi.mock("@/features/transactions/components/Modal", () => ({
  Modal: ({ onClose, onSubmit, transaction }: any) => (
    <div data-testid="modal">
      <button
        onClick={onClose}
        aria-label="close-modal"
      />
      <button
        onClick={() => onSubmit(transaction)}
        aria-label="submit-modal"
      />
    </div>
  ),
}));

/* - Criando mock para os ícones de categoria - */

vi.mock("@/features/transactions/model/categoryIcons", () => ({
  IncomeIcons: {
    Salário: { icon: "💼" },
  },
  ExpenseIcons: {
    Moradia: { icon: "🏠" },
  },
}));

/* - Transações base para os testes - */

const incomeTransaction = {
  id: "1",
  title: "Salário Janeiro",
  amount: 3000,
  type: "Entrada" as const,
  date: "2024-01-15",
  period: "Último Mês" as const,
  category: "Salário",
  user_id: "user-1",
};

const expenseTransaction = {
  id: "2",
  title: "Aluguel",
  amount: 1500,
  type: "Saída" as const,
  date: "2024-01-20",
  period: "Último Mês" as const,
  category: "Moradia",
  user_id: "user-1",
};

const defaultProps = {
  ExpenseOptions: ["Moradia", "Alimentação"],
  IncomeOptions: ["Salário", "Freelance"],
};

/* - Limpando mocks entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando renderização do título e data - */

test("should render transaction title and formatted date", () => {
  render(
    <LandscapeUniqueTransaction
      transaction={incomeTransaction}
      {...defaultProps}
    />,
  );

  expect(screen.getByText("Salário Janeiro")).toBeInTheDocument();
  expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
});

/* - Testando renderização do valor de entrada - */

test("should render income amount with correct format and badge", () => {
  render(
    <LandscapeUniqueTransaction
      transaction={incomeTransaction}
      {...defaultProps}
    />,
  );

  expect(screen.getByText(/3\.000,00/)).toBeInTheDocument();
  expect(screen.getByText("Entrada")).toBeInTheDocument();
});

/* - Testando renderização do valor de saída - */

test("should render expense amount with correct format and badge", () => {
  render(
    <LandscapeUniqueTransaction
      transaction={expenseTransaction}
      {...defaultProps}
    />,
  );

  expect(screen.getByText(/1\.500,00/)).toBeInTheDocument();
  expect(screen.getByText("Saída")).toBeInTheDocument();
});

/* - Testando renderização da categoria e ícone - */

test("should render category name and icon", () => {
  render(
    <LandscapeUniqueTransaction
      transaction={incomeTransaction}
      {...defaultProps}
    />,
  );

  expect(screen.getByText("Salário")).toBeInTheDocument();
  expect(screen.getByTestId("category-icon")).toBeInTheDocument();
});

/* - Testando renderização dos botões de editar e deletar - */

test("should render edit and delete buttons", () => {
  render(
    <LandscapeUniqueTransaction
      transaction={incomeTransaction}
      {...defaultProps}
    />,
  );

  expect(screen.getByTestId("FaPenAlt")).toBeInTheDocument();
  expect(screen.getByTestId("FaTrashAlt")).toBeInTheDocument();
});

/* - Testando abertura do modal ao clicar em editar - */

test("should open modal when edit button is clicked", async () => {
  render(
    <LandscapeUniqueTransaction
      transaction={incomeTransaction}
      {...defaultProps}
    />,
  );

  await userEvent.click(screen.getByTestId("FaPenAlt"));

  expect(screen.getByTestId("modal")).toBeInTheDocument();
});

/* - Testando fechamento do modal ao clicar em fechar - */

test("should close modal when onClose is called", async () => {
  render(
    <LandscapeUniqueTransaction
      transaction={incomeTransaction}
      {...defaultProps}
    />,
  );

  await userEvent.click(screen.getByTestId("FaPenAlt"));
  await userEvent.click(screen.getByLabelText("close-modal"));

  expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
});

/* - Testando chamada de handleDeleteTransaction ao clicar em deletar - */

test("should call handleDeleteTransaction with transaction id when delete button is clicked", async () => {
  render(
    <LandscapeUniqueTransaction
      transaction={incomeTransaction}
      {...defaultProps}
    />,
  );

  await userEvent.click(screen.getByTestId("FaTrashAlt"));

  expect(mockHandleDeleteTransaction).toHaveBeenCalledWith("1");
  expect(mockHandleDeleteTransaction).toHaveBeenCalledTimes(1);
});

/* - Testando chamada de handleUpdateTransaction ao submeter o modal - */

test("should call handleUpdateTransaction and close modal when onSubmit is called", async () => {
  render(
    <LandscapeUniqueTransaction
      transaction={incomeTransaction}
      {...defaultProps}
    />,
  );

  await userEvent.click(screen.getByTestId("FaPenAlt"));
  await userEvent.click(screen.getByLabelText("submit-modal"));

  expect(mockHandleUpdateTransaction).toHaveBeenCalledWith(incomeTransaction);
  expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
});

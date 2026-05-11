import { render, screen } from "@testing-library/react";
import { Modal } from "@/features/transactions";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

/* - Criando mock para simular as máscaras e regex - */

vi.mock("@/shared", () => ({
  masks: {
    title: vi.fn((value: string) => value),
  },
  regex: {
    amount: { test: vi.fn(() => true) },
  },
}));

/* - Transação base para os testes - */

const mockTransaction = {
  id: "1",
  title: "Salário Janeiro",
  amount: 3000,
  type: "Entrada" as const,
  date: "2024-01-15",
  period: "Último Mês" as const,
  category: "Salário",
  user_id: "user-1",
};

const mockOnClose = vi.fn();
const mockOnSubmit = vi.fn();

const defaultProps = {
  transaction: mockTransaction,
  onClose: mockOnClose,
  onSubmit: mockOnSubmit,
  ExpenseOptions: ["Moradia", "Alimentação"],
  IncomeOptions: ["Salário", "Freelance"],
};

/* - Limpando mocks entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando renderização do modal - */

test("should render modal with transaction data", () => {
  render(<Modal {...defaultProps} />);

  expect(screen.getByText("Atualize a sua transação")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Salário Janeiro")).toBeInTheDocument();
  expect(screen.getByDisplayValue("3000,00")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Salário")).toBeInTheDocument();
  expect(screen.getByDisplayValue("2024-01-15")).toBeInTheDocument();
});

/* - Testando chamada de onClose ao clicar no botão de fechar - */

test("should call onClose when close button is clicked", async () => {
  render(<Modal {...defaultProps} />);

  await userEvent.click(screen.getByLabelText("close-modal"));

  expect(mockOnClose).toHaveBeenCalledTimes(1);
});

/* - Testando edição do título - */

test("should update title when user types in the title input", async () => {
  render(<Modal {...defaultProps} />);

  const titleInput = screen.getByDisplayValue("Salário Janeiro");
  await userEvent.clear(titleInput);
  await userEvent.type(titleInput, "Novo Título");

  expect(screen.getByDisplayValue("Novo Título")).toBeInTheDocument();
});

/* - Testando submissão com dados atualizados - */

test("should call onSubmit with updated transaction when save button is clicked", async () => {
  render(<Modal {...defaultProps} />);

  const titleInput = screen.getByDisplayValue("Salário Janeiro");
  await userEvent.clear(titleInput);
  await userEvent.type(titleInput, "Salário Fevereiro");

  await userEvent.click(screen.getByText("Salvar"));

  expect(mockOnSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ title: "Salário Fevereiro" }),
  );
});

/* - Testando que onSubmit não é chamado com título vazio - */

test("should not call onSubmit when title is empty", async () => {
  render(<Modal {...defaultProps} />);

  const titleInput = screen.getByDisplayValue("Salário Janeiro");
  await userEvent.clear(titleInput);

  await userEvent.click(screen.getByText("Salvar"));

  expect(mockOnSubmit).not.toHaveBeenCalled();
});

/* - Testando abertura do dropdown de categorias - */

test("should open category dropdown when category input is clicked", async () => {
  render(<Modal {...defaultProps} />);

  await userEvent.click(screen.getByDisplayValue("Salário"));

  expect(screen.getByText("Freelance")).toBeInTheDocument();
});

/* - Testando seleção de categoria - */

test("should update category when an option is selected", async () => {
  render(<Modal {...defaultProps} />);

  await userEvent.click(screen.getByDisplayValue("Salário"));
  await userEvent.click(screen.getByText("Freelance"));

  expect(screen.getByDisplayValue("Freelance")).toBeInTheDocument();
});

/* - Testando reset dos campos - */

test("should reset all fields to original transaction values when reset button is clicked", async () => {
  render(<Modal {...defaultProps} />);

  const titleInput = screen.getByDisplayValue("Salário Janeiro");
  await userEvent.clear(titleInput);
  await userEvent.type(titleInput, "Título Alterado");

  await userEvent.click(screen.getByText("Resetar"));

  expect(screen.getByDisplayValue("Salário Janeiro")).toBeInTheDocument();
  expect(screen.getByDisplayValue("3000,00")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Salário")).toBeInTheDocument();
  expect(screen.getByDisplayValue("2024-01-15")).toBeInTheDocument();
});

/* - Testando fechamento do dropdown ao selecionar uma categoria - */

test("should close category dropdown after selecting an option", async () => {
  render(<Modal {...defaultProps} />);

  await userEvent.click(screen.getByDisplayValue("Salário"));
  await userEvent.click(screen.getByText("Freelance"));

  expect(screen.queryByText("Salário Janeiro")).not.toBeInTheDocument();
});

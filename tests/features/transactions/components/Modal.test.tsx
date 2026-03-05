import { render, screen } from "@testing-library/react";
import { Modal } from "@/features/transactions";
import userEvent from "@testing-library/user-event";
import type { Transaction } from "@/features/transactions/model/TransactionTypes";
import { vi } from "vitest";

/* - Criando um objeto para simular uma transação - */

const fakeTransaction: Transaction = {
  id: "1",
  title: "Pagamento",
  amount: 3000,
  category: "Freelance",
  type: "Entrada",
  date: "2025-01-01",
  period: "Último Ano",
  user_id: "user-1",
};

/* - Criando defaultProps para evitar repetição - */

const defaultProps = {
  transaction: fakeTransaction,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  IncomeOptions: ["Salário", "Freelance"],
  ExpenseOptions: ["Alimentação", "Transporte"],
};

/* - Criando a função para renderizar o componente - */

const renderComponent = (props = {}) =>
  render(
    <Modal
      {...defaultProps}
      {...props}
    />,
  );

/* - Testando o título - */

test("should render the modal title 'Atualize a sua transação'", () => {
  renderComponent();

  expect(screen.getByText("Atualize a sua transação")).toBeInTheDocument();
});

/* - Testando se os campos são renderizados com os valores corretos - */

test("should render inputs with the transaction's current values", () => {
  renderComponent();

  expect(screen.getByDisplayValue("Pagamento")).toBeInTheDocument();
  expect(screen.getByDisplayValue("3000,00")).toBeInTheDocument();
  expect(screen.getByDisplayValue("2025-01-01")).toBeInTheDocument();
});

/* - Testando se os botões são renderizados - */

test("should render 'Salvar' and 'Resetar' buttons", () => {
  renderComponent();

  expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Resetar" })).toBeInTheDocument();
});

/* - Testando se onClose é chamado ao clicar no botão de fechar - */

test("should call onClose when the close button is clicked", async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  const closeModalButton = screen.getByLabelText("close-modal");

  await userEvent.click(closeModalButton);

  expect(onClose).toHaveBeenCalledTimes(1);
});

/* - Testando se onSubmit é chamado com os valores atualizados - */

test("should call onSubmit with updated values when 'Salvar' is clicked", async () => {
  const onSubmit = vi.fn();
  renderComponent({ onSubmit });

  const titleInput = screen.getAllByRole("textbox")[0];
  await userEvent.clear(titleInput);
  await userEvent.type(titleInput, "Novo título");

  await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ title: "Novo título" }),
  );
});

/* - Testando se onSubmit não é chamado quando o título está vazio - */

test("should not call onSubmit when title is empty", async () => {
  const onSubmit = vi.fn();
  renderComponent({ onSubmit });

  const titleInput = screen.getAllByRole("textbox")[0];
  await userEvent.clear(titleInput);

  await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

  expect(onSubmit).not.toHaveBeenCalled();
});

/* - Testando se os valores são resetados ao clicar em Resetar - */

test("should reset inputs to original transaction values when 'Resetar' is clicked", async () => {
  renderComponent();

  const titleInput = screen.getAllByRole("textbox")[0];
  await userEvent.clear(titleInput);
  await userEvent.type(titleInput, "Outro título");

  await userEvent.click(screen.getByRole("button", { name: "Resetar" }));

  expect(screen.getByDisplayValue("Pagamento")).toBeInTheDocument();
});

/* - Testando se o dropdown de categorias abre ao clicar no input - */

test("should open category dropdown when category input is clicked", async () => {
  renderComponent();

  await userEvent.click(
    screen.getByPlaceholderText("Selecione uma Categoria..."),
  );

  expect(screen.getByText("Freelance")).toBeInTheDocument();
});

/* - Testando se a categoria é atualizada ao selecionar uma opção - */

test("should update category input when an option is selected", async () => {
  renderComponent();

  await userEvent.click(
    screen.getByPlaceholderText("Selecione uma Categoria..."),
  );
  await userEvent.click(screen.getByText("Freelance"));

  expect(screen.getByDisplayValue("Freelance")).toBeInTheDocument();
});

/* - Testando se o dropdown fecha após selecionar uma categoria - */

test("should close category dropdown after selecting an option", async () => {
  renderComponent();

  await userEvent.click(
    screen.getByPlaceholderText("Selecione uma Categoria..."),
  );
  await userEvent.click(screen.getAllByText("Freelance")[0]);

  expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
});

/* - Testando se caracteres inválidos no campo de valor são ignorados - */

test("should ignore invalid characters in amount input", async () => {
  renderComponent();

  const amountInput = screen.getByDisplayValue("3000,00");
  await userEvent.clear(amountInput);
  await userEvent.type(amountInput, "abc");

  expect(amountInput).toHaveValue("");
});

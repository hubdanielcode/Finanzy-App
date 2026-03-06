import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileActionBar } from "@/features/transactions";
import { vi } from "vitest";

/* - Função para renderizar o componente - */

const renderComponent = (overrides = {}) => {
  const props = {
    OpenForm: vi.fn(),
    OpenTransactionList: vi.fn(),
    ...overrides,
  };

  render(<MobileActionBar {...props} />);

  return { ...props };
};

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando se o componente renderiza sem crashar - */

test("should render the MobileActionBar component without crashing", () => {
  expect(() => renderComponent()).not.toThrow();
});

/* - Testando o botão de nova transação - */

test("should render a button with text 'Nova Transação'", () => {
  renderComponent();

  expect(screen.getByText("Nova Transação")).toBeInTheDocument();
});

test("should call OpenForm when 'Nova Transação' is clicked", async () => {
  const { OpenForm } = renderComponent();

  await userEvent.click(screen.getByText("Nova Transação"));

  expect(OpenForm).toHaveBeenCalled();
});

test("should call OpenForm exactly once when 'Nova Transação' is clicked", async () => {
  const { OpenForm } = renderComponent();

  await userEvent.click(screen.getByText("Nova Transação"));

  expect(OpenForm).toHaveBeenCalledTimes(1);
});

test("should not call OpenTransactionList when 'Nova Transação' is clicked", async () => {
  const { OpenTransactionList } = renderComponent();

  await userEvent.click(screen.getByText("Nova Transação"));

  expect(OpenTransactionList).not.toHaveBeenCalled();
});

/* - Testando o botão de exibir transações - */

test("should render a button with text 'Exibir Transações'", () => {
  renderComponent();

  expect(screen.getByText("Exibir Transações")).toBeInTheDocument();
});

test("should call OpenTransactionList when 'Exibir Transações' is clicked", async () => {
  const { OpenTransactionList } = renderComponent();

  await userEvent.click(screen.getByText("Exibir Transações"));

  expect(OpenTransactionList).toHaveBeenCalled();
});

test("should call OpenTransactionList exactly once when 'Exibir Transações' is clicked", async () => {
  const { OpenTransactionList } = renderComponent();

  await userEvent.click(screen.getByText("Exibir Transações"));

  expect(OpenTransactionList).toHaveBeenCalledTimes(1);
});

test("should not call OpenForm when 'Exibir Transações' is clicked", async () => {
  const { OpenForm } = renderComponent();

  await userEvent.click(screen.getByText("Exibir Transações"));

  expect(OpenForm).not.toHaveBeenCalled();
});

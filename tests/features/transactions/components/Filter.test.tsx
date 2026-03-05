import { render, screen } from "@testing-library/react";
import { Filter } from "@/features/transactions";
import userEvent from "@testing-library/user-event";
import type { Transaction } from "@/features/transactions/model/TransactionTypes";
import { vi } from "vitest";

/* - Criando os mocks das props - */

const defaultProps = {
  searchQuery: "",
  setSearchQuery: vi.fn(),
  filteredTransactions: [] as Transaction[],
  type: null as "Entrada" | "Saída" | null,
  setType: vi.fn(),
  period: null as Transaction["period"] | null,
  setPeriod: vi.fn(),
  category: "",
  setCategory: vi.fn(),
};

/* - Criando a função para renderizar o componente - */

const renderComponent = (props = {}) =>
  render(
    <Filter
      {...defaultProps}
      {...props}
    />,
  );

/* - Testando a barra de busca - */

test("should render the search input", () => {
  renderComponent();

  expect(
    screen.getByPlaceholderText("Buscar transação por título..."),
  ).toBeInTheDocument();
});

/* - Testando o botão de filtros - */

test("should render the filter button", () => {
  renderComponent();

  expect(screen.getByRole("button", { name: /filtros/i })).toBeInTheDocument();
});

/* - Testando se os filtros avançados estão ocultos por padrão - */

test("should not render advanced filters by default", () => {
  renderComponent();

  expect(screen.queryByText("Período")).not.toBeInTheDocument();
  expect(screen.queryByText("Tipo")).not.toBeInTheDocument();
  expect(screen.queryByText("Categoria")).not.toBeInTheDocument();
});

/* - Testando se os filtros avançados abrem ao clicar no botão - */

test("should render advanced filters when filter button is clicked", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: /filtros/i }));

  expect(screen.getByText("Período")).toBeInTheDocument();
  expect(screen.getByText("Tipo")).toBeInTheDocument();
  expect(screen.getByText("Categoria")).toBeInTheDocument();
});

/* - Testando se os filtros avançados fecham ao clicar novamente - */

test("should hide advanced filters when filter button is clicked again", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: /filtros/i }));
  await userEvent.click(screen.getByRole("button", { name: /filtros/i }));

  expect(screen.queryByText("Período")).not.toBeInTheDocument();
});

/* - Testando se setSearchQuery é chamado ao digitar - */

test("should call setSearchQuery when typing in the search input", async () => {
  const setSearchQuery = vi.fn();
  renderComponent({ setSearchQuery });

  await userEvent.type(
    screen.getByPlaceholderText("Buscar transação por título..."),
    "Salário",
  );

  expect(setSearchQuery).toHaveBeenCalled();
});

/* - Testando a contagem de transações no singular - */

test("should render 'Transação Encontrada' when there is only one result", () => {
  renderComponent({ filteredTransactions: [{ id: "1" } as Transaction] });

  expect(screen.getByText("Transação Encontrada")).toBeInTheDocument();
});

/* - Testando a contagem de transações no plural - */

test("should render 'Transações Encontradas' when there are multiple results", () => {
  renderComponent({
    filteredTransactions: [
      { id: "1" } as Transaction,
      { id: "2" } as Transaction,
    ],
  });

  expect(screen.getByText("Transações Encontradas")).toBeInTheDocument();
});

/* - Testando se setPeriod é chamado ao selecionar um período - */

test("should call setPeriod when a period option is selected", async () => {
  const setPeriod = vi.fn();
  renderComponent({ setPeriod });

  await userEvent.click(screen.getByRole("button", { name: /filtros/i }));
  await userEvent.click(screen.getByPlaceholderText("Todos os períodos"));
  await userEvent.click(screen.getAllByRole("listitem")[0]);

  expect(setPeriod).toHaveBeenCalled();
});

/* - Testando se setType é chamado ao selecionar um tipo - */

test("should call setType when a type option is selected", async () => {
  const setType = vi.fn();
  renderComponent({ setType });

  await userEvent.click(screen.getByRole("button", { name: /filtros/i }));
  await userEvent.click(screen.getByPlaceholderText("Todos os tipos"));
  await userEvent.click(screen.getByText("Entrada"));

  expect(setType).toHaveBeenCalledWith("Entrada");
});

/* - Testando se setCategory é chamado ao selecionar uma categoria - */

test("should call setCategory when a category option is selected", async () => {
  const setCategory = vi.fn();
  renderComponent({ setCategory });

  await userEvent.click(screen.getByRole("button", { name: /filtros/i }));
  await userEvent.click(screen.getByPlaceholderText("Todas as categorias"));
  await userEvent.click(screen.getAllByRole("listitem")[0]);

  expect(setCategory).toHaveBeenCalled();
});

/* - Testando se apenas categorias de Entrada aparecem quando type === 'Entrada' - */

test("should render only income categories when type is 'Entrada'", async () => {
  renderComponent({ type: "Entrada" });

  await userEvent.click(screen.getByRole("button", { name: /filtros/i }));
  await userEvent.click(screen.getByPlaceholderText("Todas as categorias"));

  expect(screen.queryByText("Saída")).not.toBeInTheDocument();
});

/* - Testando se apenas categorias de Saída aparecem quando type === 'Saída' - */

test("should render only expense categories when type is 'Saída'", async () => {
  renderComponent({ type: "Saída" });

  await userEvent.click(screen.getByRole("button", { name: /filtros/i }));
  await userEvent.click(screen.getByPlaceholderText("Todas as categorias"));

  expect(screen.queryByText("Entrada")).not.toBeInTheDocument();
});

/* - Testando se os filtros são limpos ao clicar em Limpar Filtros - */

test("should call all setters with empty values when 'Limpar Filtros' is clicked", async () => {
  const setSearchQuery = vi.fn();
  const setType = vi.fn();
  const setPeriod = vi.fn();
  const setCategory = vi.fn();

  renderComponent({ setSearchQuery, setType, setPeriod, setCategory });

  await userEvent.click(screen.getByText("Limpar Filtros"));

  expect(setSearchQuery).toHaveBeenCalledWith("");
  expect(setType).toHaveBeenCalledWith(null);
  expect(setPeriod).toHaveBeenCalledWith(null);
  expect(setCategory).toHaveBeenCalledWith("");
});

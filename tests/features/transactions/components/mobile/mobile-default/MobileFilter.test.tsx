import { render, screen, waitFor } from "@testing-library/react";
import { MobileFilter } from "@/features/transactions";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Transaction } from "@/features/transactions";

/* - Função para renderizar o componente - */

const renderComponent = (overrides = {}) => {
  const props = {
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

  render(<MobileFilter {...props} />);

  return { ...props };
};

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando o título - */

test("should render the title 'Filtrar Transações'", () => {
  renderComponent();

  expect(screen.getByText("Filtrar Transações")).toBeInTheDocument();
});

/* - Testando o botão de fechar - */

test("should call setIsMobileTransactionListOpen with false when close button is clicked", async () => {
  const { setIsMobileTransactionListOpen } = renderComponent();

  const closeButton = screen.getByRole("button", { name: "" });
  await userEvent.click(closeButton);

  expect(setIsMobileTransactionListOpen).toHaveBeenCalledWith(false);
});

test("should call setIsMobileTransactionListOpen exactly once when close button is clicked", async () => {
  const { setIsMobileTransactionListOpen } = renderComponent();

  const closeButton = screen.getByRole("button", { name: "" });
  await userEvent.click(closeButton);

  expect(setIsMobileTransactionListOpen).toHaveBeenCalledTimes(1);
});

/* - Testando a searchbar - */

test("should render the search input", () => {
  renderComponent();

  expect(
    screen.getByPlaceholderText("Buscar transação por título..."),
  ).toBeInTheDocument();
});

test("should call setSearchQuery when user types in the search input", async () => {
  const { setSearchQuery } = renderComponent();

  const searchInput = screen.getByPlaceholderText(
    "Buscar transação por título...",
  );
  await userEvent.type(searchInput, "Mercado");

  expect(setSearchQuery).toHaveBeenCalled();
});

/* - Testando os inputs de filtro - */

test("should render the 'Período' filter input", () => {
  renderComponent();

  expect(screen.getByPlaceholderText("Todos os períodos")).toBeInTheDocument();
});

test("should render the 'Tipo' filter input", () => {
  renderComponent();

  expect(screen.getByPlaceholderText("Todos os tipos")).toBeInTheDocument();
});

test("should render the 'Categoria' filter input", () => {
  renderComponent();

  expect(
    screen.getByPlaceholderText("Todas as categorias"),
  ).toBeInTheDocument();
});

/* - Testando abertura dos dropdowns - */

test("should open the period dropdown when 'Período' input is clicked", async () => {
  renderComponent();

  const periodInput = screen.getByPlaceholderText("Todos os períodos");
  await userEvent.click(periodInput);

  expect(screen.getByRole("list")).toBeInTheDocument();
});

test("should open the type dropdown when 'Tipo' input is clicked", async () => {
  renderComponent();

  const typeInput = screen.getByPlaceholderText("Todos os tipos");
  await userEvent.click(typeInput);

  expect(screen.getByRole("list")).toBeInTheDocument();
});

test("should open the category dropdown when 'Categoria' input is clicked", async () => {
  renderComponent();

  const categoryInput = screen.getByPlaceholderText("Todas as categorias");
  await userEvent.click(categoryInput);

  expect(screen.getByRole("list")).toBeInTheDocument();
});

/* - Testando seleção de filtros - */

test("should call setPeriod when a period option is selected", async () => {
  const { setPeriod } = renderComponent();

  const periodInput = screen.getByPlaceholderText("Todos os períodos");
  await userEvent.click(periodInput);

  const firstOption = screen.getAllByRole("listitem")[0];
  await userEvent.click(firstOption);

  expect(setPeriod).toHaveBeenCalledTimes(1);
});

test("should call setType when a type option is selected", async () => {
  const { setType } = renderComponent();

  const typeInput = screen.getByPlaceholderText("Todos os tipos");
  await userEvent.click(typeInput);

  const firstOption = screen.getAllByRole("listitem")[0];
  await userEvent.click(firstOption);

  expect(setType).toHaveBeenCalledTimes(1);
});

test("should call setCategory when a category option is selected", async () => {
  const { setCategory } = renderComponent();

  const categoryInput = screen.getByPlaceholderText("Todas as categorias");
  await userEvent.click(categoryInput);

  await userEvent.click(screen.getByText("Salário"));

  expect(setCategory).toHaveBeenCalledTimes(1);
});

/* - Testando o fechamento do dropdown ao clicar fora - */

test("should close the dropdown when user clicks outside", async () => {
  renderComponent();

  const periodInput = screen.getByPlaceholderText("Todos os períodos");
  await userEvent.click(periodInput);

  expect(screen.getByRole("list")).toBeInTheDocument();

  await userEvent.click(document.body);

  await waitFor(() => {
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

/* - Testando o botão de limpar filtros - */

test("should render the 'Limpar filtros' button", () => {
  renderComponent();

  expect(screen.getByText("Limpar filtros")).toBeInTheDocument();
});

test("should reset all filters when 'Limpar filtros' is clicked", async () => {
  const { setSearchQuery, setType, setPeriod, setCategory } = renderComponent();

  const clearButton = screen.getByText("Limpar filtros");
  await userEvent.click(clearButton);

  expect(setSearchQuery).toHaveBeenCalledWith("");
  expect(setType).toHaveBeenCalledWith(null);
  expect(setPeriod).toHaveBeenCalledWith(null);
  expect(setCategory).toHaveBeenCalledWith("");
});

/* - Testando o contador de transações - */

test("should display the correct transaction count — singular", () => {
  renderComponent({
    filteredTransactions: [{ id: "1" }] as Transaction[],
  });

  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("Transação encontrada")).toBeInTheDocument();
});

test("should display the correct transaction count — plural", () => {
  renderComponent({
    filteredTransactions: [{ id: "1" }, { id: "2" }] as Transaction[],
  });

  expect(screen.getByText("2")).toBeInTheDocument();
  expect(screen.getByText("Transações encontradas")).toBeInTheDocument();
});

/* - Testando visibilidade de categorias por tipo - */

test("should not show 'Saída' categories when type is 'Entrada'", async () => {
  renderComponent({ type: "Entrada" });

  const categoryInput = screen.getByPlaceholderText("Todas as categorias");
  await userEvent.click(categoryInput);

  expect(screen.queryByText("Saída")).not.toBeInTheDocument();
});

test("should not show 'Entrada' categories when type is 'Saída'", async () => {
  renderComponent({ type: "Saída" });

  const categoryInput = screen.getByPlaceholderText("Todas as categorias");
  await userEvent.click(categoryInput);

  expect(screen.queryByText("Entrada")).not.toBeInTheDocument();
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Filter } from "@/features/transactions/components/Filter";
import type { Transaction } from "@/features/transactions/model/transactionTypes";

/* - Mockando framer motion - */

vi.mock("framer-motion", () => ({
  motion: {
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
}));

/* - Mockando transaction options - */

vi.mock("@/features/transactions/model/transactionOptions", () => ({
  IncomeOptions: ["Salário", "Freelance"],
  ExpenseOptions: ["Mercado", "Transporte"],
  TransactionTypeOptions: ["Entrada", "Saída"],
  PeriodOptions: ["Hoje", "Última Semana", "Último Mês"],
}));

/* - Mock de transações - */

const mockTransactions: Transaction[] = [
  {
    id: "1",
    user_id: "123",
    title: "Salário",
    amount: 5000,
    type: "Entrada",
    category: "Salário",
    period: "Hoje",
    date: "2025-09-20",
  },
];

/* - Função para renderizar o componente - */

const renderComponent = (propsOverride = {}) => {
  const props = {
    searchQuery: "",

    setSearchQuery: vi.fn(),

    filteredTransactions: mockTransactions,

    type: null,

    setType: vi.fn(),

    period: null,

    setPeriod: vi.fn(),

    category: "",

    setCategory: vi.fn(),

    ...propsOverride,
  };

  render(<Filter {...props} />);

  return props;
};

/* - Limpando os mocks entre os testes - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando a searchbar - */

test("should render the search input", () => {
  renderComponent();

  expect(
    screen.getByPlaceholderText("Buscar transação por título..."),
  ).toBeInTheDocument();
});

test("should allow the user to type in search input", async () => {
  const props = renderComponent();

  const searchInput = screen.getByPlaceholderText(
    "Buscar transação por título...",
  );

  await userEvent.type(searchInput, "Mercado");

  expect(props.setSearchQuery).toHaveBeenCalled();
});

/* - Testando o botão de filtros - */

test("should render the filters button", () => {
  renderComponent();

  expect(screen.getByText("Filtros")).toBeInTheDocument();
});

test("should open filters when clicking filters button", async () => {
  renderComponent();

  const filtersButton = screen.getByText("Filtros");

  await userEvent.click(filtersButton);

  expect(screen.getByText("Período")).toBeInTheDocument();

  expect(screen.getByText("Tipo")).toBeInTheDocument();

  expect(screen.getByText("Categoria")).toBeInTheDocument();
});

/* - Testando o filtro de período - */

test("should open period options when clicking period input", async () => {
  renderComponent();

  const filtersButton = screen.getByText("Filtros");

  await userEvent.click(filtersButton);

  const periodInput = screen.getByPlaceholderText("Todos os períodos");

  await userEvent.click(periodInput);

  expect(screen.getByText("Hoje")).toBeInTheDocument();

  expect(screen.getByText("Última Semana")).toBeInTheDocument();

  expect(screen.getByText("Último Mês")).toBeInTheDocument();
});

test("should select a period option", async () => {
  const props = renderComponent();

  const filtersButton = screen.getByText("Filtros");

  await userEvent.click(filtersButton);

  const periodInput = screen.getByPlaceholderText("Todos os períodos");

  await userEvent.click(periodInput);

  const option = screen.getByText("Hoje");

  await userEvent.click(option);

  expect(props.setPeriod).toHaveBeenCalledWith("Hoje");
});

/* - Testando o filtro de tipo - */

test("should open type options when clicking type input", async () => {
  renderComponent();

  const filtersButton = screen.getByText("Filtros");

  await userEvent.click(filtersButton);

  const typeInput = screen.getByPlaceholderText("Todos os tipos");

  await userEvent.click(typeInput);

  expect(screen.getByText("Entrada")).toBeInTheDocument();

  expect(screen.getByText("Saída")).toBeInTheDocument();
});

test("should select a type option", async () => {
  const props = renderComponent();

  const filtersButton = screen.getByText("Filtros");

  await userEvent.click(filtersButton);

  const typeInput = screen.getByPlaceholderText("Todos os tipos");

  await userEvent.click(typeInput);

  const option = screen.getByText("Entrada");

  await userEvent.click(option);

  expect(props.setType).toHaveBeenCalledWith("Entrada");

  expect(props.setCategory).toHaveBeenCalledWith("");
});

/* - Testando o filtro de categoria - */

test("should open category options when clicking category input", async () => {
  renderComponent();

  const filtersButton = screen.getByText("Filtros");

  await userEvent.click(filtersButton);

  const categoryInput = screen.getByPlaceholderText("Todas as categorias");

  await userEvent.click(categoryInput);

  expect(screen.getByText("Salário")).toBeInTheDocument();

  expect(screen.getByText("Freelance")).toBeInTheDocument();

  expect(screen.getByText("Mercado")).toBeInTheDocument();

  expect(screen.getByText("Transporte")).toBeInTheDocument();
});

test("should select an income category", async () => {
  const props = renderComponent();

  const filtersButton = screen.getByText("Filtros");

  await userEvent.click(filtersButton);

  const categoryInput = screen.getByPlaceholderText("Todas as categorias");

  await userEvent.click(categoryInput);

  const option = screen.getByText("Salário");

  await userEvent.click(option);

  expect(props.setCategory).toHaveBeenCalledWith("Salário");

  expect(props.setType).toHaveBeenCalledWith("Entrada");
});

test("should select an expense category", async () => {
  const props = renderComponent();

  const filtersButton = screen.getByText("Filtros");

  await userEvent.click(filtersButton);

  const categoryInput = screen.getByPlaceholderText("Todas as categorias");

  await userEvent.click(categoryInput);

  const option = screen.getByText("Mercado");

  await userEvent.click(option);

  expect(props.setCategory).toHaveBeenCalledWith("Mercado");

  expect(props.setType).toHaveBeenCalledWith("Saída");
});

/* - Testando o botão de limpar filtros - */

test("should clear all filters when clicking clear filters button", async () => {
  const props = renderComponent();

  const clearButton = screen.getByText("Limpar Filtros");

  await userEvent.click(clearButton);

  expect(props.setSearchQuery).toHaveBeenCalledWith("");

  expect(props.setType).toHaveBeenCalledWith(null);

  expect(props.setPeriod).toHaveBeenCalledWith(null);

  expect(props.setCategory).toHaveBeenCalledWith("");
});

/* - Testando contador de transações - */

test("should render singular transaction text", () => {
  renderComponent();

  expect(screen.getByText("Transação Encontrada")).toBeInTheDocument();
});

test("should render plural transaction text", () => {
  const multipleTransactions: Transaction[] = [
    {
      id: "1",
      user_id: "123",
      title: "Salário",
      amount: 5000,
      type: "Entrada",
      category: "Salário",
      period: "Hoje",
      date: "2025-09-20",
    },
    {
      id: "2",
      user_id: "123",
      title: "Mercado",
      amount: 200,
      type: "Saída",
      category: "Mercado",
      period: "Hoje",
      date: "2025-09-20",
    },
  ];

  renderComponent({
    filteredTransactions: multipleTransactions,
  });

  expect(screen.getByText("Transações Encontradas")).toBeInTheDocument();
});

/* - Testando clique fora do dropdown - */

test("should close dropdown when clicking outside", async () => {
  renderComponent();

  const filtersButton = screen.getByText("Filtros");

  await userEvent.click(filtersButton);

  const periodInput = screen.getByPlaceholderText("Todos os períodos");

  await userEvent.click(periodInput);

  expect(screen.getByText("Hoje")).toBeInTheDocument();

  await userEvent.click(document.body);

  expect(screen.queryByText("Hoje")).not.toBeInTheDocument();
});

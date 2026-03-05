import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@/shared";
import { vi } from "vitest";

/* - Criando as props padrão para evitar repetição - */

const defaultProps = {
  currentPage: 1,
  setCurrentPage: vi.fn(),
  totalPages: 5,
  startIndex: 0,
  endIndex: 10,
  pages: [1, 2, 3, 4, 5],
  itemsPerPage: 10,
  setItemsPerPage: vi.fn(),
};

/* - Criando a função para renderizar o componente - */

const renderComponent = (props = defaultProps) => {
  return render(<Pagination {...props} />);
};

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando o texto de paginação - */

test("should render the current page and total pages", () => {
  renderComponent();

  expect(screen.getByText(/mostrando página/i)).toBeInTheDocument();
});

/* - Testando os botões de navegação - */

test("should render the previous and next buttons", () => {
  renderComponent();

  const buttons = screen.getAllByRole("button");

  expect(buttons[0]).toBeInTheDocument();
  expect(buttons[buttons.length - 1]).toBeInTheDocument();
});

/* - Testando o botão de página anterior desabilitado na primeira página - */

test("should disable the previous button when on the first page", () => {
  renderComponent();

  const buttons = screen.getAllByRole("button");
  const previousButton = buttons[0];

  expect(previousButton).toBeDisabled();
});

/* - Testando o botão de próxima página desabilitado na última página - */

test("should disable the next button when on the last page", () => {
  renderComponent({ ...defaultProps, currentPage: 5 });

  const buttons = screen.getAllByRole("button");
  const nextButton = buttons[buttons.length - 1];

  expect(nextButton).toBeDisabled();
});

/* - Testando a navegação para a próxima página - */

test("should call setCurrentPage with the next page when the next button is clicked", async () => {
  renderComponent({ ...defaultProps, currentPage: 2 });

  const buttons = screen.getAllByRole("button");
  const nextButton = buttons[buttons.length - 1];

  await userEvent.click(nextButton);

  expect(defaultProps.setCurrentPage).toHaveBeenCalledWith(3);
});

/* - Testando a navegação para a página anterior - */

test("should call setCurrentPage with the previous page when the previous button is clicked", async () => {
  renderComponent({ ...defaultProps, currentPage: 3 });

  const buttons = screen.getAllByRole("button");
  const previousButton = buttons[0];

  await userEvent.click(previousButton);

  expect(defaultProps.setCurrentPage).toHaveBeenCalledWith(2);
});

/* - Testando a navegação para uma página específica - */

test("should call setCurrentPage with the correct page when a page button is clicked", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "3" }));

  expect(defaultProps.setCurrentPage).toHaveBeenCalledWith(3);
});

/* - Testando o highlight da página atual - */

test("should highlight the current page button", () => {
  renderComponent({ ...defaultProps, currentPage: 3 });

  const currentPageButton = screen.getByRole("button", { name: "3" });

  expect(currentPageButton).toHaveClass("from-blue-600");
});

/* - Testando a abertura do dropdown de itens por página - */

test("should open the page limit dropdown when clicked", async () => {
  renderComponent();

  const dropdown = screen.getByText("10");

  await userEvent.click(dropdown);

  expect(screen.getByText("10")).toBeInTheDocument();
  expect(screen.getByText("20")).toBeInTheDocument();
  expect(screen.getByText("50")).toBeInTheDocument();
  expect(screen.getByText("100")).toBeInTheDocument();
});

/* - Testando a seleção de itens por página - */

test("should call setItemsPerPage and reset to page 1 when a new limit is selected", async () => {
  renderComponent();

  await userEvent.click(screen.getByText("10"));
  await userEvent.click(screen.getByText("20"));

  expect(defaultProps.setItemsPerPage).toHaveBeenCalledWith(20);
  expect(defaultProps.setCurrentPage).toHaveBeenCalledWith(1);
});

/* - Testando o fechamento do dropdown ao clicar fora - */

test("should close the page limit dropdown when clicking outside", async () => {
  renderComponent();

  await userEvent.click(screen.getByText("10"));

  expect(screen.getByText("20")).toBeInTheDocument();

  await userEvent.click(document.body);

  expect(screen.queryByText("20")).not.toBeInTheDocument();
});

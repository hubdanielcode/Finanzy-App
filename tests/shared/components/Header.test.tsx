import { render, screen } from "@testing-library/react";
import { Header } from "@/shared";
import { MemoryRouter } from "react-router-dom";
import { TransactionProvider } from "@/features/transactions";
import userEvent from "@testing-library/user-event";

/* - Criando a função para renderizar o componente - */

const renderComponent = () =>
  render(
    <MemoryRouter>
      <TransactionProvider>
        <Header />
      </TransactionProvider>
    </MemoryRouter>,
  );

/* - Testando a logo - */

test("should render Finanzy's Logo", () => {
  renderComponent();

  expect(screen.getByAltText("Logo")).toBeInTheDocument();
});

/* - Testando o título - */

test("should render a title with text 'Controle Financeiro'", () => {
  renderComponent();

  expect(screen.getByText("Controle Financeiro")).toBeInTheDocument();
});

/* - Testando o sub-título - */

test("should render a paragraph with text 'Gerencie suas finanças pessoais", () => {
  renderComponent();

  expect(
    screen.getByText(/gerencie suas finanças pessoais/i),
  ).toBeInTheDocument();
});

/* - Testando se o botão renderiza com o ícone Eye (isPrivate === false) - */

test("should render a button with an eye and 'Ocultar' when isPrivate === false", () => {
  renderComponent();

  expect(screen.getByRole("button", { name: "Ocultar" })).toBeInTheDocument();
});

/* - Testando se o botão muda para EyeClosed ao clicar (isPrivate === true) - */

test("should render a button with an eyeClosed and 'Mostrar' when isPrivate === true", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Ocultar" }));

  expect(screen.getByRole("button", { name: "Mostrar" })).toBeInTheDocument();
});

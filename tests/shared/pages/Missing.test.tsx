import { render, screen } from "@testing-library/react";
import { Missing } from "@/shared";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Login } from "@/features/authentication";

/* - Criando a função para renderizar o componente com Router - */

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <Missing />
    </MemoryRouter>,
  );
};

/* - Testando o título - */

test("should render a title with the text '404'", () => {
  renderComponent();

  expect(screen.getByText("404")).toBeInTheDocument();
});

/* - Testando o sub-título - */

test("should render a paragraph with the text 'Página não encontrada'", () => {
  renderComponent();

  expect(screen.getByText("Página não encontrada")).toBeInTheDocument();
});

/* - Testando o botão de voltar para a página de login - */

test("should render a button with the text 'Voltar para a tela de Login'", () => {
  renderComponent();

  expect(screen.getByText("Voltar para a tela de Login")).toBeInTheDocument();
});

test("should redirect the user to the sign in page upon click", async () => {
  render(
    <MemoryRouter initialEntries={["/missing-page"]}>
      <Routes>
        <Route
          path="*"
          element={<Missing />}
        />
        <Route
          path="/"
          element={<Login />}
        />
      </Routes>
    </MemoryRouter>,
  );

  const redirectButton = screen.getByRole("link", {
    name: /voltar para a tela de login/i,
  });

  await userEvent.click(redirectButton);

  expect(
    screen.getByLabelText("Toggle Password Visibility Login"),
  ).toBeInTheDocument();
});

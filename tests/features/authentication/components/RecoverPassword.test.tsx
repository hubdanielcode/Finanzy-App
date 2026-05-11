import { render, screen } from "@testing-library/react";
import { RecoverPassword } from "@/features/authentication";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { supabase } from "@/../supabase/supabase";

/* - Função para renderizar o componente com Router - */

const renderComponent = () =>
  render(
    <MemoryRouter>
      <RecoverPassword />
    </MemoryRouter>,
  );

/* - Criando mock para simular a chamada do supabase nos testes - */

vi.mock("@/../supabase/supabase", () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: vi.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

/* - Mockando variáveis de ambiente - */

vi.stubEnv("VITE_REDIRECT_URL", "http://localhost:5173");

/* - Limpando o mock entre os testes para evitar erro - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando a logo - */

test("should render Finanzy's Logo", () => {
  renderComponent();

  expect(screen.getByAltText("Logo")).toBeInTheDocument();
});

/* - Testando o título - */

test("should render a title with the text 'Recupere sua senha'", () => {
  renderComponent();

  expect(
    screen.getByRole("heading", { name: "Recupere sua senha" }),
  ).toBeInTheDocument();
});

/* - Testando o input de email - */

test("should render the 'Email' input and allow the user to type on it", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("seu@email.com");

  await userEvent.type(emailInput, "useremail@gmail.com");
  expect(emailInput).toHaveValue("useremail@gmail.com");
});

/* - Testando o botão de envio - */

test("should render a button to allow the user to send the email", () => {
  renderComponent();

  const sendEmailButton = screen.getByRole("button", { name: "Enviar Email" });

  expect(sendEmailButton).not.toBeDisabled();
  expect(sendEmailButton).toBeInTheDocument();
});

/* - Verificando se a função do supabase foi chamada corretamente - */

test("should call supabase resetPasswordForEmail with correct data", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("seu@email.com");
  const sendEmailButton = screen.getByRole("button", { name: "Enviar Email" });

  await userEvent.type(emailInput, "useremail@gmail.com");
  await userEvent.click(sendEmailButton);

  expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
    "useremail@gmail.com",
    { redirectTo: "http://localhost:5173/recuperar-senha" },
  );
});

/* - Testando erros de validação - */

test("should show error if email field is empty", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Enviar Email" }));

  expect(
    await screen.findByText("Digite um endereço de email válido."),
  ).toBeInTheDocument();
});

test("should show error if email format is invalid", async () => {
  renderComponent();

  await userEvent.type(
    screen.getByPlaceholderText("seu@email.com"),
    "useremail.com",
  );
  await userEvent.click(screen.getByRole("button", { name: "Enviar Email" }));

  expect(
    await screen.findByText("Digite um endereço de email válido."),
  ).toBeInTheDocument();
});

test("should show error if supabase returns an error", async () => {
  vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValueOnce({
    data: {},
    error: { message: "Error" } as any,
  });

  renderComponent();

  await userEvent.type(
    screen.getByPlaceholderText("seu@email.com"),
    "useremail@gmail.com",
  );
  await userEvent.click(screen.getByRole("button", { name: "Enviar Email" }));

  expect(
    await screen.findByText("Erro ao tentar enviar email."),
  ).toBeInTheDocument();
});

/* - Testando o link para a página de login - */

test("should render a link with the text 'Voltar para a tela de Login'", () => {
  renderComponent();

  expect(screen.getByText("Voltar para a tela de Login")).toBeInTheDocument();
});

test("should redirect the user to login page upon click", async () => {
  render(
    <MemoryRouter initialEntries={["/recuperar-senha"]}>
      <Routes>
        <Route
          path="/recuperar-senha"
          element={<RecoverPassword />}
        />
        <Route
          path="/"
          element={
            <div>
              <h1>Entrar</h1>
            </div>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  await userEvent.click(screen.getByText("Voltar para a tela de Login"));

  expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
});

import { render, screen } from "@testing-library/react";
import { RecoverPassword, Login } from "@/features/authentication";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import { supabase } from "@/supabase/supabase";

/* - Função para renderizar o componente com Router - */

const renderComponent = () =>
  render(
    <MemoryRouter>
      <RecoverPassword />
    </MemoryRouter>,
  );

/* - Criando o mock para simular a chamada do supabase nos testes - */

vi.mock("@/supabase/supabase", () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: vi.fn(() =>
        Promise.resolve({ data: null, error: null }),
      ),
    },
  },
}));

/* - Limpando o mock entre os testes para evitar erro - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Verificando se a função do supabase foi chamada corretamente - */

test("should call supabase resetPasswordForEmail with correct data", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("exemplo@email.com");
  const sendEmailButton = screen.getByText("Enviar Email");

  await userEvent.type(emailInput, "useremail@gmail.com");
  await userEvent.click(sendEmailButton);

  expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
    "useremail@gmail.com",
    {
      redirectTo: "https://projeto-finanzy.vercel.app/recover-password",
    },
  );
});

/* - Testando a logo - */

test("should render Finanzy's Logo", () => {
  renderComponent();

  expect(screen.getByAltText("Logo")).toBeInTheDocument();
});

/* - Testando o título - */

test("should render a title with the text 'Recupere sua senha'", () => {
  renderComponent();

  expect(screen.getByText("Recupere sua senha")).toBeInTheDocument();
});

/* - Testando o sub-título - */

test("should render a paragraph with the text 'Informe seu endereço de email para receber um link de redefinição de senha'", () => {
  renderComponent();

  expect(
    screen.getByText(
      "Informe seu endereço de email para receber um link de redefinição de senha",
    ),
  ).toBeInTheDocument();
});

/* - Testando o input de email - */

test("should render an input for the user to type his email", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("exemplo@email.com");

  await userEvent.type(emailInput, "useremail@gmail.com");

  expect(emailInput).toHaveValue("useremail@gmail.com");
});

/* - Testando o botão de solicitar recuperação de senha - */

test("should render a button to allow the user to type the email address that will recieve the reset password message", async () => {
  renderComponent();

  const sendEmailButton = screen.getByText("Enviar Email");

  expect(sendEmailButton).toBeInTheDocument();

  await userEvent.click(sendEmailButton);
});

test("should send reset password email if the button is clicked and the typed email is valid", async () => {
  renderComponent();

  const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

  const emailInput = screen.getByPlaceholderText("exemplo@email.com");
  const sendEmailButton = screen.getByText("Enviar Email");

  await userEvent.type(emailInput, "useremail@gmail.com");
  await userEvent.click(sendEmailButton);

  expect(alertSpy).toHaveBeenCalledWith(
    "Se o email estiver cadastrado, você receberá um link de redefinição de senha.",
  );

  alertSpy.mockRestore();
});

test("should show error if email input is blank or typed email is not valid", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("exemplo@email.com");
  const sendEmailButton = screen.getByText("Enviar Email");

  await userEvent.type(emailInput, "useremail.gmail.com");
  await userEvent.click(sendEmailButton);

  expect(
    screen.getByText("Digite um endereço de email válido."),
  ).toBeInTheDocument();
});

/* - Testando o link para a página de login - */

test("should render a link with text 'Voltar para a tela de Login'", () => {
  renderComponent();

  const loginLink = screen.getByText("Voltar para a tela de Login");
  expect(loginLink).toBeInTheDocument();
});

test("should redirect the user to login page upon click", async () => {
  render(
    <MemoryRouter initialEntries={["/recover-password"]}>
      <Routes>
        <Route
          path="/recover-password"
          element={<RecoverPassword />}
        />
        <Route
          path="/"
          element={<Login />}
        />
      </Routes>
    </MemoryRouter>,
  );

  const loginLink = screen.getByText("Voltar para a tela de Login");

  await userEvent.click(loginLink);

  expect(
    screen.getByLabelText("Toggle Password Visibility Login"),
  ).toBeInTheDocument();
});

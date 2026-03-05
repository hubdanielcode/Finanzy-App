import { render, screen } from "@testing-library/react";
import {
  Login,
  Authentication,
  RecoverPassword,
} from "@/features/authentication";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { supabase } from "@/supabase/supabase";

/* - Função para renderizar o componente com Router - */

const renderComponent = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

/* - Criando mock para simular a chamada do supabase nos testes - */

vi.mock("@/supabase/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(() =>
        Promise.resolve({
          data: null,
          error: { message: "Invalid login credentials" },
        }),
      ),
    },
  },
}));

/* - Limpando o mock entre os testes para evitar erro - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Verificando se a função do supabase foi chamada corretamente - */

test("should call supabase signInWithPassword with correct data", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("exemplo@email.com");
  const passwordInput = screen.getByPlaceholderText("Senha");
  const signInButton = screen.getByRole("button", { name: "Entrar" });

  await userEvent.type(emailInput, "useremail@gmail.com");
  await userEvent.type(passwordInput, "userpassword");
  await userEvent.click(signInButton);

  expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
    email: "useremail@gmail.com",
    password: "userpassword",
  });
});

/* - Testando a logo - */

test("should render Finanzy's Logo", () => {
  renderComponent();
  expect(screen.getByAltText("Logo")).toBeInTheDocument();
});

/* - Testando o título - */

test("should render a title with the text 'Entrar'", () => {
  renderComponent();

  expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
});

/* - Testando os inputs - */

test("should render the 'Email' input and allow the user to type on it", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("exemplo@email.com");

  await userEvent.type(emailInput, "useremail@gmail.com");
  expect(emailInput).toHaveValue("useremail@gmail.com");
});

test("should render the 'Password' input and allow the user to type on it", async () => {
  renderComponent();

  const passwordInput = screen.getByPlaceholderText("Senha");
  const hidePasswordButton = screen.getByLabelText(
    "Toggle Password Visibility Login",
  );

  await userEvent.type(passwordInput, "userpassword");
  expect(passwordInput).toHaveValue("userpassword");

  await userEvent.click(hidePasswordButton);
});

/* - Testando o link para página de recuperação de senha - */

test("should render a link with the text 'Esqueci minha senha'", () => {
  renderComponent();

  const forgotPasswordLink = screen.getByText("Esqueci minha senha");
  expect(forgotPasswordLink).toBeInTheDocument();
});

test("should redirect the user to recover password page upon click", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/recover-password"
          element={<RecoverPassword />}
        />
      </Routes>
    </MemoryRouter>,
  );
  const recoverPasswordLink = screen.getByText("Esqueci minha senha");

  await userEvent.click(recoverPasswordLink);

  expect(screen.getByText("Recupere sua senha")).toBeInTheDocument();
});

/* - Testando o botão de login - */

test("should render a button to allow the user to sign in", async () => {
  renderComponent();

  const signInButton = screen.getByRole("button", { name: "Entrar" });

  expect(signInButton).not.toBeDisabled();
  expect(signInButton).toBeInTheDocument();
  await userEvent.click(signInButton);
});

test("should allow user to sign in when all fields are filled", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("exemplo@email.com");
  const passwordInput = screen.getByPlaceholderText("Senha");

  await userEvent.type(emailInput, "useremail@gmail.com");
  await userEvent.type(passwordInput, "userpassword");

  expect(emailInput).toHaveValue("useremail@gmail.com");
  expect(passwordInput).toHaveValue("userpassword");

  const signInButton = screen.getByRole("button", { name: "Entrar" });

  await userEvent.click(signInButton);
});

/* - Testando se há campos vazios - */

test("should should show error if one or more fields are empty", async () => {
  renderComponent();

  const signInButton = screen.getByRole("button", { name: "Entrar" });

  await userEvent.click(signInButton);

  const errorMessage = await screen.findByText(/preencha todos os campos/i);

  expect(errorMessage).toBeInTheDocument();
});

test("should show error if password is not bound to email", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("exemplo@email.com");
  const passwordInput = screen.getByPlaceholderText("Senha");
  const signInButton = screen.getByRole("button", { name: "Entrar" });

  await userEvent.type(emailInput, "user@email.com");
  await userEvent.type(passwordInput, "wrongpassword");

  await userEvent.click(signInButton);

  const errorMessage = await screen.findByText("Email ou senha inválidos.");

  expect(errorMessage).toBeInTheDocument();
});

test("should show error if email format is different from the required one", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("exemplo@email.com");
  const passwordInput = screen.getByPlaceholderText("Senha");
  const signInButton = screen.getByRole("button", { name: "Entrar" });

  await userEvent.type(emailInput, "useremail.com");
  await userEvent.type(passwordInput, "123456");
  await userEvent.click(signInButton);

  const errorMessage = await screen.findByText("Formato de email inválido.");

  expect(errorMessage).toBeInTheDocument();
});

/* - Testando o link para a página de cadastro - */

test("should redirect the user to sign up page upon click", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/sign-up"
          element={<Authentication />}
        />
      </Routes>
    </MemoryRouter>,
  );
  const signUpLink = screen.getByText("Cadastre-se");
  await userEvent.click(signUpLink);
  expect(screen.getByText("Cadastre-se")).toBeInTheDocument();
});

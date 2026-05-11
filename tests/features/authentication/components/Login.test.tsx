import { render, screen } from "@testing-library/react";
import { Login } from "@/features/authentication";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { supabaseTemp } from "@/../supabase/supabase";

/* - Função para renderizar o componente com Router - */

const renderComponent = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

/* - Criando mock para simular a chamada do supabase nos testes - */

vi.mock("@/../supabase/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(() =>
        Promise.resolve({
          data: { user: { id: "123" }, session: {} },
          error: null,
        }),
      ),
    },
  },
  supabaseTemp: {
    auth: {
      signInWithPassword: vi.fn(() =>
        Promise.resolve({
          data: { user: { id: "123" }, session: {} },
          error: null,
        }),
      ),
      getSession: vi.fn(() =>
        Promise.resolve({
          data: { session: { access_token: "token123" } },
          error: null,
        }),
      ),
    },
  },
}));

/* - Mockando masks para deixar os valores passarem sem transformação - */

vi.mock("@/shared", () => ({
  masks: {
    email: (value: string) => value,
  },
  regex: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
}));

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Verificando se a função do supabase foi chamada corretamente - */

test("should call supabaseTemp signInWithPassword with correct data", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("seu@email.com");
  const passwordInput = screen.getByPlaceholderText("••••••");
  const signInButton = screen.getByRole("button", { name: /Entrar/i });

  await userEvent.type(emailInput, "user@gmail.com");
  await userEvent.type(passwordInput, "userpassword");
  await userEvent.click(signInButton);

  expect(supabaseTemp.auth.signInWithPassword).toHaveBeenCalledWith({
    email: "user@gmail.com",
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

  const emailInput = screen.getByPlaceholderText("seu@email.com");

  await userEvent.type(emailInput, "user@gmail.com");
  expect(emailInput).toHaveValue("user@gmail.com");
});

test("should render the 'Password' input and allow the user to type on it", async () => {
  renderComponent();

  const passwordInput = screen.getByPlaceholderText("••••••");
  const hidePasswordButton = screen.getByLabelText(
    "Toggle Password Visibility Login",
  );

  await userEvent.type(passwordInput, "userpassword");
  expect(passwordInput).toHaveValue("userpassword");

  await userEvent.click(hidePasswordButton);
});

/* - Testando o checkbox de lembre-me - */

test("should render the remember me checkbox unchecked by default", () => {
  renderComponent();

  const rememberMeCheckbox = screen.getByRole("checkbox");
  expect(rememberMeCheckbox).not.toBeChecked();
});

test("should allow the user to check the remember me checkbox", async () => {
  renderComponent();

  const rememberMeCheckbox = screen.getByRole("checkbox");

  await userEvent.click(rememberMeCheckbox);
  expect(rememberMeCheckbox).toBeChecked();
});

/* - Testando o botão de login - */

test("should render a button to allow the user to sign in", () => {
  renderComponent();

  const signInButton = screen.getByRole("button", { name: /Entrar/i });

  expect(signInButton).toBeInTheDocument();
  expect(signInButton).not.toBeDisabled();
});

test("should allow user to sign in when all fields are filled", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("seu@email.com");
  const passwordInput = screen.getByPlaceholderText("••••••");

  await userEvent.type(emailInput, "user@gmail.com");
  await userEvent.type(passwordInput, "userpassword");

  expect(emailInput).toHaveValue("user@gmail.com");
  expect(passwordInput).toHaveValue("userpassword");

  await userEvent.click(screen.getByRole("button", { name: /Entrar/i }));
});

/* - Testando se há campos vazios - */

test("should show error if one or more fields are empty", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: /Entrar/i }));

  expect(
    await screen.findByText("Preencha todos os campos."),
  ).toBeInTheDocument();
});

/* - Testando credenciais inválidas - */

test("should show error if password is not bound to email", async () => {
  vi.mocked(supabaseTemp.auth.signInWithPassword).mockResolvedValueOnce({
    data: { user: null, session: null },
    error: { message: "Invalid login credentials" } as any,
  });

  renderComponent();

  await userEvent.type(
    screen.getByPlaceholderText("seu@email.com"),
    "user@gmail.com",
  );
  await userEvent.type(screen.getByPlaceholderText("••••••"), "wrongpassword");
  await userEvent.click(screen.getByRole("button", { name: /Entrar/i }));

  expect(
    await screen.findByText("Email ou senha inválidos."),
  ).toBeInTheDocument();
});

/* - Testando email inválido - */

test("should show error if email format is invalid", async () => {
  renderComponent();

  await userEvent.type(
    screen.getByPlaceholderText("seu@email.com"),
    "emailinvalido",
  );
  await userEvent.type(screen.getByPlaceholderText("••••••"), "123456");
  await userEvent.click(screen.getByRole("button", { name: /Entrar/i }));

  expect(
    await screen.findByText("Formato de email inválido."),
  ).toBeInTheDocument();
});

/* - Testando o link para recuperação de senha - */

test("should render a link with the text 'Esqueci minha senha'", () => {
  renderComponent();

  expect(screen.getByText("Esqueci minha senha")).toBeInTheDocument();
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
          path="/recuperar-senha"
          element={
            <div>
              <h1>Recupere sua senha</h1>
            </div>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  await userEvent.click(screen.getByText("Esqueci minha senha"));

  expect(
    screen.getByRole("heading", { name: "Recupere sua senha" }),
  ).toBeInTheDocument();
});

/* - Testando o link para página de cadastro - */

test("should redirect the user to sign up page upon click", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/cadastro"
          element={
            <div>
              <h1>Cadastre-se</h1>
            </div>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  await userEvent.click(screen.getByText("Cadastre-se"));

  expect(
    screen.getByRole("heading", { name: "Cadastre-se" }),
  ).toBeInTheDocument();
});

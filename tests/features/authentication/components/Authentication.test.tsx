import { render, screen } from "@testing-library/react";
import { Authentication, Login } from "@/features/authentication";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { supabase } from "@/../supabase/supabase";

/* - Função para renderizar o componente com Router - */

const renderComponent = () =>
  render(
    <MemoryRouter>
      <Authentication />
    </MemoryRouter>,
  );

/* - Criando o mock para simular a chamada do supabase nos testes - */

const insertMock = vi.fn(() => Promise.resolve({}));

vi.mock("@/../supabase/supabase", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(() =>
        Promise.resolve({
          data: {
            user: {
              id: "123",
              email: "user@gmail.com",
            },
            session: null,
          },
          error: null,
        }),
      ),
      signInWithPassword: vi.fn(() =>
        Promise.resolve({
          data: { user: { id: "123" }, session: {} },
          error: null,
        }),
      ),
    },
    from: vi.fn(() => ({
      insert: insertMock,
    })),
  },
  supabaseTemp: {
    auth: {
      signInWithPassword: vi.fn(() =>
        Promise.resolve({
          data: { user: { id: "123" }, session: {} },
          error: null,
        }),
      ),
    },
  },
}));

/* - Mockando masks para deixar os valores passarem sem transformação - */

vi.mock("@/shared", () => ({
  masks: {
    name: (value: string) => value,
    email: (value: string) => value,
  },
  regex: {
    name: /^[a-zA-ZÀ-ÿ\s]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
}));

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Verificando se o insert do Supabase foi chamado corretamente - */

test("should call supabase.from('users').insert with correct data on successful signup", async () => {
  renderComponent();

  const nameInput = screen.getByPlaceholderText(/Nome Completo/i);
  const emailInput = screen.getByPlaceholderText("seu@email.com");
  const [passwordInput, confirmPasswordInput] =
    screen.getAllByPlaceholderText("••••••");
  const termsCheckbox = screen.getByRole("checkbox");
  const signUpButton = screen.getByText(/Cadastrar/i);

  await userEvent.type(nameInput, "John Doe");
  await userEvent.type(emailInput, "user@gmail.com");
  await userEvent.type(passwordInput, "userpassword");
  await userEvent.type(confirmPasswordInput, "userpassword");
  await userEvent.click(termsCheckbox);

  await userEvent.click(signUpButton);

  expect(supabase.from).toHaveBeenCalledWith("users");

  expect(insertMock).toHaveBeenCalledWith([
    {
      user_id: "123",
      email: "user@gmail.com",
      name: "John Doe",
      has_seen_welcome: false,
    },
  ]);
});

/* - Testando a logo - */

test("should render Finanzy's Logo", () => {
  renderComponent();

  expect(screen.getByAltText("Logo")).toBeInTheDocument();
});

/* - Testando o título - */

test("should render a title with the text 'Cadastre-se'", () => {
  renderComponent();

  expect(screen.getByText("Cadastre-se")).toBeInTheDocument();
});

/* - Testando os inputs - */

test("should render the 'Name' input and allow the user to type on it", async () => {
  renderComponent();

  const nameInput = screen.getByPlaceholderText(/Nome Completo/i);

  await userEvent.type(nameInput, "John Doe");
  expect(nameInput).toHaveValue("John Doe");
});

test("should render the 'Email' input and allow the user to type on it", async () => {
  renderComponent();

  const emailInput = screen.getByPlaceholderText("seu@email.com");

  await userEvent.type(emailInput, "user@gmail.com");
  expect(emailInput).toHaveValue("user@gmail.com");
});

test("should render the 'Password' input and allow the user to type on it", async () => {
  renderComponent();

  const [passwordInput] = screen.getAllByPlaceholderText("••••••");
  const hidePasswordButton = screen.getByLabelText(
    "Toggle Password Visibility",
  );

  await userEvent.type(passwordInput, "userpassword");
  expect(passwordInput).toHaveValue("userpassword");

  await userEvent.click(hidePasswordButton);
});

test("should render the 'Confirm Password' input and allow the user to type on it", async () => {
  renderComponent();

  const [, confirmPasswordInput] = screen.getAllByPlaceholderText("••••••");
  const hideConfirmPasswordButton = screen.getByLabelText(
    "Toggle Confirm Password Visibility",
  );

  await userEvent.type(confirmPasswordInput, "userpassword");
  expect(confirmPasswordInput).toHaveValue("userpassword");

  await userEvent.click(hideConfirmPasswordButton);
});

/* - Testando o checkbox de termos de uso - */

test("should render the terms of use checkbox unchecked by default", () => {
  renderComponent();

  const termsCheckbox = screen.getByRole("checkbox");
  expect(termsCheckbox).not.toBeChecked();
});

test("should allow the user to check the terms of use checkbox", async () => {
  renderComponent();

  const termsCheckbox = screen.getByRole("checkbox");

  await userEvent.click(termsCheckbox);
  expect(termsCheckbox).toBeChecked();
});

/* - Testando o botão de cadastro - */

test("should render the sign up button disabled when terms are not accepted", () => {
  renderComponent();

  const signUpButton = screen.getByText(/Cadastrar/i);
  expect(signUpButton).toBeDisabled();
});

test("should enable the sign up button when terms are accepted", async () => {
  renderComponent();

  const termsCheckbox = screen.getByRole("checkbox");
  const signUpButton = screen.getByText(/Cadastrar/i);

  await userEvent.click(termsCheckbox);
  expect(signUpButton).not.toBeDisabled();
});

test("should allow the user to sign up when all fields are filled", async () => {
  renderComponent();

  const nameInput = screen.getByPlaceholderText(/Nome Completo/i);
  const emailInput = screen.getByPlaceholderText("seu@email.com");
  const [passwordInput, confirmPasswordInput] =
    screen.getAllByPlaceholderText("••••••");
  const termsCheckbox = screen.getByRole("checkbox");

  await userEvent.type(nameInput, "John Doe");
  await userEvent.type(emailInput, "user@gmail.com");
  await userEvent.type(passwordInput, "userpassword");
  await userEvent.type(confirmPasswordInput, "userpassword");
  await userEvent.click(termsCheckbox);

  const signUpButton = screen.getByText(/Cadastrar/i);
  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  await userEvent.click(signUpButton);

  expect(alertMock).toHaveBeenCalledWith(
    "Enviamos um email de confirmação. Verifique sua caixa de entrada.",
  );

  alertMock.mockRestore();
});

/* - Testando se há campos vazios - */

test("should show error if one or more fields are empty", async () => {
  renderComponent();

  const termsCheckbox = screen.getByRole("checkbox");
  const signUpButton = screen.getByText(/Cadastrar/i);

  await userEvent.click(termsCheckbox);
  await userEvent.click(signUpButton);

  expect(
    await screen.findByText("Preencha todos os campos."),
  ).toBeInTheDocument();
});

/* - Testando se as senhas coincidem - */

test("should show error if passwords do not match", async () => {
  renderComponent();

  const nameInput = screen.getByPlaceholderText(/Nome Completo/i);
  const emailInput = screen.getByPlaceholderText("seu@email.com");
  const [passwordInput, confirmPasswordInput] =
    screen.getAllByPlaceholderText("••••••");
  const termsCheckbox = screen.getByRole("checkbox");
  const signUpButton = screen.getByText(/Cadastrar/i);

  await userEvent.type(nameInput, "John Doe");
  await userEvent.type(emailInput, "user@gmail.com");
  await userEvent.type(passwordInput, "123456");
  await userEvent.type(confirmPasswordInput, "654321");
  await userEvent.click(termsCheckbox);

  await userEvent.click(signUpButton);

  expect(
    await screen.findByText("As senhas não coincidem."),
  ).toBeInTheDocument();
});

/* - Testando senha curta (< 6 caracteres) - */

test("should show error when password is too short", async () => {
  renderComponent();

  const nameInput = screen.getByPlaceholderText(/Nome Completo/i);
  const emailInput = screen.getByPlaceholderText("seu@email.com");
  const [passwordInput, confirmPasswordInput] =
    screen.getAllByPlaceholderText("••••••");
  const termsCheckbox = screen.getByRole("checkbox");
  const signUpButton = screen.getByText(/Cadastrar/i);

  await userEvent.type(nameInput, "John Doe");
  await userEvent.type(emailInput, "user@gmail.com");
  await userEvent.type(passwordInput, "123");
  await userEvent.type(confirmPasswordInput, "123");
  await userEvent.click(termsCheckbox);

  await userEvent.click(signUpButton);

  expect(
    await screen.findByText("A senha deve conter, pelo menos, 6 caracteres."),
  ).toBeInTheDocument();
});

/* - Testando nome inválido - */

test("should show error when name is invalid", async () => {
  renderComponent();

  const nameInput = screen.getByPlaceholderText(/Nome Completo/i);
  const emailInput = screen.getByPlaceholderText("seu@email.com");
  const [passwordInput, confirmPasswordInput] =
    screen.getAllByPlaceholderText("••••••");
  const termsCheckbox = screen.getByRole("checkbox");
  const signUpButton = screen.getByText(/Cadastrar/i);

  await userEvent.type(nameInput, "123");
  await userEvent.type(emailInput, "user@gmail.com");
  await userEvent.type(passwordInput, "123456");
  await userEvent.type(confirmPasswordInput, "123456");
  await userEvent.click(termsCheckbox);

  await userEvent.click(signUpButton);

  expect(await screen.findByText("Nome inválido.")).toBeInTheDocument();
});

/* - Testando email inválido - */

test("should show error when email format is invalid", async () => {
  renderComponent();

  const nameInput = screen.getByPlaceholderText(/Nome Completo/i);
  const emailInput = screen.getByPlaceholderText("seu@email.com");
  const [passwordInput, confirmPasswordInput] =
    screen.getAllByPlaceholderText("••••••");
  const termsCheckbox = screen.getByRole("checkbox");
  const signUpButton = screen.getByText(/Cadastrar/i);

  await userEvent.type(nameInput, "John Doe");
  await userEvent.type(emailInput, "emailinvalido");
  await userEvent.type(passwordInput, "123456");
  await userEvent.type(confirmPasswordInput, "123456");
  await userEvent.click(termsCheckbox);

  await userEvent.click(signUpButton);

  expect(
    await screen.findByText("Formato de email inválido."),
  ).toBeInTheDocument();
});

/* - Testando o link para página de login - */

test("should render a link with text 'Faça Login!'", () => {
  renderComponent();

  const loginLink = screen.getByText("Faça Login!");
  expect(loginLink).toBeInTheDocument();
});

test("should redirect the user to login page upon click", async () => {
  render(
    <MemoryRouter initialEntries={["/sign-up"]}>
      <Routes>
        <Route
          path="/sign-up"
          element={<Authentication />}
        />
        <Route
          path="/"
          element={<Login />}
        />
      </Routes>
    </MemoryRouter>,
  );

  const loginLink = screen.getByText("Faça Login!");

  await userEvent.click(loginLink);

  expect(
    screen.getByLabelText("Toggle Password Visibility Login"),
  ).toBeInTheDocument();
});

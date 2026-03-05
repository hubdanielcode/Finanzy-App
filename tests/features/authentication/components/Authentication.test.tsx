import { render, screen } from "@testing-library/react";
import { Authentication, Login } from "@/features/authentication";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { supabase } from "@/supabase/supabase";

/* - Função para renderizar o componente com Router - */

const renderComponent = () =>
  render(
    <MemoryRouter>
      <Authentication />
    </MemoryRouter>,
  );

/* - Criando o mock para simular a chamada do supabase nos testes - */

const insertMock = vi.fn(() => Promise.resolve({}));

vi.mock("@/supabase/supabase", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(() =>
        Promise.resolve({
          data: {
            user: {
              id: "123",
              email: "user.email@gmail.com",
            },
          },
          error: null,
        }),
      ),
    },
    from: vi.fn(() => ({
      insert: insertMock,
    })),
  },
}));

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Verificando se o insert do Supabase foi chamado corretamente - */

test("should call supabase.from('users').insert with correct data on successful signup", async () => {
  renderComponent();

  const firstNameInput = screen.getByPlaceholderText(/Primeiro Nome/i);
  const lastNameInput = screen.getByPlaceholderText(/Último Nome/i);
  const emailInput = screen.getByPlaceholderText("exemplo@email.com");
  const passwordInput = screen.getByPlaceholderText("Senha");
  const confirmPasswordInput =
    screen.getByPlaceholderText("Confirme sua senha");
  const signUpButton = screen.getByText(/Cadastrar/i);

  await userEvent.type(firstNameInput, "John");
  await userEvent.type(lastNameInput, "Doe");
  await userEvent.type(emailInput, "useremail@gmail.com");
  await userEvent.type(passwordInput, "userpassword");
  await userEvent.type(confirmPasswordInput, "userpassword");

  await userEvent.click(signUpButton);

  expect(supabase.from).toHaveBeenCalledWith("users");

  expect(insertMock).toHaveBeenCalledWith([
    {
      user_id: "123",
      email: "user.email@gmail.com",
      first_name: "John",
      last_name: "Doe",
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

test("should render the 'First Name' input and allow the user to type on it", async () => {
  renderComponent();

  const firstNameInput = screen.getByPlaceholderText(/Primeiro Nome/i);

  await userEvent.type(firstNameInput, "John");
  expect(firstNameInput).toHaveValue("John");
});

test("should render the 'Last Name' input and allow the user to type on it", async () => {
  renderComponent();

  const lastNameInput = screen.getByPlaceholderText(/Último Nome/i);

  await userEvent.type(lastNameInput, "Doe");
  expect(lastNameInput).toHaveValue("Doe");
});

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
    "Toggle Password Visibility",
  );

  await userEvent.type(passwordInput, "userpassword");
  expect(passwordInput).toHaveValue("userpassword");

  await userEvent.click(hidePasswordButton);
});

test("should render the 'Confirm Password' input and allow the user to type on it", async () => {
  renderComponent();

  const confirmPasswordInput =
    screen.getByPlaceholderText("Confirme sua senha");
  const hideConfirmPasswordButton = screen.getByLabelText(
    "Toggle Confirm Password Visibility",
  );

  await userEvent.type(confirmPasswordInput, "userpassword");
  expect(confirmPasswordInput).toHaveValue("userpassword");

  await userEvent.click(hideConfirmPasswordButton);
});

/* - Testando o botão de cadastro - */

test("should render a button to allow the user to sign up", async () => {
  renderComponent();

  const signUpButton = screen.getByText(/Cadastrar/i);

  expect(signUpButton).not.toBeDisabled();
  await userEvent.click(signUpButton);
});

test("should allow the user to sign up when all fields are filled", async () => {
  renderComponent();

  const firstNameInput = screen.getByPlaceholderText(/Primeiro Nome/i);
  const lastNameInput = screen.getByPlaceholderText(/Último Nome/i);
  const emailInput = screen.getByPlaceholderText("exemplo@email.com");
  const passwordInput = screen.getByPlaceholderText("Senha");
  const confirmPasswordInput =
    screen.getByPlaceholderText("Confirme sua senha");

  await userEvent.type(firstNameInput, "John");
  await userEvent.type(lastNameInput, "Doe");
  await userEvent.type(emailInput, "useremail@gmail.com");
  await userEvent.type(passwordInput, "userpassword");
  await userEvent.type(confirmPasswordInput, "userpassword");

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

  const signUpButton = screen.getByText(/Cadastrar/i);

  await userEvent.click(signUpButton);

  const errorMessage = await screen.findByText(/nome inválido/i);
  expect(errorMessage).toBeInTheDocument();
});

/* - Testando se as senhas coincidem - */

test("should show error if passwords do not match", async () => {
  renderComponent();

  const firstNameInput = screen.getByPlaceholderText(/Primeiro Nome/i);
  const lastNameInput = screen.getByPlaceholderText(/Último Nome/i);
  const emailInput = screen.getByPlaceholderText("exemplo@email.com");
  const passwordInput = screen.getByPlaceholderText("Senha");
  const confirmPasswordInput =
    screen.getByPlaceholderText("Confirme sua senha");
  const signUpButton = screen.getByText(/Cadastrar/i);

  await userEvent.type(firstNameInput, "John");
  await userEvent.type(lastNameInput, "Doe");
  await userEvent.type(emailInput, "user@gmail.com");
  await userEvent.type(passwordInput, "123456");
  await userEvent.type(confirmPasswordInput, "654321");

  await userEvent.click(signUpButton);

  expect(screen.getByText("As senhas não coincidem.")).toBeInTheDocument();
});

/* - Testando senha curta (< 6 caracteres) - */

test("should show error when password is too short", async () => {
  renderComponent();

  const firstNameInput = screen.getByPlaceholderText(/Primeiro Nome/i);
  const lastNameInput = screen.getByPlaceholderText(/Último Nome/i);
  const emailInput = screen.getByPlaceholderText("exemplo@email.com");
  const passwordInput = screen.getByPlaceholderText("Senha");
  const confirmPasswordInput =
    screen.getByPlaceholderText("Confirme sua senha");
  const signUpButton = screen.getByText(/Cadastrar/i);

  await userEvent.type(firstNameInput, "John");
  await userEvent.type(lastNameInput, "Doe");
  await userEvent.type(emailInput, "user@gmail.com");
  await userEvent.type(passwordInput, "123");
  await userEvent.type(confirmPasswordInput, "123");

  await userEvent.click(signUpButton);

  expect(
    screen.getByText("A senha deve conter, pelo menos, 6 caracteres."),
  ).toBeInTheDocument();
});

/* - Testando nome inválido - */

test("should show error when first name is invalid", async () => {
  renderComponent();

  const firstNameInput = screen.getByPlaceholderText(/Primeiro Nome/i);
  const lastNameInput = screen.getByPlaceholderText(/Último Nome/i);
  const emailInput = screen.getByPlaceholderText("exemplo@email.com");
  const passwordInput = screen.getByPlaceholderText("Senha");
  const confirmPasswordInput =
    screen.getByPlaceholderText("Confirme sua senha");
  const signUpButton = screen.getByText(/Cadastrar/i);

  await userEvent.type(firstNameInput, "!!!");
  await userEvent.type(lastNameInput, "Doe");
  await userEvent.type(emailInput, "user@gmail.com");
  await userEvent.type(passwordInput, "123456");
  await userEvent.type(confirmPasswordInput, "123456");

  await userEvent.click(signUpButton);

  expect(screen.getByText("Nome inválido.")).toBeInTheDocument();
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

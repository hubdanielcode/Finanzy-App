import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, test, expect, vi } from "vitest";
import { Header } from "@/shared/components/Header";

/* - Authentication Context mock - */

vi.mock("@/features/authentication/hooks/useAuthenticationContext", () => {
  return {
    useAuthenticationContext: () => ({
      name: "João Silva Oliveira",
    }),
  };
});

/* - Mobile Context mock - */

vi.mock("@/features/transactions/hooks/useMobileContext", () => {
  return {
    useMobileContext: () => ({
      isMobile: false,
      isLandscape: false,
    }),
  };
});

/* - Theme Context mock - */

vi.mock("@/shared/hooks/useThemeContext", () => {
  return {
    useThemeContext: () => ({
      theme: "Light",
      toggleTheme: vi.fn(),
    }),
  };
});

/* - Criando mock para o TransactionCards - */

vi.mock("@/features/transactions", () => {
  return {
    TransactionCards: ({ isPrivate }: any) => (
      <div data-testid="transaction-cards">
        {isPrivate ? "private" : "public"}
      </div>
    ),
  };
});

/* - Criando mock para o PluggyConnect - */

vi.mock("@/features/transactions/components/PluggyConnect", () => {
  return {
    PluggyConnect: () => <div data-testid="pluggy-connect" />,
  };
});

/* - Criando mock para o syncTransactionsFromBank - */

vi.mock("@/features/transactions/services/PluggyService", () => {
  return {
    syncTransactionsFromBank: vi.fn(),
  };
});

/* - Criando mock para o supabase - */

vi.mock("../../../supabase/supabase", () => {
  return {
    supabase: {
      auth: {
        signOut: vi.fn(() => Promise.resolve()),
      },
    },
  };
});

/* - Criando mock para o useNavigate - */

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

/* - Limpando os mocks entre os testes para evitar erro - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Criando a função para renderizar o componente - */

const renderComponent = () =>
  render(
    <MemoryRouter>
      <Header />
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

test("should render a paragraph with text 'Gerencie suas finanças pessoais'", () => {
  renderComponent();

  expect(
    screen.getByText(/gerencie suas finanças pessoais/i),
  ).toBeInTheDocument();
});

/* - Testando saudação do usuário - */

test("should render greeting with user name", () => {
  renderComponent();

  expect(
    screen.getByText(
      (content) => content.includes("Olá") && content.includes("João Oliveira"),
    ),
  ).toBeInTheDocument();
});

/* - Testando botão de ocultar - */

test("should toggle private state button", async () => {
  renderComponent();

  await userEvent.click(screen.getByRole("button", { name: "Ocultar" }));

  expect(screen.getByRole("button", { name: "Mostrar" })).toBeInTheDocument();
});

/* - Testando abertura do menu - */

test("should open menu and show options", async () => {
  renderComponent();

  const user = userEvent.setup();

  const menuButton = document.querySelector(".lucide-menu") as HTMLElement;

  await user.click(menuButton);

  expect(await screen.findByText("Conectar Banco")).toBeInTheDocument();
  expect(screen.getByText("Gráficos")).toBeInTheDocument();
  expect(screen.getByText("Sair")).toBeInTheDocument();
});

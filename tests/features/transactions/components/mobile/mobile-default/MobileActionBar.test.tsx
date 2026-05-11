import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

/* - Mocks compartilhados (evita erro de hoisting do Vitest) - */

const mocks = vi.hoisted(() => ({
  toggleTheme: vi.fn(),
  signOut: vi.fn(() => Promise.resolve({ error: null })),
  navigate: vi.fn(),
  OpenForm: vi.fn(),
  OpenTransactionList: vi.fn(),
  OpenChart: vi.fn(),
  syncTransactionsFromBank: vi.fn(),
}));

/* - React Router mock - */

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

/* - Supabase mock - */

vi.mock("@/../supabase/supabase", () => ({
  supabase: {
    auth: {
      signOut: mocks.signOut,
    },
  },
}));

/* - Authentication context mock - */

vi.mock("@/features/authentication/hooks/useAuthenticationContext", () => ({
  useAuthenticationContext: () => ({
    name: "John Doe",
  }),
}));

/* - Theme context mock - */

vi.mock("@/shared/hooks/useThemeContext", () => ({
  useThemeContext: () => ({
    theme: "Dark",
    toggleTheme: mocks.toggleTheme,
  }),
}));

/* - Pluggy mock - */

vi.mock("@/features/transactions/components/PluggyConnect", () => ({
  PluggyConnect: () => <div>Pluggy Widget</div>,
}));

/* - Service mock - */

vi.mock("@/features/transactions/services/PluggyService", () => ({
  syncTransactionsFromBank: mocks.syncTransactionsFromBank,
}));

/* - Import do componente DEPOIS dos mocks - */

import { MobileActionBar } from "@/features/transactions/components/mobile/mobile-default/MobileActionBar";

/* - Render helper - */

const renderComponent = () => {
  render(
    <MemoryRouter>
      <MobileActionBar
        OpenForm={mocks.OpenForm}
        OpenTransactionList={mocks.OpenTransactionList}
        OpenChart={mocks.OpenChart}
      />
    </MemoryRouter>,
  );
};

/* - Reset mocks - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Teste: renderização - */

test("should render MobileActionBar without crashing", () => {
  renderComponent();

  expect(screen.getByText("Nova Transação")).toBeInTheDocument();

  expect(screen.getByText("Exibir Transações")).toBeInTheDocument();
});

/* - Teste: abrir menu - */

test("should open menu when clicking menu button", async () => {
  renderComponent();

  const menuButton = screen.getAllByRole("button")[0];

  await userEvent.click(menuButton);

  expect(screen.getByText("Mostrar Gráficos")).toBeInTheDocument();

  expect(screen.getByText("Conectar Banco")).toBeInTheDocument();

  expect(screen.getByText("Tema Claro")).toBeInTheDocument();

  expect(screen.getByText("Sair")).toBeInTheDocument();
});

/* - Teste: nova transação - */

test("should call OpenForm when clicking Nova Transação", async () => {
  renderComponent();

  await userEvent.click(screen.getByText("Nova Transação"));

  expect(mocks.OpenForm).toHaveBeenCalled();
});

/* - Teste: lista de transações - */

test("should call OpenTransactionList when clicking Exibir Transações", async () => {
  renderComponent();

  await userEvent.click(screen.getByText("Exibir Transações"));

  expect(mocks.OpenTransactionList).toHaveBeenCalled();
});

/* - Teste: gráficos - */

test("should call OpenChart when clicking Mostrar Gráficos", async () => {
  renderComponent();

  const menuButton = screen.getAllByRole("button")[0];

  await userEvent.click(menuButton);

  await userEvent.click(screen.getByText("Mostrar Gráficos"));

  expect(mocks.OpenChart).toHaveBeenCalled();
});

/* - Teste: tema - */

test("should toggle theme", async () => {
  renderComponent();

  const menuButton = screen.getAllByRole("button")[0];

  await userEvent.click(menuButton);

  await userEvent.click(screen.getByText("Tema Claro"));

  expect(mocks.toggleTheme).toHaveBeenCalled();
});

/* - Teste: logout - */

test("should logout and navigate home", async () => {
  renderComponent();

  const menuButton = screen.getAllByRole("button")[0];

  await userEvent.click(menuButton);

  await userEvent.click(screen.getByText("Sair"));

  expect(mocks.signOut).toHaveBeenCalled();

  expect(mocks.navigate).toHaveBeenCalledWith("/");
});

/* - Teste: pluggy widget - */

test("should open Pluggy widget", async () => {
  renderComponent();

  const menuButton = screen.getAllByRole("button")[0];

  await userEvent.click(menuButton);

  await userEvent.click(screen.getByText("Conectar Banco"));

  expect(screen.getByText("Pluggy Widget")).toBeInTheDocument();
});

import { render, screen } from "@testing-library/react";
import { ProtectedRoute, Login } from "@/features/authentication";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { vi } from "vitest";

/* - Criando o mock do supabase necessário para renderizar o login - */

vi.mock("@/supabase/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn().mockReturnValue({
        subscription: { unsubscribe: vi.fn() },
      }),
    },
  },
}));

/* - Criando uma sessão fake para simular usuário autenticado - */

const simulatedSession: Session = {
  access_token: "fake-access-token",
  expires_in: 3600,
  refresh_token: "fake-refresh-token",
  token_type: "bearer",
  user: {
    id: "123",
    aud: "authenticated",
    role: "authenticated",
    email: "email@example.com",
    email_confirmed_at: undefined,
    phone: undefined,
    phone_confirmed_at: undefined,
    confirmation_sent_at: undefined,
    confirmed_at: undefined,
    last_sign_in_at: undefined,
    app_metadata: {},
    user_metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando o redirecionamento para a página de login quando não há sessão - */

test("should redirect user to login page when session is null", () => {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<ProtectedRoute session={null} />}>
          <Route
            path="/dashboard"
            element={<p>Conteúdo protegido</p>}
          />
        </Route>
        <Route
          path="/"
          element={<Login />}
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(
    screen.getByLabelText("Toggle Password Visibility Login"),
  ).toBeInTheDocument();
  expect(screen.queryByText("Conteúdo protegido")).not.toBeInTheDocument();
});

/* - Testando a renderização do 'Outlet' quando há sessão - */

test("should render children (Outlet) when session exists", () => {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<ProtectedRoute session={simulatedSession} />}>
          <Route
            path="/dashboard"
            element={<p>Conteúdo protegido</p>}
          />
        </Route>
        <Route
          path="/"
          element={<Login />}
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Conteúdo protegido")).toBeInTheDocument();
  expect(
    screen.queryByLabelText("Toggle Password Visibility Login"),
  ).not.toBeInTheDocument();
});

import { render, screen, waitFor } from "@testing-library/react";
import { AuthenticationProvider } from "@/features/authentication/context/AuthenticationContext";
import { useAuthenticationContext } from "@/features/authentication";
import { vi } from "vitest";

/* - Função para renderizar o provider com um consumer de teste - */

const TestConsumer = () => {
  const { name } = useAuthenticationContext();
  return <span data-testid="name">{name}</span>;
};

const renderProvider = () =>
  render(
    <AuthenticationProvider>
      <TestConsumer />
    </AuthenticationProvider>,
  );

/* - Criando mock para simular as chamadas do supabase nos testes - */

const selectMock = vi.fn(() => ({
  eq: vi.fn(() => ({
    single: vi.fn(() =>
      Promise.resolve({
        data: { name: "John Doe" },
        error: null,
      }),
    ),
  })),
}));

vi.mock("@/../supabase/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() =>
        Promise.resolve({
          data: {
            session: {
              user: { id: "123" },
            },
          },
          error: null,
        }),
      ),
    },
    from: vi.fn(() => ({
      select: selectMock,
    })),
  },
  supabaseTemp: {
    auth: {
      getSession: vi.fn(() =>
        Promise.resolve({
          data: { session: null },
          error: null,
        }),
      ),
    },
    from: vi.fn(() => ({
      select: selectMock,
    })),
  },
}));

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando o loading - */

test("should render loading state before session is resolved", () => {
  renderProvider();

  expect(screen.getByText("Carregando...")).toBeInTheDocument();
});

/* - Testando a busca do nome via sessão persistida - */

test("should fetch and display user name from persisted session", async () => {
  renderProvider();

  await waitFor(() => {
    expect(screen.getByTestId("name")).toHaveTextContent("John Doe");
  });
});

/* - Testando fallback para sessão temporária - */

test("should fetch and display user name from temp session when persisted session is null", async () => {
  const { supabase, supabaseTemp } = await import("@/../supabase/supabase");

  vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
    data: { session: null },
    error: null,
  } as any);

  vi.mocked(supabaseTemp.auth.getSession).mockResolvedValueOnce({
    data: { session: { user: { id: "123" } } },
    error: null,
  } as any);

  renderProvider();

  await waitFor(() => {
    expect(screen.getByTestId("name")).toHaveTextContent("John Doe");
  });
});

/* - Testando quando não há sessão ativa - */

test("should not set name when there is no active session", async () => {
  const { supabase, supabaseTemp } = await import("@/../supabase/supabase");

  vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
    data: { session: null },
    error: null,
  } as any);

  vi.mocked(supabaseTemp.auth.getSession).mockResolvedValueOnce({
    data: { session: null },
    error: null,
  } as any);

  renderProvider();

  await waitFor(() => {
    expect(screen.getByTestId("name")).toHaveTextContent("");
  });
});

/* - Testando o contexto com hook - */

test("should provide name through context hook", async () => {
  renderProvider();

  await waitFor(() => {
    expect(screen.getByTestId("name")).toHaveTextContent("John Doe");
  });
});

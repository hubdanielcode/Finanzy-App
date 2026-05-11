import { renderHook, waitFor } from "@testing-library/react";
import { AuthenticationProvider } from "@/features/authentication/context/AuthenticationContext";
import { useAuthenticationContext } from "@/features/authentication/hooks/useAuthenticationContext";
import { vi } from "vitest";

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

/* - Testando a busca do nome via sessão persistida - */

test("should fetch and display user name from persisted session", async () => {
  const { result } = renderHook(() => useAuthenticationContext(), {
    wrapper: AuthenticationProvider,
  });

  await waitFor(() => {
    expect(result.current.name).toBe("John Doe");
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

  const { result } = renderHook(() => useAuthenticationContext(), {
    wrapper: AuthenticationProvider,
  });

  await waitFor(() => {
    expect(result.current.name).toBe("John Doe");
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

  const { result } = renderHook(() => useAuthenticationContext(), {
    wrapper: AuthenticationProvider,
  });

  await waitFor(() => {
    expect(result.current.name).toBe("");
  });
});

/* - Testando o hook fora do provider - */

test("should throw error when hook is used outside of provider", () => {
  expect(() => renderHook(() => useAuthenticationContext())).toThrow(
    "useAuthenticationContext must be used within a AuthenticationProvider",
  );
});

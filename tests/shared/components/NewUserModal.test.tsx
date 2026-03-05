import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewUserModal } from "@/shared";
import * as supabaseModule from "@/supabase/supabase";
import type { Session } from "@supabase/supabase-js";
import { vi } from "vitest";

/* - Criando umaa sessão falsa apenas para simulação - */

const fakeSession: Session = {
  user: {
    id: "user-123",
    email: "test@example.com",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "",
  },
  access_token: "token",
  refresh_token: "refresh",
  expires_in: 3600,
  token_type: "bearer",
};

/* - Criando o mock que vai ser usado nos testes - */

const mockSupabaseFrom = (data: {
  first_name: string | null;
  has_seen_welcome: boolean;
}) => {
  vi.spyOn(supabaseModule.supabase, "from").mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error: null }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    }),
  } as unknown as ReturnType<typeof supabaseModule.supabase.from>);
};

/* - Criando a função para renderizar o componente - */

const renderComponent = (session: Session | null = fakeSession) => {
  return render(<NewUserModal session={session} />);
};

/* - Limpando os mocks entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando casos onde a sessão é nula - */

test("should not render the modal when session is null", () => {
  const { container } = renderComponent(null);

  expect(container.firstChild).toBeNull();
});

/* - Testando casos onde o usuário já viu o modal - */

test("should not render the modal when has_seen_welcome is true", async () => {
  mockSupabaseFrom({ first_name: "Ana", has_seen_welcome: true });

  const { container } = renderComponent();

  await waitFor(() => {
    expect(container.firstChild).toBeNull();
  });
});

/* - Testando a abertura do modal - */

test("should render the modal when has_seen_welcome is false", async () => {
  mockSupabaseFrom({ first_name: "Ana", has_seen_welcome: false });

  renderComponent();

  await waitFor(() => {
    expect(screen.getByText("Bem-vindo(a), Ana 🎉")).toBeInTheDocument();
  });
});

/* - Testando a saudação sem nome - */

test("should render the welcome message without a name when first_name is null", async () => {
  mockSupabaseFrom({ first_name: null, has_seen_welcome: false });

  renderComponent();

  await waitFor(() => {
    expect(screen.getByText("Bem-vindo(a) 🎉")).toBeInTheDocument();
  });
});

/* - Testando a mensagem de boas-vindas - */

test("should render the welcome message", async () => {
  mockSupabaseFrom({ first_name: "Ana", has_seen_welcome: false });

  renderComponent();

  await waitFor(() => {
    expect(
      screen.getByText(/Estamos felizes em te receber/i),
    ).toBeInTheDocument();
  });
});

/* - Testando o botão de fechar - */

test("should render a button with the text 'Vamos lá!'", async () => {
  mockSupabaseFrom({ first_name: "Ana", has_seen_welcome: false });

  renderComponent();

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /vamos lá/i }),
    ).toBeInTheDocument();
  });
});

/* - Testando o fechamento do modal ao clicar no botão - */

test("should close the modal when the button is clicked", async () => {
  mockSupabaseFrom({ first_name: "Ana", has_seen_welcome: false });

  renderComponent();

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /vamos lá/i }),
    ).toBeInTheDocument();
  });

  await userEvent.click(screen.getByRole("button", { name: /vamos lá/i }));

  expect(screen.queryByText("Bem-vindo(a), Ana 🎉")).not.toBeInTheDocument();
});

/* - Testando a chamada ao Supabase ao fechar o modal - */

test("should call supabase update with has_seen_welcome true when the button is clicked", async () => {
  const updateMock = vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ error: null }),
  });

  vi.spyOn(supabaseModule.supabase, "from").mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: { first_name: "Ana", has_seen_welcome: false },
      error: null,
    }),
    update: updateMock,
  } as unknown as ReturnType<typeof supabaseModule.supabase.from>);

  renderComponent();

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /vamos lá/i }),
    ).toBeInTheDocument();
  });

  await userEvent.click(screen.getByRole("button", { name: /vamos lá/i }));

  await waitFor(() => {
    expect(updateMock).toHaveBeenCalledWith({ has_seen_welcome: true });
  });
});

/* - Testando o comportamento quando o Supabase retorna erro - */

test("should not open the modal when supabase returns an error", async () => {
  vi.spyOn(supabaseModule.supabase, "from").mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "DB error" } }),
  } as unknown as ReturnType<typeof supabaseModule.supabase.from>);

  const { container } = renderComponent();

  await waitFor(() => {
    expect(container.firstChild).toBeNull();
  });
});

/* - Testando as imagens do modal - */

test("should render the logo and mascot images", async () => {
  mockSupabaseFrom({ first_name: "Ana", has_seen_welcome: false });

  renderComponent();

  await waitFor(() => {
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByAltText("Mascote")).toBeInTheDocument();
  });
});

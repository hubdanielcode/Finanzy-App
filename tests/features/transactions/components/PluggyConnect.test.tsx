import { render } from "@testing-library/react";
import { vi, beforeEach } from "vitest";
import { PluggyConnect } from "@/features/transactions/components/PluggyConnect";

/* - Hoisting dos mocks para garantir disponibilidade antes do vi.mock - */

const {
  mockInvoke,
  mockGetUser,
  mockUpdate,
  mockEq,
  mockFrom,
  mockWidgetInit,
  mockPluggyConnectSDK,
} = vi.hoisted(() => {
  const mockEq = vi.fn();
  const mockUpdate = vi.fn(() => ({ eq: mockEq }));
  const mockFrom = vi.fn(() => ({ update: mockUpdate }));
  const mockWidgetInit = vi.fn();
  const mockPluggyConnectSDK = vi.fn().mockImplementation(function (
    this: any,
    config: Record<string, Function>,
  ) {
    Object.assign(this, config);
    this.init = mockWidgetInit;
  });

  return {
    mockInvoke: vi.fn(),
    mockGetUser: vi.fn(),
    mockUpdate,
    mockEq,
    mockFrom,
    mockWidgetInit,
    mockPluggyConnectSDK,
  };
});

/* - Mock do supabase - */

vi.mock("../../../../supabase/supabase", () => ({
  supabase: {
    functions: { invoke: mockInvoke },
    auth: { getUser: mockGetUser },
    from: mockFrom,
  },
}));

/* - Mock do SDK do Pluggy - */

vi.mock("pluggy-connect-sdk", () => ({
  PluggyConnect: mockPluggyConnectSDK,
}));

/* - Props base para os testes - */

const defaultProps = {
  onSuccess: vi.fn(),
  onError: vi.fn(),
  onClose: vi.fn(),
};

/* - Helpers para reduzir repetição nos testes - */

const mockSuccessInvoke = (overrides = {}) => {
  mockInvoke.mockResolvedValue({
    data: { connectToken: "token-123", apiKey: "api-key-123", ...overrides },
    error: null,
  });
};

const captureSDKCallbacks = () => {
  let capturedConfig: Record<string, Function> = {};
  mockPluggyConnectSDK.mockImplementation(function (
    this: any,
    config: Record<string, Function>,
  ) {
    capturedConfig = config;
    this.init = mockWidgetInit;
  });
  return () => capturedConfig;
};

const mockFetchAccounts = (accounts: object[]) => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ results: accounts }),
    }),
  );
};

/* - Limpando mocks entre os testes para evitar erros - */

beforeEach(() => {
  vi.clearAllMocks();
  mockPluggyConnectSDK.mockImplementation(function (this: any) {
    this.init = mockWidgetInit;
  });
});

/* - Testando chamada de onError quando invoke retorna erro - */

test("should call onError when invoke returns an error", async () => {
  mockInvoke.mockResolvedValue({ data: null, error: new Error("falhou") });

  render(<PluggyConnect {...defaultProps} />);

  await vi.waitFor(() => {
    expect(defaultProps.onError).toHaveBeenCalledWith(
      "Erro ao obter connectToken!",
    );
  });

  expect(mockWidgetInit).not.toHaveBeenCalled();
});

/* - Testando chamada de onError quando connectToken está ausente - */

test("should call onError when connectToken is missing", async () => {
  mockInvoke.mockResolvedValue({ data: { apiKey: "key" }, error: null });

  render(<PluggyConnect {...defaultProps} />);

  await vi.waitFor(() => {
    expect(defaultProps.onError).toHaveBeenCalledWith(
      "Erro ao obter connectToken!",
    );
  });
});

/* - Testando inicialização do widget com o connectToken correto - */

test("should initialize widget with the correct connectToken", async () => {
  mockSuccessInvoke();

  render(<PluggyConnect {...defaultProps} />);

  await vi.waitFor(() => {
    expect(mockPluggyConnectSDK).toHaveBeenCalledWith(
      expect.objectContaining({ connectToken: "token-123" }),
    );
    expect(mockWidgetInit).toHaveBeenCalled();
  });
});

/* - Testando chamada de onError via callback do widget - */

test("should call onError when widget triggers error callback", async () => {
  mockSuccessInvoke();
  const getCallbacks = captureSDKCallbacks();

  render(<PluggyConnect {...defaultProps} />);

  await vi.waitFor(() => expect(mockWidgetInit).toHaveBeenCalled());

  getCallbacks().onError({ message: "erro do widget" });

  expect(defaultProps.onError).toHaveBeenCalledWith("erro do widget");
});

/* - Testando chamada de onClose via callback do widget - */

test("should call onClose when widget triggers close callback", async () => {
  mockSuccessInvoke();
  const getCallbacks = captureSDKCallbacks();

  render(<PluggyConnect {...defaultProps} />);

  await vi.waitFor(() => expect(mockWidgetInit).toHaveBeenCalled());

  getCallbacks().onClose();

  expect(defaultProps.onClose).toHaveBeenCalled();
});

/* - Testando onSuccess com conta corrente (CHECKING_ACCOUNT) - */

test("should call onSuccess with CHECKING_ACCOUNT id", async () => {
  mockSuccessInvoke();
  const getCallbacks = captureSDKCallbacks();
  mockGetUser.mockResolvedValue({ data: { user: null } });
  mockFetchAccounts([
    { id: "acc-savings", subtype: "SAVINGS_ACCOUNT" },
    { id: "acc-checking", subtype: "CHECKING_ACCOUNT" },
  ]);

  render(<PluggyConnect {...defaultProps} />);

  await vi.waitFor(() => expect(mockWidgetInit).toHaveBeenCalled());

  await getCallbacks().onSuccess({ item: { id: "item-1" } });

  expect(defaultProps.onSuccess).toHaveBeenCalledWith("acc-checking");
});

/* - Testando fallback para a primeira conta quando não há CHECKING_ACCOUNT - */

test("should call onSuccess with first account id when no CHECKING_ACCOUNT exists", async () => {
  mockSuccessInvoke();
  const getCallbacks = captureSDKCallbacks();
  mockGetUser.mockResolvedValue({ data: { user: null } });
  mockFetchAccounts([
    { id: "acc-first", subtype: "SAVINGS_ACCOUNT" },
    { id: "acc-second", subtype: "INVESTMENT" },
  ]);

  render(<PluggyConnect {...defaultProps} />);

  await vi.waitFor(() => expect(mockWidgetInit).toHaveBeenCalled());

  await getCallbacks().onSuccess({ item: { id: "item-2" } });

  expect(defaultProps.onSuccess).toHaveBeenCalledWith("acc-first");
});

/* - Testando atualização do pluggy_account_id quando há usuário autenticado - */

test("should update pluggy_account_id in database when user is authenticated", async () => {
  mockSuccessInvoke();
  const getCallbacks = captureSDKCallbacks();
  mockGetUser.mockResolvedValue({ data: { user: { id: "user-42" } } });
  mockFetchAccounts([{ id: "acc-checking", subtype: "CHECKING_ACCOUNT" }]);

  render(<PluggyConnect {...defaultProps} />);

  await vi.waitFor(() => expect(mockWidgetInit).toHaveBeenCalled());

  await getCallbacks().onSuccess({ item: { id: "item-3" } });

  expect(mockFrom).toHaveBeenCalledWith("users");
  expect(mockUpdate).toHaveBeenCalledWith({
    pluggy_account_id: "acc-checking",
  });
  expect(mockEq).toHaveBeenCalledWith("user_id", "user-42");
});

/* - Testando que o banco não é atualizado quando não há usuário autenticado - */

test("should not update database when user is not authenticated", async () => {
  mockSuccessInvoke();
  const getCallbacks = captureSDKCallbacks();
  mockGetUser.mockResolvedValue({ data: { user: null } });
  mockFetchAccounts([{ id: "acc-checking", subtype: "CHECKING_ACCOUNT" }]);

  render(<PluggyConnect {...defaultProps} />);

  await vi.waitFor(() => expect(mockWidgetInit).toHaveBeenCalled());

  await getCallbacks().onSuccess({ item: { id: "item-4" } });

  expect(mockFrom).not.toHaveBeenCalled();
});

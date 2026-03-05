import { render, screen } from "@testing-library/react";
import {
  MainContent,
  type MainContentProps,
} from "@/shared/components/MainContent";
import {
  TransactionContext,
  useIsMobileDevice,
  useOrientation,
  type Transaction,
} from "@/features/transactions";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

/* - criando o mock que vai ser usado nos testes - */

vi.mock("@/features/transactions", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/transactions")>();
  return {
    ...actual,
    TransactionForm: () => <div>TransactionForm</div>,
    MobileTransactionForm: () => <div>MobileTransactionForm</div>,
    LandscapeTransactionForm: () => <div>LandscapeTransactionForm</div>,
    TransactionList: () => <div>TransactionList</div>,
    MobileTransactionList: () => <div>MobileTransactionList</div>,
    useIsMobileDevice: vi.fn(() => false),
    useOrientation: vi.fn(() => false),
  };
});

/* - Limpando o mock entre os testes para evitar erro - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Criando uma função para simular um TransactionContext - */

const fakeTransactionContext = (transactions: Transaction[] = []) => ({
  transactions,
  handleAddTransaction: vi.fn(),
  handleUpdateTransaction: vi.fn(),
  handleDeleteTransaction: vi.fn(),
  fetchTransactions: vi.fn(),
  totalIncome: 0,
  totalExpense: 0,
  availableMoney: 0,
  isLoading: false,
});

/* - Criando defaultProps para evitar repetição - */

const defaultProps = () => ({
  title: "",
  setTitle: vi.fn(),
  amount: "",
  setAmount: vi.fn(),
  date: "",
  setDate: vi.fn(),
  type: null as null,
  setType: vi.fn(),
  category: "",
  setCategory: vi.fn(),
  period: null as null,
  setPeriod: vi.fn(),
  isMobileFormOpen: false,
  setIsMobileFormOpen: vi.fn(),
  isMobileTransactionListOpen: false,
  setIsMobileTransactionListOpen: vi.fn(),
});

/* - Criando uma função para renderizar o componente com Router - */

const renderComponent = (
  props: Partial<MainContentProps> = {},
  transactions: Transaction[] = [],
) =>
  render(
    <MemoryRouter>
      <TransactionContext.Provider value={fakeTransactionContext(transactions)}>
        <MainContent
          {...defaultProps()}
          {...props}
        />
      </TransactionContext.Provider>
    </MemoryRouter>,
  );

/* - Testando renderização do MainContent - */

test("should render the MainContent component", () => {
  renderComponent();

  expect(screen.getByText("TransactionForm")).toBeInTheDocument();
});

test("should not render MobileTransactionForm by default", () => {
  renderComponent();

  expect(screen.queryByText("MobileTransactionForm")).not.toBeInTheDocument();
});

test("should not render MobileTransactionList by default", () => {
  renderComponent();

  expect(screen.queryByText("MobileTransactionList")).not.toBeInTheDocument();
});

/* - Testando renderização condicional dos modais - */

test("should render MobileTransactionForm when isMobileFormOpen is true", () => {
  renderComponent({ isMobileFormOpen: true });

  expect(screen.getByText("MobileTransactionForm")).toBeInTheDocument();
});

test("should render MobileTransactionList when isMobileTransactionListOpen is true", () => {
  renderComponent({ isMobileTransactionListOpen: true });

  expect(screen.getByText("MobileTransactionList")).toBeInTheDocument();
});

/* - Testando renderização condicional em casos de mobile landscape - */

test("should render LandscapeTransactionForm when isMobileDevice and isLandscape are true", () => {
  (useIsMobileDevice as ReturnType<typeof vi.fn>).mockReturnValue(true);
  (useOrientation as ReturnType<typeof vi.fn>).mockReturnValue(true);

  renderComponent();

  expect(screen.getByText("LandscapeTransactionForm")).toBeInTheDocument();
  expect(screen.queryByText("TransactionForm")).not.toBeInTheDocument();
});

test("should render TransactionForm when isMobileDevice and isLandscape are false", () => {
  (useIsMobileDevice as ReturnType<typeof vi.fn>).mockReturnValue(false);
  (useOrientation as ReturnType<typeof vi.fn>).mockReturnValue(false);

  renderComponent();

  expect(screen.getByText("TransactionForm")).toBeInTheDocument();
  expect(
    screen.queryByText("LandscapeTransactionForm"),
  ).not.toBeInTheDocument();
});

/* - Testando erro de contexto - */

test("should throw error when rendered outside TransactionContext", () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() =>
    render(
      <MemoryRouter>
        <MainContent {...defaultProps()} />
      </MemoryRouter>,
    ),
  ).toThrow("TransactionContext must be used within a TransactionProvider.");

  consoleError.mockRestore();
});

/* - Testando o Scroll - */

test("should make overflow hidden whenever isMobileFormOpen === true", () => {
  renderComponent({ isMobileFormOpen: true });

  expect(document.body.style.overflow).toBe("hidden");
});

test("should make overflow hidden whenever isMobileTransactionListOpen === true", () => {
  renderComponent({ isMobileTransactionListOpen: true });

  expect(document.body.style.overflow).toBe("hidden");
});

test("should make overflow auto whenever isMobileFormOpen === false and isMobileTransactionListOpen === false", () => {
  renderComponent();

  expect(document.body.style.overflow).toBe("auto");
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MainContent } from "@/shared/components/MainContent";
import { vi } from "vitest";

/* - Criando mocks para useTransactionContext - */

const setIsWidgetOpen = vi.fn();

vi.mock("@/features/transactions", async () => {
  const actual = await vi.importActual<any>("@/features/transactions");

  return {
    ...actual,

    useTransactionContext: () => ({
      transactions: [
        {
          id: "1",
          title: "Salário",
          type: "Entrada",
          period: "Hoje",
          category: "Trabalho",
        },
        {
          id: "2",
          title: "Aluguel",
          type: "Saída",
          period: "Último Mês",
          category: "Moradia",
        },
      ],
      setIsWidgetOpen,
    }),

    TransactionForm: () => <div data-testid="transaction-form" />,

    TransactionList: ({ transactions }: any) => (
      <div data-testid="transaction-list">
        {transactions.map((t: any) => (
          <span key={t.id}>{t.title}</span>
        ))}
      </div>
    ),

    Filter: ({ setSearchQuery }: any) => (
      <input
        data-testid="filter-input"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    ),

    MobileTransactionList: () => <div data-testid="mobile-transaction-list" />,

    MobileActionBar: ({ OpenForm }: any) => (
      <button onClick={OpenForm}>open form</button>
    ),

    ChartsSection: () => <div data-testid="charts" />,
  };
});

/* - Criando mocks para useMobileContext - */

const mobileContextValues = {
  isMobile: false,
  isLandscape: false,
};

const setIsMobileFormOpen = vi.fn();
const setIsMobileTransactionListOpen = vi.fn();
const setIsMobileChartOpen = vi.fn();

vi.mock("@/features/transactions/hooks/useMobileContext", () => ({
  useMobileContext: () => ({
    isMobile: mobileContextValues.isMobile,
    isLandscape: mobileContextValues.isLandscape,

    isMobileFormOpen: false,
    setIsMobileFormOpen,

    isMobileTransactionListOpen: false,
    setIsMobileTransactionListOpen,

    setIsMobileChartOpen,
  }),
}));

/* - Criando componente de renderização - */

const renderComponent = () => render(<MainContent />);

/* - Testando renderização no desktop - */

describe("MainContent — desktop", () => {
  beforeEach(() => {
    mobileContextValues.isMobile = false;
    mobileContextValues.isLandscape = false;
  });

  test("deve renderizar a lista de transações", () => {
    renderComponent();

    expect(screen.getByTestId("transaction-list")).toBeInTheDocument();
  });

  test("deve renderizar o formulário de transação", () => {
    renderComponent();

    expect(screen.getByTestId("transaction-form")).toBeInTheDocument();
  });

  test("deve renderizar o filtro", () => {
    renderComponent();

    expect(screen.getByTestId("filter-input")).toBeInTheDocument();
  });

  test("deve renderizar a seção de gráficos", () => {
    renderComponent();

    expect(screen.getByTestId("charts")).toBeInTheDocument();
  });

  test("não deve renderizar a barra de ações mobile", () => {
    renderComponent();

    expect(screen.queryByText("open form")).not.toBeInTheDocument();
  });

  test("deve exibir todas as transações inicialmente", () => {
    renderComponent();

    expect(screen.getByText("Salário")).toBeInTheDocument();
    expect(screen.getByText("Aluguel")).toBeInTheDocument();
  });

  test("deve filtrar transações pelo searchQuery", async () => {
    const user = userEvent.setup();

    renderComponent();

    const input = screen.getByTestId("filter-input");

    await user.type(input, "Sal");

    expect(screen.getByText("Salário")).toBeInTheDocument();
    expect(screen.queryByText("Aluguel")).not.toBeInTheDocument();
  });
});

/* - Testando renderização no mobile - */

describe("MainContent — mobile", () => {
  beforeEach(() => {
    mobileContextValues.isMobile = true;
    mobileContextValues.isLandscape = false;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("deve renderizar a barra de ações mobile", () => {
    renderComponent();

    expect(screen.getByText("open form")).toBeInTheDocument();
  });

  test("deve chamar setIsMobileFormOpen(true) ao clicar em 'open form'", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByText("open form"));

    expect(setIsMobileFormOpen).toHaveBeenCalledWith(true);
  });

  test("não deve renderizar a lista de transações no mobile", () => {
    renderComponent();

    expect(screen.queryByTestId("transaction-list")).not.toBeInTheDocument();
  });
});

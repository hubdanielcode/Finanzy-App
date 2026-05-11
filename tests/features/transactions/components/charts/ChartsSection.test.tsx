import { render, screen } from "@testing-library/react";
import { ChartsSection } from "@/features/transactions";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

/* - Criando mock para simular o setIsMobileChartOpen - */

const mockSetIsMobileChartOpen = vi.fn();

/* - Criando mocks para os hooks de contexto - */

vi.mock("@/features/transactions/hooks/useTransactionContext", () => ({
  useTransactionContext: vi.fn(() => ({ transactions: [] })),
}));

vi.mock("@/features/transactions/hooks/useMobileContext", () => ({
  useMobileContext: vi.fn(() => ({
    isMobileChartOpen: false,
    setIsMobileChartOpen: mockSetIsMobileChartOpen,
  })),
}));

/* - Criando mocks para os hooks de dados dos gráficos - */

vi.mock("@/features/transactions/hooks/useBalanceChartData", () => ({
  useBalanceChartData: vi.fn(() => []),
}));

vi.mock("@/features/transactions/hooks/useYearlyChartData", () => ({
  useYearlyChartData: vi.fn(() => []),
}));

vi.mock("@/features/transactions/hooks/useCategoryChartData", () => ({
  useCategoryChartData: vi.fn(() => []),
}));

/* - Criando mocks para os arquivos fonte dos gráficos - */

vi.mock("@/features/transactions/components/charts/MonthlyBarChart", () => ({
  MonthlyBarChart: () => <div data-testid="monthly-bar-chart" />,
}));

vi.mock("@/features/transactions/components/charts/BalanceLineChart", () => ({
  BalanceLineChart: () => <div data-testid="balance-line-chart" />,
}));

vi.mock("@/features/transactions/components/charts/CategoryPieChart", () => ({
  CategoryPieChart: () => <div data-testid="category-pie-chart" />,
}));

/* - Criando mocks para os filtros - */

vi.mock("@/features/transactions/components/charts/ChartFilter", () => ({
  MonthlyBarChartFilter: () => <div data-testid="monthly-bar-chart-filter" />,
  CategoryPieChartFilter: () => <div data-testid="category-pie-chart-filter" />,
  BalanceLineChartFilter: () => <div data-testid="balance-line-chart-filter" />,
}));

/* - Helpers de renderização - */

const renderOnChartsPage = () =>
  render(
    <MemoryRouter initialEntries={["/graficos"]}>
      <Routes>
        <Route
          path="/graficos"
          element={<ChartsSection />}
        />
        <Route
          path="/pagina-principal"
          element={<div>Página Principal</div>}
        />
      </Routes>
    </MemoryRouter>,
  );

const renderOnOtherPage = () =>
  render(
    <MemoryRouter initialEntries={["/pagina-principal"]}>
      <Routes>
        <Route
          path="/pagina-principal"
          element={<ChartsSection />}
        />
      </Routes>
    </MemoryRouter>,
  );

/* - Limpando mocks entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando renderização do header - */

test("should render the header with title and close button", () => {
  renderOnChartsPage();

  expect(screen.getByText("Resumo Mensal")).toBeInTheDocument();
  expect(screen.getByLabelText("close-charts")).toBeInTheDocument();
});

/* - Testando renderização dos gráficos - */

test("should render all chart components", () => {
  renderOnChartsPage();

  expect(screen.getByTestId("monthly-bar-chart")).toBeInTheDocument();
  expect(screen.getByTestId("balance-line-chart")).toBeInTheDocument();
  expect(screen.getAllByTestId("category-pie-chart")).toHaveLength(2);
});

/* - Testando renderização dos filtros - */

test("should render all chart filters", () => {
  renderOnChartsPage();

  expect(screen.getByTestId("monthly-bar-chart-filter")).toBeInTheDocument();
  expect(screen.getByTestId("balance-line-chart-filter")).toBeInTheDocument();
  expect(screen.getAllByTestId("category-pie-chart-filter")).toHaveLength(2);
});

/* - Testando labels das seções - */

test("should render all section labels", () => {
  renderOnChartsPage();

  expect(screen.getByText("Entradas e Saídas por Mês")).toBeInTheDocument();
  expect(screen.getByText("Saldo por mês")).toBeInTheDocument();
  expect(screen.getByText("Categorias de Saída")).toBeInTheDocument();
  expect(screen.getByText("Categorias de Entrada")).toBeInTheDocument();
});

/* - Testando navegação para /pagina-principal ao clicar em fechar na página /graficos - */

test("should navigate to /pagina-principal when close button is clicked on /graficos", async () => {
  renderOnChartsPage();

  await userEvent.click(screen.getByLabelText("close-charts"));

  expect(screen.getByText("Página Principal")).toBeInTheDocument();
});

/* - Testando chamada de setIsMobileChartOpen ao fechar fora da página /graficos - */

test("should call setIsMobileChartOpen(false) when close button is clicked outside /graficos", async () => {
  renderOnOtherPage();

  await userEvent.click(screen.getByLabelText("close-charts"));

  expect(mockSetIsMobileChartOpen).toHaveBeenCalledWith(false);
});

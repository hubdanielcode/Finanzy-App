import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { BalanceLineChart } from "@/features/transactions";
import type { BalanceChartData } from "@/features/transactions/hooks/useBalanceChartData";

/* - Criando dados falsos para os testes - */

const fakeData: BalanceChartData[] = [
  { month: "Jan", Saldo: 3000 },
  { month: "Fev", Saldo: -1000 },
  { month: "Mar", Saldo: 5000 },
];

/* - Função para renderizar o componente - */

const renderComponent = (data: BalanceChartData[] = fakeData) =>
  render(<BalanceLineChart data={data} />);

/* - Mockando o ResizeObserver para o recharts funcionar em ambiente de teste - */

beforeAll(() => {
  (window as any).ResizeObserver = class ResizeObserver {
    callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }

    observe(_target: Element) {
      this.callback(
        [{ contentRect: { width: 800, height: 400 } } as ResizeObserverEntry],
        this,
      );
    }

    unobserve() {}
    disconnect() {}
  };
});

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando a renderização do gráfico - */

test("should render the chart without crashing", () => {
  const { container } = renderComponent();

  expect(container.firstChild).toBeInTheDocument();
});

/* - Testando os meses no eixo X - */

test("should render the month labels on the X axis", () => {
  renderComponent();

  expect(screen.getByText("Jan")).toBeInTheDocument();
  expect(screen.getByText("Fev")).toBeInTheDocument();
  expect(screen.getByText("Mar")).toBeInTheDocument();
});

/* - Testando a legenda - */

test("should render the legend with the 'Saldo' label", () => {
  renderComponent();

  expect(screen.getByText("Saldo")).toBeInTheDocument();
});

/* - Testando com dados vazios - */

test("should render without crashing when data is empty", () => {
  const { container } = renderComponent([]);

  expect(container.firstChild).toBeInTheDocument();
});

/* - Testando com saldo negativo - */

test("should render correctly when Saldo values are negative", () => {
  const { container } = renderComponent([{ month: "Jan", Saldo: -5000 }]);

  expect(container.firstChild).toBeInTheDocument();
});

/* - Testando com um único ponto de dados - */

test("should render correctly with a single data point", () => {
  const { container } = renderComponent([{ month: "Jan", Saldo: 1000 }]);

  expect(container.firstChild).toBeInTheDocument();
});

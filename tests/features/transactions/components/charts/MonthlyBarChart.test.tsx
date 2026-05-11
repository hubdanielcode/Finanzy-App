import { render, screen } from "@testing-library/react";
import { BalanceLineChart } from "@/features/transactions/components/charts/BalanceLineChart";
import type { BalanceChartData } from "@/features/transactions/hooks/useBalanceChartData";
import { vi } from "vitest";

/* - Mockando o recharts para evitar erros de renderização no ambiente de testes - */

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Line: ({ dataKey }: { dataKey: string }) => (
    <div data-testid={`line-${dataKey}`} />
  ),
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: ({
    content,
  }: {
    content: (props: {
      payload: { color: string; value: string }[];
    }) => React.ReactNode;
  }) => (
    <div>
      {content({
        payload: [{ color: "#2563EB", value: "Saldo" }],
      })}
    </div>
  ),
  XAxis: () => <div />,
  YAxis: () => <div />,
}));

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando a renderização da linha do gráfico - */

test("should render 'Saldo' line", () => {
  render(<BalanceLineChart data={[]} />);

  expect(screen.getByTestId("line-Saldo")).toBeInTheDocument();
});

/* - Testando a renderização da label da legenda - */

test("should render Saldo label in legend", () => {
  render(<BalanceLineChart data={[]} />);

  expect(screen.getByText("Saldo")).toBeInTheDocument();
});

/* - Testando a renderização com dados - */

test("should render without crashing when data is empty", () => {
  render(<BalanceLineChart data={[]} />);

  expect(screen.getByTestId("line-Saldo")).toBeInTheDocument();
});

test("should render without crashing when data has multiple months", () => {
  const data: BalanceChartData[] = [
    { month: "Jan", Saldo: 3500 },
    { month: "Fev", Saldo: -1000 },
    { month: "Mar", Saldo: 2000 },
  ];

  render(<BalanceLineChart data={data} />);

  expect(screen.getByTestId("line-Saldo")).toBeInTheDocument();
});

test("should render without crashing when data has negative Saldo", () => {
  const data: BalanceChartData[] = [{ month: "Jan", Saldo: -5000 }];

  render(<BalanceLineChart data={data} />);

  expect(screen.getByTestId("line-Saldo")).toBeInTheDocument();
});

/* - Testando que o componente não depende do contexto - */

test("should render without TransactionContext", () => {
  expect(() => render(<BalanceLineChart data={[]} />)).not.toThrow();
});

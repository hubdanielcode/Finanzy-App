import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { CategoryPieChart } from "@/features/transactions/components/charts/CategoryPieChart";
import type { CategoryChartData } from "@/features/transactions/hooks/useCategoryChartData";

/* - Criando o mock do recharts - */

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Pie: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: ({ fill }: { fill: string }) => (
    <div
      data-testid="cell"
      data-fill={fill}
    />
  ),
  Tooltip: () => <div />,
  Legend: ({
    content,
  }: {
    content: (props: {
      payload: { color: string; value: string }[];
    }) => React.ReactNode;
  }) =>
    content({
      payload: [
        { color: "#3F51B5", value: "Salário" },
        { color: "#F5C518", value: "Moradia" },
      ],
    }),
}));

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

const sampleData: CategoryChartData[] = [
  { type: "Entrada", category: "Salário", amount: 5000, icon: "💰" },
  { type: "Saída", category: "Moradia", amount: 1500, icon: "🏠" },
  { type: "Saída", category: "Alimentação", amount: 800, icon: "🍔" },
];

/* - CategoryPieChart - */

describe("CategoryPieChart", () => {
  /* - Renderização - */

  test("should render without errors with empty data", () => {
    render(<CategoryPieChart data={[]} />);
  });

  test("should render without errors with valid data", () => {
    render(<CategoryPieChart data={sampleData} />);
  });

  test("should render one Cell per data entry", () => {
    render(<CategoryPieChart data={sampleData} />);

    expect(screen.getAllByTestId("cell")).toHaveLength(sampleData.length);
  });

  test("should render legend entries from recharts payload", () => {
    render(<CategoryPieChart data={sampleData} />);

    expect(screen.getByText("Salário")).toBeInTheDocument();
    expect(screen.getByText("Moradia")).toBeInTheDocument();
  });

  /* - Cores - */

  test("should apply correct color for known category", () => {
    render(
      <CategoryPieChart
        data={[
          { type: "Entrada", category: "Salário", amount: 5000, icon: "💰" },
        ]}
      />,
    );

    const cell = screen.getByTestId("cell");
    expect(cell).toHaveAttribute("data-fill", "#3F51B5");
  });

  test("should apply fallback color for unknown category", () => {
    render(
      <CategoryPieChart
        data={[
          {
            type: "Saída",
            category: "Categoria Desconhecida",
            amount: 999,
            icon: "❓",
          },
        ]}
      />,
    );

    const cell = screen.getByTestId("cell");
    expect(cell).toHaveAttribute("data-fill", "#cccccc");
  });

  test("should apply correct color for each category in a list", () => {
    const data: CategoryChartData[] = [
      { type: "Saída", category: "Moradia", amount: 1000, icon: "🏠" },
      { type: "Saída", category: "Transporte", amount: 500, icon: "🚗" },
    ];

    render(<CategoryPieChart data={data} />);

    const cells = screen.getAllByTestId("cell");
    expect(cells[0]).toHaveAttribute("data-fill", "#F5C518");
    expect(cells[1]).toHaveAttribute("data-fill", "#1565C0");
  });

  /* - Legend - */

  test("should render legend item with correct color style", () => {
    render(<CategoryPieChart data={sampleData} />);

    const legendItem = screen.getByText("Salário");
    expect(legendItem).toHaveStyle({ color: "#3F51B5" });
  });

  test("should render color swatch for each legend item", () => {
    render(<CategoryPieChart data={sampleData} />);

    const swatches = document.querySelectorAll(".w-3.h-3");
    expect(swatches.length).toBeGreaterThan(0);
  });
});

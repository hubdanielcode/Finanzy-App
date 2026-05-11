import {
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
  PieChart,
  Pie,
} from "recharts";
import { useState, useEffect } from "react";
import type { CategoryChartData } from "../../hooks/useCategoryChartData";

interface CategoryPieChartProps {
  data: CategoryChartData[];
}

const CategoryColors: Record<string, string> = {
  /* - Saída - */

  Moradia: "#F5C518",
  Lazer: "#FF7F2A",
  Alimentação: "#4CAF50",
  Mercado: "#4FC3F7",
  "Animais de Estimação": "#4410FE",
  "Cuidados Pessoais": "#FF4FF1",
  Educação: "#E0ABFF",
  "Impostos e Taxas": "#9E501E",
  Saúde: "#09BBB1",
  Transporte: "#1565C0",

  /* - Entrada - */

  Consultoria: "#6D4C41",
  Depósitos: "#00BCD4",
  Freelance: "#880E4F",
  Bonificações: "#CDDC39",
  Rendimentos: "#FF8A65",
  Salário: "#3F51B5",
  Vendas: "#9E9E9E",

  /* - Ambos - */

  Outros: "#E53935",
};

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const tooltipBackground = isDark ? "#1a1a2e" : "#00000060";
  const tooltipBorder = isDark ? "#6c63ff40" : "#00000060";
  const pieStroke = isDark ? "#0f0f13" : "#000000";

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <PieChart>
        <Tooltip
          cursor={false}
          contentStyle={{
            backgroundColor: tooltipBackground,
            color: "#ffffff",
            borderColor: tooltipBorder,
            fontWeight: 600,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 16,
            textShadow: "1px 1px 2px black",
            padding: "4px 8px",
          }}
        />

        <Pie
          className="border-none outline-none"
          data={data}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          stroke={pieStroke}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={CategoryColors[entry.category] ?? "#cccccc"}
            />
          ))}
        </Pie>

        <Legend
          content={({ payload }) => (
            <div className="flex flex-wrap gap-2 px-2 py-1">
              {payload?.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5"
                >
                  <div
                    className="w-3 h-3"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span
                    className="text-base font-semibold px-2 py-1"
                    style={{ color: entry.color }}
                  >
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export { CategoryPieChart };

import {
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { useState, useEffect } from "react";
import type { YearlyChartData } from "@/features/transactions/hooks/useYearlyChartData";

interface MonthlyBarChartProps {
  data: YearlyChartData[];
}

const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ data }) => {
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

  const axisColor = isDark ? "#aaaacc" : "#000000";
  const gridColor = isDark ? "#ffffff15" : "#e5e7eb";
  const tooltipBackground = isDark ? "#1a1a2e" : "#00000060";
  const tooltipBorder = isDark ? "#6c63ff40" : "#00000060";
  const barStroke = isDark ? "#0f0f13" : "#000000";
  const entradaColor = isDark ? "#1d9e75" : "#16a34a";
  const saidaColor = isDark ? "#e24b4a" : "#dc2626";

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <BarChart data={data}>
        <CartesianGrid stroke={gridColor} />

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
            textShadow: "1px 1px 2px black",
            fontSize: 16,
            padding: "4px 8px",
          }}
        />

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

        <XAxis
          dataKey="month"
          tick={{ fill: axisColor, fontWeight: 600 }}
          axisLine={{ stroke: axisColor }}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: axisColor, fontWeight: 600 }}
          axisLine={{ stroke: axisColor }}
          tickLine={false}
        />

        <Bar
          dataKey="Entrada"
          stroke={barStroke}
          fill={entradaColor}
        />

        <Bar
          dataKey="Saída"
          stroke={barStroke}
          fill={saidaColor}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export { MonthlyBarChart };

import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import { type BalanceChartData } from "../../hooks/useBalanceChartData";

interface BalanceLineChartProps {
  data: BalanceChartData[];
}

const BalanceLineChart: React.FC<BalanceLineChartProps> = ({ data }) => {
  const isDark = document.documentElement.classList.contains("dark");

  const axisColor = isDark ? "#aaaacc" : "#000000";
  const gridColor = isDark ? "#ffffff15" : "#e5e7eb";
  const tooltipBackground = isDark ? "#1a1a2e" : "#00000060";
  const tooltipBorder = isDark ? "#6c63ff40" : "#00000060";
  const lineColor = isDark ? "#4f9eff" : "#2563EB";

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke={gridColor} />

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

        <Tooltip
          cursor={false}
          contentStyle={{
            backgroundColor: tooltipBackground,
            color: "#ffffff",
            borderColor: tooltipBorder,
            fontWeight: 600,
            borderRadius: 10,
            fontSize: 16,
            textShadow: "1px 1px 2px black",
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

        <Line
          type="monotone"
          dataKey="Saldo"
          stroke={lineColor}
          strokeWidth={2}
          dot={{ fill: lineColor, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export { BalanceLineChart };

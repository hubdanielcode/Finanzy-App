import { useMemo } from "react";
import { useTransactionContext } from "@/features/transactions/hooks/useTransactionContext";
import type { Month } from "../utils/monthOptions";

const monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const monthMap: Record<Month, string> = {
  Janeiro: "Jan",
  Fevereiro: "Fev",
  Março: "Mar",
  Abril: "Abr",
  Maio: "Mai",
  Junho: "Jun",
  Julho: "Jul",
  Agosto: "Ago",
  Setembro: "Set",
  Outubro: "Out",
  Novembro: "Nov",
  Dezembro: "Dez",
};

export type YearlyChartData = {
  month: string;
  Entrada: number;
  Saída: number;
};

interface UseYearlyChartDataParams {
  month?: Month;
  year?: number;
}

export const useYearlyChartData = ({
  month,
  year,
}: UseYearlyChartDataParams = {}): YearlyChartData[] => {
  const { transactions } = useTransactionContext();

  return useMemo(() => {
    let filtered = transactions;

    if (month) {
      const shortMonth = monthMap[month];
      filtered = filtered.filter((transaction) => {
        const date = new Date(transaction.date + "T00:00:00");
        return monthNames[date.getMonth()] === shortMonth;
      });
    }

    if (year) {
      filtered = filtered.filter((transaction) => {
        const date = new Date(transaction.date + "T00:00:00");
        return date.getFullYear() === year;
      });
    }

    return filtered
      .reduce((accumulator, transaction) => {
        const date = new Date(transaction.date + "T00:00:00");
        const month = monthNames[date.getMonth()];
        const exists = accumulator.find((item) => item.month === month);

        if (!exists) accumulator.push({ month, Entrada: 0, Saída: 0 });

        const entry = accumulator.find((item) => item.month === month)!;

        if (transaction.type === "Entrada") {
          entry.Entrada += transaction.amount;
        } else {
          entry.Saída += transaction.amount;
        }

        return accumulator;
      }, [] as YearlyChartData[])
      .sort(
        (a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month),
      );
  }, [transactions, month, year]);
};

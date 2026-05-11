import { useMemo } from "react";
import { useTransactionContext } from "./useTransactionContext";
import { IncomeIcons, ExpenseIcons } from "../model/categoryIcons";
import type { Period } from "../model/transactionTypes";

export interface CategoryChartData {
  type: "Entrada" | "Saída";
  category: string;
  amount: number;
  icon: string;
}

const useCategoryChartData = (
  type: "Entrada" | "Saída",
  period?: Period,
): CategoryChartData[] => {
  const { transactions } = useTransactionContext();

  return useMemo(() => {
    const icons = type === "Entrada" ? IncomeIcons : ExpenseIcons;

    return transactions
      .filter((transaction) => transaction.type === type)
      .filter((transaction) => (period ? transaction.period === period : true))
      .reduce((accumulator, transaction) => {
        const exists = accumulator.find(
          (item) => item.category === transaction.category,
        );

        if (!exists) {
          const icon =
            icons[transaction.category as keyof typeof icons]?.icon ?? "➕";
          accumulator.push({
            type,
            category: transaction.category,
            amount: transaction.amount,
            icon,
          });
          return accumulator;
        }

        const entry = accumulator.find(
          (item) => item.category === transaction.category,
        )!;

        entry.amount += transaction.amount;
        return accumulator;
      }, [] as CategoryChartData[])
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, type, period]);
};

export { useCategoryChartData };

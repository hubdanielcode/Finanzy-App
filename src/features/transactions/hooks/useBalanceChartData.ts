import { useMemo } from "react";

import { useTransactionContext } from "./useTransactionContext";

/* - Nome abreviado dos meses - */

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

/* - Tipo do retorno do gráfico - */

export interface BalanceChartData {
  month: string;
  Saldo: number;
}

/* - Hook responsável por gerar os dados do gráfico - */

const useBalanceChartData = (year?: number): BalanceChartData[] => {
  const { transactions } = useTransactionContext();

  return useMemo(() => {
    const groupedTransactions = transactions
      /* - Filtrando por ano caso exista - */
      .filter((transaction) => {
        if (!year) return true;

        return new Date(transaction.date + "T00:00:00").getFullYear() === year;
      })

      /* - Agrupando por mês e calculando saldo mensal - */
      .reduce((accumulator, transaction) => {
        const date = new Date(transaction.date + "T00:00:00");

        const month = monthNames[date.getMonth()];

        const existingMonth = accumulator.find((item) => item.month === month);

        /* - Criando mês caso ainda não exista - */

        if (!existingMonth) {
          accumulator.push({
            month,
            Saldo: 0,
          });
        }

        const currentMonth = accumulator.find((item) => item.month === month)!;

        /* - Somando entradas e subtraindo saídas - */

        if (transaction.type === "Entrada") {
          currentMonth.Saldo += transaction.amount;
        } else {
          currentMonth.Saldo -= transaction.amount;
        }

        return accumulator;
      }, [] as BalanceChartData[])

      /* - Ordenando os meses corretamente - */
      .sort(
        (a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month),
      );

    return groupedTransactions;
  }, [transactions, year]);
};

export { useBalanceChartData };

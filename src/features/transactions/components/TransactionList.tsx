import { UniqueTransaction } from "./UniqueTransaction";
import { LandscapeUniqueTransaction } from "./mobile/mobile-landscape/LandscapeUniqueTransactions";
import { ExpenseOptions, IncomeOptions } from "../model/transactionOptions";
import type { Transaction } from "../model/transactionTypes";
import { Pagination } from "../../../shared/components/Pagination";
import { useState } from "react";
import { useTransactionContext } from "../hooks/useTransactionContext";
import { transactionListVariants } from "../model/variants";

type Variant = "desktop" | "landscape";

interface TransactionListProps {
  transactions: Transaction[];
  variant: Variant;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  variant,
}) => {
  /* - Puxando do context - */

  const { isLoading } = useTransactionContext();

  /* - Funções - */

  // 1. Converte a data para timestamp

  const toTimestamp = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    if (!year || !month || !day) return 0;
    return new Date(year, month - 1, day).getTime();
  };

  // 2. Ordena as transações por data

  const sortedTransactions = [...transactions].sort((a, b) => {
    return toTimestamp(b.date) - toTimestamp(a.date);
  });

  /* - Definições - */

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  return (
    <div className={transactionListVariants.wrapper[variant]}>
      <div className="flex my-4">
        <h1 className="text-2xl text-black dark:text-[#e2e2ef] font-bold mx-auto pt-3">
          Histórico de Transações
        </h1>
      </div>

      {isLoading && (
        <p className="font-semibold text-lg text-gray-700 dark:text-[#aaaacc] mx-auto pt-1">
          Carregando lista de transações...
        </p>
      )}

      {transactions.length > 0 && !isLoading && (
        <div>
          <ul>
            {paginatedTransactions
              .filter(
                (transaction) =>
                  transaction.id !== null && transaction.id !== undefined,
              )
              .map((transaction) =>
                variant === "landscape" ? (
                  <LandscapeUniqueTransaction
                    key={transaction.id}
                    transaction={transaction}
                    ExpenseOptions={ExpenseOptions}
                    IncomeOptions={IncomeOptions}
                  />
                ) : (
                  <UniqueTransaction
                    key={transaction.id}
                    transaction={transaction}
                    ExpenseOptions={ExpenseOptions}
                    IncomeOptions={IncomeOptions}
                  />
                ),
              )}
          </ul>

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            pages={pages}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      )}

      {!transactions.length && !isLoading && (
        <p className="font-semibold text-lg text-gray-700 dark:text-[#aaaacc] mx-auto pt-1">
          Ainda não há transações na lista.
        </p>
      )}
    </div>
  );
};

export { TransactionList };

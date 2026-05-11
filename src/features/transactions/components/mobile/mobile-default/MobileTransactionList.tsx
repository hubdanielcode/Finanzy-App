import { UniqueTransaction } from "../../UniqueTransaction";
import {
  ExpenseOptions,
  IncomeOptions,
} from "../../../model/transactionOptions";
import type { Transaction } from "../../../model/transactionTypes";
import { Pagination } from "../../../../../shared/components/Pagination";
import { useState } from "react";
import { MobileFilter } from "./MobileFilter";
import { useTransactionContext } from "@/features/transactions/hooks/useTransactionContext";

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredTransactions: Transaction[];
  type: "Entrada" | "Saída" | null;
  setType: (type: "Entrada" | "Saída" | null) => void;
  period: Transaction["period"] | null;
  setPeriod: (period: Transaction["period"] | null) => void;
  category: string;
  setCategory: (category: string) => void;
  isMobileTransactionListOpen: boolean;
  setIsMobileTransactionListOpen: (value: boolean) => void;
}

interface TransactionListProps extends FilterProps {
  transactions: Transaction[];
}

const MobileTransactionList: React.FC<TransactionListProps> = ({
  transactions,
  searchQuery,
  setSearchQuery,
  filteredTransactions,
  type,
  setType,
  period,
  setPeriod,
  category,
  setCategory,
  isMobileTransactionListOpen,
  setIsMobileTransactionListOpen,
}) => {
  /* - Puxando do context - */

  const { isLoading } = useTransactionContext();

  /* - Funções - */

  // 1. Pega o momento da transação

  const toTimestamp = (date: string) => {
    return new Date(date).getTime();
  };

  // 2. Organiza as transações baseadas no momento: mais recentes -> mais antigas

  const sortedTransactions = [...transactions].sort((a, b) => {
    return toTimestamp(b.date) - toTimestamp(a.date);
  });

  /* - Definições - */

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  return (
    <div className="fixed inset-0 z-1 sm:hidden bg-white dark:bg-[#0f0f13] overflow-y-auto">
      <MobileFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredTransactions={filteredTransactions}
        type={type}
        setType={setType}
        period={period}
        setPeriod={setPeriod}
        category={category}
        setCategory={setCategory}
        isMobileTransactionListOpen={isMobileTransactionListOpen}
        setIsMobileTransactionListOpen={setIsMobileTransactionListOpen}
      />

      <div className="flex flex-col sm:hidden pl-8 bg-gray-100 dark:bg-[#0f0f13] min-h-screen">
        <div className="flex sm:my-4 pb-2">
          <h1 className="text-xl sm:text-2xl text-black dark:text-[#e2e2ef] font-bold mx-auto pt-3">
            Histórico de Transações
          </h1>
        </div>

        {isLoading && (
          <p className="font-semibold text-md text-gray-700 dark:text-[#aaaacc] mx-auto pt-1">
            Carregando lista de transações...
          </p>
        )}

        {transactions.length > 0 && !isLoading && (
          <div>
            <ul>
              {paginatedTransactions.map((transaction) => (
                <UniqueTransaction
                  key={transaction.id}
                  transaction={transaction}
                  ExpenseOptions={ExpenseOptions}
                  IncomeOptions={IncomeOptions}
                />
              ))}
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
          <p className="font-semibold text-md text-gray-700 dark:text-[#aaaacc] mx-auto pt-1">
            Ainda não há transações na lista.
          </p>
        )}
      </div>
    </div>
  );
};

export { MobileTransactionList };

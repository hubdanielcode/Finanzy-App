import { UniqueTransaction } from "../UniqueTransaction";
import { ExpenseOptions, IncomeOptions } from "../../model/TransactionOptions";
import type { Transaction } from "../../model/TransactionTypes";
import { Pagination } from "../../../../shared/components/Pagination";
import { useContext, useState } from "react";
import { MobileFilter } from "./MobileFilter";
import { TransactionContext } from "../../context/TransactionContext";

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
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "TransactionContext must be used within a TransactionProvider",
    );
  }

  const { isLoading } = context;

  const toTimestamp = (date: string) => {
    return new Date(date).getTime();
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    return toTimestamp(b.date) - toTimestamp(a.date);
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  return (
    <div className="fixed inset-0 z-1 sm:hidden bg-white overflow-y-auto">
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

      <div className="flex flex-col sm:hidden pl-8 bg-gray-100 h-screen">
        <div className="flex sm:my-4 pb-2">
          <h1 className="text-xl sm:text-2xl text-black font-bold mx-auto pt-3">
            Histórico de Transações
          </h1>
        </div>

        {isLoading && (
          <p className="font-semibold text-md text-gray-700 mx-auto pt-1">
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
          <p className="font-semibold text-md text-gray-700 mx-auto pt-1">
            Ainda não há transações na lista.
          </p>
        )}
      </div>
    </div>
  );
};

export { MobileTransactionList };

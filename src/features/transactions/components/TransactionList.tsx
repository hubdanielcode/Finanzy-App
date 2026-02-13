import { UniqueTransaction } from "./UniqueTransaction";
import { ExpenseOptions, IncomeOptions } from "../model/TransactionOptions";
import type { Transaction } from "../model/TransactionTypes";
import { Pagination } from "../../../shared/components/Pagination";
import { useContext, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "TransactionContext must be used within a TransactionProvider",
    );
  }

  const { isLoading } = context;

  const toTimestamp = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);

    if (!year || !month || !day) return 0;

    return new Date(year, month - 1, day).getTime();
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
    <div className="flex flex-col">
      <div className="flex my-4">
        <h1 className="text-2xl text-black font-bold mx-auto pt-3">
          Histórico de Transações
        </h1>
      </div>

      {isLoading && (
        <p className="font-semibold text-lg text-gray-700 mx-auto pt-1">
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
              .map((transaction) => (
                <UniqueTransaction
                  key={transaction.id}
                  transaction={transaction}
                  ExpenseOptions={ExpenseOptions}
                  IncomeOptions={IncomeOptions}
                />
              ))}
          </ul>
          {paginatedTransactions && totalPages >= 2 && (
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
          )}
        </div>
      )}

      {!transactions.length && !isLoading && (
        <p className="font-semibold text-lg text-gray-700 mx-auto pt-1">
          Ainda não há transações na lista.
        </p>
      )}
    </div>
  );
};

export { TransactionList };

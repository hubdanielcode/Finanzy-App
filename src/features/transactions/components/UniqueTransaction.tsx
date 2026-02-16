import { LuDot } from "react-icons/lu";
import type { Transaction } from "../model/TransactionTypes";
import { FaPenAlt, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useContext, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { Modal } from "./Modal";
import { ExpenseIcons, IncomeIcons } from "../model/CategoryIcons";

interface UniqueTransactionProps {
  transaction: Transaction;
  ExpenseOptions: string[];
  IncomeOptions: string[];
}

const UniqueTransaction: React.FC<UniqueTransactionProps> = ({
  transaction,
  ExpenseOptions,
  IncomeOptions,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { handleDeleteTransaction, handleUpdateTransaction } =
    useContext(TransactionContext)!;

  const [year, month, day] = transaction.date.split("-").map(Number);

  const transactionDate = new Date(year, month - 1, day);

  const formattedDate = format(
    transactionDate,
    "EEEE, dd 'de' MMMM 'de' yyyy",
    { locale: ptBR },
  ).toUpperCase();

  const anotherFormattedDate = format(transactionDate, "dd/MM/yyyy");

  const handleUpdate = (updated: Transaction) => {
    handleUpdateTransaction(updated);
    setIsModalOpen(false);
  };

  const categoryIcon =
    transaction.type === "Entrada"
      ? IncomeIcons[transaction.category as keyof typeof IncomeIcons]?.icon
      : ExpenseIcons[transaction.category as keyof typeof ExpenseIcons]?.icon;

  const formattedAmount =
    transaction.amount > 1e9
      ? transaction.amount.toExponential(2)
      : transaction.amount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

  return (
    <div>
      <h1 className="text-gray-600/70 font-bold text-[clamp(0.8rem,1.1vw,1rem)] mb pl-4">
        {formattedDate}
      </h1>

      <div className="relative bg-white text-black flex items-center border border-gray-500/50 rounded-xl sm:h-25 h-25 px-4 py-3 mb-6 w-full sm:max-w-3xl">
        <div className="hidden sm:flex sm:justify-center sm:items-center sm:text-2xl bg-linear-to-br from-blue-400 via-indigo-400 to-purple-400 sm:rounded-full sm:w-14 sm:h-14 sm:p-3 sm:border border-gray-500/50">
          {categoryIcon}
        </div>

        <div className="flex flex-col text-gray-700 font-bold text-[clamp(0.8rem,1.1vw,1rem)] ml-2 sm:ml-4 sm:px-4 px-2 sm:py-2 py">
          {transaction.title}

          <div className="flex text-sm text-gray-600/70 font-semibold mt-2">
            <span>{transaction.category} </span>
            <LuDot className="hidden sm:inline sm:h-5 sm:w-5" />
            <span className="hidden sm:inline"> {anotherFormattedDate} </span>
          </div>
        </div>

        <div className="flex flex-col ml-auto px-4 sm:px-6 lg:px-8 sm:mr-35 items-end">
          <div
            className={`text-[clamp(0.8rem,1.1vw,1rem)] font-bold sm:mb-3 max-w-40 truncate ${
              transaction.type === "Entrada" ? "text-green-600" : "text-red-600"
            }`}
          >
            {transaction.type === "Entrada" ? "+" : "-"}
            {formattedAmount}
          </div>

          <span
            className={`sm:text-sm text-xs border rounded-full py px-2 font-bold w-fit ml-auto ${
              transaction.type === "Entrada"
                ? "border-green-600 bg-green-200 hover:border-green-800 hover:bg-green-300 text-green-600"
                : "border-red-600 bg-red-200 hover:border-red-800 hover:bg-red-300 text-red-600"
            }`}
          >
            {transaction.type}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex sm:flex-row flex-col gap-4 sm:m-4">
          <FaPenAlt
            className="sm:h-10 sm:w-10 h-7 w-5 sm:p-2 sm:hover:p-1.5 hover:bg-gray-200 hover:text-blue-600 hover:border hover:border-gray-100 rounded-lg cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          <FaTrashAlt
            className="sm:h-10 sm:w-10 h-7 w-5 sm:p-2 sm:hover:p-1.5 hover:bg-gray-200 hover:text-red-600 hover:border hover:border-gray-100 rounded-lg cursor-pointer"
            onClick={() => handleDeleteTransaction(transaction.id!)}
          />
        </div>
      </div>

      {isModalOpen && (
        <Modal
          transaction={transaction}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleUpdate}
          ExpenseOptions={ExpenseOptions}
          IncomeOptions={IncomeOptions}
        />
      )}
    </div>
  );
};

export { UniqueTransaction };

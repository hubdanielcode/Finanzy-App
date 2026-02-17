import type { Transaction } from "../../../model/TransactionTypes";
import { FaPenAlt, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useContext, useState } from "react";
import { TransactionContext } from "../../../context/TransactionContext";
import { Modal } from "../../Modal";
import { ExpenseIcons, IncomeIcons } from "../../../model/CategoryIcons";
import { LuDot } from "react-icons/lu";

interface UniqueTransactionProps {
  transaction: Transaction;
  ExpenseOptions: string[];
  IncomeOptions: string[];
}

const LandscapeUniqueTransaction: React.FC<UniqueTransactionProps> = ({
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

  return (
    <div>
      <h1 className="text-gray-600/70 font-bold text-[clamp(0.8rem,1.1vw,1rem)] pl-4">
        {formattedDate}
      </h1>

      <div className="relative bg-white text-black flex items-center border border-gray-500/50 rounded-xl h-25 px-4 py-3 mb-6 w-full max-w-3xl">
        <div className="flex items-center justify-center bg-linear-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-full w-12 h-12 p-3 border border-gray-500/50">
          {categoryIcon}
        </div>

        <div className="flex flex-col text-gray-700 font-bold text-[clamp(0.8rem,1.1vw,1rem)] ml-2 px-2 py-1">
          {transaction.title}

          <div className="flex text-sm text-gray-600/70 font-semibold mt-2">
            <span>{transaction.category} </span>
            <LuDot className="inline h-5 w-5" />
            <span> {anotherFormattedDate} </span>
          </div>
        </div>

        <div className="flex flex-col ml-auto px-4 mr-2 items-end">
          <div
            className={`text-[clamp(0.8rem,1.1vw,1rem)] font-bold mb-3 mr-15 max-w-40 truncate ${
              transaction.type === "Entrada" ? "text-green-600" : "text-red-600"
            }`}
          >
            R$ {transaction.type === "Entrada" ? "+ " : "- "}
            {transaction.amount.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>

          <span
            className={`text-xs border rounded-full px-2 font-bold w-fit mr-15  ${
              transaction.type === "Entrada"
                ? "border-green-600 bg-green-200 hover:border-green-800 hover:bg-green-300 text-green-600"
                : "border-red-600 bg-red-200 hover:border-red-800 hover:bg-red-300 text-red-600"
            }`}
          >
            {transaction.type}
          </span>
        </div>

        <div className="absolute top-2 right-3 flex flex-col gap-1">
          <FaPenAlt
            className="h-10 w-10 mr-3 p-2 hover:p-1.5 hover:bg-gray-200 hover:text-blue-600 hover:border hover:border-gray-100 rounded-lg cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          <FaTrashAlt
            className="h-10 w-10 mr-3 p-2 hover:p-1.5 hover:bg-gray-200 hover:text-red-600 hover:border hover:border-gray-100 rounded-lg cursor-pointer"
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

export { LandscapeUniqueTransaction };

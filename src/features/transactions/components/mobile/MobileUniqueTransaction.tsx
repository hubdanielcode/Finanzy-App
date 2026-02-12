import { LuDot } from "react-icons/lu";
import type { Transaction } from "../../model/TransactionTypes";
import { FaPenAlt, FaTrashAlt } from "react-icons/fa";
import { parse, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useContext, useState } from "react";
import { TransactionContext } from "../../context/TransactionContext";
import { Modal } from "../Modal";
import { ExpenseIcons, IncomeIcons } from "../../model/CategoryIcons";

interface UniqueTransactionProps {
  transaction: Transaction;
  ExpenseOptions: string[];
  IncomeOptions: string[];
}

const MobileUniqueTransaction: React.FC<UniqueTransactionProps> = ({
  transaction,
  ExpenseOptions,
  IncomeOptions,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { handleDeleteTransaction, handleUpdateTransaction } =
    useContext(TransactionContext)!;

  const transactionDate = parse(transaction.date, "yyyy-MM-dd", new Date());
  const formattedDate = format(
    transactionDate,
    "EEEE, dd 'de' MMMM 'de' yyyy",
    { locale: ptBR },
  ).toUpperCase();

  const anotherFormattedDate = format(transactionDate, "dd/MM/yyyy");

  /* - Quando o Modal chama onSubmit, atualiza - */

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
      <h1 className="text-gray-600/70 font-bold text-lg mb pl-4">
        {formattedDate}
      </h1>

      <div className="relative bg-white text-black flex items-center border border-gray-500/50 rounded-xl h-15 px-4 py-3 mb-6 w-80">
        <div className="flex justify-center items-center text-2xl bg-blue-200 rounded-full w-10 h-10 p-2 border border-gray-500/50">
          {categoryIcon}
        </div>
        <div className="flex flex-col text-gray-700 font-bold text-md ml-4 px-4 py-2">
          {transaction.title}

          <div className="flex text-md text-gray-600/70 font-semibold mt-2">
            {transaction.category}
            <LuDot size={25} />
            {anotherFormattedDate}
          </div>
        </div>
        <div className="flex flex-col mr-10 mx-auto">
          <div
            className={`text-2xl font-bold mb-3 ${
              transaction.type === "Entrada" ? "text-green-600" : "text-red-600"
            }`}
          >
            {transaction.type === "Entrada" ? "+" : "-"}
            {transaction.amount.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>

          <span
            className={`text-sm border rounded-full py px-2 font-bold w-fit ml-auto ${
              transaction.type === "Entrada"
                ? "border-green-600 bg-green-200 hover:border-green-800 hover:bg-green-300 text-green-600"
                : "border-red-600 bg-red-200 hover:border-red-800 hover:bg-red-300 text-red-600"
            }`}
          >
            {transaction.type}
          </span>
        </div>
        <div className="flex gap-3 justify-between items-center mr-2">
          <FaPenAlt
            className="h-10 w-10 p-2 hover:p-1.5 hover:bg-gray-200 hover:text-blue-600 hover:border hover:border-gray-100 rounded-lg cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          <FaTrashAlt
            className="h-10 w-10 p-2 hover:p-1.5 hover:bg-gray-200 hover:text-red-600 hover:border hover:border-gray-100 rounded-lg cursor-pointer"
            onClick={() => handleDeleteTransaction(transaction.id)}
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

export { MobileUniqueTransaction };

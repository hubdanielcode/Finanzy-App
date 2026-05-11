import type { Transaction } from "../../../model/transactionTypes";
import { FaPenAlt, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Modal } from "../../Modal";
import { ExpenseIcons, IncomeIcons } from "../../../model/categoryIcons";
import { LuDot } from "react-icons/lu";
import { useTransactionContext } from "@/features/transactions/hooks/useTransactionContext";

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
  /* - Puxando do context - */

  const { handleDeleteTransaction, handleUpdateTransaction } =
    useTransactionContext();

  /* - Estados do modal - */

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  /* - Definições - */

  const [year, month, day] = transaction.date.split("-").map(Number);
  const transactionDate = new Date(year, month - 1, day);

  const formattedDate = format(
    transactionDate,
    "EEEE, dd 'de' MMMM 'de' yyyy",
    { locale: ptBR },
  ).toUpperCase();

  const anotherFormattedDate = format(transactionDate, "dd/MM/yyyy");

  const categoryIcon =
    transaction.type === "Entrada"
      ? IncomeIcons[transaction.category as keyof typeof IncomeIcons]?.icon
      : ExpenseIcons[transaction.category as keyof typeof ExpenseIcons]?.icon;

  /* - Funções - */

  // 1. Atualiza a transação e fecha o modal

  const handleUpdate = (updated: Transaction) => {
    handleUpdateTransaction(updated);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-gray-600/70 dark:text-[#555577] font-bold text-[clamp(0.8rem,1.1vw,1rem)] pl-4">
        {formattedDate}
      </h1>

      <div className="relative bg-white dark:bg-[#1a1a2e] text-black dark:text-[#e2e2ef] flex items-center border border-gray-500/50 dark:border-white/10 rounded-xl h-25 px-4 py-3 mb-6 w-full max-w-3xl">
        <div
          className="flex items-center justify-center bg-linear-to-br from-blue-400 via-indigo-400 to-purple-400 dark:from-[#6c63ff]/40 dark:via-[#4f46e5]/40 dark:to-[#a09cff]/40 rounded-full w-12 h-12 p-3 border border-gray-500/50 dark:border-[#6c63ff]/30"
          data-testid="category-icon"
        >
          {categoryIcon}
        </div>

        <div className="flex flex-col text-gray-700 dark:text-[#e2e2ef] font-bold text-[clamp(0.8rem,1.1vw,1rem)] ml-2 px-2 py-1">
          {transaction.title}

          <div className="flex text-sm text-gray-600/70 dark:text-[#aaaacc] font-semibold mt-2">
            <span>{transaction.category} </span>

            <LuDot className="inline h-5 w-5" />

            <span> {anotherFormattedDate} </span>
          </div>
        </div>

        <div className="flex flex-col ml-auto px-4 mr-2 items-end">
          <div
            className={`text-[clamp(0.8rem,1.1vw,1rem)] font-bold mb-3 mr-15 max-w-40 truncate ${
              transaction.type === "Entrada"
                ? "text-green-600 dark:text-[#1d9e75]"
                : "text-red-600 dark:text-[#e24b4a]"
            }`}
          >
            R$ {transaction.type === "Entrada" ? "+ " : "- "}
            {transaction.amount.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>

          <span
            className={`text-xs border rounded-full px-2 font-bold w-fit mr-15 ${
              transaction.type === "Entrada"
                ? "border-green-600 bg-green-200 hover:border-green-800 hover:bg-green-300 text-green-600 dark:border-[#1d9e75] dark:bg-[#1d9e75]/20 dark:hover:bg-[#1d9e75]/30 dark:text-[#1d9e75]"
                : "border-red-600 bg-red-200 hover:border-red-800 hover:bg-red-300 text-red-600 dark:border-[#e24b4a] dark:bg-[#e24b4a]/20 dark:hover:bg-[#e24b4a]/30 dark:text-[#e24b4a]"
            }`}
          >
            {transaction.type}
          </span>
        </div>

        <div className="absolute top-2 right-3 flex flex-col gap-1">
          <FaPenAlt
            className="h-10 w-10 mr-3 p-2 hover:p-1.5 text-black dark:text-[#555577] hover:bg-gray-200 dark:hover:bg-[#6c63ff]/20 hover:text-blue-500 dark:hover:text-[#4f9eff] hover:border hover:border-gray-100 dark:hover:border-[#6c63ff]/30 rounded-lg cursor-pointer transition-colors"
            aria-label="edit-button"
            data-testid="FaPenAlt"
            onClick={() => setIsModalOpen(true)}
          />
          <FaTrashAlt
            className="h-10 w-10 mr-3 p-2 hover:p-1.5 text-black dark:text-[#555577] hover:bg-gray-200 dark:hover:bg-[#e24b4a]/20 hover:text-red-600 dark:hover:text-[#e24b4a] hover:border hover:border-gray-100 dark:hover:border-[#e24b4a]/30 rounded-lg cursor-pointer transition-colors"
            aria-label="delete-button"
            data-testid="FaTrashAlt"
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

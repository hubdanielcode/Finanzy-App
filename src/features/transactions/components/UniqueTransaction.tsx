import { LuDot } from "react-icons/lu";
import type { Transaction } from "../model/transactionTypes";
import { FaPenAlt, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Modal } from "./Modal";
import { ExpenseIcons, IncomeIcons } from "../model/categoryIcons";
import { useTransactionContext } from "../hooks/useTransactionContext";
import { motion } from "framer-motion";

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
  /* - Puxando do context - */

  const { handleDeleteTransaction, handleUpdateTransaction } =
    useTransactionContext();

  /* - Estados do modal - */

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  /* - Funções - */

  // 1. Atualiza os dados da transação escolhida

  const handleUpdate = (updated: Transaction) => {
    handleUpdateTransaction(updated);
    setIsModalOpen(false);
  };

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

  return (
    <div>
      <h1 className="text-gray-600/70 dark:text-[#555577] font-bold text-[clamp(0.8rem,1.1vw,1rem)] mb-1 pl-4s">
        {formattedDate}
      </h1>

      <motion.div
        className="relative bg-white dark:bg-[#1a1a2e] text-black dark:text-[#e2e2ef] flex items-center border border-gray-500/50 dark:border-white/10 shadow-none hover:shadow-sm hover:shadow-gray-900 dark:hover:shadow-[#e9d5ff] rounded-xl md:h-25 h-25 px-4 py-3 mb-6 w-87 md:w-full md:max-w-3xl"
        whileHover={{ scale: 1.02 }}
      >
        {/* - Ícone de categoria - */}

        <div
          className="hidden md:flex md:self-center md:justify-center md:items-center md:text-2xl bg-linear-to-br from-blue-400 via-indigo-400 to-purple-400 dark:from-[#6c63ff]/30 dark:via-[#4f46e5]/30 dark:to-[#a09cff]/30 dark:border dark:border-[#6c63ff]/30 md:rounded-full md:w-14 md:h-14 md:p-3 md:border border-gray-500/50"
          data-testid="category-icon"
        >
          <span className="flex justify-center items-center leading-none">
            {categoryIcon}
          </span>
        </div>

        {/* - Título e categoria - */}

        <div className="flex flex-col text-gray-700 dark:text-[#e2e2ef] font-bold text-[clamp(0.8rem,1.1vw,1rem)] ml-2 md:ml-4 md:px-4 px-2 md:py-2 py-1">
          {transaction.title}

          <div className="flex text-sm text-gray-600/70 dark:text-[#555577] font-semibold mt-2">
            <span>{transaction.category}</span>

            <LuDot className="hidden md:inline md:h-5 md:w-5" />

            <span className="hidden md:inline">{anotherFormattedDate}</span>
          </div>
        </div>

        {/* - Valor e badge - */}

        <div className="flex flex-col ml-auto px-4 md:px-6 lg:px-8 md:mr-35 items-end">
          <div
            className={`text-[clamp(0.8rem,1.1vw,1rem)] font-bold md:mb-3 mr-15 md:mr-0 max-w-40 truncate ${
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
            className={`md:text-sm text-xs border rounded-full px-2 font-bold w-fit mr-15 md:mr-0 ${
              transaction.type === "Entrada"
                ? "border-green-600 bg-green-200 hover:border-green-800 hover:bg-green-300 text-green-600 dark:border-[#1d9e75]/50 dark:bg-[#1d9e75]/20 dark:hover:bg-[#1d9e75]/30 dark:text-[#1d9e75]"
                : "border-red-600 bg-red-200 hover:border-red-800 hover:bg-red-300 text-red-600 dark:border-[#e24b4a]/50 dark:bg-[#e24b4a]/20 dark:hover:bg-[#e24b4a]/30 dark:text-[#e24b4a]"
            }`}
          >
            {transaction.type}
          </span>
        </div>

        {/* - Botões de ação - */}

        <div className="absolute top-3 right-3 flex md:flex-row flex-col gap-4 md:m-4">
          <FaPenAlt
            className="md:h-10 md:w-10 h-7 w-5 mr-3 md:mr-0 md:p-2 md:hover:p-1.5 text-black dark:text-[#555577] hover:bg-gray-200 dark:hover:bg-[#6c63ff]/30 hover:text-blue-600 dark:hover:text-[#4f9eff] dark:hover:border-[#6c63ff]/30 rounded-lg cursor-pointer transition-colors"
            aria-label="edit-button"
            data-testid="FaPenAlt"
            onClick={() => setIsModalOpen(true)}
          />

          <FaTrashAlt
            className="md:h-10 md:w-10 h-7 w-5 mr-3 md:mr-0 md:p-2 md:hover:p-1.5 text-black dark:text-[#555577] hover:bg-gray-200 dark:hover:bg-[#e24b4a]/30 hover:text-red-600 dark:hover:text-[#e24b4a] dark:hover:border-[#e24b4a]/30 rounded-lg cursor-pointer transition-colors"
            aria-label="delete-button"
            data-testid="FaTrashAlt"
            onClick={() => handleDeleteTransaction(transaction.id!)}
          />
        </div>
      </motion.div>

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

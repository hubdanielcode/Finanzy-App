import { X } from "lucide-react";
import { useState } from "react";
import type { Transaction } from "../model/transactionTypes";
import { motion } from "framer-motion";
import { regex, masks } from "@/shared";

interface ModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSubmit: (updatedTransaction: Transaction) => void;
  ExpenseOptions: string[];
  IncomeOptions: string[];
}

const Modal: React.FC<ModalProps> = ({
  transaction,
  onClose,
  onSubmit,
  ExpenseOptions,
  IncomeOptions,
}) => {
  /* - Estados da transação a ser editada - */

  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount);
  const [amountInput, setAmountInput] = useState(
    transaction.amount.toFixed(2).replace(".", ","),
  );
  const [category, setCategory] = useState(transaction.category);
  const [type, setType] = useState(transaction.type);
  const [date, setDate] = useState(transaction.date);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /* - Definições - */

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/80 dark:bg-black/90 z-3">
      <div
        className="flex flex-col bg-white dark:bg-[#1a1a2e] w-105 max-h-[95%] sm:h-fit sm:max-w-2xl rounded-xl border border-gray-500/50 dark:border-white/10 pt-2 relative mx-4 overflow-y-auto"
        role="dialog"
      >
        {/* - Título geral - */}

        <h1 className="flex w-full font-bold text-black dark:text-[#e2e2ef] text-xl sm:text-3xl justify-center mb-4 pt-2">
          Atualize a sua transação
        </h1>

        <motion.button
          className="absolute top-5 right-5 bg-gray-800 dark:bg-[#0f0f13] hover:bg-black dark:hover:bg-[#6c63ff]/30 text-white dark:text-[#a09cff] rounded-xl p-1 cursor-pointer border border-transparent dark:border-[#6c63ff]/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="close-modal"
          onClick={onClose}
        >
          <X size={25} />
        </motion.button>

        {/* - Título da transação - */}

        <div className="flex flex-col mb-2 px-10">
          <label className="flex flex-col text-gray-700 dark:text-[#aaaacc] font-semibold mb-2">
            Título
          </label>

          <input
            className="bg-gray-100 dark:bg-[#0f0f13] px-4 py-2 border border-gray-500/50 dark:border-white/10 rounded-lg w-full text-md outline-none font-normal placeholder:font-normal text-gray-700 dark:text-[#e2e2ef] dark:placeholder-[#555577]"
            type="text"
            value={title}
            onChange={(e) => setTitle(masks.title(e.target.value))}
            maxLength={30}
          />
        </div>

        {/* - Valor da transação - */}

        <div className="flex flex-col mb-2 px-10">
          <label className="flex flex-col text-gray-700 dark:text-[#aaaacc] font-semibold mb-2">
            Valor
          </label>

          <div className="bg-gray-100 dark:bg-[#0f0f13] flex px-4 py-2 border border-gray-500/50 dark:border-white/10 rounded-lg w-full text-sm outline-none pr-2 font-bold text-gray-700 dark:text-[#aaaacc]">
            R$:
            <input
              className="outline-none pl-2 font-normal placeholder:font-normal text-gray-700 dark:text-[#e2e2ef] dark:placeholder-[#555577] dark:bg-transparent w-full"
              type="text"
              pattern="[0-9]*[.,]?[0-9]{0,2}"
              inputMode="decimal"
              value={amountInput}
              onChange={(e) => {
                const value = e.target.value;

                if (!regex.amount.test(value)) return;
                if (value.includes("-")) return;

                setAmountInput(value);

                const raw = value.replace(",", ".");
                const parsed = parseFloat(raw);
                setAmount(isNaN(parsed) ? 0 : parsed);
              }}
              placeholder="0,00"
              required
            />
          </div>
        </div>

        {/* - Categoria da transação - */}

        <div className="flex flex-col mb-2 px-10 relative">
          <label className="text-gray-700 dark:text-[#aaaacc] font-semibold mb-2">
            Categoria
          </label>

          <input
            className="bg-gray-100 dark:bg-[#0f0f13] px-4 py-2 border border-gray-500/50 dark:border-white/10 rounded-lg w-full text-md outline-none text-gray-700 dark:text-[#e2e2ef] dark:placeholder-[#555577] cursor-pointer"
            type="text"
            value={category}
            placeholder="Selecione uma Categoria..."
            readOnly
            onClick={() => setIsOpen(!isOpen)}
          />

          {isOpen && (
            <ul className="absolute top-full left-10 right-10 mt-1 max-h-40 overflow-y-auto bg-white dark:bg-[#1e1e2e] border border-gray-300 dark:border-white/10 rounded-lg shadow-lg z-50">
              {(type === "Entrada" ? IncomeOptions : ExpenseOptions).map(
                (option) => (
                  <li
                    key={option}
                    className="px-4 py-2 text-gray-700 dark:text-[#aaaacc] hover:bg-gray-100 dark:hover:bg-[#6c63ff]/20 dark:hover:text-[#a09cff] cursor-pointer transition-colors"
                    onClick={() => {
                      setCategory(option);
                      setIsOpen(false);
                    }}
                  >
                    {option}
                  </li>
                ),
              )}
            </ul>
          )}
        </div>

        {/* - Data da transação - */}

        <div className="flex flex-col mb-2 px-10">
          <label className="flex flex-col text-gray-700 dark:text-[#aaaacc] font-semibold mb-2">
            Data
          </label>

          <input
            className="bg-gray-100 dark:bg-[#0f0f13] px-4 py-2 border border-gray-500/50 dark:border-white/10 rounded-lg w-full text-md outline-none font-normal text-gray-700 dark:text-[#e2e2ef] dark:placeholder-[#555577]"
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* - Botões - */}

        <div className="flex justify-around items-center mb-4 px-10">
          <motion.button
            className="flex bg-linear-to-r from-blue-600 to-indigo-600 dark:from-[#6c63ff] dark:to-[#4f46e5] font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 dark:hover:from-[#7c74ff] dark:hover:to-[#6560f0] text-white border border-gray-500/50 dark:border-[#6c63ff]/30 py-2 px-4 rounded-lg cursor-pointer transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!title.trim()) {
                alert("O título não pode ser vazio");
                return;
              }
              onSubmit({ ...transaction, title, amount, category, type, date });
            }}
          >
            Salvar
          </motion.button>

          <motion.button
            className="flex bg-linear-to-r from-blue-600 to-indigo-600 dark:from-[#6c63ff] dark:to-[#4f46e5] font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 dark:hover:from-[#7c74ff] dark:hover:to-[#6560f0] text-white border border-gray-500/50 dark:border-[#6c63ff]/30 py-2 px-4 rounded-lg cursor-pointer transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setTitle(transaction.title);
              setAmount(transaction.amount);
              setAmountInput(transaction.amount.toFixed(2).replace(".", ","));
              setCategory(transaction.category);
              setType(transaction.type);
              setDate(transaction.date);
            }}
          >
            Resetar
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export { Modal };

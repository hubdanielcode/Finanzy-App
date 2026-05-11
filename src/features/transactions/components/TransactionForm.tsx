import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  ExpenseOptions,
  IncomeOptions,
  TransactionTypeOptions,
} from "../model/transactionOptions";
import type {
  NewTransaction,
  TransactionType,
  Period,
} from "../model/transactionTypes";
import { calculatePeriod, formatTodayString } from "../../../shared/utils/date";
import { createTransaction } from "../services/transactionService";
import { supabase } from "../../../../supabase/supabase";
import { useTransactionContext } from "../hooks/useTransactionContext";
import { regex, masks } from "@/shared";
import { motion } from "framer-motion";
import { transactionFormVariants } from "../model/variants";

type Variant = "desktop" | "landscape" | "mobile";

export interface TransactionFormProps {
  variant: Variant;
  title: string;
  setTitle: (title: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  date: string;
  setDate: (date: string) => void;
  isMobileFormOpen?: boolean;
  setIsMobileFormOpen?: (open: boolean) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  variant,
  title,
  setTitle,
  amount,
  setAmount,
  date,
  setDate,
  isMobileFormOpen,
  setIsMobileFormOpen,
}) => {
  /* - Puxando do context - */

  const { fetchTransactions } = useTransactionContext();

  /* - Estados do form - */

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [formType, setFormType] = useState<"Entrada" | "Saída" | null>(null);

  /* - Definições - */

  const DropDownRef = useRef<HTMLDivElement | null>(null);
  const TypeRef = useRef<HTMLFormElement | null>(null);
  const todayString = formatTodayString();
  const isMobile = variant === "mobile";

  /* - Funções - */

  // 1. Abre o form limpo no mobile

  useEffect(() => {
    if (isMobile && isMobileFormOpen) {
      setFormType(null);
      setSelectedCategory("");
      setIsOpen(false);
    }
  }, [isMobile, isMobileFormOpen]);

  // 2. Fecha o erro ao clicar fora

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        DropDownRef.current &&
        !DropDownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }

      if (
        !isMobile &&
        TypeRef.current &&
        !TypeRef.current.contains(event.target as Node)
      ) {
        setFormType(null);
        setSelectedCategory("");
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  // 3. Insere o valor

  const handleAmountChange = (value: string) => {
    if (isMobile) {
      setAmount(value);
    } else if (regex.amount.test(value)) {
      setAmount(masks.amount(value));
    }
  };

  // 4. Marca a transação como "Entrada" ou "Saída", limpa o campo de categoria e fecha o dropdown

  const handleSelectType = (type: "Entrada" | "Saída") => {
    setFormType(type);
    setSelectedCategory("");
    setIsOpen(false);
  };

  // 5. Abre ou fecha a lista de categorias a depender do tipo escolhido"

  const handleToggleDropDown = () => {
    if (!formType) return;
    setIsOpen((prev) => !prev);
  };

  // 6. Envia o formulário e adiciona a transação desejada

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formType || !selectedCategory) {
      alert("Todos os campos são obrigatórios");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Usuário não autenticado");

    const newTransaction: NewTransaction = {
      title: title.trim(),
      amount: Number(amount.replace(",", ".")),
      type: formType.trim() as TransactionType,
      category: selectedCategory.trim(),
      date,
      period: calculatePeriod(date).trim() as Period,
    };

    try {
      await createTransaction(newTransaction);
      await fetchTransactions();

      setTitle("");
      setAmount("");
      setDate("");
      setFormType(null);
      setSelectedCategory("");
      setIsOpen(false);
      if (isMobile) setIsMobileFormOpen?.(false);
    } catch (error) {
      console.log("Erro ao criar transação:", error);
      alert(
        "Não foi possível adicionar a transação. Verifique os valores e tente novamente.",
      );
    }
  };

  const TransactionFrormVariant = {
    wrapper: transactionFormVariants.wrapper[variant],
    form: transactionFormVariants.form[variant],
    fieldWrapper: transactionFormVariants.fieldWrapper[variant],
    label: transactionFormVariants.label[variant],
  };

  /* - Botões de tipo - */

  const TypeButtons = isMobile ? (
    <div className="flex gap-4">
      {TransactionTypeOptions.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => handleSelectType(type)}
          className={`flex-1 py-2 rounded-lg border font-bold transition outline-none focus:outline-none ${
            formType === type
              ? type === "Entrada"
                ? "bg-green-100 dark:bg-[#1d9e75]/20 border-green-600 dark:border-[#1d9e75] text-green-600 dark:text-[#1d9e75]"
                : "bg-red-100 dark:bg-[#e24b4a]/20 border-red-600 dark:border-[#e24b4a] text-red-600 dark:text-[#e24b4a]"
              : "bg-gray-100 dark:bg-[#0f0f13] border-gray-500/50 dark:border-white/10 text-gray-700 dark:text-[#aaaacc]"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  ) : (
    <div className="flex gap-8 sm:gap-4 justify-center mb-4">
      <motion.button
        className={`font-bold py-2 px-4 w-45 h-12 rounded-lg border cursor-pointer transition-colors ${
          formType === "Entrada"
            ? "bg-green-100 dark:bg-[#1d9e75]/20 text-green-600 dark:text-[#1d9e75] border-green-600 dark:border-[#1d9e75]"
            : "bg-gray-100 dark:bg-[#0f0f13] text-gray-700 dark:text-[#aaaacc] border-gray-500/50 dark:border-white/10 hover:bg-green-100 dark:hover:bg-[#1d9e75]/20 hover:text-green-600 dark:hover:text-[#1d9e75] hover:border-green-600 dark:hover:border-[#1d9e75]"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => handleSelectType("Entrada")}
      >
        Entrada
      </motion.button>

      <motion.button
        className={`font-bold py-2 px-4 w-45 h-12 rounded-lg border cursor-pointer transition-colors ${
          formType === "Saída"
            ? "bg-red-100 dark:bg-[#e24b4a]/20 text-red-600 dark:text-[#e24b4a] border-red-600 dark:border-[#e24b4a]"
            : "bg-gray-100 dark:bg-[#0f0f13] text-gray-700 dark:text-[#aaaacc] border-gray-500/50 dark:border-white/10 hover:bg-red-100 dark:hover:bg-[#e24b4a]/20 hover:text-red-600 dark:hover:text-[#e24b4a] hover:border-red-600 dark:hover:border-[#e24b4a]"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => handleSelectType("Saída")}
      >
        Saída
      </motion.button>
    </div>
  );

  return (
    <div className={TransactionFrormVariant.wrapper}>
      <form
        className={TransactionFrormVariant.form}
        ref={TypeRef}
        onSubmit={handleSubmit}
      >
        {/* - Cabeçalho - */}

        <div
          className={`flex items-center gap-3 ${
            isMobile ? "pb-4" : "md:w-full sm:max-w-70 flex py-2 mb-4 px-4 pt-6"
          }`}
        >
          <Plus
            className={
              isMobile
                ? "bg-linear-to-r from-blue-600 to-indigo-600 dark:from-[#6c63ff] dark:to-[#4f46e5] font-semibold shadow-lg text-white h-8 w-8 rounded-xl p-1"
                : "bg-blue-200 dark:bg-[#6c63ff]/20 mr-3 h-8 w-8 rounded-xl text-blue-600 dark:text-[#a09cff]"
            }
          />

          <h1 className="font-bold text-black dark:text-[#e2e2ef] text-2xl">
            Nova Transação
          </h1>

          {isMobile && (
            <button
              className="ml-auto bg-black dark:bg-[#0f0f13] dark:border dark:border-white/10 dark:hover:bg-[#6c63ff]/20 h-8 w-8 rounded-xl flex items-center justify-center text-white dark:text-[#a09cff] transition-colors"
              type="button"
              onClick={() => setIsMobileFormOpen?.(false)}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* - Título - */}

        <div className={TransactionFrormVariant.fieldWrapper}>
          <label className={TransactionFrormVariant.label}>Título</label>

          <input
            className="bg-gray-100 dark:bg-[#0f0f13] px-4 py-2 border border-gray-500/50 dark:border-white/10 rounded-lg w-full outline-none text-gray-700 dark:text-[#e2e2ef] placeholder-gray-400 dark:placeholder-[#555577]"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Salário, Aluguel, Supermercado..."
            maxLength={isMobile ? 20 : 30}
            required
          />
        </div>

        {/* - Valor - */}

        <div className={TransactionFrormVariant.fieldWrapper}>
          <label className={TransactionFrormVariant.label}>Valor</label>

          <div className="flex items-center bg-gray-100 dark:bg-[#0f0f13] border rounded-lg px-4 py-2 border-gray-500/50 dark:border-white/10 outline-none">
            <span className="font-bold text-gray-700 dark:text-[#aaaacc]">
              R$
            </span>

            <input
              className="pl-2 outline-none w-full bg-transparent text-gray-700 dark:text-[#e2e2ef] placeholder-gray-400 dark:placeholder-[#555577]"
              type="text"
              inputMode={isMobile ? "decimal" : undefined}
              pattern={isMobile ? "[0-9]*[.,]?[0-9]{0,2}" : undefined}
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>
        </div>

        {/* - Tipo - */}

        <div className={TransactionFrormVariant.fieldWrapper}>
          <label className={TransactionFrormVariant.label}>Tipo</label>
          {TypeButtons}
        </div>

        {/* - Categoria - */}

        <div
          className={TransactionFrormVariant.fieldWrapper}
          ref={DropDownRef}
        >
          <label className={TransactionFrormVariant.label}>Categoria</label>

          {isOpen && formType && (
            <ul className="bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-white/10 rounded-lg shadow-sm mb-2">
              {(formType === "Saída" ? ExpenseOptions : IncomeOptions).map(
                (option) => (
                  <li
                    className="px-4 py-2 text-gray-700 dark:text-[#aaaacc] hover:bg-gray-100 dark:hover:bg-[#6c63ff]/20 dark:hover:text-[#a09cff] cursor-pointer transition-colors"
                    key={option}
                    onClick={() => {
                      setSelectedCategory(option);
                      setIsOpen(false);
                    }}
                  >
                    {option}
                  </li>
                ),
              )}
            </ul>
          )}

          {!isOpen && (
            <input
              className="bg-gray-100 dark:bg-[#0f0f13] px-4 py-2 border border-gray-500/50 dark:border-white/10 rounded-lg w-full disabled:opacity-60 dark:disabled:opacity-30 outline-none text-gray-700 dark:text-[#e2e2ef] placeholder-gray-400 dark:placeholder-[#555577] cursor-pointer"
              type="text"
              value={selectedCategory}
              readOnly
              disabled={!formType}
              onClick={handleToggleDropDown}
              placeholder={
                formType
                  ? "Selecione uma categoria"
                  : "Selecione o tipo primeiro"
              }
              required
            />
          )}
        </div>

        {/* - Data - */}

        <div className={isMobile ? "" : "mb-6"}>
          <label className={TransactionFrormVariant.label}>Data</label>

          <input
            className="bg-gray-100 dark:bg-[#0f0f13] px-4 py-2 border border-gray-500/50 dark:border-white/10 rounded-lg w-full outline-none text-gray-700 dark:text-[#e2e2ef]"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayString}
            min="2020-01-01"
            required
          />
        </div>

        {/* - Botão Enviar - */}

        {isMobile ? (
          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 dark:from-[#6c63ff] dark:to-[#4f46e5] font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 dark:hover:from-[#7c74ff] dark:hover:to-[#6560f0] text-white py-2 rounded-lg transition-all"
          >
            Enviar
          </button>
        ) : (
          <motion.button
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 dark:from-[#6c63ff] dark:to-[#4f46e5] font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 dark:hover:from-[#7c74ff] dark:hover:to-[#6560f0] text-white rounded-lg h-12 mb-3 cursor-pointer transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enviar
          </motion.button>
        )}
      </form>
    </div>
  );
};

export { TransactionForm };

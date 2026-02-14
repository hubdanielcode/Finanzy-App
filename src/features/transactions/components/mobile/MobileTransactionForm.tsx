import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState, useContext } from "react";
import { TransactionContext } from "../../context/TransactionContext";
import {
  IncomeOptions,
  ExpenseOptions,
  TransactionTypeOptions,
} from "../../model/TransactionOptions";
import type {
  Period,
  NewTransaction,
  TransactionType,
} from "../../model/TransactionTypes";
import {
  calculatePeriod,
  formatTodayString,
} from "../../../../shared/utils/date";
import { createTransaction } from "../../services/transactionService";
import { supabase } from "../../../../supabase/supabase";

export interface TransactionFormProps {
  title: string;
  setTitle: (title: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  date: string;
  setDate: (date: string) => void;
  isMobileFormOpen: boolean;
  setIsMobileFormOpen: (isMobileFormOpen: boolean) => void;
}

const MobileTransactionForm: React.FC<TransactionFormProps> = ({
  title,
  setTitle,
  amount,
  setAmount,
  date,
  setDate,
  isMobileFormOpen,
  setIsMobileFormOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formType, setFormType] = useState<"Entrada" | "Saída" | null>(null);

  const DropDownRef = useRef<HTMLDivElement>(null);
  const FormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isMobileFormOpen) {
      setFormType(null);
      setSelectedCategory("");
      setIsOpen(false);
    }
  }, [isMobileFormOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        DropDownRef.current &&
        !DropDownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error("TransactionForm deve estar dentro do TransactionProvider");
  }
  const { fetchTransactions } = context;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formType || !selectedCategory) {
      alert("Todos os campos são obrigatórios");
      return;
    }

    const formattedType = formType.trim();
    const formattedCategory = selectedCategory.trim();
    const formattedPeriod = calculatePeriod(date).trim();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const newTransaction: NewTransaction = {
      title: title.trim(),
      amount: Number(amount.replace(",", ".")),
      type: formattedType as TransactionType,
      category: formattedCategory,
      date: date,
      period: formattedPeriod as Period,
    };

    console.log("Enviando para Supabase:", newTransaction);

    try {
      await createTransaction(newTransaction);
      await fetchTransactions();

      setTitle("");
      setAmount("");
      setDate("");
      setFormType(null);
      setSelectedCategory("");
      setIsOpen(false);
      setIsMobileFormOpen(false);
    } catch (error: any) {
      console.error("Erro ao criar transação:", error.message);
      alert(
        "Não foi possível adicionar a transação. Verifique os valores e tente novamente.",
      );
    }
  };

  const todayString = formatTodayString();

  return (
    <div className="fixed inset-0 z-1 sm:hidden bg-white">
      <form
        className="flex flex-col gap-4 h-full overflow-y-auto px-4 py-6 w-screen"
        ref={FormRef}
        onSubmit={handleSubmit}
      >
        {/* - Cabeçalho - */}

        <div className="flex items-center gap-3 pb-4">
          <Plus className="bg-linear-to-r from-blue-600 to-indigo-600 font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 text-white h-8 w-8 rounded-xl p-1" />
          <h1 className="font-bold text-2xl text-black">Nova Transação</h1>
          <button
            className="ml-auto bg-black h-8 w-8 rounded-xl flex items-center justify-center text-white"
            type="button"
            onClick={() => setIsMobileFormOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* - Título - */}

        <div>
          <label className="text-gray-700 font-semibold mb-1 block">
            Título
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 border-gray-500/50"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Salário, Aluguel..."
            maxLength={20}
            required
          />
        </div>

        {/* - Valor - */}

        <div>
          <label className="text-gray-700 font-semibold mb-1 block">
            Valor
          </label>
          <div className="flex items-center bg-gray-100 border rounded-lg px-4 py-2 border-gray-500/50">
            <span className="font-bold text-gray-700">R$</span>
            <input
              className="pl-2 outline-none w-full bg-transparent"
              type="text"
              pattern="[0-9]*[.,]?[0-9]{0,2}"
              inputMode="decimal"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>
        </div>

        {/* - Tipo - */}

        <div>
          <label className="text-gray-700 font-semibold mb-1 block">Tipo</label>
          <div className="flex gap-4">
            {TransactionTypeOptions.map((type) => (
              <button
                className={`flex-1 py-2 rounded-lg border font-bold transition outline-none focus:outline-none ${
                  formType === type
                    ? type === "Entrada"
                      ? "bg-green-100 border-green-600 text-green-600"
                      : "bg-red-100 border-red-600 text-red-600"
                    : "bg-gray-100 border-gray-500/50 text-gray-700"
                }`}
                key={type}
                type="button"
                onClick={() => {
                  setFormType(type);
                  setSelectedCategory("");
                  setIsOpen(false);
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* - Categoria - */}

        <div ref={DropDownRef}>
          <label className="text-gray-700 font-semibold mb-1 block">
            Categoria
          </label>
          {isOpen && formType && (
            <ul className="bg-white shadow-sm">
              {(formType === "Entrada" ? IncomeOptions : ExpenseOptions).map(
                (option) => (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
              className="w-full px-4 py-2 rounded-lg border border-gray-500/50 bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
              type="text"
              value={selectedCategory}
              readOnly
              disabled={!formType}
              placeholder={
                formType
                  ? "Selecione uma categoria"
                  : "Selecione o tipo primeiro"
              }
              onClick={() => formType && setIsOpen(true)}
              required
            />
          )}
        </div>

        {/* - Data - */}

        <div>
          <label className="text-gray-700 font-semibold mb-1 block">Data</label>
          <input
            className="w-full px-4 py-2 border border-gray-500/50 rounded-lg bg-gray-100"
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayString}
            min="2020-01-01"
          />
        </div>

        <button
          className="w-full bg-linear-to-r from-blue-600 to-indigo-600 font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 text-white py-2 rounded-lg"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export { MobileTransactionForm };

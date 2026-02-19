import { Plus } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ExpenseOptions,
  IncomeOptions,
} from "../../../model/TransactionOptions";
import type {
  NewTransaction,
  TransactionType,
  Period,
} from "../../../model/TransactionTypes";
import {
  calculatePeriod,
  formatTodayString,
} from "../../../../../shared/utils/date";
import { createTransaction } from "../../../services/transactionService";
import { TransactionContext } from "../../../context/TransactionContext";
import { supabase } from "../../../../../supabase/supabase";

export interface TransactionFormProps {
  title: string;
  setTitle: (title: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  date: string;
  setDate: (date: string) => void;
}

const LandscapeTransactionForm: React.FC<TransactionFormProps> = ({
  title,
  setTitle,
  amount,
  setAmount,
  date,
  setDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formType, setFormType] = useState<"Entrada" | "Saída" | null>(null);

  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const typeRef = useRef<HTMLFormElement | null>(null);

  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error("TransactionForm deve estar dentro do TransactionProvider");
  }

  const { fetchTransactions } = context;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }

      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setFormType(null);
        setSelectedCategory("");
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAmountChange = (value: string) => {
    if (/^[0-9.,]*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSelectIncome = () => {
    setFormType("Entrada");
    setSelectedCategory("");
    setIsOpen(false);
  };

  const handleSelectExpense = () => {
    setFormType("Saída");
    setSelectedCategory("");
    setIsOpen(false);
  };

  const handleToggleDropDown = () => {
    if (!formType) return;
    setIsOpen((prev) => !prev);
  };

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

    try {
      await createTransaction(newTransaction);
      await fetchTransactions();

      setTitle("");
      setAmount("");
      setDate("");
      setFormType(null);
      setSelectedCategory("");
      setIsOpen(false);
    } catch (error) {
      console.log("Erro ao criar transação:", error);
      alert(
        "Não foi possível adicionar a transação. Verifique os valores e tente novamente.",
      );
    }
  };

  const todayString = formatTodayString();

  return (
    <div>
      <form
        className="hidden sm:block mx-auto bg-white border border-gray-500/50 rounded-xl text-black max-w-7xl mt-8 mb-7 py-2 w-full sm:max-w-2xl lg:max-w-4xl
 px-8 sticky top-6"
        ref={typeRef}
        onSubmit={handleSubmit}
      >
        {/* - Cabeçalho - */}

        <div className="w-full flex items-center mb-6">
          <Plus className="bg-blue-200 mr-3 h-8 w-8 rounded-xl text-blue-600" />
          <h1 className="font-bold text-2xl">Nova Transação</h1>
        </div>

        {/* - Título - */}

        <div className="mb-4">
          <label className="text-gray-700 font-semibold mb-2 block">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Salário, Aluguel, Supermercado..."
            maxLength={30}
            required
            className="bg-gray-100 px-4 py-2 border border-gray-500/50 rounded-lg w-full outline-none"
          />
        </div>

        {/* - Valor - */}

        <div className="mb-4">
          <label className="text-gray-700 font-semibold mb-2 block">
            Valor
          </label>
          <div className="flex items-center bg-gray-100 border rounded-lg px-4 py-2 border-gray-500/50">
            <span className="font-bold text-gray-700">R$</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0,00"
              required
              className="pl-2 outline-none w-full bg-transparent"
            />
          </div>
        </div>

        {/* - Tipo - */}

        <div className="mb-4">
          <label className="text-gray-700 font-semibold mb-2 block">Tipo</label>
          <div className="flex gap-6 justify-center mb-4">
            <button
              type="button"
              onClick={handleSelectIncome}
              className={`font-bold py-2 px-6 h-12 rounded-lg border transition ${
                formType === "Entrada"
                  ? "bg-green-100 text-green-600 border-green-600"
                  : "bg-gray-100 text-gray-700 border-gray-500/50 hover:bg-green-100 hover:text-green-600 hover:border-green-600"
              }`}
            >
              Entrada
            </button>
            <button
              type="button"
              onClick={handleSelectExpense}
              className={`font-bold py-2 px-6 h-12 rounded-lg border transition ${
                formType === "Saída"
                  ? "bg-red-100 text-red-600 border-red-600"
                  : "bg-gray-100 text-gray-700 border-gray-500/50 hover:bg-red-100 hover:text-red-600 hover:border-red-600"
              }`}
            >
              Saída
            </button>
          </div>
        </div>

        {/* - Categoria - */}

        <div
          className="mb-4"
          ref={dropDownRef}
        >
          <label className="text-gray-700 font-semibold mb-2 block">
            Categoria
          </label>
          {isOpen && (
            <ul className="bg-white border rounded-lg shadow-sm mb-2">
              {(formType === "Saída" ? ExpenseOptions : IncomeOptions).map(
                (option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setSelectedCategory(option);
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {option}
                  </li>
                ),
              )}
            </ul>
          )}
          {!isOpen && (
            <input
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
              className="bg-gray-100 px-4 py-2 border border-gray-500/50 rounded-lg w-full disabled:opacity-60 outline-none"
            />
          )}
        </div>

        {/* - Data - */}

        <div className="mb-6">
          <label className="text-gray-700 font-semibold mb-2 block">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayString}
            min="2020-01-01"
            required
            className="bg-gray-100 px-4 py-2 border border-gray-500/50 rounded-lg w-full outline-none"
          />
        </div>

        <button className="w-full bg-linear-to-r from-blue-600 to-indigo-600 font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg h-12 transition">
          Enviar
        </button>
      </form>
    </div>
  );
};

export { LandscapeTransactionForm };

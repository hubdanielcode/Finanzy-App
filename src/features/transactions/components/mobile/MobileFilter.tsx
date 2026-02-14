import { Funnel, X } from "lucide-react";
import type { Transaction } from "../../model/TransactionTypes";
import {
  ExpenseOptions,
  IncomeOptions,
  PeriodOptions,
  TransactionTypeOptions,
} from "../../model/TransactionOptions";
import { FaSearch } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredTransactions: Transaction[];
  type: "Entrada" | "Saída" | null;
  setType: (type: "Entrada" | "Saída" | null) => void;
  period: Transaction["period"] | null;
  setPeriod: (period: Transaction["period"] | null) => void;
  category: string;
  setCategory: (category: string) => void;
  isMobileTransactionListOpen: boolean;
  setIsMobileTransactionListOpen: (isMobileTransactionOpen: boolean) => void;
}

const MobileFilter: React.FC<FilterProps> = ({
  searchQuery,
  setSearchQuery,
  filteredTransactions,
  type,
  setType,
  setPeriod,
  setCategory,
  setIsMobileTransactionListOpen,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [open, setOpen] = useState<"period" | "type" | "category" | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearFilters = () => {
    setSearchQuery("");

    setSelectedPeriod("");
    setSelectedType("");
    setSelectedCategory("");

    setType(null);
    setPeriod(null);
    setCategory("");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-4 mt-6 bg-white">
        <Funnel className="bg-blue-100 h-8 w-8 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 text-white p-1.5 ml-4" />
        <h1 className="font-bold text-2xl text-black bg-white">
          Nova Transação
        </h1>
        <button
          className="absolute right-4 top-6 bg-black h-8 w-8 rounded-xl flex items-center justify-center text-white"
          type="button"
          onClick={() => setIsMobileTransactionListOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col sm:mt-8 bg-white sm:rounded-xl mx-auto w-full max-w-5xl">
        {/* - Searchbar - */}

        <div className="flex items-center gap-3 h-20 px-4">
          <div className="flex items-center bg-gray-100 h-12 w-full border border-gray-500/50 rounded-xl px-4">
            <FaSearch
              className="text-gray-700"
              size={16}
            />
            <input
              className="w-full outline-none text-gray-700 ml-2 bg-transparent"
              type="text"
              placeholder="Buscar transação por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* - Botão de abrir os filtros (só existe no desktop) - */}

          <button
            className="hidden sm:flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 text-white h-11 px-4 rounded-lg transition-colors"
            onClick={() => setIsFilterOpen((prev) => !prev)}
          >
            <Funnel className="bg-linear-to-r from-blue-600 to-indigo-600 font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 text-white h-8 w-8 rounded-xl p-1" />
            Filtros
          </button>
        </div>

        {/* - Inputs - */}

        <div
          ref={filterRef}
          className={`grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 ${
            isFilterOpen ? "block" : "block sm:hidden"
          }`}
        >
          {/* - Período - */}

          <div className="relative">
            <label className="font-semibold text-gray-700 mb-1 block">
              Período
            </label>
            <input
              readOnly
              value={selectedPeriod}
              placeholder="Todos os períodos"
              className="w-full h-12 bg-gray-100 border border-gray-500/50 rounded-xl px-4 cursor-pointer"
              onClick={() => setOpen(open === "period" ? null : "period")}
            />

            {open === "period" && (
              <ul className="absolute z-1 mt-2 w-full bg-white border rounded-xl shadow max-h-60 overflow-y-auto">
                {PeriodOptions.map((option) => (
                  <li
                    key={option}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-200"
                    onClick={() => {
                      setSelectedPeriod(option);
                      setPeriod(option);
                      setOpen(null);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* - Tipo - */}

          <div className="relative">
            <label className="font-semibold text-gray-700 mb-1 block">
              Tipo
            </label>
            <input
              readOnly
              value={selectedType}
              placeholder="Todos os tipos"
              className="w-full h-12 bg-gray-100 border border-gray-500/50 rounded-xl px-4 cursor-pointer"
              onClick={() => setOpen(open === "type" ? null : "type")}
            />

            {open === "type" && (
              <ul className="absolute z-1 mt-2 w-full bg-white border rounded-xl shadow">
                {TransactionTypeOptions.map((option) => (
                  <li
                    key={option}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-200"
                    onClick={() => {
                      setSelectedType(option);
                      setType(option);
                      setSelectedCategory("");
                      setCategory("");
                      setOpen(null);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* - Categoria - */}

          <div className="relative">
            <label className="font-semibold text-gray-700 mb-1 block">
              Categoria
            </label>
            <input
              readOnly
              value={selectedCategory}
              placeholder="Todas as categorias"
              className="w-full h-12 bg-gray-100 border border-gray-500/50 rounded-xl px-4 cursor-pointer"
              onClick={() => setOpen(open === "category" ? null : "category")}
            />

            {open === "category" && (
              <ul className="absolute z-1 mt-2 w-full bg-white border rounded-xl shadow max-h-72 overflow-y-auto">
                {type !== "Saída" && (
                  <>
                    <li className="px-4 py-2 font-semibold bg-black text-white">
                      Entrada
                    </li>
                    {IncomeOptions.map((option) => (
                      <li
                        key={option}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-200"
                        onClick={() => {
                          setSelectedCategory(option);
                          setCategory(option);
                          setOpen(null);
                        }}
                      >
                        {option}
                      </li>
                    ))}
                  </>
                )}

                {type !== "Entrada" && (
                  <>
                    <li className="px-4 py-2 font-semibold bg-black text-white">
                      Saída
                    </li>
                    {ExpenseOptions.map((option) => (
                      <li
                        key={option}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-200"
                        onClick={() => {
                          setSelectedCategory(option);
                          setCategory(option);
                          setOpen(null);
                        }}
                      >
                        {option}
                      </li>
                    ))}
                  </>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* - Footer - */}

        <div className="flex py-4 border-b w-screen border-gray-500/50">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 font-semibold text-gray-600 hover:text-black"
          >
            <X />
            Limpar filtros
          </button>

          <p className="font-semibold text-gray-700 flex flex-1 justify-center items-center">
            <span className="text-blue-600 pr-2">
              {filteredTransactions.length}
            </span>
            {filteredTransactions.length === 1
              ? "Transação encontrada"
              : "Transações encontradas"}
          </p>
        </div>
      </div>
    </>
  );
};

export { MobileFilter };

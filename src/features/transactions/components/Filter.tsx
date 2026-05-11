import { Funnel, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import type { Transaction } from "../model/transactionTypes";
import { IncomeOptions, ExpenseOptions } from "../model/transactionOptions";
import {
  TransactionTypeOptions,
  PeriodOptions,
} from "../model/transactionOptions";
import { motion } from "framer-motion";

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
}

const Filter: React.FC<FilterProps> = ({
  searchQuery,
  setSearchQuery,
  filteredTransactions,
  type,
  setType,
  setPeriod,
  setCategory,
}) => {
  /* - Estados de categoria - */

  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  /* - Estados de tipo - */

  const [isTypeOpen, setIsTypeOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("");

  /* - Estados de período - */

  const [isPeriodOpen, setIsPeriodOpen] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  /* - Estados de filtro - */

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  /* - Definições - */

  const filterRef = useRef<HTMLDivElement | null>(null);

  /* - Funções - */

  // 1. Limpa os filtros

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedPeriod("");
    setSelectedType("");
    setSelectedCategory("");
    setType(null);
    setPeriod(null);
    setCategory("");
  };

  // 2. Fecha o erro ao clicar fora

  useEffect(() => {
    const handleClickAnywhere = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
        setIsPeriodOpen(false);
        setIsTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickAnywhere);
    return () => document.removeEventListener("mousedown", handleClickAnywhere);
  }, [isCategoryOpen, isPeriodOpen, isTypeOpen]);

  return (
    <>
      <div className="flex flex-col mt-8 mb-4 px-4 md:px-6 lg:px-8 bg-white dark:bg-[#1a1a2e] w-full h-fit rounded-xl text-md border border-gray-500/50 dark:border-white/10 mx-auto">
        {/* - Searchbar - */}

        <div className="flex items-center gap-3 h-20 mt-6">
          <div className="flex items-center bg-gray-100 dark:bg-[#0f0f13] h-12 w-full border border-gray-300 dark:border-white/10 rounded-xl px-4 text-md">
            <FaSearch
              className="text-gray-400 dark:text-[#555577]"
              size={16}
            />

            <input
              className="w-full outline-none bg-transparent text-gray-700 dark:text-[#e2e2ef] text-md placeholder-gray-400 dark:placeholder-[#555577] ml-2"
              type="text"
              placeholder="Buscar transação por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <motion.button
            className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-[#6c63ff] dark:to-[#4f46e5] shadow-lg hover:from-blue-500 hover:to-indigo-500 dark:hover:from-[#7c74ff] dark:hover:to-[#6560f0] text-white h-11 px-4 rounded-lg font-semibold transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Funnel size={14} />
            Filtros
          </motion.button>
        </div>

        {/* - Inputs - */}

        {isFilterOpen && (
          <div
            className="grid grid-cols-3 mt-6 relative gap-3"
            ref={filterRef}
          >
            {/* - Período - */}

            <div className="full relative">
              <label className="text-gray-700 dark:text-[#aaaacc] font-semibold mb-2 block">
                Período
              </label>

              <input
                className="w-full bg-gray-100 dark:bg-[#0f0f13] h-12 border border-gray-300 dark:border-white/10 rounded-xl px-4 cursor-pointer text-md text-gray-700 dark:text-[#e2e2ef] placeholder-gray-400 dark:placeholder-[#555577] outline-none"
                type="text"
                placeholder="Todos os períodos"
                value={selectedPeriod}
                readOnly
                onClick={() => {
                  setIsPeriodOpen((prev) => !prev);
                  setIsTypeOpen(false);
                  setIsCategoryOpen(false);
                }}
              />

              {isPeriodOpen && (
                <ul className="absolute z-1 mt-2 w-full bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {PeriodOptions.map((option) => (
                    <li
                      className="px-4 py-2 text-md text-gray-700 dark:text-[#aaaacc] cursor-pointer hover:bg-blue-200 dark:hover:bg-[#6c63ff]/20 hover:text-blue-600 dark:hover:text-[#a09cff] transition-colors"
                      key={option}
                      onClick={() => {
                        setSelectedPeriod(option);
                        setPeriod(option);
                        setIsPeriodOpen(false);
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* - Tipo - */}

            <div className="w-full relative">
              <label className="text-gray-700 dark:text-[#aaaacc] font-semibold mb-2 block">
                Tipo
              </label>

              <input
                className="w-full bg-gray-100 dark:bg-[#0f0f13] h-12 border border-gray-300 dark:border-white/10 rounded-xl px-4 cursor-pointer text-md text-gray-700 dark:text-[#e2e2ef] placeholder-gray-400 dark:placeholder-[#555577] outline-none"
                type="text"
                placeholder="Todos os tipos"
                value={selectedType}
                readOnly
                onClick={() => {
                  setIsTypeOpen((prev) => !prev);
                  setIsPeriodOpen(false);
                  setIsCategoryOpen(false);
                }}
              />

              {isTypeOpen && (
                <ul className="absolute z-1 mt-2 w-full bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg">
                  {TransactionTypeOptions.map((option) => (
                    <li
                      className="px-4 py-2 text-md text-gray-700 dark:text-[#aaaacc] cursor-pointer hover:bg-blue-200 dark:hover:bg-[#6c63ff]/20 hover:text-blue-600 dark:hover:text-[#a09cff] transition-colors"
                      key={option}
                      onClick={() => {
                        setSelectedType(option);
                        setType(option);
                        setIsTypeOpen(false);
                        setCategory("");
                        setSelectedCategory("");
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* - Categoria - */}

            <div className="w-full relative">
              <label className="text-gray-700 dark:text-[#aaaacc] font-semibold mb-2 block">
                Categoria
              </label>

              <input
                className="w-full bg-gray-100 dark:bg-[#0f0f13] h-12 border border-gray-300 dark:border-white/10 rounded-xl px-4 cursor-pointer text-md text-gray-700 dark:text-[#e2e2ef] placeholder-gray-400 dark:placeholder-[#555577] outline-none"
                type="text"
                placeholder="Todas as categorias"
                value={selectedCategory}
                readOnly
                onClick={() => {
                  setIsCategoryOpen((prev) => !prev);
                  setIsPeriodOpen(false);
                  setIsTypeOpen(false);
                }}
              />

              {isCategoryOpen && (
                <ul className="absolute z-1 mt-2 w-full bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg max-h-72 overflow-y-auto">
                  {type !== "Saída" && (
                    <>
                      <span className="block px-4 py-2 text-md font-semibold tracking-wide text-white bg-black dark:bg-[#6c63ff]/30 dark:text-[#a09cff]">
                        Entrada
                      </span>
                      {IncomeOptions.map((option) => (
                        <li
                          key={option}
                          className="px-4 py-2 text-sm text-gray-700 dark:text-[#aaaacc] cursor-pointer hover:bg-blue-200 dark:hover:bg-[#6c63ff]/20 hover:text-blue-600 dark:hover:text-[#a09cff] transition-colors"
                          onClick={() => {
                            setSelectedCategory(option);
                            setCategory(option);
                            setIsCategoryOpen(false);
                            setType("Entrada");
                            setSelectedType("Entrada");
                          }}
                        >
                          {option}
                        </li>
                      ))}
                    </>
                  )}

                  {type !== "Entrada" && (
                    <>
                      <span className="block px-4 py-2 text-md font-semibold tracking-wide text-white bg-black dark:bg-[#e24b4a]/20 dark:text-[#e24b4a]">
                        Saída
                      </span>
                      {ExpenseOptions.map((option) => (
                        <li
                          key={option}
                          className="px-4 py-2 text-sm text-gray-700 dark:text-[#aaaacc] cursor-pointer hover:bg-blue-200 dark:hover:bg-[#6c63ff]/20 hover:text-blue-600 dark:hover:text-[#a09cff] transition-colors"
                          onClick={() => {
                            setSelectedCategory(option);
                            setCategory(option);
                            setIsCategoryOpen(false);
                            setType("Saída");
                            setSelectedType("Saída");
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
        )}

        {/* - Footer - */}

        <div className="flex justify-between items-center py-4 pb-6">
          <motion.button
            className="flex items-center font-semibold text-gray-600 dark:text-[#555577] hover:text-black dark:hover:text-[#aaaacc] cursor-pointer transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearFilters}
          >
            <X className="mr-2" />
            Limpar Filtros
          </motion.button>

          <p className="font-semibold text-md text-gray-700 dark:text-[#aaaacc]">
            <span className="text-blue-600 dark:text-[#a09cff] mr-2">
              {filteredTransactions.length}
            </span>
            {filteredTransactions.length === 1
              ? "Transação Encontrada"
              : "Transações Encontradas"}
          </p>
        </div>
      </div>
    </>
  );
};

export { Filter };

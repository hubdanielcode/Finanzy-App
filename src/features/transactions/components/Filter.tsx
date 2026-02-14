import { Funnel, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import type { Transaction } from "../model/TransactionTypes";
import { IncomeOptions, ExpenseOptions } from "../model/TransactionOptions";
import {
  TransactionTypeOptions,
  PeriodOptions,
} from "../model/TransactionOptions";

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
  const handleClearFilters: any = () => {
    setSearchQuery("");

    setSelectedPeriod("");
    setSelectedType("");
    setSelectedCategory("");

    setType(null);
    setPeriod(null);
    setCategory("");
  };

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement | null>(null);

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

    return () => {
      document.removeEventListener("mousedown", handleClickAnywhere);
    };
  }, [isCategoryOpen, isPeriodOpen, isTypeOpen]);

  return (
    <>
      <div className="flex flex-col mt-8 mb-4 px-8 mr-10 bg-white w-202 h-fit rounded-xl text-md border border-gray-500/50 mx-auto">
        {/* - Searchbar - */}

        <div className="flex items-center gap-3 h-20 mt-6">
          <div className="flex items-center bg-gray-100 h-12 w-full border border-gray-300 rounded-xl px-4 text-md">
            <FaSearch
              className="text-gray-400"
              size={16}
            />
            <input
              className="w-full outline-none text-gray-700 text-md placeholder-gray-400 ml-2"
              type="text"
              placeholder="Buscar transação por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 shadow-lg hover:from-blue-500 hover:to-indigo-500 text-white h-11 px-4 rounded-lg font-semibold transition-colors cursor-pointer"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Funnel size={14} />
            Filtros
          </button>
        </div>

        {/* - Inputs - */}

        {isFilterOpen && (
          <div
            className="grid grid-cols-3 mt-6 relative"
            ref={filterRef}
          >
            {/* - Período - */}

            <div className="mx-3 w-60 relative">
              <label className="text-gray-700 font-semibold mb-2 block">
                Período
              </label>

              <input
                className="w-full bg-gray-100 h-12 border border-gray-300 rounded-xl px-4 cursor-pointer text-md text-gray-700 outline-none"
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
                <ul className="absolute z-1 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {PeriodOptions.map((option) => (
                    <li
                      className="px-4 py-2 text-md text-gray-700 cursor-pointer hover:bg-blue-200 hover:text-blue-600 transition-colors"
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

            <div className="mx-3 w-60 relative">
              <label className="text-gray-700 font-semibold mb-2 block">
                Tipo
              </label>

              <input
                className="w-full bg-gray-100 h-12 border border-gray-300 rounded-xl px-4 cursor-pointer text-md text-gray-700 outline-none"
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
                <ul className="absolute z-1 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg">
                  {TransactionTypeOptions.map((option) => (
                    <li
                      className="px-4 py-2 text-md text-gray-700 cursor-pointer hover:bg-blue-200 hover:text-blue-600 transition-colors"
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

            <div className="mx-3 w-60 relative">
              <label className="text-gray-700 font-semibold mb-2 block">
                Categoria
              </label>

              <input
                className="w-full bg-gray-100 h-12 border border-gray-300 rounded-xl px-4 cursor-pointer text-md text-gray-700 outline-none"
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
                <ul className="absolute z-1 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
                  {type !== "Saída" && (
                    <>
                      <span className="block px-4 py-2 text-md font-semibold tracking-wide text-white bg-black">
                        Entrada
                      </span>
                      {IncomeOptions.map((option) => (
                        <li
                          key={option}
                          className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-200 hover:text-blue-600 transition-colors"
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
                      <span className="block px-4 py-2 text-md font-semibold tracking-wide text-white bg-black">
                        Saída
                      </span>
                      {ExpenseOptions.map((option) => (
                        <li
                          key={option}
                          className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-200 hover:text-blue-600 transition-colors"
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
          <div
            onClick={handleClearFilters}
            className="flex items-center font-semibold text-gray-600 hover:text-black cursor-pointer transition-colors"
          >
            <X className="mr-2" />
            Limpar Filtros
          </div>

          <p className="font-semibold text-md text-gray-700">
            <span className="text-blue-600 mr-2">
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

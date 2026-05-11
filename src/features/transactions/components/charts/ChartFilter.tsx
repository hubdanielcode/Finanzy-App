import { Funnel } from "lucide-react";
import { PeriodOptions } from "../../model/transactionOptions";
import type { Period } from "../../model/transactionTypes";
import { useRef } from "react";
import { motion } from "framer-motion";

interface CategoryPieChartFilterProps {
  period: Period | undefined;
  setPeriod: (period: Period | undefined) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface MonthlyBarChartFilterProps {
  year: number | undefined;
  setYear: (year: number | undefined) => void;
  years: number[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CategoryPieChartFilter: React.FC<CategoryPieChartFilterProps> = ({
  period,
  setPeriod,
  isOpen,
  setIsOpen,
}) => {
  const filterRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="relative"
      ref={filterRef}
    >
      <motion.button
        className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-[#6c63ff] dark:to-[#4f46e5] shadow-lg hover:from-blue-500 hover:to-indigo-500 dark:hover:from-[#7c74ff] dark:hover:to-[#6560f0] text-white h-8 sm:h-11 px-2 sm:px-4 rounded-lg font-semibold transition-colors cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Funnel size={14} />
        Filtros
      </motion.button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-10 bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden min-w-48">
          <motion.button
            className="w-full text-left px-4 py-2 text-sm cursor-pointer font-medium text-gray-500 dark:text-[#aaaacc] hover:bg-gray-50 dark:hover:bg-[#6c63ff]/20 dark:hover:text-[#a09cff] transition-colors border-b border-gray-100 dark:border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setPeriod(undefined);
              setIsOpen(false);
            }}
          >
            Todos os períodos
          </motion.button>

          <ul>
            {PeriodOptions.map((option) => (
              <li
                key={option}
                className={`px-4 py-2 text-md cursor-pointer transition-colors hover:bg-blue-200 dark:hover:bg-[#6c63ff]/20 hover:text-blue-600 dark:hover:text-[#a09cff] ${
                  period === option
                    ? "bg-purple-200 dark:bg-[#6c63ff]/30 text-purple-600 dark:text-[#a09cff] font-semibold"
                    : "text-gray-700 dark:text-[#aaaacc]"
                }`}
                onClick={() => {
                  setPeriod(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/* - Filtro que regula MonthlyBar e BalanceLine separadamente - */

const YearFilter: React.FC<MonthlyBarChartFilterProps> = ({
  year,
  setYear,
  years,
  isOpen,
  setIsOpen,
}) => {
  const filterRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="relative"
      ref={filterRef}
    >
      <motion.button
        className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-[#6c63ff] dark:to-[#4f46e5] shadow-lg hover:from-blue-500 hover:to-indigo-500 dark:hover:from-[#7c74ff] dark:hover:to-[#6560f0] text-white h-8 sm:h-11 px-2 sm:px-4 rounded-lg font-semibold transition-colors cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Funnel size={14} />
        Filtros
      </motion.button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-10 bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden min-w-48">
          <motion.button
            className="w-full text-left px-4 py-2 text-sm cursor-pointer font-medium text-gray-500 dark:text-[#aaaacc] hover:bg-gray-50 dark:hover:bg-[#6c63ff]/20 dark:hover:text-[#a09cff] transition-colors border-b border-gray-100 dark:border-white/10"
            onClick={() => {
              setYear(undefined);
              setIsOpen(false);
            }}
          >
            Todos os anos
          </motion.button>

          <ul>
            {years.map((option) => (
              <li
                key={option}
                className={`px-4 py-2 text-md cursor-pointer transition-colors hover:bg-blue-200 dark:hover:bg-[#6c63ff]/20 hover:text-blue-600 dark:hover:text-[#a09cff] ${
                  year === option
                    ? "bg-purple-200 dark:bg-[#6c63ff]/30 text-purple-600 dark:text-[#a09cff] font-semibold"
                    : "text-gray-700 dark:text-[#aaaacc]"
                }`}
                onClick={() => {
                  setYear(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const MonthlyBarChartFilter = YearFilter;
export const BalanceLineChartFilter = YearFilter;

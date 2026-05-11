import { X, ChartColumnDecreasing } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { CategoryPieChart, BalanceLineChart, MonthlyBarChart } from "../..";
import { useBalanceChartData } from "../../hooks/useBalanceChartData";
import { useYearlyChartData } from "../../hooks/useYearlyChartData";
import { useCategoryChartData } from "../../hooks/useCategoryChartData";
import {
  MonthlyBarChartFilter,
  CategoryPieChartFilter,
  BalanceLineChartFilter,
} from "./ChartFilter";
import type { Period } from "../../model/transactionTypes";
import { useTransactionContext } from "../../hooks/useTransactionContext";
import { motion } from "framer-motion";
import { useMobileContext } from "../../hooks/useMobileContext";

const ChartsSection = () => {
  /* - Puxando do context - */

  const { transactions } = useTransactionContext();
  const { isMobileChartOpen, setIsMobileChartOpen } = useMobileContext();

  /* - Estados do BalanceLineChart - */

  const [lineYear, setLineYear] = useState<number | undefined>(undefined);
  const [isBalanceFilterOpen, setIsBalanceFilterOpen] = useState(false);

  /* - Estados do CategoryPieChart - */

  const [expensePeriod, setExpensePeriod] = useState<Period | undefined>(
    undefined,
  );
  const [isExpenseFilterOpen, setIsExpenseFilterOpen] = useState(false);

  const [incomePeriod, setIncomePeriod] = useState<Period | undefined>(
    undefined,
  );
  const [isIncomeFilterOpen, setIsIncomeFilterOpen] = useState(false);

  /* - Estados do MonthlyBarChart - */

  const [year, setYear] = useState<number | undefined>(undefined);
  const [isMonthlyFilterOpen, setIsMonthlyFilterOpen] = useState(false);

  /* - Definições - */

  const yearlyData = useYearlyChartData({ year });
  const balanceData = useBalanceChartData(lineYear);
  const expenseData = useCategoryChartData("Saída", expensePeriod);
  const incomeData = useCategoryChartData("Entrada", incomePeriod);

  const { pathname } = useLocation();
  const isChartsPage = pathname === "/graficos";
  const navigate = useNavigate();

  const wrapperClass = isChartsPage
    ? "min-h-screen bg-gray-100 dark:bg-[#0f0f13]"
    : `fixed inset-0 sm:hidden overflow-y-auto bg-gray-100 dark:bg-[#0f0f13] ${
        isMobileChartOpen ? "block" : "hidden"
      }`;

  /* - Funções - */

  // 1. Separa as transações de cada ano

  const years = useMemo(
    () =>
      [
        ...new Set(
          transactions.map((transaction) =>
            new Date(transaction.date + "T00:00:00").getFullYear(),
          ),
        ),
      ].sort((a, b) => b - a),
    [transactions],
  );
  // 2. Volta para a página principal ao clicar no botão "X"

  const handleClose = () =>
    isChartsPage ? navigate("/pagina-principal") : setIsMobileChartOpen(false);

  return (
    <div className={wrapperClass}>
      {/* - Header - */}

      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 sm:px-8 py-4 w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-[#0f0f13] dark:via-[#1a1a2e] dark:to-[#16213e]"
        style={{ boxShadow: "0 3px 6px rgba(0,0,0,0.4)" }}
      >
        <ChartColumnDecreasing className="bg-black dark:bg-[#6c63ff]/20 dark:border dark:border-[#6c63ff]/30 text-white dark:text-[#4f9eff] h-10 w-10 rounded-xl p-1 shrink-0" />

        <h1
          className="font-bold text-lg sm:text-2xl text-white truncate"
          style={{ textShadow: "2px 2px 8px black" }}
        >
          Resumo Mensal
        </h1>

        <motion.button
          className="ml-auto bg-black dark:bg-[#0f0f13] dark:border dark:border-white/10 dark:hover:bg-[#6c63ff]/20 h-10 w-10 rounded-xl flex items-center justify-center text-white dark:text-[#a09cff] cursor-pointer shrink-0 hover:bg-gray-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          aria-label="close-charts"
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </motion.button>
      </div>

      {/* - Gráficos de barras e linha - */}

      <div className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr] md:grid md:grid-cols-[1fr_1fr] gap-4 px-4 sm:px-6 py-5 sm:py-7">
        {/* - Entradas e Saídas por Mês - */}

        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-4 sm:p-5 border border-black dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-black dark:border-white/10 gap-2">
            <p className="text-black dark:text-[#e2e2ef] text-xs sm:text-sm font-bold uppercase tracking-widest leading-tight whitespace-nowrap">
              Entradas e Saídas por Mês
              {year && (
                <span className="ml-2 text-xs font-semibold normal-case text-blue-600 dark:text-[#4f9eff]">
                  {year}
                </span>
              )}
            </p>

            <MonthlyBarChartFilter
              year={year}
              setYear={setYear}
              years={years}
              isOpen={isMonthlyFilterOpen}
              setIsOpen={setIsMonthlyFilterOpen}
            />
          </div>

          <MonthlyBarChart data={yearlyData} />
        </div>

        {/* - Saldo por Mês - */}

        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-4 sm:p-5 border border-black dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-black dark:border-white/10 gap-2">
            <p className="text-black dark:text-[#e2e2ef] text-xs sm:text-sm font-bold uppercase tracking-widest leading-tight">
              Saldo por mês
              {lineYear && (
                <span className="ml-2 text-xs font-semibold normal-case text-blue-600 dark:text-[#4f9eff]">
                  {lineYear}
                </span>
              )}
            </p>

            <BalanceLineChartFilter
              year={lineYear}
              setYear={setLineYear}
              years={years}
              isOpen={isBalanceFilterOpen}
              setIsOpen={setIsBalanceFilterOpen}
            />
          </div>

          <BalanceLineChart data={balanceData} />
        </div>
      </div>

      {/* - Gráficos de pizza - */}

      <div className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr] md:grid md:grid-cols-[1fr_1fr] gap-4 px-4 sm:px-6 py-5 sm:py-7">
        {/* - Categorias de Saída - */}

        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-4 sm:p-5 border border-black dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-black dark:border-white/10 gap-2">
            <p className="text-black dark:text-[#e2e2ef] text-xs sm:text-sm font-bold uppercase tracking-widest leading-tight">
              Categorias de Saída
              {expensePeriod && (
                <span className="ml-2 text-xs font-semibold normal-case text-blue-600 dark:text-[#4f9eff]">
                  {expensePeriod}
                </span>
              )}
            </p>

            <CategoryPieChartFilter
              period={expensePeriod}
              setPeriod={setExpensePeriod}
              isOpen={isExpenseFilterOpen}
              setIsOpen={setIsExpenseFilterOpen}
            />
          </div>

          <CategoryPieChart data={expenseData} />
        </div>

        {/* - Categorias de Entrada - */}

        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-4 sm:p-5 border border-black dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-black dark:border-white/10 gap-2">
            <p className="text-black dark:text-[#e2e2ef] text-xs sm:text-sm font-bold uppercase tracking-widest leading-tight">
              Categorias de Entrada
              {incomePeriod && (
                <span className="ml-2 text-xs font-semibold normal-case text-blue-600 dark:text-[#4f9eff]">
                  {incomePeriod}
                </span>
              )}
            </p>

            <CategoryPieChartFilter
              period={incomePeriod}
              setPeriod={setIncomePeriod}
              isOpen={isIncomeFilterOpen}
              setIsOpen={setIsIncomeFilterOpen}
            />
          </div>

          <CategoryPieChart data={incomeData} />
        </div>
      </div>
    </div>
  );
};

export { ChartsSection };

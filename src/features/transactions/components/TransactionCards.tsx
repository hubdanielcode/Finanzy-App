import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";
import { formatPrivateCurrency } from "../utils/formatPrivateCurrency";
import { useTransactionContext } from "../hooks/useTransactionContext";
import { motion } from "framer-motion";

const TransactionCards: React.FC<{ isPrivate: boolean }> = ({ isPrivate }) => {
  /* - Puxando do context - */

  const { totalIncome, totalExpense, availableMoney } = useTransactionContext();

  return (
    <div>
      <div className="flex flex-col sm:flex sm:flex-row md:flex md:flex-row gap-4 mt-3 py-2">
        {/* - Entradas - */}

        <motion.div
          className="bg-white/20 dark:bg-[#1a1a2e] border border-gray-50/50 dark:border-white/10 backdrop-blur-sm rounded-xl w-full flex-1 h-25 md:h-35 flex px-4 md:px-6 shadow-none hover:shadow-md hover:shadow-gray-900 dark:hover:shadow-black/60"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-green-300 dark:text-[#1d9e75] bg-green-600/50 dark:bg-[#1d9e75]/20 dark:border dark:border-[#1d9e75]/30 rounded-xl h-8 w-11 md:h-12 md:w-15 mt-4 md:mt-6 md:p-2 flex justify-center items-center">
            <ArrowDownCircle className="h-6 w-6 md:h-9 md:w-9" />
          </div>

          <div className="flex flex-col w-full pl-4 min-w-0">
            <h1 className="text-white dark:text-[#e2e2ef] font-semibold text-lg md:text-2xl mt-4 md:mt-8 mb-2 md:mb-4">
              Entradas
            </h1>

            <p className="font-bold text-white dark:text-white/70 text-[clamp(1rem,0.42vw,1.5rem)] whitespace-nowrap mb-4">
              {formatPrivateCurrency(totalIncome, isPrivate)}
            </p>
          </div>
        </motion.div>

        {/* - Saídas - */}

        <motion.div
          className="bg-white/20 dark:bg-[#1a1a2e] border border-gray-50/50 dark:border-white/10 backdrop-blur-sm rounded-xl w-full flex-1 h-25 md:h-35 flex px-4 md:px-6 shadow-none hover:shadow-md hover:shadow-gray-900 dark:hover:shadow-black/60"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-red-300 dark:text-[#e24b4a] bg-red-600/50 dark:bg-[#e24b4a]/20 dark:border dark:border-[#e24b4a]/30 rounded-xl h-8 w-11 md:h-12 md:w-15 mt-4 md:mt-6 md:p-2 flex justify-center items-center">
            <ArrowUpCircle className="h-6 w-6 md:h-9 md:w-9" />
          </div>

          <div className="flex flex-col w-full pl-4 min-w-0">
            <h1 className="text-white dark:text-[#e2e2ef] font-semibold text-lg md:text-2xl mt-4 md:mt-8 mb-2 md:mb-4">
              Saídas
            </h1>

            <p className="font-bold text-white dark:text-white/70 text-[clamp(1rem,0.42vw,1.5rem)] whitespace-nowrap mb-4">
              {formatPrivateCurrency(totalExpense, isPrivate)}
            </p>
          </div>
        </motion.div>

        {/* - Saldo - */}

        <motion.div
          className="bg-white/20 dark:bg-[#1a1a2e] border border-gray-50/50 dark:border-white/10 backdrop-blur-sm rounded-xl w-full flex-1 h-25 md:h-35 flex px-4 md:px-6 shadow-none hover:shadow-sm hover:shadow-gray-900 dark:hover:shadow-[#e9d5ff]"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-blue-300 dark:text-[#a09cff] bg-blue-600/50 dark:bg-[#6c63ff]/20 dark:border dark:border-[#6c63ff]/30 rounded-xl h-8 w-11 md:h-12 md:w-15 mt-4 md:mt-6 md:p-2 flex justify-center items-center">
            <DollarSign className="h-6 w-6 md:h-9 md:w-9" />
          </div>

          <div className="flex flex-col w-full pl-4 min-w-0">
            <h1 className="text-white dark:text-[#e2e2ef] font-semibold text-lg md:text-2xl mt-4 md:mt-8 mb-2 md:mb-4">
              Saldo
            </h1>

            <p
              className={`font-bold text-[clamp(1rem,0.42vw,1.5rem)] whitespace-nowrap mb-4 ${
                availableMoney > 0
                  ? "text-green-300 dark:text-[#1d9e75]"
                  : availableMoney < 0
                    ? "text-red-300 dark:text-[#e24b4a]"
                    : "text-white dark:text-[#e2e2ef]"
              }`}
              data-testid="saldo"
            >
              {formatPrivateCurrency(availableMoney, isPrivate)}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { TransactionCards };

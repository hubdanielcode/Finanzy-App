import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";
import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { formatPrivateCurrency } from "../utils/formatPrivateCurrency";

const TransactionCards: React.FC<{ isPrivate: boolean }> = ({ isPrivate }) => {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error("TransactionContext must be used within a contextProvider");
  }

  const { totalIncome, totalExpense, availableMoney } = context;

  return (
    <div>
      <div className="flex flex-col gap-4 mt-3 sm:flex-row sm:mx-auto">
        {/* - Entradas - */}

        <div className="bg-white/20 border border-gray-50/50 backdrop-blur-sm rounded-xl w-full sm:flex-1 h-25 sm:h-35 flex px-4 sm:px-6">
          <div className="text-green-300 bg-green-600/50 rounded-xl h-8 w-11 sm:h-12 sm:w-15 mt-4 sm:mt-6 sm:p-2 flex justify-center items-center">
            <ArrowDownCircle className="h-6 w-6 sm:h-9 sm:w-9" />
          </div>

          <div className="flex flex-col w-full pl-4 min-w-0">
            <h1 className="text-white font-semibold text-lg sm:text-2xl mt-4 sm:mt-8 mb-2 sm:mb-4">
              Entradas
            </h1>

            <p className="font-bold text-white text-[clamp(1rem,0.42vw,1.5rem)] whitespace-nowrap">
              {formatPrivateCurrency(totalIncome, isPrivate)}
            </p>
          </div>
        </div>

        {/* - Saídas - */}

        <div className="bg-white/20 border border-gray-50/50 backdrop-blur-sm rounded-xl w-full sm:flex-1 h-25 sm:h-35 flex px-4 sm:px-6">
          <div className="text-red-300 bg-red-600/50 rounded-xl h-8 w-11 sm:h-12 sm:w-15 mt-4 sm:mt-6 sm:p-2 flex justify-center items-center">
            <ArrowUpCircle className="h-6 w-6 sm:h-9 sm:w-9" />
          </div>

          <div className="flex flex-col w-full pl-4 min-w-0">
            <h1 className="text-white font-semibold text-lg sm:text-2xl mt-4 sm:mt-8 mb-2 sm:mb-4">
              Saídas
            </h1>

            <p className="font-bold text-white text-[clamp(1rem,0.42vw,1.5rem)] whitespace-nowrap">
              {formatPrivateCurrency(totalExpense, isPrivate)}
            </p>
          </div>
        </div>

        {/* - Saldo - */}

        <div className="bg-white/20 border border-gray-50/50 backdrop-blur-sm rounded-xl w-full sm:flex-1 h-25 sm:h-35 flex px-4 sm:px-6">
          <div className="text-blue-300 bg-blue-600/50 rounded-xl h-8 w-11 sm:h-12 sm:w-15 mt-4 sm:mt-6 sm:p-2 flex justify-center items-center">
            <DollarSign className="h-6 w-6 sm:h-9 sm:w-9" />
          </div>

          <div className="flex flex-col w-full pl-4 min-w-0">
            <h1 className="text-white font-semibold text-lg sm:text-2xl mt-4 sm:mt-8 mb-2 sm:mb-4">
              Saldo
            </h1>

            <p
              className={`font-bold text-[clamp(1rem,0.42vw,1.5rem)] whitespace-nowrap ${
                availableMoney > 0
                  ? "text-green-300"
                  : availableMoney < 0
                    ? "text-red-300"
                    : "text-white"
              }
              `}
            >
              {formatPrivateCurrency(availableMoney, isPrivate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TransactionCards };

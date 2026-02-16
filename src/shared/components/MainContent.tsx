import { useContext, useEffect, useMemo, useState } from "react";

import {
  TransactionContext,
  TransactionForm,
  TransactionList,
  Filter,
  MobileTransactionForm,
  MobileTransactionList,
  MobileActionBar,
} from "../../features/transactions";

export interface MainContentProps {
  title: string;
  setTitle: (title: string) => void;

  amount: string;
  setAmount: (amount: string) => void;

  date: string;
  setDate: (date: string) => void;

  type: "Entrada" | "Saída" | null;
  setType: (type: "Entrada" | "Saída" | null) => void;

  category: string;
  setCategory: (category: string) => void;

  isMobileFormOpen: boolean;
  setIsMobileFormOpen: (isMobileFormOpen: boolean) => void;

  isMobileTransactionListOpen: boolean;
  setIsMobileTransactionListOpen: (
    isMobileTransactionListOpen: boolean,
  ) => void;

  period:
    | "Hoje"
    | "Última Semana"
    | "Último Mês"
    | "Último Bimestre"
    | "Último Trimestre"
    | "Último Quadrimestre"
    | "Último Semestre"
    | "Último Ano"
    | "Mais de um ano"
    | null;
  setPeriod: (period: MainContentProps["period"]) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  title,
  setTitle,
  amount,
  setAmount,
  date,
  setDate,
  type,
  setType,
  period,
  setPeriod,
  category,
  setCategory,
  isMobileFormOpen,
  setIsMobileFormOpen,
  isMobileTransactionListOpen,
  setIsMobileTransactionListOpen,
}) => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "TransactionContext must be used within a TransactionProvider.",
    );
  }

  const { transactions } = context;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchQuery.trim()) {
      result = result.filter((transaction) =>
        transaction.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (type) {
      result = result.filter((transaction) => transaction.type === type);
    }

    if (period) {
      result = result.filter((transaction) => transaction.period === period);
    }

    if (category) {
      result = result.filter(
        (transaction) => transaction.category === category,
      );
    }

    return result;
  }, [transactions, searchQuery, type, period, category]);

  useEffect(() => {
    const shouldBlockScroll = isMobileFormOpen || isMobileTransactionListOpen;

    document.body.style.overflow = shouldBlockScroll ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileFormOpen, isMobileTransactionListOpen]);

  return (
    <div className="w-full flex flex-1 flex-col">
      <main className="flex-1">
        <MobileActionBar
          OpenForm={() => setIsMobileFormOpen(true)}
          OpenTransactionList={() => setIsMobileTransactionListOpen(true)}
        />

        <div className="flex flex-1 gap-4 max-w-2xl sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TransactionForm
            title={title}
            setTitle={setTitle}
            amount={amount}
            setAmount={setAmount}
            date={date}
            setDate={setDate}
          />

          <div className="hidden sm:flex sm:flex-col sm:flex-1 bg-gray-100">
            <Filter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredTransactions={filteredTransactions}
              type={type}
              setType={setType}
              period={period}
              setPeriod={setPeriod}
              category={category}
              setCategory={setCategory}
            />

            <TransactionList transactions={filteredTransactions} />
          </div>
        </div>

        {isMobileFormOpen && (
          <MobileTransactionForm
            title={title}
            setTitle={setTitle}
            amount={amount}
            setAmount={setAmount}
            date={date}
            setDate={setDate}
            isMobileFormOpen={isMobileFormOpen}
            setIsMobileFormOpen={setIsMobileFormOpen}
          />
        )}

        {isMobileTransactionListOpen && (
          <MobileTransactionList
            transactions={filteredTransactions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredTransactions={filteredTransactions}
            type={type}
            setType={setType}
            period={period}
            setPeriod={setPeriod}
            category={category}
            setCategory={setCategory}
            isMobileTransactionListOpen={isMobileTransactionListOpen}
            setIsMobileTransactionListOpen={setIsMobileTransactionListOpen}
          />
        )}
      </main>
    </div>
  );
};

export { MainContent };

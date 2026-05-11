import { useEffect, useMemo, useState } from "react";
import {
  TransactionForm,
  TransactionList,
  Filter,
  MobileTransactionList,
  MobileActionBar,
  ChartsSection,
  useTransactionContext,
} from "../../features/transactions";
import { useMobileContext } from "@/features/transactions/hooks/useMobileContext";

export interface MainContentProps {
  isMobileFormOpen: boolean;
  setIsMobileFormOpen: (isMobileFormOpen: boolean) => void;
  isMobileTransactionListOpen: boolean;
  setIsMobileTransactionListOpen: (
    isMobileTransactionListOpen: boolean,
  ) => void;
  isMobileChartOpen: boolean;
  setIsMobileChartOpen: (isMobileChartOpen: boolean) => void;
}

const MainContent = () => {
  /* - Puxando do context - */

  const { isMobile, isLandscape } = useMobileContext();
  const { setIsWidgetOpen, transactions } = useTransactionContext();
  const {
    isMobileFormOpen,
    setIsMobileFormOpen,
    isMobileTransactionListOpen,
    setIsMobileTransactionListOpen,
    setIsMobileChartOpen,
  } = useMobileContext();

  /* - Estados de transação - */

  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [type, setType] = useState<"Entrada" | "Saída" | null>(null);
  const [category, setCategory] = useState<string>("");
  const [period, setPeriod] = useState<
    | "Hoje"
    | "Última Semana"
    | "Último Mês"
    | "Último Bimestre"
    | "Último Trimestre"
    | "Último Quadrimestre"
    | "Último Semestre"
    | "Último Ano"
    | "Mais de um ano"
    | null
  >(null);

  /* - Estados de busca - */

  const [searchQuery, setSearchQuery] = useState<string>("");

  /* - Definições - */

  const isMobileLandscape = isLandscape && !isMobile;
  const isDesktop = !isMobile && !isLandscape;
  const formProps = { title, setTitle, amount, setAmount, date, setDate };

  /* - Funções - */

  // 1. Filtrando as transações

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

  // 2. Bloqueia scroll se for mobile

  useEffect(() => {
    const shouldBlockScroll = isMobileFormOpen || isMobileTransactionListOpen;
    document.body.style.overflow = shouldBlockScroll ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileFormOpen, isMobileTransactionListOpen]);

  return (
    <div className="w-full flex flex-1 flex-col bg-gray-100 dark:bg-[#0f0f13]">
      <main className="flex-1">
        {isMobile && (
          <MobileActionBar
            OpenForm={() => setIsMobileFormOpen(true)}
            OpenTransactionList={() => setIsMobileTransactionListOpen(true)}
            OpenChart={() => setIsMobileChartOpen(true)}
            onConnectBank={() => setIsWidgetOpen(true)}
          />
        )}

        <div className="flex w-screen flex-1 gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-[#0f0f13]">
          {!isMobile && (
            <TransactionForm
              {...formProps}
              variant={isMobileLandscape ? "landscape" : "desktop"}
            />
          )}

          {(isMobileLandscape || isDesktop) && (
            <div className="flex flex-col flex-1 bg-gray-100 dark:bg-[#0f0f13]">
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

              <TransactionList
                transactions={filteredTransactions}
                variant={isMobileLandscape ? "landscape" : "desktop"}
              />
            </div>
          )}
        </div>

        {isMobileFormOpen && (
          <TransactionForm
            {...formProps}
            variant="mobile"
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

        <ChartsSection />
      </main>
    </div>
  );
};

export { MainContent };

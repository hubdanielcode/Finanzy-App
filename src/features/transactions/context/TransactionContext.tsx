import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { NewTransaction, Transaction } from "../model/transactionTypes";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";

interface TransactionContextType {
  /* - Estados das transações - */

  transactions: Transaction[];
  handleAddTransaction: (transaction: NewTransaction) => Promise<void>;
  handleUpdateTransaction: (transaction: Transaction) => Promise<void>;
  handleDeleteTransaction: (transactionId: string) => Promise<void>;
  totalIncome: number;
  totalExpense: number;
  availableMoney: number;
  fetchTransactions: () => void;
  isLoading: boolean;

  /* - Estados do pluggy - */

  isWidgetOpen: boolean;
  setIsWidgetOpen: (isWidgetOpen: boolean) => void;
}

const TransactionContext = createContext<TransactionContextType | null>(null);

const TransactionProvider = ({ children }: { children: ReactNode }) => {
  /* - Estados das transações - */

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /* - Estados de carregamento - */

  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* - Estados da pluggy - */

  const [isWidgetOpen, setIsWidgetOpen] = useState<boolean>(false);

  /* - Funções - */

  // 1. Busca as transações do Supabase

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao carregar transações", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Carrega as transações quando o componente monta

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 3. Adiciona uma nova transação

  const handleAddTransaction = async (transaction: NewTransaction) => {
    try {
      await createTransaction(transaction);
      await fetchTransactions();
    } catch (error) {
      console.error("Erro ao adicionar transação", error);
    }
  };

  // 4. Atualiza uma transação existente

  const handleUpdateTransaction = async (transaction: Transaction) => {
    try {
      await updateTransaction(transaction);
      await fetchTransactions();
    } catch (error) {
      console.error("Erro ao atualizar transação", error);
    }
  };

  // 5. Deleta uma transação

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
      await fetchTransactions();
    } catch (error) {
      console.error("Erro ao deletar transação", error);
    }
  };

  // 6. Calcula o total de entradas, saídas e saldo disponível

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.type === "Entrada")
        .reduce(
          (accumulator, transaction) => accumulator + transaction.amount,
          0,
        ),
    [transactions],
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.type === "Saída")
        .reduce(
          (accumulator, transaction) => accumulator + transaction.amount,
          0,
        ),
    [transactions],
  );

  const availableMoney = useMemo(
    () => totalIncome - totalExpense,
    [totalIncome, totalExpense],
  );

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        handleAddTransaction,
        handleUpdateTransaction,
        handleDeleteTransaction,
        totalIncome,
        totalExpense,
        availableMoney,
        fetchTransactions,
        isLoading,
        isWidgetOpen,
        setIsWidgetOpen,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionContext, TransactionProvider };

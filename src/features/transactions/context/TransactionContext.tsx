import { createContext, useEffect, useState } from "react";
import type { NewTransaction, Transaction } from "../model/TransactionTypes";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";

interface TransactionContextType {
  transactions: Transaction[];
  handleAddTransaction: (transaction: NewTransaction) => Promise<void>;
  handleUpdateTransaction: (transaction: Transaction) => Promise<void>;
  handleDeleteTransaction: (transactionId: string) => Promise<void>;
  totalIncome: number;
  totalExpense: number;
  availableMoney: number;
  fetchTransactions: () => void;
  isLoading: boolean;
}

export const TransactionContext = createContext<TransactionContextType | null>(
  null,
);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /* - Função que carrega todas as transações do Supabase - */

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

  /* - Carrega as transações quando o componente monta - */

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (transaction: NewTransaction) => {
    try {
      await createTransaction(transaction);
      await fetchTransactions();
    } catch (error) {
      console.error("Erro ao adicionar transação", error);
    }
  };

  const handleUpdateTransaction = async (transaction: Transaction) => {
    try {
      await updateTransaction(transaction);
      await fetchTransactions();
    } catch (error) {
      console.error("Erro ao atualizar transação", error);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
      await fetchTransactions();
    } catch (error) {
      console.error("Erro ao deletar transação", error);
    }
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "Entrada")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "Saída")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const availableMoney = totalIncome - totalExpense;

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
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("TransactionContext must be used within a ContextProvider");
  }
  return context;
};
export { useTransactionContext };

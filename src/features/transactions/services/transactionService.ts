import { supabase } from "../../../supabase/supabase";
import type { NewTransaction, Transaction } from "../model/TransactionTypes";

interface NewTransactionInsert extends NewTransaction {
  user_id: string;
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Erro ao carregar transações");
  }

  return data ?? [];
};

export const createTransaction = async (
  transaction: NewTransaction,
): Promise<Transaction> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const NewTransactionForInsert: NewTransactionInsert = {
    title: transaction.title,
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date,
    period: transaction.period,
    user_id: user.id,
  };

  const result = await supabase
    .from("transactions")
    .insert(NewTransactionForInsert)
    .select()
    .single();

  if (result.error || !result) {
    console.log(result.error);
  }

  if (!result.data) {
    throw new Error("Supabase não retornou a transação criada");
  }

  const data = result.data;
  return {
    id: String(data.id),
    title: data.title,
    type: data.type,
    category: data.category,
    amount: Number(data.amount),
    date: data.date,
    period: data.period,
    user_id: data.user_id,
  };
};

export const updateTransaction = async (
  transaction: Transaction,
): Promise<Transaction> => {
  if (!transaction.id) {
    throw new Error("ID obrigatório para atualizar transação");
  }

  const result = await supabase
    .from("transactions")
    .update({
      title: transaction.title,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      period: transaction.period,
    })
    .eq("id", transaction.id)
    .select("*")
    .single();

  if (result.error) {
    throw new Error("Erro ao atualizar transação");
  }

  const data = result.data;
  return {
    id: String(data.id),
    title: data.title,
    type: data.type,
    category: data.category,
    amount: Number(data.amount),
    date: data.date,
    period: data.period,
    user_id: data.user_id,
  };
};

export const deleteTransaction = async (
  transactionId: string,
): Promise<void> => {
  const result = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId);

  if (result.error) {
    throw new Error("Erro ao deletar transação");
  }

  console.log("Delete result:", result.data);
};

import { supabase } from "../../../../supabase/supabase";
import type { Period, Transaction } from "../model/transactionTypes";

interface PluggyTransaction {
  id: string;
  description: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  period: Period | null;
  date: string;
  category?: string;
}

/* - Busca a apiKey via Edge Function, secret nunca toca o frontend - */

const getApiKey = async (): Promise<string> => {
  const { data, error } = await supabase.functions.invoke("pluggy-auth");
  if (error) throw new Error("Falha ao autenticar com a Pluggy");
  return data.apiKey;
};

/* - Busca as transações de uma conta no Pluggy - */

const fetchTransactionsFromPluggy = async (
  accountId: string,
): Promise<PluggyTransaction[]> => {
  const apiKey = await getApiKey();

  const response = await fetch(
    `https://api.pluggy.ai/transactions?accountId=${accountId}`,
    { headers: { "X-API-KEY": apiKey } },
  );

  if (!response.ok) throw new Error("Falha ao buscar transações na Pluggy");

  const data = await response.json();
  return data.results;
};

/* - Formata a transação da Pluggy para ficar de acordo com a transação do Finanzy - */

const mapPluggyCategory = (pluggyCategory?: string): string => {
  const map: Record<string, string> = {
    /* - Renda - */

    Salary: "Salário",
    Retirement: "Rendimentos",
    "Entrepreneurial activities": "Freelance",
    "Non-recurring income": "Renda Passiva",
    "Proceeds interests and dividends": "Rendimentos",

    /* - Rendimentos de Investimentos - */

    Investments: "Rendimentos",
    "Fixed income": "Rendimentos",
    "Variable income": "Rendimentos",

    /* - Depósitos - */

    Transfers: "Depósitos",
    "Same person transfer": "Depósitos",
    "Third party transfers": "Depósitos",
    "Credit card payment": "Depósitos",

    /* - Alimentação - */

    Groceries: "Mercado",
    "Food and drinks": "Alimentação",
    "Eating out": "Alimentação",
    "Food delivery": "Alimentação",

    /* - Moradia - */

    Housing: "Moradia",
    Rent: "Moradia",
    Utilities: "Moradia",

    /* - Saúde - */

    Healthcare: "Saúde",
    Dentist: "Saúde",
    Pharmacy: "Saúde",
    "Hospital clinics and labs": "Saúde",

    /* - Transporte - */

    Transportation: "Transporte",
    "Taxi and ride-hailing": "Transporte",
    "Public transportation": "Transporte",
    Automotive: "Transporte",
    "Gas stations": "Transporte",

    /* - Educação - */

    Education: "Educação",
    "Online Courses": "Educação",
    University: "Educação",

    /* - Animais de Estimação - */

    "Pet supplies and vet": "Animais de Estimação",

    /* - Impostos e Taxas - */

    Taxes: "Impostos e Taxas",
    "Bank fees": "Impostos e Taxas",
    "Legal obligations": "Impostos e Taxas",

    /* - Lazer - */

    Leisure: "Lazer",
    Gaming: "Lazer",
    "Video streaming": "Lazer",
    "Music streaming": "Lazer",
    Tickets: "Lazer",
    Travel: "Lazer",

    /* - Outros - */

    Services: "Outros",
  };

  return map[pluggyCategory ?? ""] ?? "Outros";
};

const mapPluggyToTransaction = (
  pluggyTransactions: PluggyTransaction,
  userId: string,
): Omit<Transaction, "id"> => {
  return {
    user_id: userId,
    title: pluggyTransactions.description,
    amount: Math.abs(pluggyTransactions.amount),
    type: pluggyTransactions.type === "DEBIT" ? "Saída" : "Entrada",
    period: "Último Mês",
    category: mapPluggyCategory(pluggyTransactions.category),
    date: pluggyTransactions.date,
    external_id: pluggyTransactions.id,
  };
};

/* - Sincroniza e salva no Supabase, evitando duplicatas - */

const syncTransactionsFromBank = async (accountId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");

  const pluggyTransactions = await fetchTransactionsFromPluggy(accountId);

  for (const pluggyTx of pluggyTransactions) {
    const mapped = mapPluggyToTransaction(pluggyTx, user.id);
    const { error } = await supabase
      .from("transactions")
      .upsert(mapped, { onConflict: "external_id" });
    if (error) console.error("Erro no upsert:", error);
  }
};

export { syncTransactionsFromBank };

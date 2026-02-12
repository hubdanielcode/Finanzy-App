export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType | null;
  date: string;
  period: Period | null;
  category: string;
  user_id: string;
}
export type TransactionType = "Entrada" | "Saída";

export interface NewTransaction {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  period: Period;
}

export type Period =
  | "Hoje"
  | "Última Semana"
  | "Último Mês"
  | "Último Bimestre"
  | "Último Trimestre"
  | "Último Quadrimestre"
  | "Último Semestre"
  | "Último Ano"
  | "Mais de um ano";

export type PeriodType =
  | "Hoje"
  | "Última Semana"
  | "Último Mês"
  | "Último Bimestre"
  | "Último Trimestre"
  | "Último Quadrimestre"
  | "Último Semestre"
  | "Último Ano"
  | "Mais de um ano";

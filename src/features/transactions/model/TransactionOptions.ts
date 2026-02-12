import type { Period, TransactionType } from "./TransactionTypes";

export const TransactionTypeOptions: TransactionType[] = ["Entrada", "Saída"];

export const PeriodOptions: Period[] = [
  "Hoje",
  "Última Semana",
  "Último Mês",
  "Último Bimestre",
  "Último Trimestre",
  "Último Quadrimestre",
  "Último Semestre",
  "Último Ano",
  "Mais de um ano",
];

export const ExpenseOptions = [
  "Alimentação",
  "Aluguel",
  "Animais de Estimação",
  "Cuidados Pessoais",
  "Educação",
  "Impostos e Taxas",
  "Lazer",
  "Mercado",
  "Moradia",
  "Outro",
  "Saúde",
  "Transporte",
];

export const IncomeOptions = [
  "Consultoria",
  "Depósitos",
  "Freelance",
  "Outros",
  "Bonificações",
  "Renda Passiva",
  "Rendimentos de Investimentos",
  "Salário",
  "Vendas",
];

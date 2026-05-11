import type { Period, TransactionType } from "./transactionTypes";

const TransactionTypeOptions: TransactionType[] = ["Entrada", "Saída"];

const PeriodOptions: Period[] = [
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

const ExpenseOptions = [
  "Alimentação",
  "Moradia",
  "Animais de Estimação",
  "Cuidados Pessoais",
  "Educação",
  "Impostos e Taxas",
  "Lazer",
  "Mercado",
  "Outros",
  "Saúde",
  "Transporte",
];

const IncomeOptions = [
  "Consultoria",
  "Depósitos",
  "Freelance",
  "Outros",
  "Bonificações",
  "Rendimentos",
  "Salário",
  "Vendas",
];

export { TransactionTypeOptions, PeriodOptions, ExpenseOptions, IncomeOptions };

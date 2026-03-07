import {
  TransactionTypeOptions,
  PeriodOptions,
  ExpenseOptions,
  IncomeOptions,
} from "@/features/transactions/model/TransactionOptions";

/* - Testando o TransactionTypeOptions - */

test("should have all expected transaction type options", () => {
  expect(TransactionTypeOptions).toEqual(["Entrada", "Saída"]);
});

test("should have only two transaction types", () => {
  expect(TransactionTypeOptions).toHaveLength(2);
});

/* - Testando o PeriodOptions - */

test("should have all expected period options", () => {
  expect(PeriodOptions).toEqual([
    "Hoje",
    "Última Semana",
    "Último Mês",
    "Último Bimestre",
    "Último Trimestre",
    "Último Quadrimestre",
    "Último Semestre",
    "Último Ano",
    "Mais de um ano",
  ]);
});

test("should not have duplicate values in PeriodOptions", () => {
  const unique = [...new Set(PeriodOptions)];

  expect(PeriodOptions).toEqual(unique);
});

/* - Testando o ExpenseOptions - */

test("should have all expected expense options", () => {
  expect(ExpenseOptions).toEqual([
    "Alimentação",
    "Aluguel",
    "Animais de Estimação",
    "Cuidados Pessoais",
    "Educação",
    "Impostos e Taxas",
    "Lazer",
    "Mercado",
    "Moradia",
    "Outros",
    "Saúde",
    "Transporte",
  ]);
});

test("should not have duplicate values in ExpenseOptions", () => {
  const unique = [...new Set(ExpenseOptions)];

  expect(ExpenseOptions).toEqual(unique);
});

/* - Testando o IncomeOptions - */

test("should have all expected income options", () => {
  expect(IncomeOptions).toEqual([
    "Consultoria",
    "Depósitos",
    "Freelance",
    "Outros",
    "Bonificações",
    "Renda Passiva",
    "Rendimentos de Investimentos",
    "Salário",
    "Vendas",
  ]);
});

test("should not have duplicate values in IncomeOptions", () => {
  const unique = [...new Set(IncomeOptions)];

  expect(IncomeOptions).toEqual(unique);
});

/* - Testando categorias compartilhadas - */

test("should have 'Outros' as an option in both ExpenseOptions and IncomeOptions", () => {
  expect(ExpenseOptions).toContain("Outros");
  expect(IncomeOptions).toContain("Outros");
});

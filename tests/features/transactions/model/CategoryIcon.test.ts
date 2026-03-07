import {
  ExpenseIcons,
  IncomeIcons,
} from "@/features/transactions/model/CategoryIcons";

/* - Testando o ExpenseIcons - */

test("should have all expected expense categories", () => {
  const expectedCategories = [
    "Alimentação",
    "Aluguel",
    "Animais de Estimação",
    "Cuidados Pessoais",
    "Educação",
    "Impostos e Taxas",
    "Lazer",
    "Mercado",
    "Moradia",
    "Saúde",
    "Transporte",
    "Outros",
  ];

  expect(Object.keys(ExpenseIcons)).toEqual(expectedCategories);
});

test("should have an icon for every expense category", () => {
  Object.entries(ExpenseIcons).forEach(([_, value]) => {
    expect(value.icon).toBeTruthy();
    expect(typeof value.icon).toBe("string");
  });
});

/* - Testando o IncomeIcons - */

test("should have all expected income categories", () => {
  const expectedCategories = [
    "Salário",
    "Consultoria",
    "Freelance",
    "Vendas",
    "Rendimentos de Investimentos",
    "Renda Passiva",
    "Depósitos",
    "Bonificações",
    "Outros",
  ];

  expect(Object.keys(IncomeIcons)).toEqual(expectedCategories);
});

test("should have an icon for every income category", () => {
  Object.entries(IncomeIcons).forEach(([_, value]) => {
    expect(value.icon).toBeTruthy();
    expect(typeof value.icon).toBe("string");
  });
});

/* - Testando categorias compartilhadas - */

test("should have 'Outros' as a category in both ExpenseIcons and IncomeIcons", () => {
  expect(ExpenseIcons).toHaveProperty("Outros");
  expect(IncomeIcons).toHaveProperty("Outros");
});

test("should not have duplicate categories within ExpenseIcons", () => {
  const keys = Object.keys(ExpenseIcons);
  const uniqueKeys = [...new Set(keys)];

  expect(keys).toEqual(uniqueKeys);
});

test("should not have duplicate categories within IncomeIcons", () => {
  const keys = Object.keys(IncomeIcons);
  const uniqueKeys = [...new Set(keys)];

  expect(keys).toEqual(uniqueKeys);
});

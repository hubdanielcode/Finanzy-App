import { formatCurrency } from "@/features/transactions/utils/formatCurrency";

/* - Testando valores positivos - */

test("should format zero value", () => {
  expect(formatCurrency(0)).toBe("R$ 0,00");
});

test("should format a simple positive integer", () => {
  expect(formatCurrency(10)).toBe("R$ 10,00");
});

test("should format a value with decimal cents", () => {
  expect(formatCurrency(10.5)).toBe("R$ 10,50");
});

test("should format a value with two decimal places", () => {
  expect(formatCurrency(10.99)).toBe("R$ 10,99");
});

test("should round to two decimal places", () => {
  expect(formatCurrency(10.999)).toBe("R$ 11,00");
});

/* - Testando separadores de milhar - */

test("should format thousands with dot separator", () => {
  expect(formatCurrency(1000)).toBe("R$ 1.000,00");
});

test("should format tens of thousands", () => {
  expect(formatCurrency(10000)).toBe("R$ 10.000,00");
});

test("should format hundreds of thousands", () => {
  expect(formatCurrency(100000)).toBe("R$ 100.000,00");
});

test("should format millions with two dot separators", () => {
  expect(formatCurrency(1000000)).toBe("R$ 1.000.000,00");
});

test("should format a large value with cents", () => {
  expect(formatCurrency(1234567.89)).toBe("R$ 1.234.567,89");
});

/* - Testando valores negativos - */

test("should format a simple negative value", () => {
  expect(formatCurrency(-10)).toBe("R$ -10,00");
});

test("should format a negative value with cents", () => {
  expect(formatCurrency(-10.5)).toBe("R$ -10,50");
});

test("should format a negative thousand", () => {
  expect(formatCurrency(-1000)).toBe("R$ -1.000,00");
});

test("should format a large negative value with cents", () => {
  expect(formatCurrency(-1234567.89)).toBe("R$ -1.234.567,89");
});

/* - Testando o prefixo R$ - */

test("should always include the R$ prefix", () => {
  expect(formatCurrency(1)).toMatch(/^R\$ /);
});

test("should place the negative sign after the R$ prefix", () => {
  expect(formatCurrency(-1)).toMatch(/^R\$ -/);
});

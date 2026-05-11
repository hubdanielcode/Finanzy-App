import { formatPrivateCurrency } from "@/features/transactions/utils/formatPrivateCurrency";

/* - Testando modo privado - */

test("should return masked value when isPrivate === true", () => {
  expect(formatPrivateCurrency(100, true)).toBe("R$ *****");
});

test("should return masked value for negative numbers when isPrivate === true", () => {
  expect(formatPrivateCurrency(-100, true)).toBe("R$ *****");
});

test("should return masked value for zero when isPrivate === true", () => {
  expect(formatPrivateCurrency(0, true)).toBe("R$ *****");
});

/* - Testando modo público - */

test("should return formatted value when isPrivate === false", () => {
  expect(formatPrivateCurrency(100, false)).toBe("R$ 100,00");
});

test("should return formatted negative value when isPrivate === false", () => {
  expect(formatPrivateCurrency(-100, false)).toBe("R$ -100,00");
});

test("should return formatted zero when isPrivate === false", () => {
  expect(formatPrivateCurrency(0, false)).toBe("R$ 0,00");
});

test("should return formatted value with thousands separator when isPrivate === false", () => {
  expect(formatPrivateCurrency(1000, false)).toBe("R$ 1.000,00");
});

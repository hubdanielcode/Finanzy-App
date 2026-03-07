import { formatTodayString, calculatePeriod } from "@/shared/utils/date";
import { vi } from "vitest";

/* - Criando o mock para simular a data nos testes - */

const setFakeToday = (dateString: string) => {
  vi.setSystemTime(new Date(`${dateString}T12:00:00`));
};

/* - Limpando o mock entre os testes para evitar erros - */

beforeEach(() => {
  vi.useFakeTimers();
  setFakeToday("2024-01-15");
});

afterEach(() => {
  vi.useRealTimers();
});

/* - Testando o formatTodayString - */

test("should return today's date formatted as YYYY-MM-DD", () => {
  const result = formatTodayString();

  expect(result).toBe("2024-01-15");
});

test("should pad month and day with leading zero when necessary", () => {
  setFakeToday("2024-03-05");

  const result = formatTodayString();

  expect(result).toBe("2024-03-05");
});

/* - Testando o calculatePeriod - */

test("should return 'Hoje' when transaction date is today", () => {
  const result = calculatePeriod("2024-01-15");

  expect(result).toBe("Hoje");
});

test("should return 'Última Semana' when transaction date is within 7 days", () => {
  const result = calculatePeriod("2024-01-08");

  expect(result).toBe("Última Semana");
});

test("should return 'Último Mês' when transaction date is within 30 days", () => {
  const result = calculatePeriod("2023-12-16");

  expect(result).toBe("Último Mês");
});

test("should return 'Último Bimestre' when transaction date is within 60 days", () => {
  const result = calculatePeriod("2023-11-16");

  expect(result).toBe("Último Bimestre");
});

test("should return 'Último Trimestre' when transaction date is within 90 days", () => {
  const result = calculatePeriod("2023-10-17");

  expect(result).toBe("Último Trimestre");
});

test("should return 'Último Quadrimestre' when transaction date is within 120 days", () => {
  const result = calculatePeriod("2023-09-17");

  expect(result).toBe("Último Quadrimestre");
});

test("should return 'Último Semestre' when transaction date is within 180 days", () => {
  const result = calculatePeriod("2023-07-19");

  expect(result).toBe("Último Semestre");
});

test("should return 'Último Ano' when transaction date is within 365 days", () => {
  const result = calculatePeriod("2023-01-15");

  expect(result).toBe("Último Ano");
});

test("should return 'Mais de um ano' when transaction date is more than 365 days ago", () => {
  const result = calculatePeriod("2022-01-14");

  expect(result).toBe("Mais de um ano");
});

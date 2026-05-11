import { vi } from "vitest";
import { formatTodayString, calculatePeriod } from "@/shared/utils/date";

/* - Mockando o tempo para evitar falhas por data real - */

beforeEach(() => {
  vi.useFakeTimers();
});

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.useRealTimers();
});

/* - Criando uma função para calcular uma data relativa ao dia atual - */

const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/* - Testando o formatTodayString - */

test("should return today's date in YYYY-MM-DD format", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(formatTodayString()).toBe("2025-06-15");
});

test("should pad month with leading zero when necessary", () => {
  vi.setSystemTime(new Date("2025-03-01T00:00:00"));

  expect(formatTodayString()).toBe("2025-03-01");
});

test("should pad day with leading zero when necessary", () => {
  vi.setSystemTime(new Date("2025-11-05T00:00:00"));

  expect(formatTodayString()).toBe("2025-11-05");
});

test("should return correct date at the end of the year", () => {
  vi.setSystemTime(new Date("2025-12-31T00:00:00"));

  expect(formatTodayString()).toBe("2025-12-31");
});

test("should return correct date at the start of the year", () => {
  vi.setSystemTime(new Date("2025-01-01T00:00:00"));

  expect(formatTodayString()).toBe("2025-01-01");
});

/* - Testando o calculatePeriod - */

test("should return 'Hoje' when date is today", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(0))).toBe("Hoje");
});

test("should return 'Última Semana' when date is 1 day ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(1))).toBe("Última Semana");
});

test("should return 'Última Semana' when date is 7 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(7))).toBe("Última Semana");
});

test("should return 'Último Mês' when date is 8 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(8))).toBe("Último Mês");
});

test("should return 'Último Mês' when date is 30 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(30))).toBe("Último Mês");
});

test("should return 'Último Bimestre' when date is 31 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(31))).toBe("Último Bimestre");
});

test("should return 'Último Bimestre' when date is 60 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(60))).toBe("Último Bimestre");
});

test("should return 'Último Trimestre' when date is 61 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(61))).toBe("Último Trimestre");
});

test("should return 'Último Trimestre' when date is 90 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(90))).toBe("Último Trimestre");
});

test("should return 'Último Quadrimestre' when date is 91 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(91))).toBe("Último Quadrimestre");
});

test("should return 'Último Quadrimestre' when date is 120 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(120))).toBe("Último Quadrimestre");
});

test("should return 'Último Semestre' when date is 121 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(121))).toBe("Último Semestre");
});

test("should return 'Último Semestre' when date is 180 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(180))).toBe("Último Semestre");
});

test("should return 'Último Ano' when date is 181 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(181))).toBe("Último Ano");
});

test("should return 'Último Ano' when date is 365 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(365))).toBe("Último Ano");
});

test("should return 'Mais de um ano' when date is 366 days ago", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod(daysAgo(366))).toBe("Mais de um ano");
});

test("should return 'Mais de um ano' when date is far in the past", () => {
  vi.setSystemTime(new Date("2025-06-15T00:00:00"));

  expect(calculatePeriod("2020-01-01")).toBe("Mais de um ano");
});

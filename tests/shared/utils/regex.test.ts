import { regex } from "@/shared/utils/regex";

/* - Testando o regex de nome - */

test("should match full name with two words", () => {
  expect(regex.name.test("João Silva")).toBe(true);
});

test("should match full name with accented characters", () => {
  expect(regex.name.test("Ângela Müller")).toBe(true);
});

test("should not match single word name", () => {
  expect(regex.name.test("João")).toBe(false);
});

test("should not match name with numbers", () => {
  expect(regex.name.test("João 123")).toBe(false);
});

test("should not match name with special characters", () => {
  expect(regex.name.test("João @Silva")).toBe(false);
});

test("should not match empty string in name", () => {
  expect(regex.name.test("")).toBe(false);
});

/* - Testando o regex de email - */

test("should match valid email", () => {
  expect(regex.email.test("test@example.com")).toBe(true);
});

test("should match email with subdomain", () => {
  expect(regex.email.test("user@mail.example.com")).toBe(true);
});

test("should match email with plus sign", () => {
  expect(regex.email.test("user+tag@example.com")).toBe(true);
});

test("should not match email without at sign", () => {
  expect(regex.email.test("testexample.com")).toBe(false);
});

test("should not match email without domain", () => {
  expect(regex.email.test("test@")).toBe(false);
});

test("should not match email with short tld", () => {
  expect(regex.email.test("test@example.c")).toBe(false);
});

test("should not match email with spaces", () => {
  expect(regex.email.test("test @example.com")).toBe(false);
});

test("should not match empty string in email", () => {
  expect(regex.email.test("")).toBe(false);
});

/* - Testando o regex de título - */

test("should match title with letters and numbers", () => {
  expect(regex.title.test("Salário 2024")).toBe(true);
});

test("should match title with allowed symbols", () => {
  expect(regex.title.test("Conta de Luz!")).toBe(true);
});

test("should match title with accented characters", () => {
  expect(regex.title.test("Revisão Mensal")).toBe(true);
});

test("should not match title with repeated characters more than twice", () => {
  expect(regex.title.test("Salaaaaário")).toBe(false);
});

test("should not match title with special characters", () => {
  expect(regex.title.test("Salário@#$")).toBe(false);
});

test("should not match empty string in title", () => {
  expect(regex.title.test("")).toBe(false);
});

/* - Testando o regex de valor - */

test("should match integer amount", () => {
  expect(regex.amount.test("1000")).toBe(true);
});

test("should match amount with comma and two decimals", () => {
  expect(regex.amount.test("10,50")).toBe(true);
});

test("should match amount with dot and two decimals", () => {
  expect(regex.amount.test("10.50")).toBe(true);
});

test("should match amount with one decimal place", () => {
  expect(regex.amount.test("10,5")).toBe(true);
});

test("should match amount with no decimal digits after separator", () => {
  expect(regex.amount.test("10,")).toBe(true);
});

test("should not match amount with letters", () => {
  expect(regex.amount.test("1000abc")).toBe(false);
});

test("should not match amount with more than two decimal places", () => {
  expect(regex.amount.test("10,999")).toBe(false);
});

test("should not match empty string in amount", () => {
  expect(regex.amount.test("")).toBe(false);
});

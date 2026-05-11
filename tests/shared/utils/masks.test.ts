import { masks } from "@/shared/utils/masks";

/* - Testando a máscara de nome - */

test("should allow letters and spaces in name mask", () => {
  expect(masks.name("João Silva")).toBe("João Silva");
});

test("should remove numbers from name mask", () => {
  expect(masks.name("João123")).toBe("João");
});

test("should remove special characters from name mask", () => {
  expect(masks.name("João@#$")).toBe("João");
});

test("should collapse multiple spaces in name mask", () => {
  expect(masks.name("João  Silva")).toBe("João Silva");
});

test("should limit name to 80 characters", () => {
  const long = "a".repeat(100);
  expect(masks.name(long)).toHaveLength(80);
});

/* - Testando a máscara de email - */

test("should allow valid email characters in email mask", () => {
  expect(masks.email("test@example.com")).toBe("test@example.com");
});

test("should remove invalid characters from email mask", () => {
  expect(masks.email("test @example.com")).toBe("test@example.com");
});

test("should limit email to 254 characters", () => {
  const long = "a".repeat(300);
  expect(masks.email(long)).toHaveLength(254);
});

/* - Testando a máscara de título - */

test("should allow letters, numbers and allowed symbols in title mask", () => {
  expect(masks.title("Salário 2024!")).toBe("Salário 2024!");
});

test("should remove invalid characters from title mask", () => {
  expect(masks.title("Salário@#$")).toBe("Salário");
});

test("should collapse multiple spaces in title mask", () => {
  expect(masks.title("Conta  de  Luz")).toBe("Conta de Luz");
});

test("should limit title to 30 characters", () => {
  const long = "a".repeat(50);
  expect(masks.title(long)).toHaveLength(30);
});

/* - Testando a máscara de valor - */

test("should allow numbers in amount mask", () => {
  expect(masks.amount("1000")).toBe("1000");
});

test("should replace dot with comma in amount mask", () => {
  expect(masks.amount("10.50")).toBe("10,50");
});

test("should remove letters from amount mask", () => {
  expect(masks.amount("1000abc")).toBe("1000");
});

test("should limit to 2 decimal places in amount mask", () => {
  expect(masks.amount("10,999")).toBe("10,99");
});

test("should collapse multiple commas in amount mask", () => {
  expect(masks.amount("10,,50")).toBe("10,50");
});

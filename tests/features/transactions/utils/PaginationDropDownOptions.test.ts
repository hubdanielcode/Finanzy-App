import { pageLimitOptions } from "@/features/transactions/utils/paginationDropdownOptions";

/* - Testando o PageLimitOptions - */

test("should have all expected page limit options", () => {
  expect(pageLimitOptions).toEqual([10, 20, 50, 100]);
});

test("should have only numeric values", () => {
  pageLimitOptions.forEach((option) => {
    expect(typeof option).toBe("number");
  });
});

test("should be sorted in ascending order", () => {
  const sorted = [...pageLimitOptions].sort((a, b) => a - b);

  expect(pageLimitOptions).toEqual(sorted);
});

test("should not have duplicate values", () => {
  const unique = [...new Set(pageLimitOptions)];

  expect(pageLimitOptions).toEqual(unique);
});

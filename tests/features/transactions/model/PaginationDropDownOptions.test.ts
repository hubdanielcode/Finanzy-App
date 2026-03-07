import { PageLimitOptions } from "@/features/transactions/model/PaginationDropdownOptions";

/* - Testando o PageLimitOptions - */

test("should have all expected page limit options", () => {
  expect(PageLimitOptions).toEqual([10, 20, 50, 100]);
});

test("should have only numeric values", () => {
  PageLimitOptions.forEach((option) => {
    expect(typeof option).toBe("number");
  });
});

test("should be sorted in ascending order", () => {
  const sorted = [...PageLimitOptions].sort((a, b) => a - b);

  expect(PageLimitOptions).toEqual(sorted);
});

test("should not have duplicate values", () => {
  const unique = [...new Set(PageLimitOptions)];

  expect(PageLimitOptions).toEqual(unique);
});

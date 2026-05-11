const transactionFormVariants = {
  wrapper: {
    desktop: "block",
    landscape: "block max-w-90",
    mobile: "fixed inset-0 z-1 bg-white dark:bg-[#0f0f13]",
  },
  form: {
    desktop:
      "mx-auto bg-white dark:bg-[#1a1a2e] border border-gray-500/50 dark:border-white/10 rounded-xl text-black dark:text-[#e2e2ef] max-w-7xl mt-8 mb-7 py-2 w-full sm:max-w-2xl lg:max-w-4xl px-8 sticky top-6",
    landscape:
      "mx-auto bg-white dark:bg-[#1a1a2e] border border-gray-500/50 dark:border-white/10 rounded-xl text-black dark:text-[#e2e2ef] max-w-7xl mt-8 mb-7 py-2 w-full sm:max-w-2xl lg:max-w-4xl px-8 sticky top-6",
    mobile: "flex flex-col gap-4 h-full overflow-y-auto px-4 py-6 w-screen",
  },
  fieldWrapper: {
    desktop: "mb-4",
    landscape: "mb-4",
    mobile: "",
  },
  label: {
    desktop: "text-gray-700 dark:text-[#aaaacc] font-semibold mb-2 block",
    landscape: "text-gray-700 dark:text-[#aaaacc] font-semibold mb-2 block",
    mobile: "text-gray-700 dark:text-[#aaaacc] font-semibold mb-1 block",
  },
} as const;

const transactionListVariants = {
  wrapper: {
    desktop: "flex flex-col w-full",
    landscape: "flex flex-col w-105",
  },
} as const;

export { transactionFormVariants, transactionListVariants };

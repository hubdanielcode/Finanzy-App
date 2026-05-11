const formatCurrency = (value: number) => {
  const isNegative = value < 0;

  const formatted = Math.abs(value)
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `R$ ${isNegative ? "-" : ""}${formatted}`;
};

export { formatCurrency };

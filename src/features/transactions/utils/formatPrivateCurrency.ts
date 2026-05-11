import { formatCurrency } from "./formatCurrency";

const formatPrivateCurrency = (value: number, isPrivate: boolean) => {
  return isPrivate ? "R$ *****" : formatCurrency(value);
};

export { formatPrivateCurrency };

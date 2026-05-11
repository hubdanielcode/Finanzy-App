import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import {
  MonthlyBarChartFilter,
  CategoryPieChartFilter,
} from "@/features/transactions/components/charts/ChartFilter";
import { PeriodOptions } from "@/features/transactions/model/transactionOptions";
import type { Period } from "@/features/transactions/model/transactionTypes";
import userEvent from "@testing-library/user-event";

/* - Criando dados falsos para os testes - */

const fakeYears = [2023, 2024, 2025];

/* - Criando funções mock para os testes - */

const fakeSetPeriod = vi.fn();
const fakeSetYear = vi.fn();
const fakeSetIsOpen = vi.fn();

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - CategoryPieChartFilter - */

/* - Testando a renderização do botão de filtro - */

test("should render the filter button on CategoryPieChartFilter", () => {
  render(
    <CategoryPieChartFilter
      period={undefined}
      setPeriod={fakeSetPeriod}
      isOpen={false}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  expect(screen.getByRole("button", { name: /filtros/i })).toBeInTheDocument();
});

/* - Testando a abertura do dropdown - */

test("should call setIsOpen when the filter button is clicked on CategoryPieChartFilter", async () => {
  render(
    <CategoryPieChartFilter
      period={undefined}
      setPeriod={fakeSetPeriod}
      isOpen={false}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  await userEvent.click(screen.getByRole("button", { name: /filtros/i }));

  expect(fakeSetIsOpen).toHaveBeenCalledWith(true);
});

/* - Testando a renderização das opções do dropdown - */

test("should render dropdown options when isOpen is true on CategoryPieChartFilter", () => {
  render(
    <CategoryPieChartFilter
      period={undefined}
      setPeriod={fakeSetPeriod}
      isOpen={true}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  expect(screen.getByText("Todos os períodos")).toBeInTheDocument();

  PeriodOptions.forEach((option) => {
    expect(screen.getByText(option)).toBeInTheDocument();
  });
});

/* - Testando a seleção de um período - */

test("should call setPeriod and setIsOpen when a period option is clicked on CategoryPieChartFilter", async () => {
  render(
    <CategoryPieChartFilter
      period={undefined}
      setPeriod={fakeSetPeriod}
      isOpen={true}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  await userEvent.click(screen.getByText(PeriodOptions[0]));

  expect(fakeSetPeriod).toHaveBeenCalledWith(PeriodOptions[0]);
  expect(fakeSetIsOpen).toHaveBeenCalledWith(false);
});

/* - Testando o reset do período - */

test("should call setPeriod with undefined when 'Todos os períodos' is clicked on CategoryPieChartFilter", async () => {
  render(
    <CategoryPieChartFilter
      period={undefined}
      setPeriod={fakeSetPeriod}
      isOpen={true}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  await userEvent.click(screen.getByText("Todos os períodos"));

  expect(fakeSetPeriod).toHaveBeenCalledWith(undefined);
  expect(fakeSetIsOpen).toHaveBeenCalledWith(false);
});

/* - Testando o período selecionado - */

test("should highlight the selected period on CategoryPieChartFilter", () => {
  render(
    <CategoryPieChartFilter
      period={PeriodOptions[0] as Period}
      setPeriod={fakeSetPeriod}
      isOpen={true}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  expect(screen.getByText(PeriodOptions[0])).toHaveClass("bg-purple-200");
});

/* - Testando o fechamento do dropdown - */

test("should not render dropdown options when isOpen is false on CategoryPieChartFilter", () => {
  render(
    <CategoryPieChartFilter
      period={undefined}
      setPeriod={fakeSetPeriod}
      isOpen={false}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  expect(screen.queryByText("Todos os períodos")).not.toBeInTheDocument();
});

/* - MonthlyBarChartFilter - */

/* - Testando a renderização do botão de filtro - */

test("should render the filter button on MonthlyBarChartFilter", () => {
  render(
    <MonthlyBarChartFilter
      year={undefined}
      setYear={fakeSetYear}
      years={fakeYears}
      isOpen={false}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  expect(screen.getByRole("button", { name: /filtros/i })).toBeInTheDocument();
});

/* - Testando a abertura do dropdown - */

test("should call setIsOpen when the filter button is clicked on MonthlyBarChartFilter", async () => {
  render(
    <MonthlyBarChartFilter
      year={undefined}
      setYear={fakeSetYear}
      years={fakeYears}
      isOpen={false}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  await userEvent.click(screen.getByRole("button", { name: /filtros/i }));

  expect(fakeSetIsOpen).toHaveBeenCalledWith(true);
});

/* - Testando a renderização dos anos no dropdown - */

test("should render dropdown options when isOpen is true on MonthlyBarChartFilter", () => {
  render(
    <MonthlyBarChartFilter
      year={undefined}
      setYear={fakeSetYear}
      years={fakeYears}
      isOpen={true}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  expect(screen.getByText("Todos os anos")).toBeInTheDocument();

  fakeYears.forEach((year) => {
    expect(screen.getByText(year)).toBeInTheDocument();
  });
});

/* - Testando a seleção de um ano - */

test("should call setYear and setIsOpen when a year option is clicked on MonthlyBarChartFilter", async () => {
  render(
    <MonthlyBarChartFilter
      year={undefined}
      setYear={fakeSetYear}
      years={fakeYears}
      isOpen={true}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  await userEvent.click(screen.getByText(fakeYears[0]));

  expect(fakeSetYear).toHaveBeenCalledWith(fakeYears[0]);
  expect(fakeSetIsOpen).toHaveBeenCalledWith(false);
});

/* - Testando o reset do ano - */

test("should call setYear with undefined when 'Todos os anos' is clicked on MonthlyBarChartFilter", async () => {
  render(
    <MonthlyBarChartFilter
      year={undefined}
      setYear={fakeSetYear}
      years={fakeYears}
      isOpen={true}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  await userEvent.click(screen.getByText("Todos os anos"));

  expect(fakeSetYear).toHaveBeenCalledWith(undefined);
  expect(fakeSetIsOpen).toHaveBeenCalledWith(false);
});

/* - Testando o ano selecionado - */

test("should highlight the selected year on MonthlyBarChartFilter", () => {
  render(
    <MonthlyBarChartFilter
      year={fakeYears[0]}
      setYear={fakeSetYear}
      years={fakeYears}
      isOpen={true}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  expect(screen.getByText(fakeYears[0])).toHaveClass("bg-purple-200");
});

/* - Testando o fechamento do dropdown - */

test("should not render dropdown options when isOpen is false on MonthlyBarChartFilter", () => {
  render(
    <MonthlyBarChartFilter
      year={undefined}
      setYear={fakeSetYear}
      years={fakeYears}
      isOpen={false}
      setIsOpen={fakeSetIsOpen}
    />,
  );

  expect(screen.queryByText("Todos os anos")).not.toBeInTheDocument();
});

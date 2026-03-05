import { render, screen } from "@testing-library/react";
import { Footer, appVersion } from "@/shared/components/Footer";

/* - Testando renderização do footer => Não deve renderizar se isMobileFormOpen === true - */

test("should not render footer when isMobileFormOpen is true", () => {
  render(
    <Footer
      isMobileFormOpen={true}
      isMobileTransactionListOpen={false}
    />,
  );

  expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
});

/* - Testando renderização do footer => Não deve renderizar se isMobileTransactionListOpen === true - */

test("should not render footer when isMobileTransactionListOpen is true", () => {
  render(
    <Footer
      isMobileFormOpen={false}
      isMobileTransactionListOpen={true}
    />,
  );
  expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
});

/* - Testando renderização do footer quando isMobileFormOpen === false && isMobileTransactionListOpen === false - */

test("should render footer when both isMobileFormOpen and isMobileTransactionListOpen are false", () => {
  render(
    <Footer
      isMobileFormOpen={false}
      isMobileTransactionListOpen={false}
    />,
  );
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});

/* - Testando renderização do nome do autor - */

test("should render a span with text 'app desenvolvido por Daniel Lorenzo", () => {
  render(
    <Footer
      isMobileFormOpen={false}
      isMobileTransactionListOpen={false}
    />,
  );
  const authorName = screen.getByText(/Daniel Lorenzo/i);

  expect(authorName).toBeInTheDocument();
});

/* - Testando renderização da versão - */

test("should render a span with the current app version", () => {
  render(
    <Footer
      isMobileFormOpen={false}
      isMobileTransactionListOpen={false}
    />,
  );

  expect(screen.getByText(appVersion)).toBeInTheDocument();
});

/* - Testando renderização do ano atual - */

test("should render a span with the current year", () => {
  render(
    <Footer
      isMobileFormOpen={false}
      isMobileTransactionListOpen={false}
    />,
  );
  const currentYear = new Date().getFullYear().toString();

  expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
});

/* - Testando renderização do texto de copyright - */

test("should render a span with the copyright text ", () => {
  render(
    <Footer
      isMobileFormOpen={false}
      isMobileTransactionListOpen={false}
    />,
  );
  expect(screen.getByText(/Todos os direitos reservados/i)).toBeInTheDocument();
  expect(screen.getByText("Finanzy")).toBeInTheDocument();
});

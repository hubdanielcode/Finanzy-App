import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Footer, appVersion } from "@/shared/components/Footer";
import { MobileContext } from "@/features/transactions/context/MobileContext";

/* - Criando wrapper de render do Footer - */

const renderFooter = (contextValue: any) => {
  return render(
    <MemoryRouter>
      <MobileContext.Provider value={contextValue}>
        <Footer />
      </MobileContext.Provider>
    </MemoryRouter>,
  );
};

/* - Testando não renderização quando isMobileFormOpen === true - */

test("should not render footer when isMobileFormOpen is true", () => {
  renderFooter({
    isMobileFormOpen: true,
    isMobileTransactionListOpen: false,
  });

  expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
});

/* - Testando não renderização quando isMobileTransactionListOpen === true - */

test("should not render footer when isMobileTransactionListOpen is true", () => {
  renderFooter({
    isMobileFormOpen: false,
    isMobileTransactionListOpen: true,
  });

  expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
});

/* - Testando renderização do footer quando ambos estão false - */

test("should render footer when both are false", () => {
  renderFooter({
    isMobileFormOpen: false,
    isMobileTransactionListOpen: false,
  });

  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});

/* - Testando renderização do nome do autor - */

test("should render author name Daniel Lorenzo", () => {
  renderFooter({
    isMobileFormOpen: false,
    isMobileTransactionListOpen: false,
  });

  expect(screen.getByText(/Daniel Lorenzo/i)).toBeInTheDocument();
});

/* - Testando renderização da versão da aplicação - */

test("should render app version", () => {
  renderFooter({
    isMobileFormOpen: false,
    isMobileTransactionListOpen: false,
  });

  expect(screen.getByText(appVersion)).toBeInTheDocument();
});

/* - Testando renderização do ano atual - */

test("should render current year", () => {
  renderFooter({
    isMobileFormOpen: false,
    isMobileTransactionListOpen: false,
  });

  const year = new Date().getFullYear().toString();
  expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
});

import { createContext, useState, useEffect, type ReactNode } from "react";

interface MobileContextType {
  isMobile: boolean;
  isLandscape: boolean;
  isMobileFormOpen: boolean;
  setIsMobileFormOpen: (isMobileFormOpen: boolean) => void;
  isMobileTransactionListOpen: boolean;
  setIsMobileTransactionListOpen: (
    isMobileTransactionListOpen: boolean,
  ) => void;
  isMobileChartOpen: boolean;
  setIsMobileChartOpen: (isMobileChartOpen: boolean) => void;
}

const MobileContext = createContext<MobileContextType | null>(null);

const MobileProvider = ({ children }: { children: ReactNode }) => {
  /* - Estados de form - */

  const [isMobileFormOpen, setIsMobileFormOpen] = useState<boolean>(false);

  /* - Estados de lista - */

  const [isMobileTransactionListOpen, setIsMobileTransactionListOpen] =
    useState<boolean>(false);

  /* - Estados de gráfico - */

  const [isMobileChartOpen, setIsMobileChartOpen] = useState<boolean>(false);

  /* - Funções - */

  // 1. Definindo o layout baseado no tamanho da tela

  const getScreenState = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const isMobile = width < 640;
    const isLandscape = width >= 640 && width < 1023 && width > height;

    return { isMobile, isLandscape };
  };

  // 2. Redefinindo para o layout escolhido

  useEffect(() => {
    const handleResize = () => setScreenState(getScreenState());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* - Definições - */

  const [{ isMobile, isLandscape }, setScreenState] = useState(getScreenState);

  return (
    <MobileContext.Provider
      value={{
        isMobile,
        isLandscape,
        isMobileFormOpen,
        setIsMobileFormOpen,
        isMobileTransactionListOpen,
        setIsMobileTransactionListOpen,
        isMobileChartOpen,
        setIsMobileChartOpen,
      }}
    >
      {children}
    </MobileContext.Provider>
  );
};

export { MobileContext, MobileProvider };

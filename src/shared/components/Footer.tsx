import { useMobileContext } from "@/features/transactions/hooks/useMobileContext";
import { LuDot } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";

const appVersion = "v2.0.0";

const Footer = () => {
  /* - Puxando do context - */

  const { isMobileFormOpen, isMobileTransactionListOpen } = useMobileContext();

  /* - Definições - */
  const location = useLocation();

  if (!isMobileFormOpen && !isMobileTransactionListOpen) {
    return (
      <footer className="w-full border-t bg-[#222] dark:bg-[#0a0a10] text-white border-gray-500/50 dark:border-white/5 mt-8 sticky bottom-0 z-2">
        <div className="w-full max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm min-w-0">
          <span className="text-white dark:text-[#444]">
            © {new Date().getFullYear()}{" "}
            <strong className="dark:text-[#666]">Finanzy</strong> Todos os
            direitos reservados.
          </span>

          <Link
            className="hover:underline text-white dark:text-[#444] dark:hover:text-[#8888aa] transition-colors"
            to={"/politica-de-privacidade"}
            state={{ from: location.pathname }}
          >
            Política de Privacidade
          </Link>

          <Link
            className="hover:underline text-white dark:text-[#444] dark:hover:text-[#8888aa] transition-colors"
            to={"/termos-de-uso"}
            state={{ from: location.pathname }}
          >
            Termos de Uso
          </Link>

          <span className="flex items-center gap-1 text-xs text-white dark:text-[#444]">
            <span>App desenvolvido por</span>

            <strong className="dark:text-[#666]">Daniel Lorenzo</strong>

            <LuDot className="h-4 w-4 md:h-5 md:w-5 text-white dark:text-[#444]" />

            <span>{appVersion}</span>
          </span>
        </div>
      </footer>
    );
  }
};

export { Footer, appVersion };

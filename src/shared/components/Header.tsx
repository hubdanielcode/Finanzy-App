import { TransactionCards } from "../../features/transactions";
import {
  Eye,
  EyeClosed,
  ChartColumnDecreasing,
  Menu,
  Landmark,
  Sun,
  LogOut,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FinanzyLogo from "../../../public/FinanzyLogo.png";
import { syncTransactionsFromBank } from "@/features/transactions/services/pluggyService";
import { PluggyConnect } from "@/features/transactions/components/PluggyConnect";
import { useAuthenticationContext } from "@/features/authentication/hooks/useAuthenticationContext";
import { supabase } from "../../../supabase/supabase";
import { useMobileContext } from "@/features/transactions/hooks/useMobileContext";
import { useThemeContext } from "../hooks/useThemeContext";

const Header: React.FC = () => {
  /* - Puxando do context - */

  const { name } = useAuthenticationContext();
  const { isMobile, isLandscape } = useMobileContext();
  const { theme, toggleTheme } = useThemeContext();

  /* - Estados de esconder os valores - */

  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  /* - Estados do menu dropdown - */

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  /* - Estados da pluggy - */

  const [isWidgetOpen, setIsWidgetOpen] = useState<boolean>(false);

  /* - Definições - */

  const isMobileLandscape = isMobile && isLandscape;
  const isDesktop = !isMobile;
  const navigate = useNavigate();

  /* - Funções - */

  // 1. Desconecta o usuário ao clicar no botão e redireciona-o para a página de login

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // 2. Define qual nome vai retornar para aparecer na saudação

  const formattedName = (name: string) => {
    const parts = name.trim().split(/\s+/);

    if (parts.length <= 2) {
      return name;
    } else {
      return `${parts[0]} ${parts[parts.length - 1]}`;
    }
  };

  return (
    <header className="relative w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-[#0f0f13] dark:via-[#1a1a2e] dark:to-[#16213e] py-6 sm:py-2 md:py-6">
      <div className="w-full sm:w-160 md:max-w-7xl md:mx-auto text-white px-4 md:px-6 lg:px-8">
        {/* - Topo: Logo + Ocultar - */}

        <div className="flex items-center justify-between w-full flex-1">
          {/* - Logo + título - */}

          <div className="backdrop-blur-sm rounded-xl flex items-center p-5">
            <img
              className="shrink-0 rounded-lg object-cover h-10 w-10 sm:h-8 sm:w-8 md:h-14 md:w-14"
              src={FinanzyLogo}
              alt="Logo"
            />

            <div className="pl-4 overflow-hidden">
              <h1 className="font-bold truncate text-lg sm:text-base md:text-3xl text-white">
                Controle Financeiro
              </h1>

              <p className="text-[11.5px] sm:text-sm md:text-base opacity-80 truncate text-white dark:text-[#8888aa] dark:opacity-100">
                Gerencie suas finanças pessoais
              </p>
            </div>
          </div>

          {/* - Botão Ocultar - */}

          <div className="flex items-center">
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-[#6c63ff]/20 border border-gray-50/50 dark:border-[#6c63ff]/40 backdrop-blur-sm rounded-lg font-semibold whitespace-nowrap cursor-pointer text-white dark:text-[#a09cff]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPrivate ? "Mostrar" : "Ocultar"}
              onClick={() => setIsPrivate(!isPrivate)}
            >
              {isPrivate ? (
                <EyeClosed
                  className={isMobileLandscape ? "h-4 w-4" : "h-6 w-6"}
                />
              ) : (
                <Eye className={isMobileLandscape ? "h-4 w-4" : "h-6 w-6"} />
              )}
              {(isDesktop || isMobileLandscape) && (
                <span>{isPrivate ? "Mostrar" : "Ocultar"}</span>
              )}
            </motion.button>
          </div>
        </div>

        {/* - Cards - */}

        <TransactionCards isPrivate={isPrivate} />
      </div>

      {/* - Dropdown - */}

      <div className="hidden sm:absolute md:absolute top-0 right-5 sm:flex sm:flex-col md:flex md:flex-col gap-2 p-4 sm:p-2 z-50">
        {/* - Nome + Ícone do menu - */}

        <div className="flex items-center justify-end gap-3">
          <span className="text-base sm:text-sm font-semibold text-white dark:text-[#e2e2ef]">
            Olá, {formattedName(name)} !
          </span>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu
              className="cursor-pointer text-white dark:text-[#a09cff] h-8 w-8 sm:h-5 sm:w-5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </motion.div>
        </div>

        {/* - Menu - */}

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="flex flex-col bg-black/50 dark:bg-[#1a1a2e]/95 text-white border border-gray-50/50 dark:border-[#ffffff]/10 rounded-lg px-4 sm:px-2"
              initial={{ y: -120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -120, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                className="flex items-center gap-2 font-semibold sm:text-sm text-white dark:text-[#e2e2ef] py-3 border-b border-gray-50/50 dark:border-[#ffffff]/10 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWidgetOpen(true)}
              >
                <Landmark className="h-5 w-5 sm:h-4 sm:w-4 text-purple-400 dark:text-[#a09cff]" />
                Conectar Banco
              </motion.button>

              <motion.button
                className="flex items-center gap-2 font-semibold sm:text-sm text-white dark:text-[#e2e2ef] py-3 border-b border-gray-50/50 dark:border-[#ffffff]/10 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/graficos")}
              >
                <ChartColumnDecreasing className="h-5 w-5 sm:h-4 sm:w-4 text-blue-400 dark:text-[#4f9eff]" />
                Gráficos
              </motion.button>

              <motion.button
                className="flex items-center gap-2 font-semibold text-white dark:text-[#e2e2ef] sm:text-sm py-3 border-b border-gray-50/50 dark:border-[#ffffff]/10 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
              >
                {theme === "Dark" ? (
                  <span className="flex gap-2 w-full">
                    <Sun className="h-5 w-5 sm:h-4 sm:w-4 text-yellow-400" />
                    Tema Claro
                  </span>
                ) : (
                  <span className="flex gap-2 w-full">
                    <Moon className="h-5 w-5 sm:h-4 sm:w-4 text-gray-400 dark:text-[#a09cff]" />
                    Tema Escuro
                  </span>
                )}
              </motion.button>

              <motion.button
                className="flex items-center gap-2 font-semibold sm:text-sm text-white dark:text-[#e2e2ef] py-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 sm:h-4 sm:w-4 text-red-400 dark:text-[#e24b4a]" />
                Sair
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* - Pluggy Connect Widget - */}

      {isWidgetOpen && (
        <div className="flex items-center justify-center fixed inset-0 z-50">
          <div>
            <PluggyConnect
              onSuccess={async (accountId) => {
                setIsWidgetOpen(false);
                await syncTransactionsFromBank(accountId);
              }}
              onError={() => setIsWidgetOpen(false)}
              onClose={() => setIsWidgetOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export { Header };

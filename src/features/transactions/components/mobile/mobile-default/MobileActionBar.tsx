import { FaPenSquare, FaPlusSquare } from "react-icons/fa";
import {
  LogOut,
  Sun,
  Moon,
  Menu,
  ChartColumnDecreasing,
  Landmark,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../../../supabase/supabase";
import { useAuthenticationContext } from "@/features/authentication/hooks/useAuthenticationContext";
import { PluggyConnect } from "@/features/transactions/components/PluggyConnect";
import { syncTransactionsFromBank } from "@/features/transactions/services/pluggyService";
import { useThemeContext } from "@/shared/hooks/useThemeContext";

interface MobileActionBarProps {
  OpenForm: () => void;
  OpenTransactionList: () => void;
  OpenChart: () => void;
  onConnectBank?: () => void;
}

const MobileActionBar: React.FC<MobileActionBarProps> = ({
  OpenForm,
  OpenTransactionList,
  OpenChart,
}) => {
  /* - Puxando do context - */

  const { name } = useAuthenticationContext();
  const { theme, toggleTheme } = useThemeContext();

  /* - Estados do menu - */

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  /* - Puxando da pluggy - */

  const [isWidgetOpen, setIsWidgetOpen] = useState<boolean>(false);

  /* - Definições - */

  const navigate = useNavigate();

  /* - Funções - */

  // 1. Desconecta e volta pra página inicial quando o usuário clica no botão de sair

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // 2. Define qual nome vai aparecer na saudação

  const formattedName = (name: string) => {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return name;
    } else {
      return `${parts[0]} ${parts[parts.length - 1]}`;
    }
  };

  return (
    <>
      <div className="sm:hidden md:hidden flex flex-1 flex-col gap-4 px-4 mt-6">
        {/* - Saudação + Menu - */}

        <div className="flex items-center justify-between">
          <span className="font-bold text-black dark:text-[#e2e2ef] text-lg">
            Olá, {formattedName(name)} !
          </span>

          <button
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1a2e]"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <Menu className="h-5 w-5 text-black dark:text-[#a09cff]" />
          </button>
        </div>

        {/* - Dropdown do menu - */}

        {isMenuOpen && (
          <div className="flex flex-col bg-white dark:bg-[#1a1a2e] border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3">
            <button
              className="flex items-center gap-2 font-semibold text-black dark:text-[#e2e2ef] py-3 border-b border-gray-100 dark:border-white/10"
              onClick={() => {
                OpenChart();
                setIsMenuOpen(false);
              }}
            >
              <ChartColumnDecreasing className="h-5 w-5 text-blue-600 dark:text-[#4f9eff]" />
              Mostrar Gráficos
            </button>

            <button
              className="flex items-center gap-2 font-semibold text-black dark:text-[#e2e2ef] py-3 border-b border-gray-100 dark:border-white/10"
              onClick={() => {
                setIsWidgetOpen(true);
                setIsMenuOpen(false);
              }}
            >
              <Landmark className="h-5 w-5 text-indigo-600 dark:text-[#a09cff]" />
              Conectar Banco
            </button>

            <button
              className="flex items-center gap-2 font-semibold text-black dark:text-[#e2e2ef] py-3 border-b border-gray-100 dark:border-white/10"
              onClick={toggleTheme}
            >
              {theme === "Dark" ? (
                <>
                  <Sun className="h-5 w-5 text-yellow-400" />
                  Tema Claro
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 text-gray-400" />
                  Tema Escuro
                </>
              )}
            </button>

            <button
              className="flex items-center gap-2 font-semibold text-black dark:text-[#e2e2ef] py-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 text-red-500 dark:text-[#e24b4a]" />
              Sair
            </button>
          </div>
        )}

        {/* - Botões de ação - */}

        <button
          className="flex items-center gap-2 flex-1 bg-white dark:bg-[#1a1a2e] border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 font-bold text-black dark:text-[#e2e2ef]"
          onClick={() => OpenForm()}
        >
          <FaPlusSquare className="text-blue-600 dark:text-[#a09cff] bg-blue-200 dark:bg-[#6c63ff]/20 rounded-lg h-6 w-6" />
          Nova Transação
        </button>

        <button
          className="flex items-center gap-2 flex-1 bg-white dark:bg-[#1a1a2e] border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 font-bold text-black dark:text-[#e2e2ef]"
          onClick={() => OpenTransactionList()}
        >
          <FaPenSquare className="text-blue-600 dark:text-[#a09cff] bg-blue-200 dark:bg-[#6c63ff]/20 rounded-lg h-6 w-6" />
          Exibir Transações
        </button>
      </div>

      {isWidgetOpen && (
        <div className="flex items-center justify-center fixed inset-0 z-50">
          <PluggyConnect
            onSuccess={async (accountId) => {
              setIsWidgetOpen(false);
              await syncTransactionsFromBank(accountId);
            }}
            onError={() => setIsWidgetOpen(false)}
            onClose={() => setIsWidgetOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export { MobileActionBar };

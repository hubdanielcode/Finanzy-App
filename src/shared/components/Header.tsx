import { TransactionCards } from "../../features/transactions";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import FinanzyLogo from "../../../public/FinanzyLogo.png";

const Header: React.FC = () => {
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <header className="w-full min-w-fit py-6 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="flex justify-between items-center max-w-7xl overflow-auto">
          {/* - Logo + título - */}

          <div className="backdrop-blur-sm rounded-xl flex items-center p-4">
            <img
              className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 rounded-lg object-cover"
              src={FinanzyLogo}
              alt="Logo"
            />

            <div className="pl-4 overflow-hidden">
              <h1 className="text-lg sm:text-3xl font-bold truncate">
                Controle Financeiro
              </h1>
              <p className="text-[11.5px] sm:text-sm opacity-90 truncate">
                Gerencie suas finanças pessoais
              </p>
            </div>
          </div>

          {/* - Botão - */}

          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className="flex items-center gap-2 bg-white/20 border border-gray-500/50 backdrop-blur-sm rounded-lg py-2 px-4 font-semibold whitespace-nowrap focus:none outline:none cursor-pointer"
          >
            {isPrivate ? (
              <EyeClosed className="h-6 w-6" />
            ) : (
              <Eye className="h-6 w-6" />
            )}
            <span className="hidden sm:inline">
              {isPrivate ? "Mostrar" : "Ocultar"}
            </span>
          </button>
        </div>

        {/* - Cards - */}

        <TransactionCards isPrivate={isPrivate} />
      </div>
    </header>
  );
};

export { Header };

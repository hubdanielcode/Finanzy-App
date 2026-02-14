import { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase";
import type { Session } from "@supabase/supabase-js";

import FinanzyLogo from "../../../public/FinanzyLogo.png";
import Mascote from "../../assets/images/mascote.png";

interface NewUserModalProps {
  session: Session | null;
}

const NewUserModal: React.FC<NewUserModalProps> = ({ session }) => {
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [firstName, setFirstName] = useState<string | null>("...");

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("first_name")
        .eq("user_id", session.user.id);

      if (error) {
        console.log("Erro ao buscar nome:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setFirstName(data[0].first_name);
      } else {
        setFirstName(null);
      }
    };

    const checkWelcomeStatus = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("has_seen_welcome")
        .eq("user_id", session.user.id);

      if (error) {
        console.log("Erro ao buscar usuários", error.message);
        return;
      }

      if (data && data.length > 0 && data[0].has_seen_welcome === false) {
        setIsNewUserModalOpen(true);
        await supabase
          .from("users")
          .update({ has_seen_welcome: true })
          .eq("user_id", session.user.id);
      }
    };

    fetchUserData();
    checkWelcomeStatus();
  }, [session]);

  if (!isNewUserModalOpen) return null;

  return (
    <div className="fixed inset-0 z-3 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="relative max-w-[80%] sm:max-w-[30%] min-h-[30%] sm:min-h-[45%] rounded-2xl bg-linear-to-br from-black/85 via-black/80 to-black/75 p-4 sm:p-8 shadow-lg sm:shadow-2xl">
        {/* - Logo - */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[60%]">
          <div className="w-16 h-16 sm:h-24 sm:w-24 rounded-full flex items-center justify-center shadow-xl border border-gray-500/50">
            <img
              className="h-16 w-16 sm:h-24 sm:w-24 object-cover shrink-0 rounded-full"
              src={FinanzyLogo}
              alt="Logo"
            />
          </div>
        </div>

        {/* - Título - */}

        <h2 className="text-center text-lg sm:text-3xl font-bold text-white mt-10 mb-12">
          Bem-vindo(a), {firstName}
        </h2>

        {/* - Texto - */}

        <div className="grid grid-cols-[1fr_2fr] items-center gap-6 sm:gap-8 mb-5">
          <div className="w-16 h-16 sm:h-45 sm:w-45 border border-gray-500/50 rounded-full bg-linear-to-br from-blue-400 via-indigo-400 to-purple-400 flex items-center justify-center shadow-xl">
            <img
              className="h-16 w-16 sm:h-55 sm:w-55 object-cover shrink-0 ml-6 mx-auto mt-4"
              src={Mascote}
              alt="Logo"
            />
          </div>
          <p className="text-center text-sm sm:text-lg text-white/80 font-semibold leading-relaxed mb-3 sm:mb-6">
            Estamos felizes em tê-lo a bordo. Comece explorando os recursos e
            aproveite as funcionalidades do nosso aplicativo!
          </p>
        </div>

        {/* - Botão - */}

        <div className="flex w-full justify-center sm:mt-8">
          <button
            className="w-full rounded-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-gray-500/50 py-3 font-semibold text-sm sm:text-md text-white shadow-lg transition hover:opacity-90 cursor-pointer"
            onClick={() => setIsNewUserModalOpen(false)}
          >
            Vamos Lá!
          </button>
        </div>
      </div>
    </div>
  );
};

export { NewUserModal };

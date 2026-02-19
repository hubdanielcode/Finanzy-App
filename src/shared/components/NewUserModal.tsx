import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import type { Session } from "@supabase/supabase-js";

import FinanzyLogo from "../../../public/FinanzyLogo.png";
import Mascote from "../../assets/images/mascote.png";

interface NewUserModalProps {
  session: Session | null;
}

const NewUserModal: React.FC<NewUserModalProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("first_name, has_seen_welcome")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar usuário:", error.message);
        return;
      }

      setFirstName(data.first_name ?? "");

      if (data.has_seen_welcome === false) {
        setIsOpen(true);
      }
    };

    loadUser();
  }, [session]);

  const handleClose = async () => {
    setIsOpen(false);

    await supabase
      .from("users")
      .update({ has_seen_welcome: true })
      .eq("user_id", session?.user.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative max-w-[80%] sm:max-w-[30%] min-h-[30%] sm:min-h-[45%] rounded-2xl bg-linear-to-br from-black/85 via-black/80 to-black/75 p-4 sm:p-8 shadow-2xl">
        {/* - Logo - */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[60%]">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-gray-500/50 shadow-xl">
            <img
              src={FinanzyLogo}
              alt="Logo"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-center text-lg sm:text-3xl font-bold text-white mt-10 mb-10">
          Bem-vindo{firstName && `, ${firstName}`} 🎉
        </h2>

        <div className="grid grid-cols-[1fr_2fr] items-center gap-6 mb-6">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-blue-400 via-indigo-400 to-purple-400 shadow-xl flex items-center justify-center">
            <img
              src={Mascote}
              alt="Mascote"
              className="w-20 h-20 object-contain"
            />
          </div>

          <p className="text-sm sm:text-lg text-white/80 font-semibold leading-relaxed">
            Estamos felizes em te receber! Explore o app e aproveite todos os
            recursos.
          </p>
        </div>

        <button
          onClick={handleClose}
          className="w-full rounded-full bg-linear-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg hover:opacity-90 transition"
        >
          Vamos lá!
        </button>
      </div>
    </div>
  );
};

export { NewUserModal };

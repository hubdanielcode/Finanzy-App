import { useEffect, useState } from "react";
import { supabase } from "../../../supabase/supabase";
import type { Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import FinanzyLogo from "../../../public/FinanzyLogo.png";
import Mascote from "../../assets/images/mascote.png";

interface NewUserModalProps {
  session: Session | null;
}

const NewUserModal: React.FC<NewUserModalProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

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

      setName(data.first_name ?? "");

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm">
      <div className="relative max-w-[80%] sm:max-w-[30%] min-h-[30%] sm:min-h-[45%] rounded-2xl bg-linear-to-br from-black/85 via-black/80 to-black/75 dark:from-[#1a1a2e] dark:via-[#16213e]/95 dark:to-[#0f0f13]/95 border border-transparent dark:border-white/10 p-4 sm:p-8 shadow-2xl">
        {/* - Logo - */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[60%]">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-gray-500/50 dark:border-[#6c63ff]/40 shadow-xl dark:shadow-[#6c63ff]/10">
            <img
              src={FinanzyLogo}
              alt="Logo"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-center text-lg sm:text-3xl font-bold text-white dark:text-[#e2e2ef] mt-10 mb-10">
          Bem-vindo(a){name ? `, ${name}` : ""} 🎉
        </h2>

        <div className="grid grid-cols-[1fr_2fr] items-center gap-6 mb-6">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-blue-400 via-indigo-400 to-purple-400 dark:from-[#6c63ff]/40 dark:via-[#4f46e5]/40 dark:to-[#a09cff]/40 dark:border dark:border-[#6c63ff]/30 shadow-xl flex items-center justify-center">
            <img
              className="w-20 h-20 object-contain"
              src={Mascote}
              alt="Mascote"
            />
          </div>

          <p className="text-sm sm:text-lg text-white/80 dark:text-[#aaaacc] font-semibold leading-relaxed">
            Estamos felizes em te receber! Explore o app e aproveite todos os
            recursos.
          </p>
        </div>

        <motion.button
          className="w-full rounded-full bg-linear-to-r from-blue-600 to-indigo-600 dark:from-[#6c63ff] dark:to-[#4f46e5] py-3 font-semibold text-white shadow-lg hover:opacity-90 dark:hover:opacity-80 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClose}
        >
          Vamos lá!
        </motion.button>
      </div>
    </div>
  );
};

export { NewUserModal };

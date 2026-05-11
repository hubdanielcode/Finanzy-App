import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../../supabase/supabase";
import { MdAlternateEmail } from "react-icons/md";
import FinanzyLogo from "../../../../public/FinanzyLogo.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { regex, masks } from "@/shared";

const RecoverPassword = () => {
  /* - Estados de recuperação de senha - */

  const [recoverEmail, setRecoverEmail] = useState("");

  /* - Estados de erro - */

  const [errorMessage, setErrorMessage] = useState("");

  /* - Definições - */

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const redirectUrl = import.meta.env.VITE_REDIRECT_URL;

  /* - Funções - */

  const handleResetPassword = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    if (!recoverEmail || !regex.email.test(recoverEmail)) {
      setErrorMessage("Digite um endereço de email válido.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(recoverEmail, {
      redirectTo: `${redirectUrl}/recuperar-senha`,
    });

    if (error) {
      setErrorMessage("Erro ao tentar enviar email.");
      return;
    }

    alert(
      "Se o email estiver cadastrado, você receberá um link de redefinição de senha.",
    );

    setRecoverEmail("");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      if (!buttonRef.current.contains(e.target as Node)) {
        setErrorMessage("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center sm:justify-start bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 px-4 py-6 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-black/60 backdrop-blur-sm border border-gray-500/50 shadow-2xl px-6 py-8 sm:py-5 m-4">
        {/* - Logo - */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[60%] sm:-translate-y-[50%]">
          <div className="w-16 h-16 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl border border-gray-500/50">
            <img
              className="w-full h-full object-cover rounded-full"
              src={FinanzyLogo}
              alt="Logo"
            />
          </div>
        </div>

        <h1 className="mt-8 mb-4 text-center text-xl sm:text-2xl font-bold text-white">
          Recupere sua senha
        </h1>

        <p className="mb-6 text-sm text-white text-center">
          Informe seu endereço de email para receber um link de redefinição de
          senha
        </p>

        {/* - Email input - */}

        <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-4">
          <MdAlternateEmail className="text-blue-600 text-lg" />

          <input
            className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
            placeholder="seu@email.com"
            type="email"
            value={recoverEmail}
            onChange={(e) => setRecoverEmail(masks.email(e.target.value))}
          />
        </div>

        <motion.button
          className="mt-4 w-full h-12 sm:h-10 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 transition cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          ref={buttonRef}
          onClick={handleResetPassword}
        >
          Enviar Email
        </motion.button>

        <div className="min-h-20 py-4">
          {errorMessage && (
            <p className="flex items-center justify-center h-12 rounded-xl bg-red-100 border border-red-300 text-red-700 text-sm font-semibold px-4 text-center">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="mt-4 text-center text-sm font-semibold text-white">
          <Link
            className="hover:text-blue-400 hover:underline"
            to="/"
          >
            Voltar para a tela de Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export { RecoverPassword };

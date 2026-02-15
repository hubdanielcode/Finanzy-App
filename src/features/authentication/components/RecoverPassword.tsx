import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../supabase/supabase";
import { MdAlternateEmail } from "react-icons/md";
import FinanzyLogo from "../../../../public/FinanzyLogo.png";
import { Link } from "react-router-dom";

const RecoverPassword = () => {
  const [recoverEmail, setRecoverEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleResetPassword = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!recoverEmail || !emailRegex.test(recoverEmail)) {
      setErrorMessage("Digite um endereço de email válido.");
      return;
    }

    const redirectUrl = import.meta.env.VITE_REDIRECT_URL;

    const { error } = await supabase.auth.resetPasswordForEmail(recoverEmail, {
      redirectTo: `${redirectUrl}/recover-password`,
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
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-black/60 backdrop-blur-sm border border-gray-500/50 shadow-2xl px-6 py-8 landscape:py-5 m-4">
        {/* Logo */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[60%] landscape:-translate-y-[40%]">
          <div className="w-16 h-16 landscape:w-12 landscape:h-12 rounded-full flex items-center justify-center shadow-xl border border-gray-500/50">
            <img
              className="w-full h-full object-cover rounded-full"
              src={FinanzyLogo}
              alt="Logo"
            />
          </div>
        </div>

        <h1 className="mt-12 mb-8 landscape:mt-8 landscape:mb-4 text-center text-xl sm:text-2xl font-bold text-white">
          Recupere sua senha
        </h1>

        <p className="mb-6 text-sm text-white text-center">
          Informe seu endereço de email para receber um link de redefinição de
          senha
        </p>

        {/* Email input */}
        <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-4">
          <MdAlternateEmail className="text-blue-600 text-lg" />
          <input
            className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
            placeholder="exemplo@email.com"
            type="email"
            value={recoverEmail}
            onChange={(e) => setRecoverEmail(e.target.value)}
          />
        </div>

        <button
          ref={buttonRef}
          onClick={handleResetPassword}
          className="w-full h-12 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 transition"
        >
          Enviar Email
        </button>

        {errorMessage && (
          <p className="mt-4 flex items-center justify-center h-12 rounded-xl bg-red-100 border border-red-300 text-red-700 text-sm font-semibold px-4 text-center">
            {errorMessage}
          </p>
        )}

        <div className="mt-4 text-center text-sm font-semibold text-white">
          <Link
            to="/"
            className="hover:text-blue-400 hover:underline"
          >
            Voltar para a tela de Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export { RecoverPassword };

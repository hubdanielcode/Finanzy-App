import { useState, useEffect, useRef } from "react";
import { supabase } from "../../../supabase/supabase";
import { MdAlternateEmail } from "react-icons/md";
import FinanzyLogo from "../../../../public/FinanzyLogo.png";
import { Link } from "react-router-dom";

const RecoverPassword = () => {
  const [recoverEmail, setRecoverEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const RecoverRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!RecoverRef.current) {
        return;
      }

      const clickedInsideButton = RecoverRef.current.contains(e.target as Node);

      if (!clickedInsideButton) {
        setErrorMessage("");
        setRecoverEmail("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-black/60 backdrop-blur-sm border border-gray-500/50 shadow-2xl px-8 py-10">
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

        <h1 className="mt-12 mb-8 text-center text-2xl font-bold text-white">
          Recupere sua senha
        </h1>
        <div className="flex text-sm text-white justify-center items-center w-full">
          <p className="px-4 py-2 mb-4 min-h-10 text-center">
            Informe-nos o seu endereço de email para que possamos enviar um link
            para redefinir sua senha
          </p>
        </div>

        {/* - Inputs - */}

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

        {/* - Botão de recuperação de senha - */}

        <button
          className="mt-4 w-full h-12 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-500  hover:to-indigo-500 transition cursor-pointer"
          onClick={handleResetPassword}
          ref={RecoverRef}
        >
          Enviar Email
        </button>
        <div className="h-14 w-full text-center text-md">
          {errorMessage && (
            <p className="flex justify-center items-center mt-5 w-full h-12 rounded-xl bg-red-100 border border-red-300 text-red-700 text-md font-semibold px-4 py-2 text-center">
              {errorMessage}
            </p>
          )}
        </div>
        <div className="flex flex-col ml-2 text-white font-semibold text-sm">
          <Link
            className="text-white flex justify-center items-center text-sm hover:text-blue-400 hover:underline"
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

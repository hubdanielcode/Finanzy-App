import { useEffect, useRef, useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { supabase } from "../../../supabase/supabase";
import { Link, useNavigate } from "react-router-dom";

import FinanzyLogo from "../../../../public/FinanzyLogo.png";
import { Eye, EyeClosed } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordPrivate, setIsPasswordPrivate] = useState(true);

  const [signInError, setSignInError] = useState("");

  const navigate = useNavigate();

  const LoginWithAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setSignInError("Preencha todos os campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setSignInError("Formato de email inválido.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setSignInError("Email ou senha inválidos.");
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  const signInRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!signInRef.current) {
        return;
      }

      const clickedInsideButton = signInRef.current.contains(e.target as Node);

      if (!clickedInsideButton) {
        setSignInError("");
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
          Gerencie suas finanças
        </h1>

        {/* - Inputs - */}

        <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-4">
          <MdAlternateEmail className="text-blue-600 text-lg" />
          <input
            className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
            placeholder="exemplo@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-4">
          <RiLockPasswordFill className="text-blue-600 text-lg" />
          <input
            className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
            placeholder="Senha"
            type={isPasswordPrivate ? "password" : "text"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="flex items-center gap-2 bg-transparent backdrop-blur-sm rounded-lg py-2 px-4 font-semibold whitespace-nowrap focus:none outline:none cursor-pointer"
            onClick={() => setIsPasswordPrivate(!isPasswordPrivate)}
          >
            {isPasswordPrivate ? (
              <EyeClosed className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
            <span className="hidden sm:inline text-sm text-gray-500">
              {isPasswordPrivate ? "Mostrar" : "Ocultar"}
            </span>
          </button>
        </div>

        {/* - Recupere sua senha - */}

        <div className="flex flex-row justify-center items-center text-white font-semibold text-sm">
          <p className="cursor-pointer">
            <Link
              className="text-white text-sm hover:text-blue-400 hover:underline"
              to="/recover-password"
            >
              Esqueci minha senha
            </Link>
          </p>
        </div>

        {/* - Botão de login - */}

        <button
          className="mt-4 w-full h-12 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-500  hover:to-indigo-500 transition cursor-pointer"
          onClick={LoginWithAccount}
          ref={signInRef}
        >
          Entrar
        </button>
        <div className="h-14 w-full text-center text-md">
          {signInError && (
            <p className="flex justify-center items-center mt-5 w-full h-12 rounded-xl bg-red-100 border border-red-300 text-red-700 text-md font-semibold px-4 py-2 text-center">
              {signInError}
            </p>
          )}
        </div>

        {/* - Ir para a página de cadastro - */}

        <div className="flex flex-col ml-2 text-white font-semibold text-sm">
          <p className="flex flex-row justify-center items-center gap-2 mt-5">
            Não possui cadastro?
            <Link
              className="text-white text-sm hover:text-blue-400 hover:underline"
              to="/sign-up"
            >
              Clique Aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export { Login };

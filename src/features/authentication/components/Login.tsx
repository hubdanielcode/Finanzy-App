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
  const signInRef = useRef<HTMLButtonElement | null>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!signInRef.current) return;

      const clickedInsideButton = signInRef.current.contains(e.target as Node);
      if (!clickedInsideButton) {
        setSignInError("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center landscape:justify-start bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 px-4 py-6 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-black/60 backdrop-blur-sm border border-gray-500/50 shadow-2xl px-6 py-8 landscape:py-5 m-4">
        {/* - Logo - */}

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
          Entrar
        </h1>

        {/* - Inputs - */}

        {/* - Email - */}

        <div className="flex items-center gap-3 h-12 landscape:h-10 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-4">
          <MdAlternateEmail className="text-blue-600 text-lg" />
          <input
            className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
            placeholder="exemplo@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* - Senha - */}

        <div className="flex items-center gap-3 h-12 landscape:h-10 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-2">
          <RiLockPasswordFill className="text-blue-600 text-lg" />
          <input
            className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
            placeholder="Senha"
            type={isPasswordPrivate ? "password" : "text"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="flex items-center gap-2 bg-transparent rounded-lg py-1 px-2 font-semibold whitespace-nowrap outline-none cursor-pointer"
            onClick={() => setIsPasswordPrivate(!isPasswordPrivate)}
          >
            {isPasswordPrivate ? (
              <EyeClosed className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* - Recupere sua senha - */}

        <div className="flex justify-center items-center mb-4 text-white font-semibold text-sm">
          <Link
            className="hover:text-blue-400 hover:underline"
            to="/recover-password"
          >
            Esqueci minha senha
          </Link>
        </div>

        {/* - Botão - */}

        <button
          className="mt-2 w-full h-12 landscape:h-10 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 transition cursor-pointer"
          onClick={LoginWithAccount}
          ref={signInRef}
        >
          Entrar
        </button>

        {/* - Erro - */}

        <div className="h-14 w-full text-center text-md">
          {signInError && (
            <p className="flex justify-center items-center mt-5 w-full h-12 landscape:h-10 rounded-xl bg-red-100 border border-red-300 text-red-700 text-sm font-semibold px-4 py-2 text-center">
              {signInError}
            </p>
          )}
        </div>

        {/* - Cadastro - */}

        <div className="flex flex-col text-white font-semibold text-sm">
          <p className="flex justify-center items-center gap-2 mt-5">
            Não possui cadastro?
            <Link
              className="hover:text-blue-400 hover:underline"
              to="/sign-up"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { Login };

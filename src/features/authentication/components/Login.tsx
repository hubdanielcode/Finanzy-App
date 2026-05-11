import { useEffect, useRef, useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { supabase, supabaseTemp } from "../../../../supabase/supabase";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FinanzyLogo from "../../../../public/FinanzyLogo.png";
import { Eye, EyeClosed } from "lucide-react";
import { regex, masks } from "@/shared";

const Login = () => {
  /* - Estados de login - */

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  /* - Estado de erro - */

  const [signInError, setSignInError] = useState("");

  /* - Estado para esconder a senha - */

  const [isPasswordPrivate, setIsPasswordPrivate] = useState(true);

  /* - Definições - */

  const navigate = useNavigate();
  const signInRef = useRef<HTMLButtonElement | null>(null);
  const client = rememberMe ? supabase : supabaseTemp;

  /* - Funções - */

  // 1. Fazendo login

  const loginWithAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setSignInError("Preencha todos os campos.");
      return;
    }

    if (!regex.email.test(email)) {
      setSignInError("Formato de email inválido.");
      return;
    }

    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setSignInError("Email ou senha inválidos.");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    if (!rememberMe) {
      const { data } = await supabaseTemp.auth.getSession();
      if (data.session) {
        sessionStorage.setItem(
          "supabase_session",
          JSON.stringify(data.session),
        );
      }
    }

    navigate("/pagina-principal", { replace: true });
  };

  // 2. Carregando a página com o email salvo

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // 3. Fechando o erro ao clicar fora

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
          Entrar
        </h1>

        {/* - Email input - */}

        <span className="text-white font-semibold text-sm">Seu Email</span>

        <div className="flex items-center gap-3 h-12 sm:h-10 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mt-2 mb-4">
          <div className="flex gap-2 w-full">
            <MdAlternateEmail className="text-blue-600 text-lg" />

            <input
              className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
              placeholder="seu@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(masks.email(e.target.value))}
            />
          </div>
        </div>

        {/* - Senha input - */}

        <span className="text-white font-semibold text-sm">Sua Senha</span>

        <div className="flex items-center gap-3 h-12 sm:h-10 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mt-2">
          <div className="flex gap-2 w-full">
            <RiLockPasswordFill className="text-blue-600 text-lg" />

            <input
              className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
              placeholder="••••••"
              type={isPasswordPrivate ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="flex items-center gap-2 bg-transparent rounded-lg py-1 px-2 font-semibold whitespace-nowrap outline-none cursor-pointer"
              type="button"
              aria-label="Toggle Password Visibility Login"
              onClick={() => setIsPasswordPrivate(!isPasswordPrivate)}
            >
              {isPasswordPrivate ? (
                <EyeClosed className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <p className="text-white/70 text-sm mt-1 mb-4">
          Mínimo de 6 caracteres.
        </p>

        {/* - Checkbox - */}

        <div className="flex gap-3 justify-center items-center my-3">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />

          <p className="text-white/70 text-sm">Lembre-me</p>

          {/* - Recupere sua senha - */}

          <Link
            className="text-sm font-semibold text-white hover:text-blue-400 hover:underline ml-auto"
            to="/recuperar-senha"
          >
            Esqueci minha senha
          </Link>
        </div>

        {/* - Botão - */}

        <motion.button
          className="mt-2 w-full h-12 sm:h-10 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 transition cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loginWithAccount}
          ref={signInRef}
        >
          Entrar
        </motion.button>

        {/* - Erro - */}

        <div className="min-h-20 py-4">
          {signInError && (
            <p className="flex items-center justify-center h-12 rounded-xl bg-red-100 border border-red-300 text-red-700 text-sm font-semibold px-4 text-center">
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
              to="/cadastro"
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

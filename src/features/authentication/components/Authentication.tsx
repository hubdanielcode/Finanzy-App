import { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { supabase } from "../../../../supabase/supabase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FinanzyLogo from "../../../../public/FinanzyLogo.png";
import { Eye, EyeClosed } from "lucide-react";
import { regex, masks } from "@/shared";

const Authentication = () => {
  /* - Estados de cadastro - */

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);

  /* - Estado de erro - */

  const [signUpError, setSignUpError] = useState<string>("");

  /* - Estado para esconder a senha - */

  const [isPasswordPrivate, setIsPasswordPrivate] = useState<boolean>(true);
  const [isConfirmPasswordPrivate, setIsConfirmPasswordPrivate] =
    useState<boolean>(true);

  /* - Definições - */

  const signUpRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  /* - Funções - */

  // 1. Criando a conta

  const createNewAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setSignUpError("Preencha todos os campos.");
      return;
    }

    if (!regex.name.test(name)) {
      setSignUpError("Nome inválido.");
      return;
    }

    if (!regex.email.test(email)) {
      setSignUpError("Formato de email inválido.");
      return;
    }

    if (password !== confirmPassword) {
      setSignUpError("As senhas não coincidem.");
      return;
    }

    if (password.length <= 5) {
      setSignUpError("A senha deve conter, pelo menos, 6 caracteres.");
      return;
    }

    const redirectUrl = import.meta.env.VITE_REDIRECT_URL;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: `${redirectUrl}/`,
      },
    });

    if (error) {
      setSignUpError(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("users").insert([
        {
          user_id: data.user.id,
          email: data.user.email,
          name: name,
          has_seen_welcome: false,
        },
      ]);
    }

    if (!data.session) {
      alert(
        "Enviamos um email de confirmação. Verifique sua caixa de entrada.",
      );
    } else {
      alert("Conta criada com sucesso!");
    }

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // 2. Fechando o erro ao clicar fora

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!signUpRef.current) return;

      const clickedInsideButton = signUpRef.current.contains(e.target as Node);

      if (!clickedInsideButton) {
        setSignUpError("");
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
          Cadastre-se
        </h1>

        {/* - Input de primeiro nome - */}

        <span className="text-white font-semibold text-sm">Seu Nome</span>

        <div className="flex items-center gap-3 h-12 sm:h-10 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mt-2 mb-4">
          <div className="flex gap-2 w-full">
            <FaUser className="text-blue-600 text-lg h-4 w-4" />

            <input
              className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
              placeholder="Nome Completo"
              type="text"
              value={name}
              onChange={(e) => setName(masks.name(e.target.value))}
            />
          </div>
        </div>

        {/* - Email - */}

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

        {/* - Senha - */}

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
              className="flex items-center bg-transparent rounded-lg font-semibold whitespace-nowrap outline-none cursor-pointer"
              aria-label="Toggle Password Visibility"
              type="button"
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

        {/* - Confirmar Senha - */}

        <span className="text-white font-semibold text-sm">
          Confirme Sua Senha
        </span>

        <div className="flex items-center gap-3 h-12 sm:h-10 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mt-2">
          <div className="flex gap-2 w-full">
            <RiLockPasswordFill className="text-blue-600 text-lg" />

            <input
              className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
              placeholder="••••••"
              type={isConfirmPasswordPrivate ? "password" : "text"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="flex items-center bg-transparent rounded-lg font-semibold whitespace-nowrap outline-none cursor-pointer"
              aria-label="Toggle Confirm Password Visibility"
              type="button"
              onClick={() =>
                setIsConfirmPasswordPrivate(!isConfirmPasswordPrivate)
              }
            >
              {isConfirmPasswordPrivate ? (
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

        <div className="flex gap-3">
          <input
            type="checkbox"
            checked={hasAcceptedTerms}
            onChange={(e) => setHasAcceptedTerms(e.target.checked)}
          />

          <p className="text-white/70 text-sm">
            Concordo com os{" "}
            <span
              className="font-semibold text-white hover:text-blue-500 hover:underline cursor-pointer"
              role="button"
              onClick={() => {
                navigate("/termos-de-uso", {
                  state: { from: location.pathname },
                });
              }}
            >
              Termos de Uso
            </span>{" "}
            e{" "}
            <span
              className="font-semibold text-white hover:text-blue-500 hover:underline cursor-pointer"
              role="button"
              onClick={() => {
                navigate("/politica-de-privacidade", {
                  state: { from: location.pathname },
                });
              }}
            >
              Política de Privacidade
            </span>
          </p>
        </div>

        {/* - Botão - */}

        <motion.button
          className="mt-4 w-full h-12 sm:h-10 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={createNewAccount}
          disabled={!hasAcceptedTerms}
          ref={signUpRef}
        >
          Cadastrar
        </motion.button>

        {/* - Erro - */}

        <div className="min-h-20 py-4">
          {signUpError && (
            <p className="flex items-center justify-center h-12 rounded-xl bg-red-100 border border-red-300 text-red-700 text-sm font-semibold px-4 text-center">
              {signUpError}
            </p>
          )}
        </div>

        {/* - Login - */}

        <div className="flex flex-col text-white font-semibold text-sm">
          <p className="flex justify-center items-center gap-2 mt-5">
            Já possui cadastro?
            <Link
              className="hover:text-blue-400 hover:underline"
              to="/"
            >
              Faça Login!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { Authentication };

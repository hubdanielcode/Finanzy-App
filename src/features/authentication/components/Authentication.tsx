import { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { supabase } from "../../../supabase/supabase";
import { Link } from "react-router-dom";

import FinanzyLogo from "../../../../public/FinanzyLogo.png";
import { Eye, EyeClosed } from "lucide-react";

const Authentication = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");

  const [isPasswordPrivate, setIsPasswordPrivate] = useState(true);
  const [isConfirmPasswordPrivate, setIsConfirmPasswordPrivate] =
    useState(true);

  const signUpRef = useRef<HTMLButtonElement | null>(null);

  const createNewAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const nameRegex = /^(?!.*(.)\1{2,})[A-Za-zÀ-ÿ]+$/;

    if (!nameRegex.test(firstName)) {
      setSignUpError("Nome inválido.");
      return;
    }

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setSignUpError("Preencha todos os campos.");
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
          first_name: firstName,
          last_name: lastName,
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
          first_name: firstName,
          last_name: lastName,
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

    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center landscape:justify-start bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 px-4 py-6 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-black/60 backdrop-blur-sm border border-gray-500/50 shadow-2xl px-6 py-8 landscape:py-5 m-4">
        {/* - Logo - */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[60%] landscape:-translate-y-[50%]">
          <div className="w-16 h-16 landscape:w-12 landscape:h-12 rounded-full flex items-center justify-center shadow-xl border border-gray-500/50">
            <img
              className="w-full h-full object-cover rounded-full"
              src={FinanzyLogo}
              alt="Logo"
            />
          </div>
        </div>

        <h1 className="mt-12 mb-8 landscape:mt-8 landscape:mb-4 text-center text-xl sm:text-2xl font-bold text-white">
          Cadastre-se
        </h1>

        {/* - Input de primeiro nome - */}

        <div className="flex items-center gap-3 h-12 landscape:h-10 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-4">
          <FaUser className="text-blue-600 text-lg" />
          <input
            className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
            placeholder="Primeiro Nome"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* - input de último nome - */}

        <div className="flex items-center gap-3 h-12 landscape:h-10 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-4">
          <FaUser className="text-blue-600 text-lg" />
          <input
            className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
            placeholder="Último Nome"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

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

        <div className="flex items-center gap-3 h-12 landscape:h-10 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-4">
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

        {/* - Confirmar Senha - */}

        <div className="flex items-center gap-3 h-12 landscape:h-10 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-4">
          <RiLockPasswordFill className="text-blue-600 text-lg" />
          <input
            className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
            placeholder="Confirme sua senha"
            type={isConfirmPasswordPrivate ? "password" : "text"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="flex items-center gap-2 bg-transparent rounded-lg py-1 px-2 font-semibold whitespace-nowrap outline-none cursor-pointer"
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

        {/* - Botão - */}

        <button
          className="mt-4 w-full h-12 landscape:h-10 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 transition cursor-pointer"
          onClick={createNewAccount}
          ref={signUpRef}
        >
          Cadastrar
        </button>

        {/* - Erro - */}

        <div className="min-h-18 py-3">
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

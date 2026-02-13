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

  const createNewAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setSignUpError("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setSignUpError("As senhas não coincidem.");
      return;
    }

    if (password.length <= 5) {
      setSignUpError("A senha deve conter, pelo menos, 6 caracteres");
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
      console.log(error.message);
      return;
    } else {
      if (!data.session) {
        alert(
          "Enviamos um email de confirmação. Verifique sua caixa de entrada para continuar.",
        );
      } else {
        alert("Conta criada com sucesso!");
      }
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
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const signUpRef = useRef<HTMLButtonElement | null>(null);

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
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 px-4">
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
          Cadastre-se
        </h1>

        {/* - Inputs - */}

        <div>
          <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-4">
            <FaUser className="text-blue-600 text-lg" />
            <input
              className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 border-gray-500/50 placeholder:text-gray-400"
              placeholder="Primeiro Nome"
              type="text"
              value={firstName}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^(?!.*(.)\1{2,})[A-Za-zÀ-ÿ]+$/;

                if (regex.test(value)) {
                  setFirstName(value);
                }
              }}
            />
          </div>
          <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-4">
            <FaUser className="text-blue-600 text-lg" />
            <input
              className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 border-gray-500/50 placeholder:text-gray-400"
              placeholder="Último Nome"
              type="text"
              value={lastName}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^(?!.*(.)\1{2,})[A-Za-zÀ-ÿ]+$/;

                if (regex.test(value)) {
                  setLastName(value);
                }
              }}
            />
          </div>

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
              onClick={() => setIsPasswordPrivate(!isPasswordPrivate)}
              className="flex items-center gap-2 bg-transparent backdrop-blur-sm rounded-lg py-2 px-4 font-semibold whitespace-nowrap focus:none outline:none cursor-pointer"
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

          <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-gray-200 border border-gray-500/50 focus-within:ring-2 focus-within:ring-blue-500 mb-4">
            <RiLockPasswordFill className="text-blue-600 text-lg" />
            <input
              className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
              placeholder="Confirme sua senha"
              type={isConfirmPasswordPrivate ? "password" : "text"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={() =>
                setIsConfirmPasswordPrivate(!isConfirmPasswordPrivate)
              }
              className="flex items-center gap-2 bg-transparent backdrop-blur-sm rounded-lg py-2 px-4 font-semibold whitespace-nowrap focus:none outline:none cursor-pointer"
            >
              {isConfirmPasswordPrivate ? (
                <EyeClosed className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
              <span className="hidden sm:inline text-sm text-gray-500">
                {isConfirmPasswordPrivate ? "Mostrar" : "Ocultar"}
              </span>
            </button>
          </div>
        </div>

        {/* - Botão de cadastro - */}

        <button
          className="mt-4 w-full h-12 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-500  hover:to-indigo-500 transition cursor-pointer"
          onClick={createNewAccount}
          ref={signUpRef}
        >
          Cadastrar
        </button>
        <div className="h-14 w-full text-center text-md">
          {signUpError && (
            <p className="flex justify-center items-center mt-5 w-full h-12 rounded-xl bg-red-100 border border-red-300 text-red-700 text-md font-semibold px-4 py-2 text-center">
              {signUpError}
            </p>
          )}
        </div>

        {/* - Ir para a página de login - */}

        <div className="flex flex-col ml-2 text-white font-semibold text-sm">
          <p className="flex flex-row justify-center items-center gap-2 mt-5">
            Já possui cadastro?
            <Link
              className="text-white text-sm hover:text-blue-400 hover:underline"
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

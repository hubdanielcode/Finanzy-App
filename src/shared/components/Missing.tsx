import { Link } from "react-router-dom";

const Missing: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600">
      <div className="flex flex-col justify-center items-center bg-linear-to-br from-black/85 via-black/80 to-black/75 rounded-xl p-6">
        {/* - Texto - */}

        <h1 className="text-5xl font-bold text-white">404</h1>
        <p className="text-2xl mt-8 text-white font-bold">
          Página não encontrada
        </p>

        {/* - Botão - */}

        <Link
          className="mt-8 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full text-white font-semibold text-sm transition"
          to="/login"
        >
          Voltar para a tela de Login
        </Link>
      </div>
    </div>
  );
};

export { Missing };

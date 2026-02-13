import { useEffect, useState } from "react";
import { TransactionProvider } from "./features/transactions";
import {
  Authentication,
  Login,
  RecoverPassword,
} from "./features/authentication";
import { Header, MainContent, Missing, Footer } from "./shared/index";
import { Routes, Route, Outlet } from "react-router-dom";
import { supabase } from "./supabase/supabase";
import type { Session } from "@supabase/supabase-js";
import { ProtectedRoute } from "./features/authentication/components/ProtectedRoute";
import { NewUserModal } from "./shared/components/NewUserModal";

interface AppLayoutProps {
  session: Session | null;
  isMobileFormOpen: boolean;
  isMobileTransactionListOpen: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  session,

  isMobileFormOpen,
  isMobileTransactionListOpen,
}) => (
  <>
    <Header />
    <NewUserModal session={session} />
    <Outlet />
    <Footer
      isMobileFormOpen={isMobileFormOpen}
      isMobileTransactionListOpen={isMobileTransactionListOpen}
    />
  </>
);

const App = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"Entrada" | "Saída" | null>(null);
  const [category, setCategory] = useState("");
  const [period, setPeriod] = useState<
    | "Hoje"
    | "Última Semana"
    | "Último Mês"
    | "Último Bimestre"
    | "Último Trimestre"
    | "Último Quadrimestre"
    | "Último Semestre"
    | "Último Ano"
    | "Mais de um ano"
    | null
  >(null);

  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);
  const [isMobileTransactionListOpen, setIsMobileTransactionListOpen] =
    useState(false);

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    const getSession = await supabase.auth.getSession();
    setSession(getSession.data.session);
    console.log("Supabase session:", getSession.data.session);
    setLoading(false);
  };

  useEffect(() => {
    fetchSession();

    const { data: AuthenticationListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => {
      AuthenticationListener.subscription.unsubscribe();
    };
  }, []);

  /* - "Carregando..." até o Supabase retornar uma sessão válida - */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full text-6xl text-white font-bold bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600">
        Carregando...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen mx-auto flex flex-col select-none scroll-smooth">
      <TransactionProvider>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          {/* - Layout principal do aplicativo (Rota Segura) - */}

          <Route element={<ProtectedRoute session={session} />}>
            <Route
              path="/homepage"
              element={
                <AppLayout
                  session={session}
                  isMobileFormOpen={isMobileFormOpen}
                  isMobileTransactionListOpen={isMobileTransactionListOpen}
                />
              }
            >
              <Route
                index
                element={
                  <MainContent
                    title={title}
                    setTitle={setTitle}
                    amount={amount}
                    setAmount={setAmount}
                    date={date}
                    setDate={setDate}
                    type={type}
                    setType={setType}
                    category={category}
                    setCategory={setCategory}
                    period={period}
                    setPeriod={setPeriod}
                    isMobileFormOpen={isMobileFormOpen}
                    setIsMobileFormOpen={setIsMobileFormOpen}
                    isMobileTransactionListOpen={isMobileTransactionListOpen}
                    setIsMobileTransactionListOpen={
                      setIsMobileTransactionListOpen
                    }
                  />
                }
              />
            </Route>
          </Route>

          {/* - Rota de cadastro - */}

          <Route
            path="/cadastro"
            element={<Authentication />}
          />

          {/* - Rota de recuperação de senha - */}

          <Route
            path="/recover-password"
            element={<RecoverPassword />}
          />

          {/* - Rota de erro - */}

          <Route
            path="*"
            element={<Missing />}
          />
        </Routes>
      </TransactionProvider>
    </div>
  );
};

export default App;

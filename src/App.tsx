import { useEffect, useState } from "react";
import { TransactionProvider } from "./features/transactions/context/TransactionContext";
import {
  Authentication,
  Login,
  RecoverPassword,
} from "./features/authentication";
import {
  Header,
  MainContent,
  Missing,
  Footer,
  PrivacyPolicy,
  TermsOfUse,
} from "./shared/index";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { supabase, supabaseTemp } from "./../supabase/supabase";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { ProtectedRoute } from "./features/authentication/components/ProtectedRoute";
import { NewUserModal } from "./shared/components/NewUserModal";
import { ChartsSection } from "./features/transactions/components/charts/ChartsSection";
import { AuthenticationProvider } from "./features/authentication/context/AuthenticationContext";
import { MobileProvider } from "./features/transactions/context/MobileContext";
import { ThemeProvider } from "./shared/context/ThemeContext";

interface AppLayoutProps {
  session: Session | null;
}

const AppLayout: React.FC<AppLayoutProps> = ({ session }) => {
  return (
    <TransactionProvider>
      <div className="flex max-w-full flex-col min-w-fit min-h-screen dark:bg-gray-800">
        <Header />
        {session && <NewUserModal session={session} />}
        <Outlet />
        <Footer />
      </div>
    </TransactionProvider>
  );
};

const App = () => {
  /* - Estados de carregamento - */

  const [loading, setLoading] = useState(true);

  /* - Estados de sessão - */

  const [session, setSession] = useState<Session | null>(null);

  /* - Definições - */

  const navigate = useNavigate();

  /* - Funções - */

  // 1. Buscando a sessão do usuário logado

  const fetchSession = async () => {
    const {
      data: { session: persistedSession },
    } = await supabase.auth.getSession();

    if (persistedSession) {
      setSession(persistedSession);
      setLoading(false);
      return;
    }

    const savedSessionString = sessionStorage.getItem("supabase_session");

    if (savedSessionString) {
      const savedSession = JSON.parse(savedSessionString);

      const { data, error } = await supabase.auth.setSession(savedSession);

      if (!error && data.session) {
        setSession(data.session);
        setLoading(false);
        return;
      }
    }

    setSession(null);
    setLoading(false);
  };

  // 2. Listener de autenticação

  useEffect(() => {
    fetchSession();

    const { data: AuthenticationListener } = supabase.auth.onAuthStateChange(
      (e: AuthChangeEvent, session: Session | null) => {
        if (e === "SIGNED_OUT") {
          navigate("/", { replace: true });
        }
        setSession(session);
      },
    );

    const { data: TempAuthenticationListener } =
      supabaseTemp.auth.onAuthStateChange(
        (e: AuthChangeEvent, session: Session | null) => {
          if (e === "SIGNED_OUT") {
            navigate("/", { replace: true });
          }
          if (session) setSession(session);
        },
      );

    return () => {
      AuthenticationListener.subscription.unsubscribe();
      TempAuthenticationListener.subscription.unsubscribe();
    };
  }, []);

  /* - "Carregando..." até o Supabase retornar uma sessão válida - */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full text-6xl text-white font-bold bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-[#0f0f13] dark:via-[#1a1a2e] dark:to-[#16213e]">
        Carregando...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-[#0f0f13] h-screen w-full flex flex-col select-none scroll-smooth">
      <AuthenticationProvider>
        <MobileProvider>
          <ThemeProvider>
            <Routes>
              <Route
                path="/"
                element={<Login />}
              />

              <Route element={<ProtectedRoute session={session} />}>
                <Route
                  path="/pagina-principal"
                  element={<AppLayout session={session} />}
                >
                  <Route
                    index
                    element={<MainContent />}
                  />
                </Route>

                <Route
                  path="/graficos"
                  element={
                    <TransactionProvider>
                      <ChartsSection />
                    </TransactionProvider>
                  }
                />
              </Route>

              <Route
                path="/cadastro"
                element={<Authentication />}
              />
              <Route
                path="/recuperar-senha"
                element={<RecoverPassword />}
              />
              <Route
                path="/politica-de-privacidade"
                element={<PrivacyPolicy />}
              />
              <Route
                path="/termos-de-uso"
                element={<TermsOfUse />}
              />
              <Route
                path="*"
                element={<Missing />}
              />
            </Routes>
          </ThemeProvider>
        </MobileProvider>
      </AuthenticationProvider>
    </div>
  );
};

export default App;

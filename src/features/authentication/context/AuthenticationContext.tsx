import { createContext, useEffect, useState, type ReactNode } from "react";
import { supabase, supabaseTemp } from "../../../../supabase/supabase";

interface AuthenticationContextType {
  name: string;
  setName: (name: string) => void;
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(
  null,
);

const AuthenticationProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchName = async () => {
      const {
        data: { session: persistedSession },
      } = await supabase.auth.getSession();
      const {
        data: { session: tempSession },
      } = await supabaseTemp.auth.getSession();

      const session = persistedSession ?? tempSession;
      const client = persistedSession ? supabase : supabaseTemp;

      if (session) {
        const { data } = await client
          .from("users")
          .select("name")
          .eq("user_id", session.user.id)
          .single();

        if (data) {
          setName(data.name);
        }
      }

      setIsLoading(false);
    };

    fetchName();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full text-6xl text-white font-bold bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600">
        Carregando...
      </div>
    );
  }

  return (
    <AuthenticationContext.Provider value={{ name, setName }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export { AuthenticationContext, AuthenticationProvider };

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import api from "./Api";
import { setAccessToken, clearAccessToken } from "./tokenManager";

interface User {
  id: string;
  nome: string;
  email: string;
  profile_image?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  loadingUser: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

// const isDev = import.meta.env.VITE_DEV === "true";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  

  const setToken = (token: string) => {
    setAccessToken(token);
    fetchUser();
  };

  const logout = async() => {
    try{
      await api.post("/login/logout",{})
    } catch {
      console.error("Não foi possível deslogar.");
    }
    clearAccessToken();
    setUser(null);
    window.location.href = "/login";
  };

  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const res = await api.get<User>("/login/me");
      setUser(res.data);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    // if (isDev && !getAccessToken()) {
    //     const fakeToken = "fake-dev-token";
    //     const fakeUser = { id: "1", nome: "Usuário Dev", email: "demo@local.com" };

    //     setAccessToken(fakeToken);
    //     setUser(fakeUser);
    //     setLoadingUser(false);
    //     return;
    // }

    fetchUser();
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loadingUser, setToken, logout }),
    [user, loadingUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
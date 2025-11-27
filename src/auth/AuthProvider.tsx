// src/auth/AuthContext.tsx
import {
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
  signOut,
} from "aws-amplify/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

interface User {
  id: string;
  nome?: string;
  email?: string;
  profile_image?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  loadingUser: boolean;
  reloadUser: () => Promise<void>;
  getToken: () => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const reloadUser = async () => {
    try {
      setLoadingUser(true);

      // se não houver usuário logado, getCurrentUser lança erro
      const { userId } = await getCurrentUser();
      const attrs = await fetchUserAttributes();

      const mappedUser: User = {
        id: userId,
        nome: attrs.name,
        email: attrs.email,
        profile_image: attrs.picture,
        ...attrs,
      };

      setUser(mappedUser);
    } catch (err) {
      // não logado ou erro -> user = null
      console.error("Erro ao buscar usuário Cognito:", err);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const getToken = async () => {
    try {
      const session = await fetchAuthSession();
      // escolha qual token você quer usar
      return session.tokens?.idToken?.toString() ?? null;
      // ou: session.tokens?.accessToken?.toString()
    } catch (err) {
      console.error("Erro ao obter token:", err);
      return null;
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Erro ao deslogar do Cognito:", err);
    }
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    reloadUser();
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loadingUser, reloadUser, getToken, logout }),
    [user, loadingUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
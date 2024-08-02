import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/types";
import { getCurrentUser, signOutAccount } from "@/lib/appwrite/api"; // Asegúrate de importar signOutAccount

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  logout: () => {},
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    await signOutAccount();
    setUser(INITIAL_USER);
    setIsAuthenticated(false);
    localStorage.removeItem("loginTimestamp");
    localStorage.setItem("isLoggedOut", Date.now().toString()); // Indicador de cierre de sesión
    navigate("/sign-in");
  };

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        const loginTimestamp = localStorage.getItem("loginTimestamp");
        const currentTime = Date.now();
        const sessionDuration = 20 * 60 * 1000; // 20 minutos
        //donde 1000 es el valor en milisegundos, 60 es el valor en segundos y 20 es el valor en minutos
        //si quiero poner que dure 2 minutos sería 2*60*1000

        if (loginTimestamp && currentTime - parseInt(loginTimestamp) > sessionDuration) {
          logout();
          return false;
        }

        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);

        // Almacenar la hora de inicio de sesión
        if (!loginTimestamp) {
          localStorage.setItem("loginTimestamp", currentTime.toString());
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      navigate("/sign-in");
    }

    checkAuthUser();

    // Añadir evento para escuchar cambios en localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "isLoggedOut") {
        navigate("/sign-in");
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);

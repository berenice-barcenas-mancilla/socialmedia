import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/types";
import { getCurrentUser, signOutAccount } from "@/lib/appwrite/api";

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
  isLoading: true,
  isAuthenticated: false,
  isInitialized: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  logout: () => {},
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  isInitialized: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOutAccount();
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      localStorage.removeItem("loginTimestamp");
      localStorage.setItem("isLoggedOut", Date.now().toString());
      navigate("/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        const loginTimestamp = localStorage.getItem("loginTimestamp");
        const currentTime = Date.now();
        const sessionDuration = 20 * 60 * 1000; // 20 minutos

        if (loginTimestamp && currentTime - parseInt(loginTimestamp) > sessionDuration) {
          await logout();
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

        if (!loginTimestamp) {
          localStorage.setItem("loginTimestamp", currentTime.toString());
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking auth user:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const cookieFallback = localStorage.getItem("cookieFallback");
      if (
        cookieFallback === "[]" ||
        cookieFallback === null ||
        cookieFallback === undefined
      ) {
        setIsAuthenticated(false);
        setIsInitialized(true);
        setIsLoading(false);
        navigate("/sign-in");
        return;
      }

      const isAuth = await checkAuthUser();
      setIsInitialized(true);
      setIsLoading(false);
      if (!isAuth) {
        navigate("/sign-in");
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "isLoggedOut") {
        setIsAuthenticated(false);
        navigate("/sign-in");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  const value = {
    user,
    setUser,
    isLoading,
    isInitialized,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
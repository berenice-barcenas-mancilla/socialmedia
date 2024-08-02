import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { isAuthenticated, checkAuthUser } = useUserContext();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuthUser();
      setCheckingAuth(false);
      if (!isAuth) {
        localStorage.setItem("redirectToLogin", "true");
      }
    };

    verifyAuth();
  }, [checkAuthUser]);

  // Check authentication status
  if (localStorage.getItem("redirectToLogin") === "true") {
    localStorage.removeItem("redirectToLogin");
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default PrivateRoute;

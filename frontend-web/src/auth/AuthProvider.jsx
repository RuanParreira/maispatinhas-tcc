import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "@/api/axios";
import { AuthContext, useAuth } from "@/auth/useAuth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/api/user")
      .then((res) => {
        setUser(res.data);
        setStatus("authenticated");
      })
      .catch(() => {
        setUser(null);
        setStatus("guest");
      });
  }, []);

  function login(user) {
    setUser(user);
    setStatus("authenticated");
  }

  async function logout() {
    await api.post("/api/logout");
    setUser(null);
    setStatus("guest");
  }

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthGate({ when, redirectTo }) {
  const { status } = useAuth();

  if (status === "loading") {
    return null;
  }

  if (status === when) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

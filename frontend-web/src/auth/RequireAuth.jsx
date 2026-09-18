import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "@/api/axios";

export default function RequireAuth() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/api/user")
      .then(() => setStatus("authenticated"))
      .catch(() => setStatus("guest"));
  }, []);

  if (status === "loading") {
    return null;
  }

  if (status === "guest") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import ForgotPassword from "./auth/ForgotPassword.jsx";
import ResetPassword from "./auth/ResetPassword.jsx";
import Adoptions from "./pages/Adoptions.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AuthGate } from "./auth/AuthProvider.jsx";
import GuestLayout from "./layouts/GuestLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<GuestLayout />}>
        <Route path="/home" element={<Home />} />

        {/* Bloqueia acesso de quem já está autenticado */}
        <Route
          element={<AuthGate when="authenticated" redirectTo="/adoptions" />}
        >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Route>

      {/* Exige autenticação */}
      <Route element={<AuthGate when="guest" redirectTo="/login" />}>
        <Route element={<AppLayout />}>
          <Route path="/adoptions" element={<Adoptions />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

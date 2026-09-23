import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import ForgotPassword from "./auth/ForgotPassword.jsx";
import ResetPassword from "./auth/ResetPassword.jsx";
import EmailVerified from "./auth/EmailVerified.jsx";
import VerifyEmailNotice from "./auth/VerifyEmailNotice.jsx";
import Adoptions from "./pages/Adoptions.jsx";
import Lost from "./pages/Lost.jsx";
import Found from "./pages/Found.jsx";
import MyPosts from "./pages/MyPosts.jsx";
import Messages from "./pages/Messages.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
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
        <Route path="/email-verified" element={<EmailVerified />} />

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
          <Route path="/lost" element={<Lost />} />
          <Route path="/found" element={<Found />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/verify-email" element={<VerifyEmailNotice />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

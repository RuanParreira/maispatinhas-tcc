import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import Adoptions from "./pages/Adoptions.jsx";
import NotFound from "./pages/NotFound.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";
import GuestLayout from "./layouts/GuestLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route element={<GuestLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/adoptions" element={<Adoptions />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { Routes, Route, Navigate, ScrollRestoration } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import ForgotPassword from "./auth/ForgotPassword.jsx";
import ResetPassword from "./auth/ResetPassword.jsx";
import EmailVerified from "./auth/EmailVerified.jsx";
import VerifyEmailNotice from "./auth/VerifyEmailNotice.jsx";
import Adoptions from "./pages/Adoptions.jsx";
import LostAndFound from "./pages/LostAndFound.jsx";
import Reunions from "./pages/Reunions.jsx";
import Favorites from "./pages/Favorites.jsx";
import MyPosts from "./pages/MyPosts.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import EditPost from "./pages/EditPost.jsx";
import PostDetails from "./pages/PostDetails.jsx";
import MyAdoptions from "./pages/MyAdoptions.jsx";
import Messages from "./pages/Messages.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AuthGate } from "./auth/AuthProvider.jsx";
import GuestLayout from "./layouts/GuestLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

// Rolagem por página (caminho): abrir outra tela começa no topo, voltar devolve a posição
// e mudar filtros (que só mexem na URL) não pula para o topo.
const scrollKeyOf = (location) => location.pathname;

export default function App() {
  return (
    <>
      <ScrollRestoration getKey={scrollKeyOf} />
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
            <Route path="/lost" element={<LostAndFound />} />
            {/* Encontrados virou o filtro "Achados"; o endereço antigo continua funcionando. */}
            <Route
              path="/found"
              element={<Navigate to="/lost?view=found" replace />}
            />
            <Route path="/reunions" element={<Reunions />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/posts/create" element={<CreatePost />} />
            <Route path="/posts/:id/edit" element={<EditPost />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/my-adoptions" element={<MyAdoptions />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/users/:id" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/verify-email" element={<VerifyEmailNotice />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

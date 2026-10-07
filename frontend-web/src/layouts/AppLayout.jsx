import { matchPath, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { AppSidebar } from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const OWN_PROFILE = {
  title: "Meu perfil",
  description: "É assim que as outras pessoas veem você na plataforma.",
};

const PAGES = {
  "/adoptions": {
    title: "Adotar",
    description:
      "Pets esperando por uma nova história de afeto e cuidado mútuo.",
  },
  "/lost": {
    title: "Perdidos",
    description: "Ajude alguém a reencontrar seu companheiro desaparecido.",
  },
  "/found": {
    title: "Encontrados",
    description: "Animais encontrados na rua, à espera do tutor.",
  },
  "/my-posts": {
    title: "Meus anúncios",
    description: "Acompanhe e gerencie os anúncios que você publicou.",
  },
  "/my-adoptions": {
    title: "Minhas adoções",
    description: "Pedidos de adoção que você fez e recebeu.",
  },
  "/messages": {
    title: "Mensagens",
    description: "Suas conversas com tutores, protetores e interessados.",
  },
  "/users/:id": {
    title: "Perfil",
    description: "Conheça quem anuncia e adota na plataforma.",
  },
  "/settings": {
    title: "Configurações",
    description: "Segurança e acesso da sua conta.",
  },
  "/verify-email": { title: "Verificar e-mail" },
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const page =
    pathname === `/users/${user?.id}`
      ? OWN_PROFILE
      : Object.entries(PAGES).find(([path]) => matchPath(path, pathname))?.[1];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex items-start justify-between gap-4 px-6 pt-8 lg:px-8">
          <div className="flex min-w-0 items-start gap-3">
            <SidebarTrigger className="mt-1.5 md:hidden" />
            {page && (
              <div className="min-w-0">
                <h1 className="font-heading text-4xl tracking-tight">
                  {page.title}
                </h1>
                {page.description && (
                  <p className="mt-1 text-muted-foreground">
                    {page.description}
                  </p>
                )}
              </div>
            )}
          </div>
          <NotificationBell />
        </header>
        <main className="flex flex-1 flex-col p-6 lg:px-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { matchPath, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import AdoptionPrompt from "@/components/adoptions/AdoptionPrompt";
import { AppSidebar } from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import { cn } from "@/lib/utils";
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
    title: "Pets perdidos",
    description:
      "Pets que sumiram e animais achados na rua esperando o tutor. Viu algum?",
  },
  "/reunions": {
    title: "Reencontros",
    description: "Pets que estavam perdidos e voltaram para casa.",
  },
  "/my-posts": {
    title: "Meus anúncios",
    description: "Acompanhe e gerencie os anúncios que você publicou.",
  },
  "/posts/create": {
    title: "Novo anúncio",
    description: "Cadastre o pet e o anúncio em poucas etapas.",
  },
  "/posts/:id/edit": {
    title: "Editar anúncio",
    description:
      "Ajuste o que precisar. Mudanças em anúncio publicado passam pela moderação.",
  },
  "/favorites": {
    title: "Favoritos",
    description: "Pets que você guardou para ver com calma.",
  },
  "/my-adoptions": {
    title: "Minhas adoções",
    description: "Os pets que você levou para casa.",
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

// Em tela sem título, o header não ocupa linha própria no desktop: o sino flutua no canto e a página sobe.
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
        <header
          className={cn(
            "flex items-start justify-between gap-4 px-6 pt-8 lg:px-8",
            !page &&
              "md:pointer-events-none md:absolute md:inset-x-0 md:top-0 md:z-10 md:justify-end md:pt-6 md:*:pointer-events-auto",
          )}
        >
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
      <AdoptionPrompt />
    </SidebarProvider>
  );
}

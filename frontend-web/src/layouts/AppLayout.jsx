import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const TITLES = {
  "/adoptions": "Adoções",
  "/lost": "Perdidos",
  "/found": "Encontrados",
  "/my-posts": "Meus anúncios",
  "/messages": "Mensagens",
  "/profile": "Meu perfil",
  "/settings": "Configurações",
  "/verify-email": "Verificar e-mail",
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const title = TITLES[pathname];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center border-b px-4">
          {title && <h1 className="font-heading text-4xl">{title}</h1>}
        </header>
        <main className="flex-1 flex flex-col p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

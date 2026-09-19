import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center border-b px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 flex flex-col p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

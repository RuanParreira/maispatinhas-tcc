import { Home, PawPrint, Heart, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Início", url: "/home", icon: Home },
  { title: "Adoções", url: "/adoptions", icon: Heart },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await api.post("/api/logout");
    navigate("/login");
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            <PawPrint className="size-4" />
          </span>
          <span className="font-heading text-lg leading-tight whitespace-nowrap group-data-[collapsible=icon]:hidden">
            Mais Patinhas
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="data-active:bg-primary data-active:text-primary-foreground data-active:hover:bg-primary data-active:hover:text-primary-foreground"
                  >
                    <Link to={item.url}>
                      <item.icon data-icon="inline-start" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 p-1 group-data-[collapsible=icon]:hidden">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
              US
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">Usuário</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sair"
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-4" />
          </button>
        </div>
        <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Sair"
              className="cursor-pointer"
            >
              <LogOut data-icon="inline-start" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

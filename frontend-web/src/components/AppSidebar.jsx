import {
  PawPrint,
  Heart,
  HandHeart,
  LogOut,
  MapPin,
  ScanSearch,
  FileText,
  MessageSquare,
  User,
  Settings,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";

const groups = [
  {
    label: "Principal",
    items: [
      { title: "Adotar", url: "/adoptions", icon: Heart },
      { title: "Perdidos", url: "/lost", icon: MapPin },
      { title: "Encontrados", url: "/found", icon: ScanSearch },
    ],
  },
  {
    label: "Gerenciar",
    items: [
      { title: "Meus anúncios", url: "/my-posts", icon: FileText },
      { title: "Minhas adoções", url: "/my-adoptions", icon: HandHeart },
      { title: "Mensagens", url: "/messages", icon: MessageSquare },
    ],
  },
  {
    label: "Conta",
    items: [
      { title: "Meu perfil", url: "/profile", icon: User },
      { title: "Configurações", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("")
    : "US";

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1">
          <div className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
              <PawPrint className="size-4" />
            </span>
            <span className="font-heading text-lg leading-tight whitespace-nowrap group-data-[collapsible=icon]:hidden">
              Mais Patinhas
            </span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
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
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 p-1 group-data-[collapsible=icon]:hidden">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">
              {user?.name ?? "Usuário"}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
            aria-label="Sair"
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut />
          </Button>
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

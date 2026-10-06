import {
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
import logo from "@/assets/logo.png";
import { useAuth } from "@/auth/useAuth";
import { initialsOf } from "@/lib/initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const initials = user?.name ? initialsOf(user.name) : "US";

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pt-4 pb-2">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col">
          <Link
            to="/home"
            aria-label="Mais Patinhas"
            className="flex min-w-0 items-center gap-2.5 rounded-md ring-sidebar-ring outline-hidden focus-visible:ring-2"
          >
            <img src={logo} alt="" className="size-8 shrink-0" />
            <span className="font-heading text-xl leading-none whitespace-nowrap group-data-[collapsible=icon]:hidden">
              Mais Patinhas
            </span>
          </Link>
          <SidebarTrigger className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[0.6875rem] font-semibold tracking-wider text-sidebar-foreground/60 uppercase group-data-[collapsible=icon]:pointer-events-none">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                      className="h-9 font-medium text-sidebar-foreground/80 transition-colors data-active:bg-primary data-active:text-primary-foreground data-active:shadow-xs data-active:hover:bg-primary data-active:hover:text-primary-foreground"
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
      <SidebarFooter className="border-t border-sidebar-border py-3">
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2">
          <Avatar className="size-8 shrink-0">
            {user?.avatar_url && <AvatarImage src={user.avatar_url} alt="" />}
            <AvatarFallback className="bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">
              {user?.name ?? "Usuário"}
            </span>
            {user?.email && (
              <span className="truncate text-xs text-sidebar-foreground/60">
                {user.email}
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
            aria-label="Sair"
            title="Sair"
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8"
          >
            <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

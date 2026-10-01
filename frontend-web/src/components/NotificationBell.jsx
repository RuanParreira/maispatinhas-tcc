import { useState } from "react";
import { Bell, CircleCheck, HandHeart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Dados de exemplo enquanto o backend não expõe notificações.
const mockNotifications = [
  {
    id: 1,
    icon: HandHeart,
    title: "Novo pedido de adoção",
    description: "Marina quer adotar a Luna.",
    time: "há 5 min",
    unread: true,
  },
  {
    id: 2,
    icon: MessageSquare,
    title: "Nova mensagem",
    description: "Rodrigo respondeu sobre o Pipoca.",
    time: "há 1 h",
    unread: true,
  },
  {
    id: 3,
    icon: CircleCheck,
    title: "Anúncio aprovado",
    description: "O anúncio do Bento já está publicado.",
    time: "ontem",
    unread: false,
  },
];

export default function NotificationBell() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((item) => item.unread).length;

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((item) => ({ ...item, unread: false })),
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={
            unreadCount > 0
              ? `Notificações, ${unreadCount} não lidas`
              : "Notificações"
          }
          className="relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary outline-none transition-colors hover:bg-border focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Bell className="size-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2.5 size-2.5 rounded-full border-2 border-secondary bg-primary" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-88 max-w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-xl p-0"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <p className="font-heading text-xl">Notificações</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="cursor-pointer text-xs font-medium text-warning hover:underline"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        <ul className="border-t border-border/60">
          {notifications.map((item) => (
            <li
              key={item.id}
              className={cn(
                "flex items-start gap-3 px-4 py-3",
                item.unread && "bg-secondary/40",
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-warning">
                <item.icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-[0.8125rem] leading-5 text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground/80">
                  {item.time}
                </p>
              </div>
              {item.unread && (
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
              )}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

import { CalendarDays, MailCheck, MailWarning } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { initialsOf } from "@/lib/initials";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const monthYear = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

export default function AccountOverview() {
  const { user } = useAuth();
  const verified = Boolean(user?.email_verified_at);

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-card p-5 shadow-xs sm:p-6">
      <Avatar className="size-14">
        <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
          {user?.name ? initialsOf(user.name) : "US"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-3xl leading-tight">{user?.name}</p>
        <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <span
          className={
            verified
              ? "flex items-center gap-2 rounded-xl bg-success-subtle px-3 py-2 text-sm text-success"
              : "flex items-center gap-2 rounded-xl bg-warning-subtle px-3 py-2 text-sm text-warning"
          }
        >
          {verified ? (
            <MailCheck className="size-4" />
          ) : (
            <MailWarning className="size-4" />
          )}
          {verified ? "E-mail verificado" : "E-mail não verificado"}
        </span>
        {user?.created_at && (
          <span className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            Membro desde {monthYear.format(new Date(user.created_at))}
          </span>
        )}
      </div>
    </div>
  );
}

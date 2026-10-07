import { useEffect, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import { PasswordField } from "@/components/form/IconField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  SettingsBody,
  SettingsFooter,
} from "@/components/settings/SettingsCard";

const browsers = [
  ["Edg/", "Edge"],
  ["OPR/", "Opera"],
  ["Firefox/", "Firefox"],
  ["Chrome/", "Chrome"],
  ["Safari/", "Safari"],
];

const systems = [
  ["Android", "Android"],
  ["iPhone", "iOS"],
  ["iPad", "iPadOS"],
  ["Windows", "Windows"],
  ["Mac OS", "macOS"],
  ["Linux", "Linux"],
];

function describeAgent(userAgent = "") {
  const browser = browsers.find(([token]) => userAgent.includes(token))?.[1];
  const system = systems.find(([token]) => userAgent.includes(token))?.[1];
  const mobile = /Mobile|Android|iPhone/.test(userAgent);

  return {
    label:
      [browser, system].filter(Boolean).join(" no ") ||
      "Dispositivo desconhecido",
    Icon: mobile ? Smartphone : Monitor,
  };
}

const relative = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

function timeAgo(isoDate) {
  const minutes = Math.round((new Date(isoDate) - Date.now()) / 60000);
  if (Math.abs(minutes) < 60) return relative.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relative.format(hours, "hour");
  return relative.format(Math.round(hours / 24), "day");
}

export default function SessionsCard() {
  const [sessions, setSessions] = useState(null);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    return api
      .get("/api/user/sessions")
      .then((res) => setSessions(res.data))
      .catch(() => {
        setSessions([]);
        toast.error("Erro ao carregar sessões.");
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleLogoutOthers(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.delete("/api/user/sessions", {
        data: { current_password: password },
      });
      setOpen(false);
      setPassword("");
      toast.success("Outros dispositivos desconectados.");
      await load();
    } catch (err) {
      setError(
        err.response?.data?.errors?.current_password?.[0] ??
          "Erro ao desconectar.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const hasOthers = sessions?.some((session) => !session.is_current);

  return (
    <>
      <SettingsBody>
        <ul className="flex flex-col divide-y divide-border/60">
          {sessions === null
            ? [1, 2].map((key) => (
                <li key={key} className="flex items-center gap-3 py-3">
                  <Skeleton className="size-10 rounded-xl" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </li>
              ))
            : sessions.map((session) => {
                const { label, Icon } = describeAgent(session.user_agent);

                return (
                  <li
                    key={session.key}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.ip_address} ·{" "}
                        {session.is_current
                          ? "ativa agora"
                          : timeAgo(session.last_active_at)}
                      </p>
                    </div>
                    {session.is_current && (
                      <Badge variant="success">Este dispositivo</Badge>
                    )}
                  </li>
                );
              })}
        </ul>
      </SettingsBody>

      <SettingsFooter
        hint={
          sessions === null
            ? "Carregando dispositivos..."
            : `${sessions.length} ${sessions.length === 1 ? "dispositivo conectado" : "dispositivos conectados"}.`
        }
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={!hasOthers}
              size="md"
            >
              Sair dos outros dispositivos
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleLogoutOthers} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Sair dos outros dispositivos</DialogTitle>
                <DialogDescription>
                  Confirme sua senha. Este dispositivo continua conectado.
                </DialogDescription>
              </DialogHeader>
              <PasswordField
                id="sessions_current_password"
                label="Senha atual"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={submitting}
                  size="md"
                >
                  {submitting && <Spinner />}
                  Desconectar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SettingsFooter>
    </>
  );
}

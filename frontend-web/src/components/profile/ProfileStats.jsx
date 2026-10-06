import { CalendarHeart, Heart, PawPrint, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function timeOnPlatform(memberSince) {
  const start = new Date(memberSince);
  const now = new Date();
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  if (months < 1) return "Novo";
  if (months < 12) return `${months} ${months === 1 ? "mês" : "meses"}`;

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "ano" : "anos"}`;
}

function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

export default function ProfileStats({ stats, memberSince }) {
  const items = [
    {
      icon: Heart,
      value: stats.adoptions_completed,
      label: "Finais felizes",
      detail:
        stats.adoptions_completed > 0 &&
        `${plural(stats.adoptions_donated, "doado", "doados")} · ${plural(stats.adoptions_adopted, "adotado", "adotados")}`,
    },
    { icon: PawPrint, value: stats.active_posts, label: "Anúncios ativos" },
    {
      icon: CalendarHeart,
      value: timeOnPlatform(memberSince),
      label: "Na plataforma",
    },
    {
      icon: Star,
      value: stats.rating === null ? "—" : stats.rating.toFixed(1),
      label: plural(stats.reviews_count, "avaliação", "avaliações"),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {items.map(({ icon: Icon, value, label, detail }) => (
        <div
          key={label}
          className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-xs"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-warning">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <p className="font-heading text-3xl leading-none">{value}</p>
              {detail && (
                <Badge variant="muted" className="ml-auto max-w-full min-w-0">
                  <span className="truncate">{detail}</span>
                </Badge>
              )}
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

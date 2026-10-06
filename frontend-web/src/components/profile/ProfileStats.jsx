import { CalendarHeart, Heart, PawPrint, Star } from "lucide-react";

function timeOnPlatform(createdAt) {
  if (!createdAt) return "Novo";

  const start = new Date(createdAt);
  const now = new Date();
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  if (months < 1) return "Novo";
  if (months < 12) return `${months} ${months === 1 ? "mês" : "meses"}`;

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "ano" : "anos"}`;
}

export default function ProfileStats({ stats, createdAt }) {
  const items = [
    {
      icon: Heart,
      value: stats.adoptionsCompleted,
      label: "Adoções concluídas",
    },
    { icon: PawPrint, value: stats.activePosts, label: "Anúncios ativos" },
    {
      icon: CalendarHeart,
      value: timeOnPlatform(createdAt),
      label: "Na plataforma",
    },
    {
      icon: Star,
      value: stats.reviewsCount ? stats.rating.toFixed(1) : "—",
      label: `${stats.reviewsCount} ${stats.reviewsCount === 1 ? "avaliação" : "avaliações"}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {items.map(({ icon: Icon, value, label }) => (
        <div
          key={label}
          className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-xs"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-warning">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-3xl leading-none">{value}</p>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

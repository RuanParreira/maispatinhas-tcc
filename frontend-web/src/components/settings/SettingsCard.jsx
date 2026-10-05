import { cn } from "@/lib/utils";

export function SettingsCard({
  icon: Icon,
  title,
  description,
  tone = "default",
  className,
  children,
}) {
  const danger = tone === "danger";

  return (
    <section
      className={cn(
        "flex h-full flex-col rounded-2xl bg-card shadow-xs",
        danger && "ring-1 ring-destructive/25",
        className,
      )}
    >
      <header className="flex items-start gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            danger
              ? "bg-destructive/10 text-destructive"
              : "bg-secondary text-warning",
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="font-heading text-2xl leading-tight">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}

export function SettingsBody({ className, children }) {
  return (
    <div className={cn("flex flex-1 flex-col gap-4 p-5 sm:p-6", className)}>
      {children}
    </div>
  );
}

export function SettingsFooter({ hint, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-4 sm:px-6">
      <p className="min-w-0 flex-1 text-xs text-muted-foreground">{hint}</p>
      {children}
    </div>
  );
}

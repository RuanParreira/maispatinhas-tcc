export default function FormSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-warning">
          <Icon className="size-5" />
        </span>
        <div>
          <h3 className="font-sans text-base font-semibold">{title}</h3>
          <p className="text-[0.8125rem] text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

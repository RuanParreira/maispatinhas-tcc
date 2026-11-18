import {
  CalendarDays,
  HeartPulse,
  House,
  Images,
  MapPin,
  PawPrint,
  Pencil,
  ShieldCheck,
  Star,
  TextQuote,
} from "lucide-react";
import {
  animalSexes,
  animalColors,
  animalSizes,
  animalSpecies,
  healthAnswers,
  healthQuestions,
  postTypes,
} from "@/lib/posts";
import { formatAge } from "@/lib/postForm";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const healthBadgeVariants = {
  yes: "success",
  no: "muted",
  unknown: "secondary",
};

function ReviewSection({
  title,
  icon: Icon,
  stepId,
  onEdit,
  className,
  children,
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/60 bg-background/40 p-5",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-warning">
            <Icon className="size-4.5" />
          </span>
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(stepId)}
          aria-label={`Editar ${title.toLowerCase()}`}
          className="text-warning"
        >
          <Pencil />
          Editar
        </Button>
      </div>
      {children}
    </section>
  );
}

function ReviewItem({ label, className, children }) {
  return (
    <div className={className}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium break-words">{children}</dd>
    </div>
  );
}

export default function ReviewStep({ form, municipalities, onEdit }) {
  const previews = form.images.map((image) => image.url);
  const type = postTypes[form.type];
  const city = municipalities.find(
    (municipality) => municipality.ibge_code === form.municipality_id,
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl bg-linear-to-br from-primary/20 via-secondary/50 to-secondary/20 p-5 sm:flex-row sm:items-center sm:p-6">
        <PawPrint
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -bottom-8 size-48 -rotate-12 text-primary/10"
        />
        <div className="flex size-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary text-muted-foreground/50 shadow-md ring-4 ring-card">
          {previews[0] ? (
            <img
              src={previews[0]}
              alt="Capa do anúncio"
              className="size-full object-cover object-[50%_25%]"
            />
          ) : (
            <PawPrint className="size-12" />
          )}
        </div>
        <div className="relative min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={type.variant}>{type.label}</Badge>
            {previews.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Images className="size-3.5" />
                {previews.length} {previews.length === 1 ? "foto" : "fotos"}
              </span>
            )}
          </div>
          <p className="mt-2 font-heading text-4xl leading-tight tracking-tight break-words">
            {form.title}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-muted-foreground">
            {city && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {form.type !== "adoption" && form.location_reference.trim()
                  ? `${form.location_reference.trim()}, ${city.name} - ${city.state}`
                  : `${city.name} - ${city.state}`}
              </span>
            )}
            {form.type !== "adoption" && form.occurred_at && (
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3.5" />
                {new Date(`${form.occurred_at}T00:00`).toLocaleDateString(
                  "pt-BR",
                )}
              </span>
            )}
            {form.type === "found" && form.with_finder && (
              <span className="flex items-center gap-1">
                <House className="size-3.5" />
                {form.with_finder === "yes"
                  ? "Está com quem encontrou"
                  : "Ficou no local"}
              </span>
            )}
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {[
              form["animal.name"],
              animalSpecies[form["animal.species"]],
              animalSexes[form["animal.sex"]],
              `Porte ${animalSizes[form["animal.size"]].toLowerCase()}`,
              formatAge(form.age_amount, form.age_unit),
            ]
              .filter(Boolean)
              .map((fact) => (
                <li
                  key={fact}
                  className="rounded-full bg-card/80 px-3 py-1 text-xs font-medium shadow-xs backdrop-blur-xs"
                >
                  {fact}
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ReviewSection
          title="Sobre o pet"
          icon={PawPrint}
          stepId="pet"
          onEdit={onEdit}
          className="lg:col-span-2"
        >
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ReviewItem label="Nome">
              {form["animal.name"] || "Sem nome"}
            </ReviewItem>
            <ReviewItem label="Espécie">
              {animalSpecies[form["animal.species"]]}
            </ReviewItem>
            <ReviewItem label="Raça">
              {form["animal.breed"] || "Sem raça definida"}
            </ReviewItem>
            <ReviewItem label="Cor">
              {animalColors[form["animal.color"]]}
            </ReviewItem>
            <ReviewItem label="Sexo">
              {animalSexes[form["animal.sex"]]}
            </ReviewItem>
            <ReviewItem label="Porte">
              {animalSizes[form["animal.size"]]}
            </ReviewItem>
            <ReviewItem label="Idade aproximada">
              {formatAge(form.age_amount, form.age_unit) ?? "Não informada"}
            </ReviewItem>
            <ReviewItem
              label="Características marcantes"
              className="col-span-full"
            >
              {form["animal.distinctive_features"].trim() || "Não informadas"}
            </ReviewItem>
          </dl>
        </ReviewSection>

        {form.type === "adoption" && (
          <ReviewSection
            title="Saúde"
            icon={HeartPulse}
            stepId="health"
            onEdit={onEdit}
          >
            <ul className="flex flex-col gap-3">
              {healthQuestions.map(({ field, label }) => (
                <li
                  key={field}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  {label}
                  <Badge variant={healthBadgeVariants[form[field]]}>
                    {healthAnswers[form[field]]}
                  </Badge>
                </li>
              ))}
            </ul>
          </ReviewSection>
        )}

        <ReviewSection
          title="Fotos"
          icon={Images}
          className={form.type === "adoption" ? undefined : "lg:col-span-2"}
          stepId="photos"
          onEdit={onEdit}
        >
          {previews.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {previews.map((url, index) => (
                <li key={url} className="relative">
                  <img
                    src={url}
                    alt={index === 0 ? "Capa" : `Foto ${index + 1}`}
                    className={cn(
                      "size-20 rounded-xl object-cover object-[50%_25%] shadow-xs",
                      index === 0 &&
                        "ring-2 ring-primary ring-offset-2 ring-offset-card",
                    )}
                  />
                  {index === 0 && (
                    <Star className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-primary fill-primary-foreground p-1 text-primary-foreground shadow-xs" />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma foto. O card vai mostrar uma patinha no lugar.
            </p>
          )}
        </ReviewSection>

        <ReviewSection
          title="Descrição"
          icon={TextQuote}
          stepId="details"
          onEdit={onEdit}
          className="lg:col-span-2"
        >
          <p className="text-sm leading-6 whitespace-pre-line">
            {form.description}
          </p>
        </ReviewSection>
      </div>

      <p className="flex items-start gap-3 rounded-2xl bg-info-subtle px-4 py-3 text-[0.8125rem] text-info">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" />
        Depois de publicar, o anúncio passa pela moderação antes de aparecer
        para todos. Você acompanha o status em Meus anúncios.
      </p>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  HeartPulse,
  Heart,
  MapPin,
  MessageCircle,
  PartyPopper,
  PawPrint,
  SearchX,
  Star,
  Share2,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import { useFavorite } from "@/hooks/useFavorite";
import { initialsOf } from "@/lib/initials";
import { ageFromBirthDate, formatAge } from "@/lib/postForm";
import {
  animalColors,
  animalSexes,
  animalSizes,
  animalSpecies,
  catalogLabels,
  finishedPostStatuses,
  postStatuses,
  postTypes,
  statusLabelOf,
} from "@/lib/posts";
import { cn } from "@/lib/utils";
import PetCard from "@/components/PetCard";
import PersonLink from "@/components/profile/PersonLink";
import PostActions from "@/components/PostActions";
import WholePhoto from "@/components/WholePhoto";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

const fullDate = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const relativeTime = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

// Quem chega pelo catálogo volta para ele; o dono, em anúncio fora do ar, volta para Meus anúncios.
function backLinkOf(post, isOwner) {
  if (post.status === "resolved") {
    return { to: "/reunions", label: "Voltar para reencontros" };
  }
  if (isOwner && post.status !== "active") {
    return { to: "/my-posts", label: "Voltar para meus anúncios" };
  }
  if (post.type === "adoption") {
    return { to: "/adoptions", label: "Voltar para adoções" };
  }
  return { to: `/lost?view=${post.type}`, label: "Voltar para pets perdidos" };
}

function contactOf(post, name) {
  if (post.type === "lost") {
    return {
      label: "Vi este pet",
      hint: "Conte para o tutor onde e quando você o viu.",
    };
  }
  if (post.type === "found") {
    return {
      label: "É o meu pet",
      hint: "Mostre a quem achou que ele é seu, com fotos ou detalhes.",
    };
  }
  return {
    label: `Quero adotar ${name ?? "este pet"}`,
    hint: "Converse com quem anunciou antes de combinar a adoção.",
  };
}

function publishedLabel(date) {
  const days = Math.floor((Date.now() - new Date(date)) / 86_400_000);
  if (days > 30) return `Publicado em ${fullDate.format(new Date(date))}`;
  return `Publicado ${relativeTime.format(-days, "day")}`;
}

function dateOnly(value) {
  return fullDate.format(new Date(`${value}T00:00`));
}

function PhotoViewer({ photos, name, current, onChange, open, onOpenChange }) {
  const hasMany = photos.length > 1;

  function step(delta) {
    onChange((current + delta + photos.length) % photos.length);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[calc(100%-2rem)] gap-3 border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-5xl"
        onKeyDown={(event) => {
          if (!hasMany) return;
          if (event.key === "ArrowLeft") step(-1);
          if (event.key === "ArrowRight") step(1);
        }}
      >
        <DialogTitle className="sr-only">Fotos de {name}</DialogTitle>
        <DialogDescription className="sr-only">
          Use as setas do teclado para passar as fotos.
        </DialogDescription>
        <div className="relative h-[80vh]">
          <img
            src={photos[current].url}
            alt={`Foto ${current + 1} de ${name}`}
            className="size-full object-contain drop-shadow-lg"
          />
          {hasMany && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon-lg"
                aria-label="Foto anterior"
                onClick={() => step(-1)}
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full shadow-xs"
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon-lg"
                aria-label="Próxima foto"
                onClick={() => step(1)}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full shadow-xs"
              >
                <ChevronRight />
              </Button>
            </>
          )}
        </div>
        {hasMany && (
          <p className="text-center text-sm font-medium text-white tabular-nums">
            Foto {current + 1} de {photos.length}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PhotoGallery({ photos, name, badge }) {
  const [current, setCurrent] = useState(0);
  const [viewing, setViewing] = useState(false);
  const photo = photos[current];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-secondary">
        {photo ? (
          <button
            type="button"
            aria-label="Ampliar foto"
            onClick={() => setViewing(true)}
            className="absolute inset-0 cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          >
            <WholePhoto
              src={photo.url}
              alt={`Foto ${current + 1} de ${name}`}
            />
          </button>
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground/40">
            <PawPrint className="size-20" />
          </div>
        )}
        <div className="absolute top-4 left-4">{badge}</div>
        {photos.length > 1 && (
          <span className="absolute right-4 bottom-4 rounded-full bg-foreground/70 px-3 py-1 text-xs font-medium text-background tabular-nums">
            Foto {current + 1} de {photos.length}
          </span>
        )}
      </div>

      {photos.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {photos.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === current}
              onClick={() => setCurrent(index)}
              className={cn(
                "cursor-pointer overflow-hidden rounded-xl ring-2 ring-transparent transition-shadow outline-none focus-visible:ring-ring",
                index === current
                  ? "ring-warning"
                  : "opacity-80 hover:opacity-100",
              )}
            >
              <img
                src={item.url}
                alt=""
                className="aspect-square w-full object-cover object-[50%_25%]"
              />
            </button>
          ))}
        </div>
      )}

      {photo && (
        <PhotoViewer
          photos={photos}
          name={name}
          current={current}
          onChange={setCurrent}
          open={viewing}
          onOpenChange={setViewing}
        />
      )}
    </div>
  );
}

function HealthCard({ animal }) {
  const items = [
    { label: "Vacinado", value: animal.vaccinated },
    { label: "Vermifugado", value: animal.dewormed },
    { label: "Castrado", value: animal.neutered },
  ];

  return (
    <section className="rounded-2xl bg-card p-5 shadow-xs sm:p-6">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <HeartPulse className="size-5 text-warning" />
        Saúde e cuidados
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map(({ label, value }) => (
          <li
            key={label}
            className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3"
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full",
                value === true
                  ? "bg-success-subtle text-success"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {value === true ? (
                <Check className="size-4" />
              ) : value === false ? (
                <X className="size-4" />
              ) : (
                <CircleHelp className="size-4" />
              )}
            </span>
            <span className="flex flex-col">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-sm font-semibold">
                {value === true
                  ? "Sim"
                  : value === false
                    ? "Não"
                    : "Não informado"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SightingCard({ post }) {
  const isLost = post.type === "lost";
  const items = [
    post.occurred_at && {
      icon: CalendarDays,
      label: isLost ? "Sumiu em" : "Encontrado em",
      value: dateOnly(post.occurred_at),
    },
    post.location_reference && {
      icon: MapPin,
      label: isLost ? "Visto pela última vez" : "Onde foi encontrado",
      value: post.location_reference,
    },
    !isLost &&
      post.with_finder !== null && {
        icon: PawPrint,
        label: "Onde ele está agora",
        value: post.with_finder
          ? "Com quem o encontrou"
          : "Continua no local onde foi visto",
      },
  ].filter(Boolean);

  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl bg-card p-5 shadow-xs sm:p-6">
      <h2 className="text-base font-semibold">Quando e onde</h2>
      <dl className="mt-4 flex flex-col gap-4">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-warning-subtle text-warning">
              <Icon className="size-4" />
            </span>
            <div>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

function FavoriteButton({ post, name }) {
  const { favorite, pending, toggle } = useFavorite(post.id, post.is_favorite);

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-lg"
      aria-label={`Favoritar ${name}`}
      aria-pressed={favorite}
      onClick={toggle}
      disabled={pending}
      className="rounded-full"
    >
      <Heart
        className={cn(
          "size-4 transition-colors",
          favorite && "fill-destructive text-destructive",
        )}
      />
    </Button>
  );
}

function AboutSection({ post, animal }) {
  return (
    <section className="rounded-2xl bg-card p-5 shadow-xs sm:p-8">
      <h2 className="font-heading text-2xl tracking-tight">
        Sobre {animal.name ?? "o pet"}
      </h2>
      {animal.name && <p className="mt-4 font-semibold">{post.title}</p>}
      <p className="mt-2 leading-relaxed whitespace-pre-line text-foreground/90">
        {post.description}
      </p>
      {animal.distinctive_features && (
        <>
          <h3 className="mt-6 text-sm font-semibold">Sinais particulares</h3>
          <p className="mt-1 leading-relaxed text-foreground/90">
            {animal.distinctive_features}
          </p>
        </>
      )}
    </section>
  );
}

const monthYear = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
});

// Os números vêm do perfil público. Se ele não carregar, o card fica só com nome e foto.
function AuthorCard({ author }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (author.removed) return;
    let ignore = false;
    api
      .get(`/api/users/${author.id}`)
      .then(({ data }) => !ignore && setProfile(data.data))
      .catch(() => !ignore && setProfile(false));
    return () => {
      ignore = true;
    };
  }, [author.id, author.removed]);

  const stats = profile?.stats;
  const highlights = stats && [
    {
      label:
        stats.reviews_count === 1
          ? "1 avaliação"
          : `${stats.reviews_count} avaliações`,
      value:
        stats.rating === null ? (
          "Novo"
        ) : (
          <span className="inline-flex items-center gap-1">
            <Star className="size-4 fill-primary text-warning" />
            {stats.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
          </span>
        ),
    },
    {
      label: stats.adoptions_completed === 1 ? "adoção" : "adoções",
      value: stats.adoptions_completed,
    },
    {
      label: stats.active_posts === 1 ? "anúncio ativo" : "anúncios ativos",
      value: stats.active_posts,
    },
  ];

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-xs">
      <div className="flex items-center gap-4">
        <Avatar className="size-12">
          {author.avatar_url && <AvatarImage src={author.avatar_url} alt="" />}
          <AvatarFallback className="bg-secondary font-semibold text-warning">
            {initialsOf(author.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">Anunciado por</p>
          <p className="flex min-w-0 items-center gap-1.5">
            <span className="truncate">
              <PersonLink person={author} />
            </span>
            {profile?.email_verified && (
              <BadgeCheck
                aria-label="E-mail verificado"
                className="size-4 shrink-0 text-success"
              />
            )}
          </p>
          {profile && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {profile.municipality.name} - {profile.municipality.state} · No
              Mais Patinhas desde{" "}
              {monthYear.format(new Date(profile.member_since))}
            </p>
          )}
        </div>
        {!author.removed && (
          <Button asChild variant="secondary" size="md">
            <Link to={`/users/${author.id}`}>Ver perfil</Link>
          </Button>
        )}
      </div>

      {highlights ? (
        <dl className="grid grid-cols-3 gap-3 border-t border-border/50 pt-4 text-center">
          {highlights.map(({ label, value }) => (
            <div key={label} className="flex flex-col-reverse gap-0.5">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        profile === null &&
        !author.removed && <Skeleton className="h-11 w-full rounded-xl" />
      )}
    </section>
  );
}

const similarCount = 3;
const similarRadiusKm = 100;

// Adoção puxa adoções; perdido e achado puxam os dois, porque quem procura o pet olha ambos.
const similarSections = {
  adoption: {
    types: ["adoption"],
    title: "Outros pets esperando um lar",
    to: "/adoptions",
  },
  lost: {
    types: ["lost", "found"],
    title: "Outros pets perdidos",
    to: "/lost",
  },
};

// Mesmo tipo e mesma região, mais perto primeiro, sem espécie nem raça: a ideia é mostrar qualquer pet que precise de ajuda ali.
function SimilarPets({ post }) {
  const section =
    similarSections[post.type === "adoption" ? "adoption" : "lost"];
  const municipalityId = post.municipality?.ibge_code;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let ignore = false;
    api
      .get("/api/posts", {
        params: {
          type: section.types,
          near: municipalityId,
          radius: similarRadiusKm,
          sort: "distance",
        },
      })
      .then(({ data }) => {
        if (ignore) return;
        setPosts(
          data.data
            .filter((item) => item.id !== post.id)
            .slice(0, similarCount),
        );
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [section, municipalityId, post.id]);

  if (posts.length === 0) return null;

  return (
    <section className="mt-6 flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl tracking-tight">
            {section.title}
          </h2>
          {post.municipality && (
            <p className="mt-1 text-sm text-muted-foreground">
              Em {post.municipality.name} e região, até {similarRadiusKm} km
            </p>
          )}
        </div>
        <Link
          to={section.to}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-warning"
        >
          Ver todos
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
        {posts.map((post) => (
          <PetCard key={post.id} pet={post} />
        ))}
      </div>
    </section>
  );
}

function share(name) {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: name, url }).catch(() => {});
    return;
  }
  navigator.clipboard
    .writeText(url)
    .then(() => toast.success("Link copiado."))
    .catch(() => toast.error("Não foi possível copiar o link."));
}

function PostDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando anúncio"
      className="flex w-full flex-col gap-6"
    >
      <div className="flex min-h-9 items-center">
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Skeleton className="aspect-4/3 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function PostDetailsError({ notFound, onRetry }) {
  return (
    <Empty variant="outline">
      <EmptyHeader>
        <EmptyMedia variant="brand">
          <SearchX />
        </EmptyMedia>
        {notFound && <EmptyTitle>Anúncio não encontrado</EmptyTitle>}
        <EmptyDescription>
          {notFound
            ? "Ele pode ter sido finalizado, pausado ou removido."
            : "Não foi possível carregar o anúncio."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {notFound ? (
          <Button asChild variant="outline">
            <Link to="/adoptions">Ver anúncios</Link>
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={onRetry}>
            Tentar de novo
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}

// Quem veio de outra tela do site volta no histórico (mantém os filtros da busca) com um "Voltar" genérico.
// No celular a ordem é fotos, ficha e "Sobre"; no desktop a ficha vira a coluna da direita.
export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [openingChat, setOpeningChat] = useState(false);

  useEffect(() => {
    let ignore = false;
    api
      .get(`/api/posts/${id}`)
      .then(({ data }) => !ignore && setResult({ id, post: data.data }))
      .catch(
        (error) =>
          !ignore &&
          setResult({
            id,
            error: error.response?.status === 404 ? "not_found" : "failed",
          }),
      );
    return () => {
      ignore = true;
    };
  }, [id, attempt]);

  const petName =
    result?.post && (result.post.animal.name || result.post.title);
  useEffect(() => {
    if (!petName) return;
    const previous = document.title;
    document.title = `${petName} · Mais Patinhas`;
    return () => {
      document.title = previous;
    };
  }, [petName]);

  if (!result || result.id !== id) return <PostDetailsSkeleton />;

  if (result.error) {
    return (
      <PostDetailsError
        notFound={result.error === "not_found"}
        onRetry={() => {
          setResult(null);
          setAttempt((current) => current + 1);
        }}
      />
    );
  }

  const { post } = result;
  const animal = post.animal;
  const name = animal.name || post.title;
  const isOwner = user?.id === post.user?.id;
  const isReunion = post.status === "resolved" && post.type !== "adoption";
  const type = postTypes[post.type] ? post.type : "adoption";
  const back = backLinkOf(post, isOwner);
  const cameFromSite = window.history.state?.idx > 0;
  const contact = contactOf(post, animal.name);

  // Abre a conversa (ou reaproveita a que já existe) e leva direto para ela.
  function openConversation() {
    setOpeningChat(true);
    api
      .post(`/api/posts/${post.id}/conversation`)
      .then(({ data }) => navigate(`/messages?conversation=${data.data.id}`))
      .catch((error) => {
        toast.error(
          error.response?.data?.message ?? "Não foi possível abrir a conversa.",
        );
        setOpeningChat(false);
      });
  }
  const { age_amount, age_unit } = ageFromBirthDate(animal.birth_date);
  const age = formatAge(age_amount, age_unit);
  const eyebrow = [
    animalSpecies[animal.species],
    animal.sex !== "undefined" && animalSexes[animal.sex],
    age,
  ]
    .filter(Boolean)
    .join(" · ");
  const attributes = [
    { label: "Porte", value: animalSizes[animal.size] },
    { label: "Cor", value: animalColors[animal.color] },
    { label: "Raça", value: animal.breed || "SRD" },
  ];
  const canFavorite =
    !isOwner &&
    post.type === "adoption" &&
    post.status === "active" &&
    post.is_favorite !== undefined;

  function changeStatus(_, status) {
    setResult((current) => ({
      ...current,
      post: { ...current.post, status },
    }));
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex min-h-9 items-center text-sm md:pr-14">
        <Link
          to={back.to}
          onClick={(event) => {
            if (cameFromSite) {
              event.preventDefault();
              navigate(-1);
            }
          }}
          className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {cameFromSite ? "Voltar" : back.label}
        </Link>
      </div>

      <div className="grid items-start gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
        <div className="lg:col-start-1">
          <PhotoGallery
            key={post.id}
            photos={post.photos ?? []}
            name={name}
            badge={
              <Badge
                variant={isReunion ? "success" : postTypes[type].variant}
                className="h-6 px-3 shadow-xs"
              >
                {isReunion ? statusLabelOf(post) : catalogLabels[type]}
              </Badge>
            }
          />
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {eyebrow && (
                <p className="text-xs font-semibold tracking-[0.12em] text-warning uppercase">
                  {eyebrow}
                </p>
              )}
              <h1 className="mt-2 font-heading text-4xl tracking-tight text-balance">
                {name}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
                {post.municipality && (
                  <>
                    <MapPin className="size-4 shrink-0" />
                    {post.municipality.name} - {post.municipality.state}
                    <span aria-hidden="true">·</span>
                  </>
                )}
                {publishedLabel(post.published_at ?? post.created_at)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              {canFavorite && <FavoriteButton post={post} name={name} />}
              {isOwner && !finishedPostStatuses.includes(post.status) && (
                <PostActions post={post} onStatusChange={changeStatus} />
              )}
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-4 rounded-2xl bg-card p-5 shadow-xs">
            {attributes.map(({ label, value }) => (
              <div key={label} className="min-w-0">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-1 truncate font-semibold" title={value}>
                  {value ?? "Não informado"}
                </dd>
              </div>
            ))}
          </dl>

          {post.type === "adoption" ? (
            <HealthCard animal={animal} />
          ) : (
            <SightingCard post={post} />
          )}

          {isReunion && (
            <div className="flex items-start gap-3 rounded-2xl bg-success-subtle p-5">
              <PartyPopper className="mt-0.5 size-5 shrink-0 text-success" />
              <div>
                <p className="font-semibold">{statusLabelOf(post)}!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Este pet voltou para casa. A história fica aqui para dar
                  esperança a quem ainda procura.
                </p>
              </div>
            </div>
          )}

          {isOwner && !isReunion && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-secondary/50 p-5 text-sm">
              <span>Este é o seu anúncio.</span>
              <Badge variant={postStatuses[post.status]?.variant}>
                {statusLabelOf(post)}
              </Badge>
            </div>
          )}

          {!isOwner && post.status === "active" && (
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                size="xl"
                className="w-full"
                disabled={openingChat}
                onClick={openConversation}
              >
                <MessageCircle />
                {contact.label}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {contact.hint}
              </p>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => share(name)}
          >
            <Share2 />
            Compartilhar
          </Button>

          {post.user && <AuthorCard author={post.user} />}
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <AboutSection post={post} animal={animal} />
        </div>
      </div>

      {!isReunion && <SimilarPets post={post} />}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import {
  Focus,
  ImageOff,
  ImagePlus,
  Images,
  Lightbulb,
  Star,
  Sun,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import WholePhoto from "@/components/WholePhoto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";

const maxPhotos = 5;
const maxPhotoBytes = 5 * 1024 * 1024;
const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];

const tips = [
  {
    icon: Sun,
    text: "Fotografe em lugar claro, de preferência com luz natural.",
  },
  { icon: Focus, text: "Deixe o pet em foco e ocupando boa parte da foto." },
  {
    icon: Images,
    text: "Mostre o rosto e o corpo inteiro em fotos diferentes.",
  },
];

// Mesmos limites do StorePostRequest. Foto grande ou pesada demais é reduzida aqui; pequena não tem conserto.
const minPhotoSide = 300;
const maxPhotoSide = 6000;
const resizedPhotoSide = 4000;

// Regrava em no máximo 4000 px; também baixa o peso de foto que já tem tamanho bom.
async function shrink(file, bitmap) {
  const scale = Math.min(
    1,
    resizedPhotoSide / Math.max(bitmap.width, bitmap.height),
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const type = file.type === "image/jpeg" ? "image/jpeg" : "image/webp";
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, type, 0.9),
  );
  return new File([blob], file.name, { type: blob.type });
}

async function checkPhoto(file) {
  if (!acceptedTypes.includes(file.type)) {
    return { file, reason: "Não é JPG, PNG ou WebP" };
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return { file, reason: "Não foi possível abrir" };
  }

  try {
    const { width, height } = bitmap;
    if (width < minPhotoSide || height < minPhotoSide) {
      return {
        file,
        preview: true,
        reason: `Pequena demais: ${width}×${height}. Mínimo ${minPhotoSide}×${minPhotoSide}`,
      };
    }
    const photo =
      width > maxPhotoSide || height > maxPhotoSide || file.size > maxPhotoBytes
        ? await shrink(file, bitmap)
        : file;
    if (photo.size > maxPhotoBytes) {
      return { file, preview: true, reason: "Passa de 5 MB" };
    }
    return { file: photo, ok: true };
  } finally {
    bitmap.close();
  }
}

function revokePreviews(photos) {
  photos.forEach(({ url }) => url && URL.revokeObjectURL(url));
}

function hasFiles(event) {
  return Array.from(event.dataTransfer.types).includes("Files");
}

function UploadArea({ compact, remaining, onFiles }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <label
      onDragOver={(event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        setIsDragging(false);
        onFiles(Array.from(event.dataTransfer.files));
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-4 text-center transition-colors focus-within:border-ring hover:border-primary hover:bg-primary/5",
        compact ? "aspect-square" : "min-h-56 flex-1 gap-3 p-6",
        isDragging && "border-primary bg-primary/10",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-2xl bg-primary/15 text-warning",
          compact ? "size-10" : "size-14",
        )}
      >
        <ImagePlus className={compact ? "size-5" : "size-7"} />
      </span>
      <span className={cn("font-semibold", compact ? "text-sm" : "text-base")}>
        {compact ? "Adicionar" : "Arraste as fotos ou clique para escolher"}
      </span>
      <span className="text-xs text-muted-foreground">
        {compact ? `Mais ${remaining}` : "JPG, PNG ou WebP, no máximo 5 fotos"}
      </span>
      <input
        type="file"
        accept={acceptedTypes.join(",")}
        multiple
        onChange={(event) => {
          onFiles(Array.from(event.target.files));
          event.target.value = "";
        }}
        className="sr-only"
      />
    </label>
  );
}

function PhotoTile({
  image,
  index,
  isCover,
  isDropTarget,
  isInvalid,
  onRemove,
  onMakeCover,
  dragHandlers,
}) {
  return (
    <li
      draggable
      {...dragHandlers}
      className={cn(
        "group relative cursor-grab overflow-hidden rounded-2xl bg-secondary shadow-xs transition-all active:cursor-grabbing",
        isCover ? "aspect-[4/3] self-start" : "aspect-square",
        isDropTarget && "ring-4 ring-primary/60",
        isInvalid && "ring-4 ring-destructive",
      )}
    >
      {isCover ? (
        <WholePhoto src={image.url} alt="Capa do anúncio" />
      ) : (
        <img
          src={image.url}
          alt={`Foto ${index + 1}`}
          draggable={false}
          className="absolute inset-0 size-full object-cover object-[50%_25%] transition-transform duration-300 group-hover:scale-[1.03]"
        />
      )}
      <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100" />

      {isCover && (
        <Badge className="absolute top-3 left-3 h-7 gap-1.5 px-3 shadow-xs">
          <Star className="fill-current" />
          Capa
        </Badge>
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Remover foto ${index + 1}`}
        onClick={onRemove}
        className="absolute top-2 right-2 rounded-full bg-background/85 shadow-xs backdrop-blur-xs hover:bg-background"
      >
        <X />
      </Button>

      {!isCover && (
        <Button
          type="button"
          size="xs"
          onClick={onMakeCover}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 shadow-xs transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
        >
          <Star />
          Tornar capa
        </Button>
      )}
    </li>
  );
}

// Foto que não entrou no anúncio: fica na grade, marcada, até a pessoa dispensar.
function RejectedTile({ photo, onDismiss }) {
  return (
    <li className="relative aspect-square overflow-hidden rounded-2xl bg-secondary ring-4 ring-destructive">
      {photo.url ? (
        <img
          src={photo.url}
          alt={`${photo.name}, não adicionada`}
          className="absolute inset-0 size-full object-cover object-[50%_25%] opacity-50"
        />
      ) : (
        <ImageOff className="absolute top-1/3 left-1/2 size-8 -translate-1/2 text-muted-foreground/60" />
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Dispensar ${photo.name}`}
        onClick={onDismiss}
        className="absolute top-2 right-2 rounded-full bg-background/85 shadow-xs backdrop-blur-xs hover:bg-background"
      >
        <X />
      </Button>
      <div
        role="alert"
        className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-destructive px-3 py-2 text-white"
      >
        <p className="truncate text-xs font-semibold" title={photo.name}>
          {photo.name}
        </p>
        <p className="text-xs leading-snug">{photo.reason}</p>
      </div>
    </li>
  );
}

// O servidor numera só as fotos novas (images.N), na ordem em que aparecem, e é assim que o erro
// dele marca a foto certa. Sair da tela libera as miniaturas das fotos recusadas.
export default function PhotosStep({ form, update, errors }) {
  const [rejected, setRejected] = useState([]);
  const rejectedRef = useRef(rejected);
  useEffect(() => {
    rejectedRef.current = rejected;
  }, [rejected]);
  useEffect(() => () => revokePreviews(rejectedRef.current), []);
  const [skipped, setSkipped] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [targetIndex, setTargetIndex] = useState(null);
  const images = form.images;
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  const remaining = maxPhotos - images.length;
  const newFiles = images
    .filter((image) => image.file)
    .map((image) => image.file);
  const rejectedFiles = new Set(
    Object.keys(errors)
      .map((key) => key.match(/^images\.(\d+)$/)?.[1])
      .filter(Boolean)
      .map((index) => newFiles[Number(index)]),
  );
  const serverError =
    errors.images ??
    Object.entries(errors).find(([key]) => key.startsWith("images."))?.[1];

  // Cada envio substitui a lista de recusadas, para ela falar só das últimas fotos escolhidas.
  // Conferir as fotos leva tempo e outro envio pode terminar antes: por isso usa a lista de agora.
  async function addFiles(files) {
    const checked = await Promise.all(files.map(checkPhoto));
    const current = imagesRef.current;
    const valid = checked.filter((result) => result.ok);
    const accepted = valid.slice(0, maxPhotos - current.length);
    setSkipped(valid.length - accepted.length);

    revokePreviews(rejectedRef.current);
    const nextRejected = checked
      .filter((result) => !result.ok)
      .map(({ file, preview, reason }) => ({
        name: file.name,
        reason,
        url: preview ? URL.createObjectURL(file) : null,
      }));
    rejectedRef.current = nextRejected;
    setRejected(nextRejected);
    const next = [
      ...current,
      ...accepted.map(({ file }) => ({ file, url: URL.createObjectURL(file) })),
    ];
    imagesRef.current = next;
    update("images", next);
  }

  function removePhoto(index) {
    URL.revokeObjectURL(images[index].url);
    setSkipped(0);
    update(
      "images",
      images.filter((_, current) => current !== index),
    );
  }

  function movePhoto(from, to) {
    const reordered = [...images];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    update("images", reordered);
  }

  function dragHandlersFor(index) {
    return {
      onDragStart: (event) => {
        event.dataTransfer.effectAllowed = "move";
        setDraggedIndex(index);
      },
      onDragOver: (event) => {
        event.preventDefault();
        setTargetIndex(index);
      },
      onDrop: (event) => {
        event.preventDefault();
        if (draggedIndex === null) {
          addFiles(Array.from(event.dataTransfer.files));
        } else if (draggedIndex !== index) {
          movePhoto(draggedIndex, index);
        }
        setDraggedIndex(null);
        setTargetIndex(null);
      },
      onDragEnd: () => {
        setDraggedIndex(null);
        setTargetIndex(null);
      },
    };
  }

  function dismissRejected(index) {
    if (rejected[index].url) URL.revokeObjectURL(rejected[index].url);
    setRejected(rejected.filter((_, current) => current !== index));
  }

  const rejectedTiles = rejected.map((photo, index) => (
    <RejectedTile
      key={`${photo.name}-${index}`}
      photo={photo}
      onDismiss={() => dismissRejected(index)}
    />
  ));

  const tiles = images.map((image, index) => (
    <PhotoTile
      key={image.url}
      image={image}
      index={index}
      isCover={index === 0}
      isDropTarget={
        targetIndex === index && draggedIndex !== null && draggedIndex !== index
      }
      isInvalid={image.file && rejectedFiles.has(image.file)}
      onRemove={() => removePhoto(index)}
      onMakeCover={() => movePhoto(index, 0)}
      dragHandlers={dragHandlersFor(index)}
    />
  ));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-3">
        {images.length === 0 ? (
          <>
            <UploadArea remaining={remaining} onFiles={addFiles} />
            {rejectedTiles.length > 0 && (
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3">
                {rejectedTiles}
              </ul>
            )}
          </>
        ) : (
          <>
            <ul className="grid gap-3 md:grid-cols-[3fr_2fr]">
              {tiles[0]}
              <li className="list-none">
                <ul className="grid grid-cols-2 content-start gap-3">
                  {tiles.slice(1)}
                  {rejectedTiles}
                  {remaining > 0 && (
                    <li>
                      <UploadArea
                        compact
                        remaining={remaining}
                        onFiles={addFiles}
                      />
                    </li>
                  )}
                </ul>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground">
              Arraste as fotos para mudar a ordem ou use "Tornar capa".{" "}
              {images.length} de {maxPhotos} fotos.
            </p>
          </>
        )}

        {skipped > 0 && (
          <p role="status" className="text-xs text-muted-foreground">
            {skipped === 1
              ? "1 foto ficou de fora"
              : `${skipped} fotos ficaram de fora`}{" "}
            porque o limite é de {maxPhotos} fotos. Ficaram as primeiras.
          </p>
        )}

        {serverError && (
          <FieldError className="text-xs">{serverError}</FieldError>
        )}
      </div>

      <aside className="h-fit rounded-2xl bg-secondary/40 p-5">
        <h3 className="flex items-center gap-2 font-sans text-sm font-semibold">
          <Lightbulb className="size-4 text-warning" />
          Dicas para boas fotos
        </h3>
        <ul className="mt-4 flex flex-col gap-4">
          {tips.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex gap-3 text-[0.8125rem] text-muted-foreground"
            >
              <Icon className="mt-0.5 size-4 shrink-0 text-warning" />
              {text}
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-border/60 pt-4 text-[0.8125rem] text-muted-foreground">
          A primeira foto vira a capa do anúncio e aparece no catálogo.
        </p>
      </aside>
    </div>
  );
}

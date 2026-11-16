import { useState } from "react";
import {
  Focus,
  ImagePlus,
  Images,
  Lightbulb,
  Star,
  Sun,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
        {compact
          ? `Mais ${remaining}`
          : "JPG, PNG ou WebP, até 5 MB cada, no máximo 5 fotos"}
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
        isCover
          ? "aspect-[4/3] md:aspect-auto md:h-full md:min-h-80"
          : "aspect-square",
        isDropTarget && "ring-4 ring-primary/60",
      )}
    >
      <img
        src={image.url}
        alt={isCover ? "Capa do anúncio" : `Foto ${index + 1}`}
        draggable={false}
        className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
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

export default function PhotosStep({ form, update, errors }) {
  const [localError, setLocalError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [targetIndex, setTargetIndex] = useState(null);
  const images = form.images;
  const remaining = maxPhotos - images.length;
  const serverError =
    errors.images ??
    Object.entries(errors).find(([key]) => key.startsWith("images."))?.[1];

  function addFiles(files) {
    const valid = files.filter(
      (file) => acceptedTypes.includes(file.type) && file.size <= maxPhotoBytes,
    );
    const accepted = valid.slice(0, remaining);

    setLocalError(
      valid.length < files.length
        ? "Use fotos JPG, PNG ou WebP de até 5 MB."
        : accepted.length < valid.length
          ? `Você pode enviar no máximo ${maxPhotos} fotos.`
          : "",
    );
    update("images", [
      ...images,
      ...accepted.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
  }

  function removePhoto(index) {
    URL.revokeObjectURL(images[index].url);
    setLocalError("");
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

  const tiles = images.map((image, index) => (
    <PhotoTile
      key={image.url}
      image={image}
      index={index}
      isCover={index === 0}
      isDropTarget={
        targetIndex === index && draggedIndex !== null && draggedIndex !== index
      }
      onRemove={() => removePhoto(index)}
      onMakeCover={() => movePhoto(index, 0)}
      dragHandlers={dragHandlersFor(index)}
    />
  ));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-3">
        {images.length === 0 ? (
          <UploadArea remaining={remaining} onFiles={addFiles} />
        ) : (
          <>
            <ul className="grid gap-3 md:grid-cols-[3fr_2fr]">
              {tiles[0]}
              <li className="list-none">
                <ul className="grid grid-cols-2 content-start gap-3">
                  {tiles.slice(1)}
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

        {(localError || serverError) && (
          <FieldError className="text-xs">
            {localError || serverError}
          </FieldError>
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

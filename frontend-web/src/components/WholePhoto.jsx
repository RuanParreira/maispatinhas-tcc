import { cn } from "@/lib/utils";

// Mostra a foto inteira, sem corte; a própria foto desfocada preenche as sobras da moldura.
// O pai define o tamanho e precisa ser relative com overflow-hidden.
export default function WholePhoto({ src, alt, className }) {
  return (
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 size-full scale-110 object-cover blur-2xl"
      />
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={cn("absolute inset-0 size-full object-contain", className)}
      />
    </>
  );
}

import { useId } from "react";

const swatchShapes = {
  black: <rect width="20" height="20" fill="#1f1b18" />,
  white: <rect width="20" height="20" fill="#ffffff" />,
  gray: <rect width="20" height="20" fill="#9b9690" />,
  caramel: <rect width="20" height="20" fill="#c98a4b" />,
  golden: <rect width="20" height="20" fill="#e0b04f" />,
  orange: <rect width="20" height="20" fill="#e07b2a" />,
  brown: <rect width="20" height="20" fill="#6b4226" />,
  beige: <rect width="20" height="20" fill="#eadbc0" />,
  black_and_white: (
    <>
      <rect width="20" height="20" fill="#ffffff" />
      <path d="M0 0H20L0 20Z" fill="#1f1b18" />
    </>
  ),
  brindle: (
    <>
      <rect width="20" height="20" fill="#c98a4b" />
      <path
        d="M-4 6L6-4M-4 14L14-4M-4 22L22-4M4 24L24 4M12 24L24 12"
        stroke="#5a3820"
        strokeWidth="2.5"
      />
    </>
  ),
  tricolor: (
    <>
      <rect width="20" height="20" fill="#ffffff" />
      <path d="M10 10L10 0H0V14Z" fill="#1f1b18" />
      <path d="M10 10L10 0H20V14Z" fill="#e07b2a" />
    </>
  ),
  siamese: (
    <>
      <rect width="20" height="20" fill="#efe3cf" />
      <path d="M0 13Q10 9 20 13V20H0Z" fill="#4a3426" />
    </>
  ),
};

/**
 * Bolinha com a cor da pelagem. SVG recortado em círculo para que padrões
 * (tigrado, tricolor) não vazem pela borda.
 */
export default function ColorSwatch({ color, className }) {
  const clipId = `swatch-${useId().replace(/[^\w-]/g, "")}`;

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <clipPath id={clipId}>
        <circle cx="10" cy="10" r="10" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>{swatchShapes[color]}</g>
      <circle
        cx="10"
        cy="10"
        r="9.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.3"
      />
    </svg>
  );
}

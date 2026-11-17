export function RequiredLabel({ children }) {
  return (
    <span>
      {children}
      <span aria-hidden="true" className="ml-0.5 text-destructive">
        *
      </span>
      <span className="sr-only"> (obrigatório)</span>
    </span>
  );
}

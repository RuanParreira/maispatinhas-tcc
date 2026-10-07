import { Link } from "react-router-dom";

// Nome de uma pessoa citada no perfil. Contas removidas não têm perfil, então ficam sem link.
export default function PersonLink({ person }) {
  if (person.removed) return person.name;

  return (
    <Link
      to={`/users/${person.id}`}
      className="font-medium text-foreground underline-offset-4 hover:underline"
    >
      {person.name}
    </Link>
  );
}

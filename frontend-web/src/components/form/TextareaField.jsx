import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";

export function TextareaField({ id, label, hint, error, ...props }) {
  return (
    <Field data-invalid={Boolean(error)} className="gap-1.5">
      <FieldLabel htmlFor={id} className="text-xs tracking-wide">
        {label}
      </FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          id={id}
          aria-invalid={Boolean(error)}
          className="min-h-28 px-4 py-3 text-body md:text-body"
          {...props}
        />
      </InputGroup>
      {hint && !error && (
        <FieldDescription className="text-xs">{hint}</FieldDescription>
      )}
      {error && <FieldError className="text-xs">{error}</FieldError>}
    </Field>
  );
}

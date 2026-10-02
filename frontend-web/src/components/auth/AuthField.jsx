import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const strengthLevels = [
  { label: "Inicial", color: "bg-border" },
  { label: "Fraca", color: "bg-destructive" },
  { label: "Média", color: "bg-primary" },
  { label: "Boa", color: "bg-success" },
  { label: "Forte", color: "bg-success" },
];

function passwordScore(password) {
  if (!password) return 0;
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  return Math.max(1, checks.filter(Boolean).length);
}

export function AuthField({
  id,
  label,
  icon: Icon,
  error,
  labelAction,
  trailing,
  footer,
  className,
  children,
  ...props
}) {
  return (
    <Field data-invalid={Boolean(error)} className="gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <FieldLabel htmlFor={id} className="text-xs tracking-wide">
          {label}
        </FieldLabel>
        {labelAction}
      </div>
      <InputGroup className="h-12">
        {children ?? (
          <InputGroupInput
            id={id}
            aria-invalid={Boolean(error)}
            className={cn("pr-4 text-body md:text-body", className)}
            {...props}
          />
        )}
        <InputGroupAddon className="pl-4">
          <Icon className="size-4.5" />
        </InputGroupAddon>
        {trailing}
      </InputGroup>
      {footer}
      {error && <FieldError className="text-xs">{error}</FieldError>}
    </Field>
  );
}

export function PasswordField({ showStrength = false, ...props }) {
  const [visible, setVisible] = useState(false);
  const ToggleIcon = visible ? EyeOff : Eye;
  const score = passwordScore(props.value);
  const level = strengthLevels[score];

  return (
    <AuthField
      {...props}
      icon={Lock}
      type={visible ? "text" : "password"}
      className="pr-1.5"
      labelAction={
        showStrength ? (
          <span className="text-[0.6875rem] text-muted-foreground">
            Segurança: {level.label}
          </span>
        ) : (
          props.labelAction
        )
      }
      footer={
        showStrength && (
          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
            {[1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  step <= score ? level.color : "bg-secondary",
                )}
              />
            ))}
          </div>
        )
      }
      trailing={
        <InputGroupAddon align="inline-end" className="pr-3">
          <InputGroupButton
            size="icon-sm"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          >
            <ToggleIcon className="size-4.5" />
          </InputGroupButton>
        </InputGroupAddon>
      }
    />
  );
}

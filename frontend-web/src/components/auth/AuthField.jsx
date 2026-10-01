import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-xs font-medium tracking-wide">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground" />
        {children ?? (
          <Input
            id={id}
            aria-invalid={Boolean(error)}
            className={cn(
              "h-12 rounded-xl border-transparent bg-secondary/50 pr-4 pl-12 text-body md:text-body",
              className,
            )}
            {...props}
          />
        )}
        {trailing}
      </div>
      {footer}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
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
      className="pr-12"
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
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
        >
          <ToggleIcon className="size-4.5" />
        </button>
      }
    />
  );
}

import { Pill, Stethoscope, Syringe } from "lucide-react";
import { cn } from "@/lib/utils";
import { healthAnswers, healthQuestions } from "@/lib/posts";
import { ChoiceField } from "@/components/form/ChoiceField";

const questionDetails = {
  "animal.vaccinated": {
    icon: Syringe,
    hint: "Vacinas em dia, como a V10 ou a antirrábica.",
  },
  "animal.dewormed": {
    icon: Pill,
    hint: "Tomou remédio contra vermes recentemente.",
  },
  "animal.neutered": {
    icon: Stethoscope,
    hint: "Já passou pela cirurgia de castração.",
  },
};

export default function HealthStep({ form, update, errors }) {
  return (
    <ul className="flex flex-col gap-3">
      {healthQuestions.map(({ field, label }) => {
        const { icon: Icon, hint } = questionDetails[field];

        return (
          <li
            key={field}
            className={cn(
              "flex flex-col gap-4 rounded-2xl border bg-background/40 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:p-5",
              form[field] ? "border-primary/40" : "border-border/70",
              errors[field] && "border-destructive/50",
            )}
          >
            <div className="flex items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-warning">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{label}</p>
                <p className="text-[0.8125rem] text-muted-foreground">{hint}</p>
              </div>
            </div>
            <ChoiceField
              ariaLabel={label}
              options={healthAnswers}
              value={form[field]}
              onChange={(value) => update(field, value)}
              error={errors[field]}
            />
          </li>
        );
      })}
    </ul>
  );
}

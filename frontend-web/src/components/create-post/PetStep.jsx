import {
  Bird,
  Cat,
  CircleHelp,
  Dna,
  Dog,
  IdCard,
  Mars,
  Palette,
  PawPrint,
  Rabbit,
  Rat,
  Sparkles,
  Venus,
} from "lucide-react";
import { animalSexes, animalSizes, animalSpecies } from "@/lib/posts";
import FormSection from "@/components/create-post/FormSection";
import { ChoiceField } from "@/components/form/ChoiceField";
import { IconField } from "@/components/form/IconField";
import { TextareaField } from "@/components/form/TextareaField";
import {
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

const speciesOptions = { ...animalSpecies, other: "Outros" };

const speciesIcons = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  rodent: Rat,
  rabbit: Rabbit,
  other: PawPrint,
};

const sexIcons = { male: Mars, female: Venus, undefined: CircleHelp };

const ageUnits = { months: "Meses", years: "Anos" };

/**
 * Idade como número + unidade; vira a data aproximada de nascimento no envio.
 */
function AgeField({ form, update, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor="age_amount" className="text-xs tracking-wide">
        {form.type === "found"
          ? "Idade aproximada (opcional)"
          : "Idade aproximada"}
      </FieldLabel>
      <div className="flex items-start gap-2">
        <InputGroup className="h-10 w-24 shrink-0">
          <InputGroupInput
            id="age_amount"
            type="number"
            inputMode="numeric"
            min={0}
            max={form.age_unit === "years" ? 30 : 36}
            placeholder="Ex.: 2"
            aria-invalid={Boolean(error)}
            value={form.age_amount}
            onChange={(e) => update("age_amount", e.target.value)}
            className="text-center text-body tabular-nums md:text-body [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
          />
        </InputGroup>
        <ChoiceField
          ariaLabel="Unidade da idade"
          options={ageUnits}
          value={form.age_unit}
          onChange={(value) => update("age_unit", value)}
        />
      </div>
      {error ? (
        <FieldError className="text-xs">{error}</FieldError>
      ) : (
        <FieldDescription className="text-xs">
          {form.type === "found"
            ? "Se der para estimar pelo tamanho e pelos dentes, ajuda nas buscas."
            : "Não sabe ao certo? Estime pelo tamanho e pelos dentes."}
        </FieldDescription>
      )}
    </div>
  );
}

export default function PetStep({ form, update, errors }) {
  return (
    <div className="flex flex-col gap-10">
      <FormSection
        icon={IdCard}
        title="Identificação"
        description="Quem ele é e como chamá-lo."
      >
        <ChoiceField
          label="Espécie"
          options={speciesOptions}
          icons={speciesIcons}
          value={form["animal.species"]}
          onChange={(value) => update("animal.species", value)}
          error={errors["animal.species"]}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <IconField
            id="animal_name"
            label={form.type === "lost" ? "Nome" : "Nome (opcional)"}
            icon={PawPrint}
            placeholder={
              form.type === "found" ? "Se tiver coleira com nome" : "Ex.: Thor"
            }
            maxLength={60}
            value={form["animal.name"]}
            onChange={(e) => update("animal.name", e.target.value)}
            error={errors["animal.name"]}
          />
          <IconField
            id="animal_breed"
            label="Raça (opcional)"
            icon={Dna}
            placeholder="Em branco = sem raça definida"
            maxLength={60}
            value={form["animal.breed"]}
            onChange={(e) => update("animal.breed", e.target.value)}
            error={errors["animal.breed"]}
          />
          <IconField
            id="animal_color"
            label="Cor"
            icon={Palette}
            placeholder="Ex.: caramelo com branco"
            maxLength={60}
            value={form["animal.color"]}
            onChange={(e) => update("animal.color", e.target.value)}
            error={errors["animal.color"]}
          />
        </div>
      </FormSection>

      <FormSection
        icon={Sparkles}
        title="Características"
        description="Detalhes que ajudam a reconhecê-lo e a encontrar o lar certo."
      >
        <div className="flex flex-wrap items-start gap-x-8 gap-y-6">
          <ChoiceField
            label="Sexo"
            options={animalSexes}
            icons={sexIcons}
            value={form["animal.sex"]}
            onChange={(value) => update("animal.sex", value)}
            error={errors["animal.sex"]}
          />
          <ChoiceField
            label="Porte"
            options={animalSizes}
            hint="Pequeno: até 10 kg · Médio: 10 a 25 kg · Grande: acima de 25 kg"
            value={form["animal.size"]}
            onChange={(value) => update("animal.size", value)}
            error={errors["animal.size"]}
          />
          <AgeField
            form={form}
            update={update}
            error={errors.age_amount ?? errors["animal.approximate_birth_date"]}
          />
        </div>

        <TextareaField
          id="animal_distinctive_features"
          label="Características marcantes"
          hint="Manchas, cicatrizes, coleira, jeito de ser: o que ajuda a reconhecê-lo."
          placeholder="Ex.: mancha branca no peito e orelha esquerda caída."
          value={form["animal.distinctive_features"]}
          onChange={(e) =>
            update("animal.distinctive_features", e.target.value)
          }
          error={errors["animal.distinctive_features"]}
        />
      </FormSection>
    </div>
  );
}

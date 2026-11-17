import {
  Check,
  House,
  Lightbulb,
  MapPin,
  MapPinned,
  Megaphone,
  Signpost,
  TextQuote,
} from "lucide-react";
import { postTextMinLengths } from "@/lib/posts";
import CityCombobox from "@/components/auth/CityCombobox";
import FormSection from "@/components/create-post/FormSection";
import { RequiredLabel } from "@/components/form/RequiredLabel";
import { ChoiceField } from "@/components/form/ChoiceField";
import { DateField } from "@/components/form/DateField";
import { IconField } from "@/components/form/IconField";
import { TextareaField } from "@/components/form/TextareaField";

const titleMaxLength = 120;

const withFinderOptions = {
  yes: "Sim, está comigo",
  no: "Não, ficou no local",
};

const withFinderIcons = { yes: House, no: MapPinned };

const copyByType = {
  adoption: {
    title: "Ex.: Thor procura um lar cheio de carinho",
    description:
      "Conte a história dele, como é o temperamento e que tipo de lar combina com ele.",
    tips: [
      "Descreva a rotina e o temperamento dele.",
      "Diga se convive bem com crianças e outros animais.",
      "Informe cuidados especiais, como remédios ou dieta.",
    ],
  },
  lost: {
    occurredAt: "Quando ele sumiu?",
    location: "Onde foi visto pela última vez (opcional)",
    locationPlaceholder: "Ex.: Centro, perto da Praça da Matriz",
    title: "Ex.: Thor desapareceu no bairro Centro",
    description:
      "Onde e como ele sumiu, se atende pelo nome e como agir se alguém o encontrar.",
    tips: [
      "Diga o bairro e o ponto onde ele foi visto pela última vez.",
      "Conte se ele atende pelo nome ou se foge de estranhos.",
      "Informe se usava coleira, plaquinha ou microchip.",
    ],
  },
  found: {
    occurredAt: "Quando você o encontrou?",
    location: "Onde foi encontrado (opcional)",
    locationPlaceholder: "Ex.: Rua das Flores, em frente à padaria",
    title: "Ex.: Cachorro caramelo encontrado perto da praça",
    description:
      "Onde você o encontrou, como ele está agora e o que o tutor precisa saber.",
    tips: [
      "Diga onde e em que horário você o encontrou.",
      "Conte como ele está agora e onde está abrigado.",
      "Guarde um detalhe só para você: ele ajuda a confirmar quem é o tutor.",
    ],
  },
};

export default function DetailsStep({ form, update, errors, municipalities }) {
  const copy = copyByType[form.type] ?? copyByType.adoption;
  const descriptionMissing =
    postTextMinLengths.description - form.description.trim().length;
  const selectedCity = municipalities.find(
    (municipality) => municipality.ibge_code === form.municipality_id,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-10">
        <FormSection
          icon={MapPin}
          title="Localização"
          description="A cidade aparece no card e ajuda nas buscas."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CityCombobox
              id="municipality_id"
              label={<RequiredLabel>Cidade</RequiredLabel>}
              municipalities={municipalities}
              value={form.municipality_id}
              initialLabel={
                selectedCity
                  ? `${selectedCity.name} - ${selectedCity.state}`
                  : ""
              }
              onChange={(value) => update("municipality_id", value)}
              error={errors.municipality_id}
            />
            {copy.occurredAt && (
              <DateField
                id="occurred_at"
                label={<RequiredLabel>{copy.occurredAt}</RequiredLabel>}
                max={new Date()}
                value={form.occurred_at}
                onChange={(value) => update("occurred_at", value)}
                error={errors.occurred_at}
              />
            )}
            {form.type === "found" && (
              <div className="md:col-span-2">
                <ChoiceField
                  label={<RequiredLabel>O pet está com você?</RequiredLabel>}
                  options={withFinderOptions}
                  icons={withFinderIcons}
                  hint="Assim o tutor sabe se deve falar com você ou ir até o local."
                  value={form.with_finder}
                  onChange={(value) => update("with_finder", value)}
                  error={errors.with_finder}
                />
              </div>
            )}
            {copy.location && (
              <div className="md:col-span-2">
                <IconField
                  id="location_reference"
                  label={copy.location}
                  icon={Signpost}
                  placeholder={copy.locationPlaceholder}
                  maxLength={120}
                  value={form.location_reference}
                  onChange={(e) => update("location_reference", e.target.value)}
                  error={errors.location_reference}
                />
              </div>
            )}
          </div>
        </FormSection>

        <FormSection
          icon={TextQuote}
          title="Texto do anúncio"
          description="Um bom título chama atenção; a descrição conquista."
        >
          <IconField
            id="title"
            label={<RequiredLabel>Título</RequiredLabel>}
            icon={Megaphone}
            placeholder={copy.title}
            maxLength={titleMaxLength}
            labelAction={
              <span className="text-[0.6875rem] text-muted-foreground tabular-nums">
                {form.title.length}/{titleMaxLength}
              </span>
            }
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            error={errors.title}
          />
          <TextareaField
            id="description"
            label={<RequiredLabel>Descrição</RequiredLabel>}
            placeholder={copy.description}
            hint={
              descriptionMissing > 0
                ? `Faltam ${descriptionMissing} caracteres para o mínimo de ${postTextMinLengths.description}.`
                : "Quanto mais detalhes, mais fácil para quem lê."
            }
            className="min-h-40 px-4 py-3 text-body md:text-body"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            error={errors.description}
          />
        </FormSection>
      </div>

      <aside className="h-fit rounded-2xl bg-secondary/40 p-5">
        <h3 className="flex items-center gap-2 font-sans text-sm font-semibold">
          <Lightbulb className="size-4 text-warning" />
          Dicas para um bom anúncio
        </h3>
        <ul className="mt-4 flex flex-col gap-4">
          {copy.tips.map((tip) => (
            <li
              key={tip}
              className="flex gap-3 text-[0.8125rem] text-muted-foreground"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-warning" />
              {tip}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

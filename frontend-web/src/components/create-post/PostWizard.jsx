import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import { toast } from "sonner";
import { fetchMunicipalities } from "@/lib/municipalities";
import { isEmpty } from "@/lib/postForm";
import { postTextMinLengths, postTypes } from "@/lib/posts";
import DetailsStep from "@/components/create-post/DetailsStep";
import HealthStep from "@/components/create-post/HealthStep";
import LeaveGuard from "@/components/create-post/LeaveGuard";
import PetStep from "@/components/create-post/PetStep";
import PhotosStep from "@/components/create-post/PhotosStep";
import ReviewStep from "@/components/create-post/ReviewStep";
import StepIndicator from "@/components/create-post/StepIndicator";
import TypeStep from "@/components/create-post/TypeStep";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const steps = [
  {
    id: "type",
    title: "Tipo",
    heading: "Que tipo de anúncio você quer criar?",
    description: "Isso define as próximas perguntas.",
    Component: TypeStep,
    required: ["type"],
  },
  {
    id: "pet",
    title: "Pet",
    heading: "Conte sobre o pet",
    description: "Esses dados ajudam as pessoas a reconhecê-lo.",
    Component: PetStep,
    required: [
      "animal.species",
      "animal.name",
      "animal.color",
      "animal.sex",
      "animal.size",
      "age_amount",
    ],
    serverFields: ["animal.breed", "animal.approximate_birth_date"],
  },
  {
    id: "health",
    title: "Saúde",
    onlyFor: "adoption",
    heading: "Como está a saúde dele?",
    description:
      'Escolha uma resposta para cada item. Sem certeza? Marque "Não sei", isso não impede a publicação.',
    Component: HealthStep,
    required: ["animal.vaccinated", "animal.dewormed", "animal.neutered"],
  },
  {
    id: "photos",
    title: "Fotos",
    heading: "Adicione fotos",
    description: "Anúncios com foto recebem muito mais atenção. São opcionais.",
    Component: PhotosStep,
    required: [],
    serverFields: ["images", "photo_order", "delete_photo_ids"],
  },
  {
    id: "details",
    title: "Anúncio",
    heading: "Onde e o que dizer no anúncio",
    description: "Onde ele está e o que as pessoas precisam saber.",
    Component: DetailsStep,
    required: [
      "municipality_id",
      "occurred_at",
      "with_finder",
      "title",
      "description",
    ],
    serverFields: ["location_reference"],
  },
  {
    id: "review",
    title: "Revisão",
    heading: "Confira antes de publicar",
    description: "Tudo certo? Use Editar para ajustar qualquer parte.",
    Component: ReviewStep,
    required: [],
  },
];

/**
 * Campos obrigatórios vazios da etapa. A data do ocorrido só vale para perdido
 * e encontrado, o nome só para perdido, a idade é opcional para encontrado e
 * "está com você?" só existe em encontrado.
 */
function missingFields(step, form) {
  const notApplicable = {
    occurred_at: form.type === "adoption",
    "animal.name": form.type !== "lost",
    age_amount: form.type === "found",
    with_finder: form.type !== "found",
  };

  return step.required
    .filter((field) => !notApplicable[field])
    .filter((field) => isEmpty(form[field]))
    .reduce(
      (errors, field) => ({ ...errors, [field]: "Preencha este campo." }),
      {},
    );
}

function ageError(form) {
  const amount = Number(form.age_amount);
  if (!Number.isInteger(amount) || amount < 0) {
    return "Informe um número inteiro.";
  }
  if (form.age_unit === "years" && amount > 30) {
    return "A idade aproximada deve ser de no máximo 30 anos.";
  }
  if (form.age_unit === "months" && amount > 36) {
    return "Acima de 36 meses, informe a idade em anos.";
  }
  return null;
}

function stepErrorsOf(step, form) {
  const errors = missingFields(step, form);
  Object.entries(postTextMinLengths)
    .filter(([field]) => step.required.includes(field) && !errors[field])
    .filter(([field, min]) => form[field].trim().length < min)
    .forEach(([field, min]) => {
      errors[field] = `Use pelo menos ${min} caracteres.`;
    });
  if (
    step.required.includes("age_amount") &&
    !isEmpty(form.age_amount) &&
    !errors.age_amount
  ) {
    const message = ageError(form);
    if (message) errors.age_amount = message;
  }
  return errors;
}

/**
 * A saúde só importa para quem vai adotar: quem encontrou não sabe e, no
 * perdido, não ajuda a reconhecer o pet. Sem tipo escolhido, mostra todas.
 */
function stepsFor(type, editing) {
  return steps.filter(
    (step) =>
      (!type || !step.onlyFor || step.onlyFor === type) &&
      !(editing && step.id === "type"),
  );
}

function stepOfField(field, visibleSteps) {
  const index = visibleSteps.findIndex((step) =>
    [...step.required, ...(step.serverFields ?? [])].some(
      (stepField) => field === stepField || field.startsWith(`${stepField}.`),
    ),
  );
  return index === -1 ? 0 : index;
}

/**
 * Cadastro em etapas, usado para criar e para editar. Na edição o tipo fica
 * travado (ele muda as regras do anúncio), então a etapa Tipo some.
 */
export default function PostWizard({ initialForm, editing = false, onSubmit }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [municipalities, setMunicipalities] = useState([]);
  const [published, setPublished] = useState(false);
  const headingRef = useRef(null);
  const hasNavigated = useRef(false);
  const latestImages = useRef([]);

  const visibleSteps = stepsFor(form.type, editing);
  const step = visibleSteps[current];
  const isLast = current === visibleSteps.length - 1;

  useEffect(() => {
    fetchMunicipalities()
      .then(setMunicipalities)
      .catch(() =>
        toast.error(
          "Não foi possível carregar as cidades. Recarregue a página.",
        ),
      );
  }, []);

  useEffect(() => {
    if (hasNavigated.current) headingRef.current?.focus();
  }, [current]);

  // Navega só depois do render em que o LeaveGuard já foi desligado.
  useEffect(() => {
    if (published) navigate("/my-posts");
  }, [published, navigate]);

  useEffect(() => {
    latestImages.current = form.images;
  }, [form.images]);

  useEffect(
    () => () =>
      latestImages.current.forEach((image) => URL.revokeObjectURL(image.url)),
    [],
  );

  /**
   * Trocar o tipo muda quais campos são obrigatórios, então limpa todos os erros.
   */
  function update(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (field === "type") {
      setErrors({});
      return;
    }
    setErrors((previous) =>
      Object.fromEntries(
        Object.entries(previous).filter(
          ([key]) => key !== field && !key.startsWith(`${field}.`),
        ),
      ),
    );
  }

  function goTo(index) {
    hasNavigated.current = true;
    setCurrent(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToStep(id) {
    goTo(visibleSteps.findIndex((visibleStep) => visibleStep.id === id));
  }

  async function submit() {
    setSubmitting(true);
    try {
      await onSubmit(form);
      setPublished(true);
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (!serverErrors) {
        toast.error(
          editing
            ? "Não foi possível salvar. Tente novamente."
            : "Não foi possível publicar. Tente novamente.",
        );
        return;
      }
      const firstMessages = Object.fromEntries(
        Object.entries(serverErrors).map(([field, messages]) => [
          field,
          messages[0],
        ]),
      );
      setErrors(firstMessages);
      goTo(
        Math.min(
          ...Object.keys(firstMessages).map((field) =>
            stepOfField(field, visibleSteps),
          ),
        ),
      );
      toast.error("Revise os campos destacados.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isLast) {
      submit();
      return;
    }
    const stepErrors = stepErrorsOf(step, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    goTo(current + 1);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <LeaveGuard when={form !== initialForm && !published} editing={editing} />
      <StepIndicator steps={visibleSteps} current={current} onSelect={goTo} />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-8 rounded-2xl bg-card p-5 shadow-xs sm:p-8"
      >
        <div>
          {step.id !== "type" && (
            <Badge variant={postTypes[form.type].variant} className="mb-3">
              {postTypes[form.type].label}
            </Badge>
          )}
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-heading text-3xl tracking-tight outline-none"
          >
            {step.heading}
          </h2>
          <p className="mt-1 text-muted-foreground">{step.description}</p>
        </div>

        <step.Component
          form={form}
          update={update}
          errors={errors}
          municipalities={municipalities}
          onEdit={goToStep}
        />

        <div className="sticky bottom-0 z-10 -mx-5 -mb-5 flex items-center justify-between gap-3 rounded-b-2xl border-t border-border/50 bg-card/95 px-5 py-4 backdrop-blur-sm sm:-mx-8 sm:-mb-8 sm:px-8 sm:py-5">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() =>
              current > 0 ? goTo(current - 1) : navigate("/my-posts")
            }
          >
            <ArrowLeft />
            Voltar
          </Button>
          <span className="hidden text-[0.8125rem] text-muted-foreground sm:block">
            Etapa {current + 1} de {visibleSteps.length}
          </span>
          <Button type="submit" size="md" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner />
                {editing ? "Salvando" : "Publicando"}
              </>
            ) : isLast ? (
              <>
                {editing ? <Check /> : <Send />}
                {editing ? "Salvar alterações" : "Publicar anúncio"}
              </>
            ) : (
              <>
                Continuar
                <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

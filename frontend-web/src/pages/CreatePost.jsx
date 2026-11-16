import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import { toDateInputValue } from "@/lib/date";
import { healthQuestions } from "@/lib/posts";
import DetailsStep from "@/components/create-post/DetailsStep";
import HealthStep from "@/components/create-post/HealthStep";
import PetStep from "@/components/create-post/PetStep";
import PhotosStep from "@/components/create-post/PhotosStep";
import ReviewStep from "@/components/create-post/ReviewStep";
import StepIndicator from "@/components/create-post/StepIndicator";
import TypeStep from "@/components/create-post/TypeStep";
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
      "animal.distinctive_features",
    ],
    serverFields: ["animal.breed", "animal.approximate_birth_date"],
  },
  {
    id: "health",
    title: "Saúde",
    skipFor: "found",
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
    serverFields: ["images"],
  },
  {
    id: "details",
    title: "Anúncio",
    heading: "Onde e o que dizer no anúncio",
    description: "Onde ele está e o que as pessoas precisam saber.",
    Component: DetailsStep,
    required: ["municipality_id", "occurred_at", "title", "description"],
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

const initialForm = {
  type: "",
  "animal.name": "",
  "animal.species": "",
  "animal.breed": "",
  "animal.color": "",
  "animal.sex": "",
  "animal.size": "",
  "animal.distinctive_features": "",
  "animal.vaccinated": "",
  "animal.dewormed": "",
  "animal.neutered": "",
  age_amount: "",
  age_unit: "years",
  municipality_id: "",
  occurred_at: "",
  title: "",
  description: "",
  images: [],
};

const healthValues = { yes: "1", no: "0", unknown: "" };

function isEmpty(value) {
  return String(value ?? "").trim() === "";
}

/**
 * Campos obrigatórios vazios da etapa. A data do ocorrido só vale para perdido
 * e encontrado, o nome só para perdido e a idade é opcional para encontrado.
 */
function missingFields(step, form) {
  const notApplicable = {
    occurred_at: form.type === "adoption",
    "animal.name": form.type !== "lost",
    age_amount: form.type === "found",
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
 * Quem encontrou um animal na rua não sabe a saúde dele, então essa etapa some.
 */
function stepsFor(type) {
  return steps.filter((step) => step.skipFor !== type);
}

function stepOfField(field, visibleSteps) {
  const index = visibleSteps.findIndex((step) =>
    [...step.required, ...(step.serverFields ?? [])].some(
      (stepField) => field === stepField || field.startsWith(`${stepField}.`),
    ),
  );
  return index === -1 ? 0 : index;
}

function birthDateFromAge(amount, unit) {
  const months = unit === "years" ? Number(amount) * 12 : Number(amount);
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return toDateInputValue(date);
}

/**
 * Monta o multipart no formato do StorePostRequest: animal[campo] e images[].
 */
function toFormData(form) {
  const data = new FormData();
  data.append("type", form.type);
  data.append("title", form.title.trim());
  data.append("description", form.description.trim());
  data.append("municipality_id", form.municipality_id);
  if (form.type !== "adoption") data.append("occurred_at", form.occurred_at);

  Object.entries(form)
    .filter(([field]) => field.startsWith("animal."))
    .forEach(([field, value]) => {
      const name = `animal[${field.slice("animal.".length)}]`;
      const isHealthField = healthQuestions.some(
        (question) => question.field === field,
      );
      const healthValue = form.type === "found" ? "" : healthValues[value];
      data.append(name, isHealthField ? healthValue : value.trim());
    });
  data.append(
    "animal[approximate_birth_date]",
    isEmpty(form.age_amount)
      ? ""
      : birthDateFromAge(form.age_amount, form.age_unit),
  );
  form.images.forEach((image) => data.append("images[]", image.file));

  return data;
}

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [municipalities, setMunicipalities] = useState([]);
  const headingRef = useRef(null);
  const hasNavigated = useRef(false);
  const latestImages = useRef([]);

  const visibleSteps = stepsFor(form.type);
  const step = visibleSteps[current];
  const isLast = current === visibleSteps.length - 1;

  useEffect(() => {
    api
      .get("/api/municipalities")
      .then(({ data }) => setMunicipalities(data))
      .catch(() =>
        toast.error(
          "Não foi possível carregar as cidades. Recarregue a página.",
        ),
      );
  }, []);

  useEffect(() => {
    if (hasNavigated.current) headingRef.current?.focus();
  }, [current]);

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
    setErrors((previous) => {
      const next = { ...previous };
      delete next[field];
      return next;
    });
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
      await api.post("/api/my-posts", toFormData(form));
      toast.success(
        "Anúncio enviado! Ele aparece para todos após a moderação.",
      );
      navigate("/my-posts");
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (!serverErrors) {
        toast.error("Não foi possível publicar. Tente novamente.");
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
      <StepIndicator steps={visibleSteps} current={current} onSelect={goTo} />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-8 rounded-2xl bg-card p-5 shadow-xs sm:p-8"
      >
        <div>
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

        <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-6">
          {current > 0 ? (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => goTo(current - 1)}
            >
              <ArrowLeft />
              Voltar
            </Button>
          ) : (
            <span />
          )}
          <span className="hidden text-[0.8125rem] text-muted-foreground sm:block">
            Etapa {current + 1} de {visibleSteps.length}
          </span>
          <Button type="submit" size="md" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner />
                Publicando
              </>
            ) : isLast ? (
              <>
                <Send />
                Publicar anúncio
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

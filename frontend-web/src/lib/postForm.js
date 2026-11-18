import { toDateInputValue } from "@/lib/date";
import { healthQuestions } from "@/lib/posts";

export const emptyPostForm = {
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
  location_reference: "",
  with_finder: "",
  title: "",
  description: "",
  images: [],
};

const healthValues = { yes: "1", no: "0", unknown: "" };
const healthAnswerOf = { true: "yes", false: "no", null: "unknown" };

export function isEmpty(value) {
  return String(value ?? "").trim() === "";
}

function birthDateFromAge(amount, unit) {
  const months = unit === "years" ? Number(amount) * 12 : Number(amount);
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return toDateInputValue(date);
}

/**
 * Converte a data de nascimento salva de volta em número + unidade:
 * meses até 3 anos (se não for ano cheio), anos daí para cima.
 */
export function ageFromBirthDate(birthDate) {
  if (!birthDate) return { age_amount: "", age_unit: "years" };
  const born = new Date(`${birthDate}T00:00`);
  const today = new Date();
  const months =
    (today.getFullYear() - born.getFullYear()) * 12 +
    today.getMonth() -
    born.getMonth() -
    (today.getDate() < born.getDate() ? 1 : 0);

  if (months < 36 && months % 12 !== 0) {
    return { age_amount: String(months), age_unit: "months" };
  }
  return { age_amount: String(Math.round(months / 12)), age_unit: "years" };
}

const ageUnitLabels = {
  years: ["ano", "anos"],
  months: ["mês", "meses"],
};

export function formatAge(amount, unit) {
  if (String(amount).trim() === "") return null;
  const [singular, plural] = ageUnitLabels[unit];
  const value = Number(amount);
  if (value === 0) return `Menos de 1 ${singular}`;
  return `${value} ${value === 1 ? singular : plural}`;
}

/**
 * Preenche o formulário do cadastro com um post vindo da API (PostResource).
 */
export function formFromPost(post) {
  const { animal } = post;
  const health = Object.fromEntries(
    healthQuestions.map(({ field }) => {
      const value = animal[field.slice("animal.".length)];
      return [field, post.type === "adoption" ? healthAnswerOf[value] : ""];
    }),
  );

  return {
    ...emptyPostForm,
    ...health,
    ...ageFromBirthDate(animal.birth_date),
    type: post.type,
    "animal.name": animal.name ?? "",
    "animal.species": animal.species,
    "animal.breed": animal.breed ?? "",
    "animal.color": animal.color,
    "animal.sex": animal.sex,
    "animal.size": animal.size,
    "animal.distinctive_features": animal.distinctive_features ?? "",
    birth_date: animal.birth_date ?? "",
    municipality_id: post.municipality.ibge_code,
    occurred_at: post.occurred_at ?? "",
    location_reference: post.location_reference ?? "",
    with_finder:
      post.with_finder === null ? "" : post.with_finder ? "yes" : "no",
    title: post.title,
    description: post.description,
    images: post.photos.map((photo) => ({ id: photo.id, url: photo.url })),
  };
}

function birthDateOf(form, initial) {
  const ageUnchanged =
    initial &&
    form.age_amount === initial.age_amount &&
    form.age_unit === initial.age_unit;
  if (ageUnchanged) return initial.birth_date;
  return isEmpty(form.age_amount)
    ? ""
    : birthDateFromAge(form.age_amount, form.age_unit);
}

/**
 * Monta o multipart do StorePostRequest (animal[campo] e images[]). Com
 * `initial` (edição), vira o PATCH: sem o tipo, com as fotos removidas e a
 * ordem final das fotos ("id:" para as que ficam, "new:" para as novas).
 */
export function postFormData(form, initial = null) {
  const data = new FormData();
  if (!initial) data.append("type", form.type);
  data.append("title", form.title.trim());
  data.append("description", form.description.trim());
  data.append("municipality_id", form.municipality_id);
  if (form.type !== "adoption") {
    data.append("occurred_at", form.occurred_at);
    data.append("location_reference", form.location_reference.trim());
  }
  if (form.type === "found") {
    data.append("with_finder", form.with_finder === "yes" ? "1" : "0");
  }

  Object.entries(form)
    .filter(([field]) => field.startsWith("animal."))
    .forEach(([field, value]) => {
      const name = `animal[${field.slice("animal.".length)}]`;
      const isHealthField = healthQuestions.some(
        (question) => question.field === field,
      );
      const healthValue = form.type === "adoption" ? healthValues[value] : "";
      data.append(name, isHealthField ? healthValue : value.trim());
    });
  data.append("animal[approximate_birth_date]", birthDateOf(form, initial));

  const newImages = form.images.filter((image) => image.file);
  newImages.forEach((image) => data.append("images[]", image.file));

  if (initial) {
    data.append("_method", "PATCH");
    const keptIds = form.images.map((image) => image.id).filter(Boolean);
    initial.images
      .filter((image) => !keptIds.includes(image.id))
      .forEach((image) => data.append("delete_photo_ids[]", image.id));
    form.images.forEach((image) =>
      data.append(
        "photo_order[]",
        image.file ? `new:${newImages.indexOf(image)}` : `id:${image.id}`,
      ),
    );
  }

  return data;
}

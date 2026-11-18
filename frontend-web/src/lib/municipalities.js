import api from "@/api/axios";

let request;

// A lista de cidades não muda durante o uso: baixa uma vez e todas as telas reaproveitam.
// Se falhar, a próxima chamada tenta de novo.
export function fetchMunicipalities() {
  request ??= api
    .get("/api/municipalities")
    .then(({ data }) => data)
    .catch((error) => {
      request = undefined;
      throw error;
    });
  return request;
}

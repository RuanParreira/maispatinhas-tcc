/**
 * Data no formato AAAA-MM-DD usando o fuso local (toISOString usaria UTC
 * e, à noite, cairia no dia seguinte).
 */
export function toDateInputValue(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

const DAY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function toDayString(input: string | Date): string {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) throw new Error("Invalid date input");
    return input.toISOString().slice(0, 10);
  }

  const raw = input.trim();
  if (!raw) throw new Error("Invalid date input");

  if (DAY_REGEX.test(raw)) {
    const normalized = new Date(`${raw}T00:00:00.000Z`).toISOString().slice(0, 10);
    if (normalized !== raw) {
      throw new Error("Invalid day format");
    }
    return raw;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) throw new Error("Invalid date input");

  return parsed.toISOString().slice(0, 10);
}

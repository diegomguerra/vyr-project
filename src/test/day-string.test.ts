import { describe, expect, it } from "vitest";
import { toDayString } from "../lib/day-string";

describe("toDayString", () => {
  it("returns YYYY-MM-DD when input is already a day string", () => {
    expect(toDayString("2026-02-17")).toBe("2026-02-17");
  });

  it("normalizes ISO datetime strings to YYYY-MM-DD", () => {
    expect(toDayString("2026-02-17T18:45:00-03:00")).toBe("2026-02-17");
  });

  it("normalizes Date objects to YYYY-MM-DD", () => {
    expect(toDayString(new Date("2026-02-17T10:00:00.000Z"))).toBe("2026-02-17");
  });

  it("throws for invalid day strings", () => {
    expect(() => toDayString("2026-02-31")).toThrowError("Invalid day format");
  });

  it("throws for non-date inputs", () => {
    expect(() => toDayString("not-a-date")).toThrowError("Invalid date input");
  });
});

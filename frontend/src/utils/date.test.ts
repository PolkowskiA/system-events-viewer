import { describe, expect, it } from "vitest";
import { toDateOnly } from "./date";

describe("toDateOnly", () => {
  it("returns undefined for empty value", () => {
    expect(toDateOnly("")).toBeUndefined();
  });

  it("returns undefined for invalid date", () => {
    expect(toDateOnly("not-a-date")).toBeUndefined();
  });

  it("returns the same value for valid date", () => {
    expect(toDateOnly("2026-02-08")).toBe("2026-02-08");
  });
});

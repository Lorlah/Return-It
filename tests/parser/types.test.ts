import { describe, it, expect } from "vitest";
import { EMPTY_DETECTED_RETURN } from "@/lib/parser/types";

describe("EMPTY_DETECTED_RETURN", () => {
  it("has null extraction fields and zero confidence", () => {
    expect(EMPTY_DETECTED_RETURN.retailer).toBeNull();
    expect(EMPTY_DETECTED_RETURN.deadline).toBeNull();
    expect(EMPTY_DETECTED_RETURN.confidence).toBe(0);
  });

  it("defaults labelType to none and flags for review", () => {
    expect(EMPTY_DETECTED_RETURN.labelType).toBe("none");
    expect(EMPTY_DETECTED_RETURN.needsReview).toBe(true);
  });
});

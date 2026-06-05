import { describe, it, expect } from "vitest";
import {
  validatePageNumber,
  calculateOffset,
  calculateTotalPages,
} from "@/lib/pagination-utils";

// ─── validatePageNumber ───────────────────────────────────────────────────────

describe("validatePageNumber", () => {
  // Requirements: 4.1, 4.3
  it("returns 1 when page parameter is undefined", () => {
    expect(validatePageNumber(undefined, 10)).toBe(1);
  });

  // Requirement: 4.3
  it("returns 1 when page parameter is a non-numeric string", () => {
    expect(validatePageNumber("abc", 10)).toBe(1);
  });

  it("returns 1 when page parameter is an empty string", () => {
    expect(validatePageNumber("", 10)).toBe(1);
  });

  // Requirement: 4.1 – page < 1
  it("returns 1 when page number is negative", () => {
    expect(validatePageNumber("-5", 10)).toBe(1);
  });

  it("returns 1 when page number is zero", () => {
    expect(validatePageNumber("0", 10)).toBe(1);
  });

  // Requirement: 4.2 – page > totalPages
  it("returns totalPages when page exceeds total pages", () => {
    expect(validatePageNumber("999", 13)).toBe(13);
  });

  // Requirement: 1.7 – within range
  it("returns the parsed page number when within valid range", () => {
    expect(validatePageNumber("5", 10)).toBe(5);
  });

  it("returns 1 when page equals 1 (first valid page)", () => {
    expect(validatePageNumber("1", 10)).toBe(1);
  });

  it("returns totalPages when page equals totalPages (last valid page)", () => {
    expect(validatePageNumber("10", 10)).toBe(10);
  });

  // Requirement: 4.3 – decimals treated as truncated integer
  it("handles decimal page numbers by truncating via parseInt", () => {
    expect(validatePageNumber("3.7", 10)).toBe(3);
  });

  // Edge case: totalPages = 0 (no content yet)
  it("returns 1 when totalPages is 0 and page is any positive number", () => {
    // totalPages = 0 means parsed > totalPages is false (0 > 0 is false),
    // so the clamping guard doesn't fire and parsed value is returned.
    // The validate function defers empty-state handling to the caller.
    expect(validatePageNumber("1", 0)).toBe(1);
  });
});

// ─── calculateOffset ─────────────────────────────────────────────────────────

describe("calculateOffset", () => {
  // Requirement: 1.2

  it("returns 0 for page 1 (first page starts at index 0)", () => {
    expect(calculateOffset(1, 12)).toBe(0);
  });

  it("returns 12 for page 2 with page size 12", () => {
    expect(calculateOffset(2, 12)).toBe(12);
  });

  it("returns 108 for page 10 with page size 12", () => {
    expect(calculateOffset(10, 12)).toBe(108);
  });

  it("returns 0 for page 1 with any page size", () => {
    expect(calculateOffset(1, 25)).toBe(0);
  });

  it("returns correct offset for page 3 with page size 10", () => {
    expect(calculateOffset(3, 10)).toBe(20);
  });
});

// ─── calculateTotalPages ─────────────────────────────────────────────────────

describe("calculateTotalPages", () => {
  // Requirement: 2.2

  it("returns 1 when total count is 0 (empty dataset)", () => {
    expect(calculateTotalPages(0, 12)).toBe(1);
  });

  it("returns 1 when total count is less than page size", () => {
    expect(calculateTotalPages(5, 12)).toBe(1);
  });

  it("returns 1 when total count exactly equals page size", () => {
    expect(calculateTotalPages(12, 12)).toBe(1);
  });

  it("returns 2 when total count is an exact multiple of page size (24 / 12)", () => {
    expect(calculateTotalPages(24, 12)).toBe(2);
  });

  it("returns 3 when total count is not an exact multiple (25 / 12 → ceil = 3)", () => {
    expect(calculateTotalPages(25, 12)).toBe(3);
  });

  it("returns correct pages for 156 items with page size 12 (ceil(156/12) = 13)", () => {
    expect(calculateTotalPages(156, 12)).toBe(13);
  });

  it("returns correct pages for 1 item with page size 12", () => {
    expect(calculateTotalPages(1, 12)).toBe(1);
  });
});

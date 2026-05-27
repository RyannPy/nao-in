// Feature: admin-crud-supabase, Property 5: draft articles never returned by public layer

/**
 * Property 5: Draft Articles Are Never Returned by Public Data Layer
 *
 * For any article with published = false, calling getArticleBySlug with that
 * article's slug should return null.
 *
 * Validates: Requirements 2.7, 12.1
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";

// ─── Mock the server Supabase client ─────────────────────────────────────────
// vi.hoisted() runs before vi.mock() factories, so variables declared here
// are available inside the factory.

const { mockSingle, mockEqPublished, mockEqSlug, mockSelect, mockFrom, mockCreateClient } =
  vi.hoisted(() => {
    const mockSingle = vi.fn();
    const mockEqPublished = vi.fn(() => ({ single: mockSingle }));
    const mockEqSlug = vi.fn(() => ({ eq: mockEqPublished }));
    const mockSelect = vi.fn(() => ({ eq: mockEqSlug }));
    const mockFrom = vi.fn(() => ({ select: mockSelect }));
    const mockCreateClient = vi.fn(() => Promise.resolve({ from: mockFrom }));
    return { mockSingle, mockEqPublished, mockEqSlug, mockSelect, mockFrom, mockCreateClient };
  });

vi.mock("@/lib/supabase/server", () => ({
  createClient: mockCreateClient,
}));

// Import AFTER mocking
import { getArticleBySlug } from "./articles";

// ─── Arbitraries ──────────────────────────────────────────────────────────────

/** Generates a valid URL-safe slug string */
const slugArb = fc
  .stringMatching(/^[a-z][a-z0-9-]{0,49}$/)
  .filter((s) => s.length >= 1);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Property 5: Draft Articles Are Never Returned by Public Data Layer", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Re-wire the mock chain after clearAllMocks resets all implementations
    mockEqPublished.mockReturnValue({ single: mockSingle });
    mockEqSlug.mockReturnValue({ eq: mockEqPublished });
    mockSelect.mockReturnValue({ eq: mockEqSlug });
    mockFrom.mockReturnValue({ select: mockSelect });
    mockCreateClient.mockResolvedValue({ from: mockFrom });
  });

  it(
    "returns null for any slug when Supabase returns no data (published filter excludes draft)",
    async () => {
      await fc.assert(
        fc.asyncProperty(slugArb, async (slug) => {
          // Simulate Supabase .single() returning PGRST116 (no rows matched),
          // which is what happens when the published=true filter excludes the draft.
          mockSingle.mockResolvedValue({
            data: null,
            error: {
              code: "PGRST116",
              message: "JSON object requested, multiple (or no) rows returned",
            },
          });

          const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

          const result = await getArticleBySlug(slug);

          consoleSpy.mockRestore();

          // Draft articles must never be returned — result must be null
          expect(result).toBeNull();
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    "returns null when Supabase returns data: null with no error (empty result set)",
    async () => {
      await fc.assert(
        fc.asyncProperty(slugArb, async (slug) => {
          mockSingle.mockResolvedValue({ data: null, error: null });

          const result = await getArticleBySlug(slug);

          expect(result).toBeNull();
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    "verifies the published filter is applied — eq('published', true) must be called for every slug",
    async () => {
      await fc.assert(
        fc.asyncProperty(slugArb, async (slug) => {
          mockSingle.mockResolvedValue({ data: null, error: null });

          await getArticleBySlug(slug);

          // The query chain must include .eq("published", true)
          expect(mockEqPublished).toHaveBeenCalledWith("published", true);
        }),
        { numRuns: 50 }
      );
    }
  );
});

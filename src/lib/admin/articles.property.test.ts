// Feature: admin-crud-supabase, Property 1: admin CRUD round-trip
// Feature: admin-crud-supabase, Property 2: stats counts match actual data

/**
 * Property 1: Admin CRUD Round-Trip
 *
 * For any valid CreateArticleInput, adminCreateArticle should return an article
 * whose fields match the input. adminUpdateArticle should return an article
 * reflecting the updated fields.
 *
 * Validates: Requirements 3.5, 3.6
 *
 * Property 2: Stats Counts Match Actual Data
 *
 * For any set of articles with known published/draft counts, adminGetStats
 * should return published + drafts === total, and each count should match
 * the actual count of articles with that status.
 *
 * Validates: Requirements 3.8, 11.1, 11.2, 11.3, 11.4
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";

// ─── Mock the server Supabase client ─────────────────────────────────────────
// vi.hoisted() runs before vi.mock() factories so variables are available
// inside the factory closure.

const {
  mockSingle,
  mockSelectAfterMutation,
  mockEqDelete,
  mockEqUpdate,
  mockUpdate,
  mockInsert,
  mockSelectQuery,
  mockOrder,
  mockEqSlug,
  mockSelectAll,
  mockFrom,
  mockCreateClient,
} = vi.hoisted(() => {
  // Shared terminal mock for .single() calls
  const mockSingle = vi.fn();

  // Chain for SELECT queries (adminGetAllArticles / adminGetStats)
  const mockOrder = vi.fn(() => ({ data: [], error: null }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockSelectAll = vi.fn<any>(() => ({ order: mockOrder }));

  // Chain for SELECT after insert/update: .select("*").single()
  const mockSelectAfterMutation = vi.fn(() => ({ single: mockSingle }));

  // Chain for DELETE: .from().delete().eq()
  const mockEqDelete = vi.fn(() => ({ data: null, error: null }));

  // Chain for UPDATE: .from().update().eq().select().single()
  const mockEqUpdate = vi.fn(() => ({ select: mockSelectAfterMutation }));
  const mockUpdate = vi.fn(() => ({ eq: mockEqUpdate }));

  // Chain for INSERT: .from().insert().select().single()
  const mockInsert = vi.fn(() => ({ select: mockSelectAfterMutation }));

  // Chain for plain SELECT (adminGetStats uses select("published, updated_at"))
  const mockSelectQuery = vi.fn(() => ({ data: [], error: null }));

  // .eq() for adminGetArticleBySlug: .from().select().eq().single()
  const mockEqSlug = vi.fn(() => ({ single: mockSingle }));

  // from() dispatcher — returns different chains based on the operation
  const mockFrom = vi.fn(() => ({
    select: mockSelectAll,
    insert: mockInsert,
    update: mockUpdate,
    delete: vi.fn(() => ({ eq: mockEqDelete })),
  }));

  const mockCreateClient = vi.fn(() =>
    Promise.resolve({ from: mockFrom })
  );

  return {
    mockSingle,
    mockSelectAfterMutation,
    mockEqDelete,
    mockEqUpdate,
    mockUpdate,
    mockInsert,
    mockSelectQuery,
    mockOrder,
    mockEqSlug,
    mockSelectAll,
    mockFrom,
    mockCreateClient,
  };
});

vi.mock("@/lib/supabase/server", () => ({
  createClient: mockCreateClient,
}));

// Import AFTER mocking
import {
  adminCreateArticle,
  adminUpdateArticle,
  adminGetStats,
} from "./articles";
import type { CreateArticleInput } from "./articles";

// ─── Arbitraries ──────────────────────────────────────────────────────────────

/** Non-empty string with reasonable length */
const nonEmptyStr = fc.string({ minLength: 1, maxLength: 100 });

/** URL-safe slug */
const slugArb = fc
  .stringMatching(/^[a-z][a-z0-9-]{0,49}$/)
  .filter((s) => s.length >= 1);

/** Valid category values */
const categoryArb = fc.constantFrom(
  "games",
  "science",
  "story",
  "coding",
  "study"
);

/** Generates a valid CreateArticleInput */
const createInputArb: fc.Arbitrary<CreateArticleInput> = fc.record({
  slug: slugArb,
  title: nonEmptyStr,
  category: categoryArb,
  excerpt: nonEmptyStr,
  content: nonEmptyStr,
  image_src: fc.option(fc.webUrl(), { nil: null }),
  published: fc.boolean(),
});

/** Generates a partial update input (at least one field) */
const updateInputArb = fc.record({
  title: fc.option(nonEmptyStr, { nil: undefined }),
  excerpt: fc.option(nonEmptyStr, { nil: undefined }),
  content: fc.option(nonEmptyStr, { nil: undefined }),
  published: fc.option(fc.boolean(), { nil: undefined }),
});

/** ISO date string arbitrary (2020–2030 range) */
const isoDateArb = fc
  .integer({ min: new Date("2020-01-01").getTime(), max: new Date("2030-01-01").getTime() })
  .map((ms) => new Date(ms).toISOString());

/** Generates an array of articles with random published values */
const articleArrayArb = fc.array(
  fc.record({
    id: fc.integer({ min: 1, max: 9999 }),
    slug: slugArb,
    title: nonEmptyStr,
    category: categoryArb,
    excerpt: fc.option(nonEmptyStr, { nil: null }),
    content: fc.option(nonEmptyStr, { nil: null }),
    image_src: fc.option(fc.webUrl(), { nil: null }),
    published: fc.boolean(),
    created_at: isoDateArb,
    updated_at: isoDateArb,
  }),
  { minLength: 0, maxLength: 50 }
);

// ─── Helper: build a full ArticleAdmin record from input ─────────────────────

function buildArticleFromInput(
  input: CreateArticleInput,
  id = 1
) {
  return {
    id,
    slug: input.slug,
    title: input.title,
    category: input.category,
    excerpt: input.excerpt,
    content: input.content,
    image_src: input.image_src,
    published: input.published,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ─── Property 1: Admin CRUD Round-Trip ───────────────────────────────────────

describe("Property 1: Admin CRUD Round-Trip", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Re-wire chains after clearAllMocks
    mockSelectAfterMutation.mockReturnValue({ single: mockSingle });
    mockInsert.mockReturnValue({ select: mockSelectAfterMutation });
    mockEqUpdate.mockReturnValue({ select: mockSelectAfterMutation });
    mockUpdate.mockReturnValue({ eq: mockEqUpdate });
    mockFrom.mockReturnValue({
      select: mockSelectAll,
      insert: mockInsert,
      update: mockUpdate,
      delete: vi.fn(() => ({ eq: mockEqDelete })),
    });
    mockCreateClient.mockResolvedValue({ from: mockFrom });
  });

  it(
    "adminCreateArticle returns an article whose fields match the input",
    async () => {
      await fc.assert(
        fc.asyncProperty(createInputArb, async (input) => {
          const expectedArticle = buildArticleFromInput(input);

          // Mock: insert().select().single() returns the created article
          mockSingle.mockResolvedValue({
            data: expectedArticle,
            error: null,
          });

          const result = await adminCreateArticle(input);

          // All input fields must be reflected in the returned article
          expect(result.slug).toBe(input.slug);
          expect(result.title).toBe(input.title);
          expect(result.category).toBe(input.category);
          expect(result.excerpt).toBe(input.excerpt);
          expect(result.content).toBe(input.content);
          expect(result.image_src).toBe(input.image_src);
          expect(result.published).toBe(input.published);
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    "adminUpdateArticle returns an article reflecting the updated fields",
    async () => {
      await fc.assert(
        fc.asyncProperty(
          slugArb,
          createInputArb,
          updateInputArb,
          async (slug, originalInput, updateInput) => {
            // Build the "updated" article by merging original + update
            const originalArticle = buildArticleFromInput(originalInput);
            const updatedArticle = {
              ...originalArticle,
              slug, // use the slug passed to adminUpdateArticle
              ...(updateInput.title !== undefined && { title: updateInput.title }),
              ...(updateInput.excerpt !== undefined && { excerpt: updateInput.excerpt }),
              ...(updateInput.content !== undefined && { content: updateInput.content }),
              ...(updateInput.published !== undefined && { published: updateInput.published }),
              updated_at: new Date().toISOString(),
            };

            // Mock: update().eq().select().single() returns the updated article
            mockSingle.mockResolvedValue({
              data: updatedArticle,
              error: null,
            });

            const result = await adminUpdateArticle(slug, updateInput);

            // Updated fields must be reflected in the returned article
            if (updateInput.title !== undefined) {
              expect(result.title).toBe(updateInput.title);
            }
            if (updateInput.excerpt !== undefined) {
              expect(result.excerpt).toBe(updateInput.excerpt);
            }
            if (updateInput.content !== undefined) {
              expect(result.content).toBe(updateInput.content);
            }
            if (updateInput.published !== undefined) {
              expect(result.published).toBe(updateInput.published);
            }
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it(
    "adminCreateArticle throws when Supabase returns an error",
    async () => {
      await fc.assert(
        fc.asyncProperty(createInputArb, async (input) => {
          const dbError = { message: "DB error", code: "23505" };

          mockSingle.mockResolvedValue({ data: null, error: dbError });

          await expect(adminCreateArticle(input)).rejects.toMatchObject(
            dbError
          );
        }),
        { numRuns: 50 }
      );
    }
  );
});

// ─── Property 2: Stats Counts Match Actual Data ───────────────────────────────

describe("Property 2: Stats Counts Match Actual Data", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCreateClient.mockResolvedValue({ from: mockFrom });
  });

  it(
    "published + drafts === total for any array of articles",
    async () => {
      await fc.assert(
        fc.asyncProperty(articleArrayArb, async (articles) => {
          // Mock: select("published, updated_at") returns the articles array
          mockFrom.mockReturnValue({
            select: vi.fn(() => ({
              data: articles.map((a) => ({
                published: a.published,
                updated_at: a.updated_at,
              })),
              error: null,
            })),
            insert: mockInsert,
            update: mockUpdate,
            delete: vi.fn(() => ({ eq: mockEqDelete })),
          });

          const stats = await adminGetStats();

          // Core invariant: published + drafts must equal total
          expect(stats.published + stats.drafts).toBe(stats.total);
          expect(stats.total).toBe(articles.length);
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    "published count matches actual count of published articles",
    async () => {
      await fc.assert(
        fc.asyncProperty(articleArrayArb, async (articles) => {
          const expectedPublished = articles.filter((a) => a.published === true).length;

          mockFrom.mockReturnValue({
            select: vi.fn(() => ({
              data: articles.map((a) => ({
                published: a.published,
                updated_at: a.updated_at,
              })),
              error: null,
            })),
            insert: mockInsert,
            update: mockUpdate,
            delete: vi.fn(() => ({ eq: mockEqDelete })),
          });

          const stats = await adminGetStats();

          expect(stats.published).toBe(expectedPublished);
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    "drafts count matches actual count of draft articles",
    async () => {
      await fc.assert(
        fc.asyncProperty(articleArrayArb, async (articles) => {
          const expectedDrafts = articles.filter((a) => a.published === false).length;

          mockFrom.mockReturnValue({
            select: vi.fn(() => ({
              data: articles.map((a) => ({
                published: a.published,
                updated_at: a.updated_at,
              })),
              error: null,
            })),
            insert: mockInsert,
            update: mockUpdate,
            delete: vi.fn(() => ({ eq: mockEqDelete })),
          });

          const stats = await adminGetStats();

          expect(stats.drafts).toBe(expectedDrafts);
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    "lastUpdated is null when there are no articles",
    async () => {
      mockFrom.mockReturnValue({
        select: vi.fn(() => ({ data: [], error: null })),
        insert: mockInsert,
        update: mockUpdate,
        delete: vi.fn(() => ({ eq: mockEqDelete })),
      });

      const stats = await adminGetStats();

      expect(stats.lastUpdated).toBeNull();
      expect(stats.total).toBe(0);
      expect(stats.published).toBe(0);
      expect(stats.drafts).toBe(0);
    }
  );

  it(
    "lastUpdated is the most recent updated_at across all articles",
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              published: fc.boolean(),
              updated_at: isoDateArb,
            }),
            { minLength: 1, maxLength: 20 }
          ),
          async (articles) => {
            mockFrom.mockReturnValue({
              select: vi.fn(() => ({ data: articles, error: null })),
              insert: mockInsert,
              update: mockUpdate,
              delete: vi.fn(() => ({ eq: mockEqDelete })),
            });

            const stats = await adminGetStats();

            const expectedLastUpdated = articles.reduce((latest, a) =>
              a.updated_at > latest.updated_at ? a : latest
            ).updated_at;

            expect(stats.lastUpdated).toBe(expectedLastUpdated);
          }
        ),
        { numRuns: 100 }
      );
    }
  );
});

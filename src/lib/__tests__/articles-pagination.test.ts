/**
 * Unit tests for data layer pagination functions.
 * Requirements: 1.1, 1.2, 1.5, 1.8, 1.9, 2.1, 2.3, 2.5, 2.6
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getArticlesPreviewPaginated,
  getArticlesByCategoryPaginated,
} from "@/lib/articles";

// ─── Mock Supabase client ─────────────────────────────────────────────────────

// We mock @/lib/supabase/client since articles.ts imports createClient from there.
// The mock creates a chainable builder that terminates at .range() and returns
// the values configured via mockSupabaseResponse().

let mockData: unknown[] | null = null;
let mockError: unknown = null;
let mockCount: number | null = null;

/** Configure what the mocked Supabase query returns on the next call. */
function mockSupabaseResponse(
  data: unknown[] | null,
  error: unknown,
  count: number | null
) {
  mockData = data;
  mockError = error;
  mockCount = count;
}

// Build a chainable mock; every intermediate method returns `this` so
// the fluent call chain resolves correctly.
function buildChainableMock() {
  const terminal = {
    // .range() is the terminal method in both paginated queries
    range: vi.fn().mockImplementation(() =>
      Promise.resolve({ data: mockData, error: mockError, count: mockCount })
    ),
    // .limit() is used by non-paginated queries – not tested here but mocked
    // so the module doesn't throw
    limit: vi.fn().mockImplementation(() =>
      Promise.resolve({ data: mockData, error: mockError })
    ),
    // .maybeSingle() used by getArticleBySlug
    maybeSingle: vi.fn().mockImplementation(() =>
      Promise.resolve({ data: mockData?.[0] ?? null, error: mockError })
    ),
  };

  const builder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    ...terminal,
  };

  return builder;
}

let chainableMock: ReturnType<typeof buildChainableMock>;

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => chainableMock),
  })),
}));

// ─── Test data helpers ────────────────────────────────────────────────────────

/** Create a minimal raw article row as Supabase would return it. */
function makeRawArticle(id: number, overrides: Record<string, unknown> = {}) {
  // Use a fixed valid date; only the id changes between articles
  return {
    id,
    slug: `article-${id}`,
    title: `Article ${id}`,
    category: "coding",
    image_src: null,
    created_at: "2024-01-15T00:00:00.000Z",
    ...overrides,
  };
}

/** Generate an array of n raw articles. */
function makeRawArticles(n: number, startId = 1) {
  return Array.from({ length: n }, (_, i) => makeRawArticle(startId + i));
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  chainableMock = buildChainableMock();
  mockData = null;
  mockError = null;
  mockCount = null;
});

// ─── getArticlesPreviewPaginated ──────────────────────────────────────────────

describe("getArticlesPreviewPaginated", () => {
  // Requirement: 1.1, 1.2
  it("returns correct data for page 1 (offset 0)", async () => {
    const rawArticles = makeRawArticles(12);
    mockSupabaseResponse(rawArticles, null, 36);

    const result = await getArticlesPreviewPaginated(1, 12);

    expect(result.data).toHaveLength(12);
    expect(result.totalCount).toBe(36);

    // Verify .range() was called with offset=0 for page 1
    expect(chainableMock.range).toHaveBeenCalledWith(0, 11);
  });

  // Requirement: 1.2
  it("returns correct data for page 2 (offset 12)", async () => {
    const rawArticles = makeRawArticles(12, 13);
    mockSupabaseResponse(rawArticles, null, 36);

    const result = await getArticlesPreviewPaginated(2, 12);

    expect(result.data).toHaveLength(12);
    expect(result.totalCount).toBe(36);

    // Verify .range() was called with offset=12 for page 2
    expect(chainableMock.range).toHaveBeenCalledWith(12, 23);
  });

  // Requirement: 1.5
  it("returns empty array and totalCount 0 when page exceeds total records", async () => {
    mockSupabaseResponse([], null, 0);

    const result = await getArticlesPreviewPaginated(999, 12);

    expect(result.data).toHaveLength(0);
    expect(result.totalCount).toBe(0);

    // Verify .range() was called with the correct (very high) offset
    // offset = (999 - 1) * 12 = 11976; end = 11976 + 12 - 1 = 11987
    expect(chainableMock.range).toHaveBeenCalledWith(11976, 11987);
  });

  // Requirement: 1.8, 1.9
  it("returns { data: [], totalCount: 0 } when Supabase returns an error", async () => {
    mockSupabaseResponse(null, { message: "Database connection failed" }, null);

    const result = await getArticlesPreviewPaginated(1, 12);

    expect(result.data).toEqual([]);
    expect(result.totalCount).toBe(0);
  });

  // Requirement: 2.1, 2.3
  it("computes tag field as ART-NNN padded to 3 digits", async () => {
    mockSupabaseResponse([makeRawArticle(1), makeRawArticle(42)], null, 2);

    const result = await getArticlesPreviewPaginated(1, 12);

    expect(result.data[0].tag).toBe("ART-001");
    expect(result.data[1].tag).toBe("ART-042");
  });

  // Requirement: 2.5, 2.6
  it("computes date field as formatted string", async () => {
    const raw = makeRawArticle(1, { created_at: "2024-01-15T00:00:00.000Z" });
    mockSupabaseResponse([raw], null, 1);

    const result = await getArticlesPreviewPaginated(1, 12);

    // Formatted by Intl.DateTimeFormat("en-GB") → "15 Jan 2024"
    expect(result.data[0].date).toBe("15 Jan 2024");
  });
  // Requirement: 1.1
  it("queries only published articles (.eq published true)", async () => {
    mockSupabaseResponse([], null, 0);

    await getArticlesPreviewPaginated(1, 12);

    expect(chainableMock.eq).toHaveBeenCalledWith("published", true);
  });

  // Requirement: 2.1
  it("orders articles by created_at descending", async () => {
    mockSupabaseResponse([], null, 0);

    await getArticlesPreviewPaginated(1, 12);

    expect(chainableMock.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
  });

  it("handles null data gracefully (returns empty array)", async () => {
    mockSupabaseResponse(null, null, 0);

    const result = await getArticlesPreviewPaginated(1, 12);

    expect(result.data).toEqual([]);
    expect(result.totalCount).toBe(0);
  });

  it("handles null count gracefully (totalCount defaults to 0)", async () => {
    mockSupabaseResponse([], null, null);

    const result = await getArticlesPreviewPaginated(1, 12);

    expect(result.totalCount).toBe(0);
  });

  it("uses custom pageSize when provided", async () => {
    mockSupabaseResponse(makeRawArticles(5), null, 5);

    await getArticlesPreviewPaginated(1, 5);

    // Page 1 with pageSize 5 → range(0, 4)
    expect(chainableMock.range).toHaveBeenCalledWith(0, 4);
  });
});

// ─── getArticlesByCategoryPaginated ──────────────────────────────────────────

describe("getArticlesByCategoryPaginated", () => {
  // Requirement: 1.1, 2.3
  it("returns articles filtered by the given category", async () => {
    const rawArticles = makeRawArticles(5);
    mockSupabaseResponse(rawArticles, null, 5);

    const result = await getArticlesByCategoryPaginated("coding", 1, 12);

    expect(result.data).toHaveLength(5);
    expect(result.totalCount).toBe(5);

    // Verify category filter was applied
    expect(chainableMock.eq).toHaveBeenCalledWith("category", "coding");
  });

  // Requirement: 1.5
  it("returns empty array when category has no articles", async () => {
    mockSupabaseResponse([], null, 0);

    const result = await getArticlesByCategoryPaginated("nonexistent", 1, 12);

    expect(result.data).toEqual([]);
    expect(result.totalCount).toBe(0);
  });

  // Requirement: 1.8, 1.9
  it("returns { data: [], totalCount: 0 } when Supabase returns an error", async () => {
    mockSupabaseResponse(null, { message: "Query timeout" }, null);

    const result = await getArticlesByCategoryPaginated("games", 1, 12);

    expect(result.data).toEqual([]);
    expect(result.totalCount).toBe(0);
  });

  // Requirement: 1.2
  it("calculates correct offset for page 1 (offset 0)", async () => {
    mockSupabaseResponse(makeRawArticles(12), null, 30);

    await getArticlesByCategoryPaginated("science", 1, 12);

    expect(chainableMock.range).toHaveBeenCalledWith(0, 11);
  });

  // Requirement: 1.2
  it("calculates correct offset for page 2 (offset 12)", async () => {
    mockSupabaseResponse(makeRawArticles(12), null, 30);

    await getArticlesByCategoryPaginated("science", 2, 12);

    expect(chainableMock.range).toHaveBeenCalledWith(12, 23);
  });

  // Requirement: 2.1, 2.3
  it("returns correct totalCount matching category results", async () => {
    mockSupabaseResponse(makeRawArticles(3), null, 3);

    const result = await getArticlesByCategoryPaginated("story", 1, 12);

    expect(result.totalCount).toBe(3);
  });

  // Requirement: 2.5, 2.6
  it("computes tag and date fields for category articles", async () => {
    const raw = makeRawArticle(7, {
      category: "games",
      created_at: "2024-06-10T00:00:00.000Z",
    });
    mockSupabaseResponse([raw], null, 1);

    const result = await getArticlesByCategoryPaginated("games", 1, 12);

    expect(result.data[0].tag).toBe("ART-007");
    expect(result.data[0].date).toBe("10 Jun 2024");
  });

  // Requirement: 1.1
  it("filters only published articles even with category filter", async () => {
    mockSupabaseResponse([], null, 0);

    await getArticlesByCategoryPaginated("coding", 1, 12);

    expect(chainableMock.eq).toHaveBeenCalledWith("published", true);
    expect(chainableMock.eq).toHaveBeenCalledWith("category", "coding");
  });

  it("handles different valid categories correctly", async () => {
    const categories = ["games", "science", "story", "coding", "study"];

    for (const category of categories) {
      chainableMock = buildChainableMock();
      mockSupabaseResponse(makeRawArticles(2), null, 2);

      const result = await getArticlesByCategoryPaginated(category, 1, 12);

      expect(result.data).toHaveLength(2);
      expect(chainableMock.eq).toHaveBeenCalledWith("category", category);
    }
  });
});

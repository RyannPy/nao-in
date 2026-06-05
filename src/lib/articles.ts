// lib/articles.ts
// Public data layer for TERMA//LOG blog.
// All queries are filtered to published = true — draft articles are never returned.
// Uses the server Supabase client (src/lib/supabase/server.ts).

import { createClient } from "./supabase/client";
import type { ArticlePreview, ArticleFull } from "@/types/article";
import type { PaginatedResult } from "@/lib/pagination-utils";

// ─── Category map ─────────────────────────────────────────────────────────────

export interface CategoryMeta {
  slug: string;
  label: string;
  id: string;
}

export const CATEGORY_MAP: Record<string, CategoryMeta> = {
  games: { slug: "games", label: "GAMES", id: "CAT-01" },
  science: { slug: "science", label: "SCIENCE", id: "CAT-02" },
  story: { slug: "story", label: "STORY", id: "CAT-03" },
  coding: { slug: "coding", label: "CODING", id: "CAT-04" },
  study: { slug: "study", label: "STUDY", id: "CAT-05" },
};

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORY_MAP[slug];
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

// ─── Public queries (published = true only) ───────────────────────────────────

// GET ALL ARTICLES — returns all published articles ordered by created_at desc
export async function getAllArticles(): Promise<ArticlePreview[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, category, image_src, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

// GET FEATURED ARTICLE — most recently created published article
export async function getArticlesFeatured(): Promise<
  (ArticlePreview & { tag: string; date: string; excerpt: string | null }) | null
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, category, excerpt, image_src, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(1);

  console.log("ARTICLES DATA:", data);

  if (error) {
    console.error(error);
    console.log("ERROR:", error);
    return null;
  }

  return data?.[0]
    ? {
        ...data[0],
        tag: `ART-${String(data[0].id).padStart(3, "0")}`,
        date: formatDate(data[0].created_at),
      }
    : null;
}

// GET RELATED ARTICLES — published articles in same category, excluding current
export async function getRelatedArticles(
  category: string,
  currentId: number,
): Promise<(ArticlePreview & { date: string })[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, category, image_src, created_at")
    .eq("published", true)
    .eq("category", category)
    .neq("id", currentId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error(error);
    return [];
  }

  return (
    data?.map((article) => ({
      ...article,
      date: formatDate(article.created_at),
    })) ?? []
  );
}

// GET RECENT ARTICLES — 4 most recently created published articles
export async function getArticlesRecent(): Promise<
  (ArticlePreview & { tag: string; date: string })[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, category, image_src, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error(error);
    return [];
  }

  return (
    data?.map((article) => ({
      ...article,
      tag: `ART-${String(article.id).padStart(3, "0")}`,
      date: formatDate(article.created_at),
    })) ?? []
  );
}

// GET PREVIEW ARTICLES — all published articles with tag and date
export async function getArticlesPreview(): Promise<
  (ArticlePreview & { tag: string; date: string })[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, category, image_src, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (
    data?.map((article) => ({
      ...article,
      tag: `ART-${String(article.id).padStart(3, "0")}`,
      date: formatDate(article.created_at),
    })) ?? []
  );
}

// GET ARTICLE BY SLUG — returns null for drafts and non-existent slugs
export async function getArticleBySlug(
  slug: string,
): Promise<(ArticleFull & { tag: string; date: string }) | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  if (!data) return null;

  return {
    ...data,
    tag: `ART-${String(data.id).padStart(3, "0")}`,
    date: formatDate(data.created_at),
  };
}

// GET ARTICLES BY CATEGORY — published articles in a category
export async function getArticlesByCategory(
  category: string,
): Promise<(ArticlePreview & { tag: string; date: string })[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, category, image_src, created_at")
    .eq("published", true)
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (
    data?.map((article) => ({
      ...article,
      tag: `ART-${String(article.id).padStart(3, "0")}`,
      date: formatDate(article.created_at),
    })) ?? []
  );
}

// GET COUNT ARTICLES — count of published articles only
export async function getCountArticles(): Promise<number> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("id")
    .eq("published", true);

  if (error) {
    console.error(error);
    return 0;
  }

  return data?.length ?? 0;
}

// GET ARTICLES PREVIEW PAGINATED — server-side paginated published articles
// Requirements: 1.1, 1.2, 1.3, 1.5, 1.8, 1.9, 1.10, 2.1, 2.2, 2.3, 2.5, 2.6
export async function getArticlesPreviewPaginated(
  page: number,
  pageSize: number = 12,
): Promise<PaginatedResult<ArticlePreview & { tag: string; date: string }>> {
  const supabase = await createClient();
  const offset = (page - 1) * pageSize;

  const { data, error, count } = await supabase
    .from("articles")
    .select("id, slug, title, category, image_src, created_at", {
      count: "exact",
    })
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    console.error("Failed to fetch paginated articles:", error);
    return { data: [], totalCount: 0 };
  }

  return {
    data:
      data?.map((article) => ({
        ...article,
        tag: `ART-${String(article.id).padStart(3, "0")}`,
        date: formatDate(article.created_at),
      })) ?? [],
    totalCount: count ?? 0,
  };
}

// GET ARTICLES BY CATEGORY PAGINATED — server-side paginated articles filtered by category
// Requirements: 1.1, 1.2, 1.3, 1.5, 1.8, 1.9, 1.10, 2.1, 2.2, 2.3, 2.5, 2.6, 7.2, 7.3
export async function getArticlesByCategoryPaginated(
  category: string,
  page: number,
  pageSize: number = 12,
): Promise<PaginatedResult<ArticlePreview & { tag: string; date: string }>> {
  const supabase = await createClient();
  const offset = (page - 1) * pageSize;

  const { data, error, count } = await supabase
    .from("articles")
    .select("id, slug, title, category, image_src, created_at", {
      count: "exact",
    })
    .eq("published", true)
    .eq("category", category)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    console.error("Failed to fetch paginated articles by category:", error);
    return { data: [], totalCount: 0 };
  }

  return {
    data:
      data?.map((article) => ({
        ...article,
        tag: `ART-${String(article.id).padStart(3, "0")}`,
        date: formatDate(article.created_at),
      })) ?? [],
    totalCount: count ?? 0,
  };
}

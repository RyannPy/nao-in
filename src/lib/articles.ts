// lib/articles.ts
// Centralized dummy database for TERMA//LOG blog.
// Replace with real DB queries (Prisma, Drizzle, etc.) in production.

// ─── Interface ────────────────────────────────────────────────────────────────

export interface Article {
  id: string;
  slug: string;
  category: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  imageSrc?: string;
}

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

// ─── Helper functions ─────────────────────────────────────────────────────────

// DATE FORMAT
function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

// GET ALL ARTICLES
import { createClient } from "./supabase/client";
const supabase = createClient();



export async function getAllArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("SUPABASE ERROR:", JSON.stringify(error, null, 2));
    return [];
  }

  return data;
}

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORY_MAP[slug];
}

// GET FEATURED ARTICLE
export async function getArticlesFeatured() {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      id,
      slug,
      title,
      category,
      excerpt,
      created_at
    `,
    )
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);
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

// GET RELATED ARTICLES (for article detail page)
export async function getRelatedArticles(
  category: string,
  currentId: string
) {
  const { data, error } = await supabase
    .from("articles")
    .select(`
      id,
      slug,
      title,
      category,
      created_at
    `)
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

// GET RECENT ARTICLE (for index page)
export async function getArticlesRecent() {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      id,
      slug,
      title,
      category,
      image_src,
      created_at
    `,
    )
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

// GET PREVIEW ARTICLE (for article list)
export async function getArticlesPreview() {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      id,
      slug,
      title,
      category,
      image_src,
      created_at
    `,
    )
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

// GET ARTICLE BY SLUG
export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return {
    ...data,
    tag: `ART-${String(data.id).padStart(3, "0")}`,
    date: formatDate(data.created_at),
  };
}

// GET ARTICLES BY CATEGORY
export async function getArticlesByCategory(category: string) {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      id,
      slug,
      title,
      category,
      image_src,
      created_at
    `,
    )
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

// STATISTICS
// get count articles
export async function getCountArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*");

  if (error) {
    console.error(error);
    return 0;
  }

  return data?.length ?? 0;
}
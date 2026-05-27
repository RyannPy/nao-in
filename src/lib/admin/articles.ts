// lib/admin/articles.ts
// Admin data layer for TERMA//LOG blog.
// All queries use the server Supabase client — no published filter.
// Throws on error so admin pages can handle and display failures.

import { createClient } from "@/lib/supabase/server";
import type { ArticleAdmin } from "@/types/article";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface ArticleStats {
  total: number;
  published: number;
  drafts: number;
  lastUpdated: string | null;
}

export interface CreateArticleInput {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_src: string | null;
  published: boolean;
}

export type UpdateArticleInput = Partial<CreateArticleInput>;

// ─── Admin queries (no published filter) ─────────────────────────────────────

// GET ALL ARTICLES — returns all articles regardless of published status
export async function adminGetAllArticles(): Promise<ArticleAdmin[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

// GET ARTICLE BY SLUG — returns full article or null if not found
export async function adminGetArticleBySlug(
  slug: string,
): Promise<ArticleAdmin | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    // PGRST116 = no rows found — not a real error, just return null
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data ?? null;
}

// CREATE ARTICLE — inserts a new row and returns the created record
export async function adminCreateArticle(
  data: CreateArticleInput,
): Promise<ArticleAdmin> {
  const supabase = await createClient();

  const { data: created, error } = await supabase
    .from("articles")
    .insert(data)
    .select("*")
    .single();

  if (error) throw error;
  if (!created) throw new Error("Insert succeeded but returned no data");

  return created;
}

// UPDATE ARTICLE — updates a row by slug and returns the updated record
export async function adminUpdateArticle(
  slug: string,
  data: UpdateArticleInput,
): Promise<ArticleAdmin> {
  const supabase = await createClient();

  const { data: updated, error } = await supabase
    .from("articles")
    .update(data)
    .eq("slug", slug)
    .select("*")
    .single();

  if (error) throw error;
  if (!updated) throw new Error("Update succeeded but returned no data");

  return updated;
}

// DELETE ARTICLE — deletes a row by slug
export async function adminDeleteArticle(slug: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("slug", slug);

  if (error) throw error;
}

// GET STATS — returns aggregate counts and most recent updated_at
export async function adminGetStats(): Promise<ArticleStats> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("published, updated_at");

  if (error) throw error;

  const rows = data ?? [];
  const total = rows.length;
  const published = rows.filter((r) => r.published === true).length;
  const drafts = rows.filter((r) => r.published === false).length;

  // Find the most recently updated article
  const lastUpdated =
    rows.length > 0
      ? rows.reduce((latest, r) =>
          r.updated_at > latest.updated_at ? r : latest,
        ).updated_at
      : null;

  return { total, published, drafts, lastUpdated };
}

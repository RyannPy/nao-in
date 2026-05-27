// app/(admin)/admin/articles/actions.ts
// Server Actions for admin article CRUD operations.
// These wrap the admin data layer so client components can call them.

"use server";

import {
  adminCreateArticle,
  adminUpdateArticle,
  adminDeleteArticle,
  type CreateArticleInput,
  type UpdateArticleInput,
} from "@/lib/admin/articles";
import type { ArticleAdmin } from "@/types/article";

// CREATE ARTICLE
export async function createArticleAction(
  data: CreateArticleInput,
): Promise<ArticleAdmin> {
  return adminCreateArticle(data);
}

// UPDATE ARTICLE
export async function updateArticleAction(
  slug: string,
  data: UpdateArticleInput,
): Promise<ArticleAdmin> {
  return adminUpdateArticle(slug, data);
}

// DELETE ARTICLE
export async function deleteArticleAction(slug: string): Promise<void> {
  return adminDeleteArticle(slug);
}

// app/(admin)/admin/articles/new/actions.ts
// Server Actions for the admin create article page.
// Must be a separate file with "use server" so it can be called from a client component.

"use server";

import {
  adminCreateArticle,
  type CreateArticleInput,
} from "@/lib/admin/articles";
import type { ArticleAdmin } from "@/types/article";

export async function createArticleAction(
  data: CreateArticleInput,
): Promise<ArticleAdmin> {
  return adminCreateArticle(data);
}

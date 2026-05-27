/**
 * Base type matching the Supabase `articles` table exactly.
 * No `featured` field — the database schema does not have one.
 */
export interface Article {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  content: string | null;
  image_src: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Fields needed for article cards on public pages
 * (list page, homepage, category pages).
 */
export type ArticlePreview = Pick<
  Article,
  'id' | 'slug' | 'title' | 'category' | 'image_src' | 'created_at'
>;

/**
 * All fields needed for the article detail page.
 */
export type ArticleFull = Article;

/**
 * All fields needed for admin list and edit pages,
 * including `published` status.
 */
export type ArticleAdmin = Article;

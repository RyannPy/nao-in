# Design Document: Admin CRUD — Supabase Integration

## Overview

This document describes the technical design for wiring the Nao-in admin UI to Supabase. The work is a production integration — not a redesign. All existing UI components, visual styles, and page layouts are preserved. The changes are:

1. Create a global `Article` type hierarchy in `src/types/article.ts`
2. Rewrite the public data layer (`src/lib/articles.ts`) to use the server Supabase client and filter all queries to `published = true`
3. Build the admin data layer (`src/lib/admin/articles.ts`) with full CRUD and stats
4. Build the storage module (`src/lib/admin/storage.ts`) for Supabase Storage image uploads
5. Create the `ImageUpload` client component to replace the URL-only `ImageSection`
6. Remove the `featured` field from `ArticleFormShared.tsx` and all admin pages
7. Wire the admin create, edit, list, and dashboard pages to real Supabase data

---

## Architecture

The application follows Next.js App Router conventions with a clear separation between server and client code.

```
┌─────────────────────────────────────────────────────────────┐
│                        Public Pages                          │
│  (Server Components — use Server_Client via Public_Data_Layer)│
└──────────────────────────┬──────────────────────────────────┘
                           │ calls
┌──────────────────────────▼──────────────────────────────────┐
│              src/lib/articles.ts (Public Data Layer)         │
│  getAllArticles · getArticleBySlug · getArticlesRecent · etc  │
│  ALL queries: .eq("published", true)                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ uses
┌──────────────────────────▼──────────────────────────────────┐
│           src/lib/supabase/server.ts (Server_Client)         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       Admin Pages                            │
│  (Client Components — call Server Actions or API routes)     │
└──────────────────────────┬──────────────────────────────────┘
                           │ calls
┌──────────────────────────▼──────────────────────────────────┐
│         src/lib/admin/articles.ts (Admin Data Layer)         │
│  adminGetAllArticles · adminCreateArticle · adminUpdateArticle│
│  adminDeleteArticle · adminGetStats · adminGetArticleBySlug  │
│  NO published filter — returns all articles                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ uses
┌──────────────────────────▼──────────────────────────────────┐
│           src/lib/supabase/server.ts (Server_Client)         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         src/components/admin/ImageUpload.tsx                 │
│  (Client Component — calls Storage_Module directly)          │
└──────────────────────────┬──────────────────────────────────┘
                           │ calls
┌──────────────────────────▼──────────────────────────────────┐
│         src/lib/admin/storage.ts (Storage_Module)            │
│  uploadArticleImage(file, slug) → public URL                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ uses
┌──────────────────────────▼──────────────────────────────────┐
│           src/lib/supabase/client.ts (Browser_Client)        │
│  (Storage uploads happen client-side from the browser)       │
└─────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

- **Server Client for all data fetching**: All Supabase database queries go through the server client (`src/lib/supabase/server.ts`) to avoid exposing query logic to the browser and to support server-side rendering.
- **Browser Client only for storage uploads**: The `ImageUpload` component is a client component that uploads files directly from the browser to Supabase Storage. This is the correct pattern for file uploads — the browser streams the file directly to storage without routing through the Next.js server.
- **No direct Supabase queries in page components**: All database access goes through the lib functions. Pages import from `src/lib/articles.ts` or `src/lib/admin/articles.ts`.
- **Admin pages as Client Components**: The admin create, edit, and list pages are `"use client"` components because they manage complex form state. They call the admin data layer functions via Server Actions (using `"use server"` inline functions or a separate actions file).

---

## Components and Interfaces

### `src/types/article.ts`

```typescript
// Base type matching the Supabase articles table exactly
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

// For article cards on public pages (list, homepage, category pages)
export type ArticlePreview = Pick<Article, 'id' | 'slug' | 'title' | 'category' | 'image_src' | 'created_at'>;

// For the article detail page — all fields needed for rendering
export type ArticleFull = Article;

// For admin pages — all fields including published status
export type ArticleAdmin = Article;
```

### `src/lib/articles.ts` (Public Data Layer)

All functions use `await createClient()` from `src/lib/supabase/server.ts`. Every query adds `.eq("published", true)`.

```typescript
// Helper: formats a date string to "DD Mon YYYY"
function formatDate(date: string): string

// Returns all published articles ordered by created_at desc
export async function getAllArticles(): Promise<ArticlePreview[]>

// Returns the most recently created published article with tag and date
export async function getArticlesFeatured(): Promise<(ArticlePreview & { tag: string; date: string; excerpt: string | null }) | null>

// Returns published articles in same category, excluding currentId, limit 3
export async function getRelatedArticles(category: string, currentId: number): Promise<(ArticlePreview & { date: string })[]>

// Returns 4 most recent published articles with tag and date
export async function getArticlesRecent(): Promise<(ArticlePreview & { tag: string; date: string })[]>

// Returns all published articles with tag and date
export async function getArticlesPreview(): Promise<(ArticlePreview & { tag: string; date: string })[]>

// Returns full article if published, null if draft or not found
export async function getArticleBySlug(slug: string): Promise<(ArticleFull & { tag: string; date: string }) | null>

// Returns published articles in a category ordered by created_at desc
export async function getArticlesByCategory(category: string): Promise<(ArticlePreview & { tag: string; date: string })[]>

// Returns count of published articles only
export async function getCountArticles(): Promise<number>

// Returns CategoryMeta for a given slug (unchanged)
export function getCategoryMeta(slug: string): CategoryMeta | undefined
```

### `src/lib/admin/articles.ts` (Admin Data Layer)

All functions use `await createClient()` from `src/lib/supabase/server.ts`. No `published` filter.

```typescript
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

// Returns all articles regardless of published status
export async function adminGetAllArticles(): Promise<ArticleAdmin[]>

// Returns a single article by slug, or null if not found
export async function adminGetArticleBySlug(slug: string): Promise<ArticleAdmin | null>

// Inserts a new article, returns the created record
export async function adminCreateArticle(data: CreateArticleInput): Promise<ArticleAdmin>

// Updates an article by slug, returns the updated record
export async function adminUpdateArticle(slug: string, data: UpdateArticleInput): Promise<ArticleAdmin>

// Deletes an article by slug
export async function adminDeleteArticle(slug: string): Promise<void>

// Returns aggregate stats for the dashboard
export async function adminGetStats(): Promise<ArticleStats>
```

### `src/lib/admin/storage.ts` (Storage Module)

Uses the Browser_Client because uploads happen client-side.

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

// Maps MIME type to file extension
function getExtFromMime(mime: string): string

// Uploads a file to the articles bucket, returns the public URL
export async function uploadArticleImage(file: File, slug: string): Promise<string>
```

### `src/components/admin/ImageUpload.tsx`

```typescript
type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImageUrl?: string;
  slug: string;
}

export default function ImageUpload({ onUpload, currentImageUrl, slug }: ImageUploadProps)
```

Internal state:
- `uploadState: UploadState` — controls which UI panel is shown
- `previewUrl: string | null` — the URL to show in the preview (either `currentImageUrl` or the newly uploaded URL)
- `errorMessage: string | null` — error text shown in error state
- `isDragOver: boolean` — controls drag-over visual feedback

### `src/components/admin/ArticleFormShared.tsx` (Updated)

Changes from current version:
- Remove `featured: boolean` from `ArticleFormData`
- Remove `featured: false` from `EMPTY_FORM`
- Remove `featured` and `setFeatured` props from `PublishSettingsSection` — the entire "Featured" row is deleted
- Remove `featured` prop from `FormSubmitBar` — the `+ FEATURED` status text is deleted
- `ImageSection` is kept as an export for backward compatibility but is no longer used in the form pages

---

## Data Models

### Supabase `articles` Table

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `BIGINT` | Primary key, auto-increment |
| `slug` | `TEXT` | UNIQUE, NOT NULL |
| `title` | `TEXT` | NOT NULL |
| `category` | `TEXT` | NOT NULL |
| `excerpt` | `TEXT` | Nullable |
| `content` | `TEXT` | Nullable |
| `image_src` | `TEXT` | Nullable |
| `published` | `BOOLEAN` | DEFAULT false |
| `created_at` | `TIMESTAMPTZ` | DEFAULT now() |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT now() |

Note: No `featured` column exists or is used.

### Supabase Storage: `articles` Bucket

- Bucket name: `articles`
- Access: Public (files are accessible via public URL without authentication)
- File naming: `{slug}-{Date.now()}.{ext}` — timestamp suffix prevents cache collisions on re-upload

### `ArticleFormData` (Updated — in `ArticleFormShared.tsx`)

```typescript
export interface ArticleFormData {
  title: string;
  slug: string;
  category: Category | "";
  excerpt: string;
  content: string;
  imageSrc: string;        // set via ImageUpload.onUpload callback
  publishStatus: PublishStatus;
  // featured: boolean — REMOVED
}

export const EMPTY_FORM: ArticleFormData = {
  title: "",
  slug: "",
  category: "",
  excerpt: "",
  content: "",
  imageSrc: "",
  publishStatus: "draft",
  // featured: false — REMOVED
};
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

This feature involves data transformation logic (CRUD operations, validation, filtering) that is well-suited to property-based testing. The property-based testing library used is **fast-check** (TypeScript/JavaScript).

### Property 1: Admin CRUD Round-Trip

*For any* valid article creation input, calling `adminCreateArticle` followed by `adminGetArticleBySlug` with the same slug should return an article whose fields match the input data.

**Validates: Requirements 3.5, 3.6**

### Property 2: Stats Counts Match Actual Data

*For any* set of articles with a known number of published and draft articles, `adminGetStats` should return `published` and `drafts` counts that sum to `total`, and each individual count should equal the actual count of articles with that status.

**Validates: Requirements 3.8, 11.1, 11.2, 11.3, 11.4**

### Property 3: Invalid MIME Type Rejection

*For any* string that is not in the set `{'image/jpeg', 'image/png', 'image/webp', 'image/gif'}`, calling `uploadArticleImage` with a File of that MIME type should throw an error with the message `"Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."`.

**Validates: Requirements 4.4**

### Property 4: File Size Limit Enforcement

*For any* file size greater than 5,242,880 bytes (5MB) with a valid MIME type, calling `uploadArticleImage` should throw an error with the message `"File too large. Maximum size is 5MB."`.

**Validates: Requirements 4.5**

### Property 5: Draft Articles Are Never Returned by Public Data Layer

*For any* article with `published = false`, calling `getArticleBySlug` with that article's slug should return `null`.

**Validates: Requirements 2.7, 12.1**

---

## Error Handling

### Public Data Layer

- All functions catch Supabase errors, log them with `console.error`, and return a safe fallback (`null` for single-item functions, `[]` for list functions, `0` for count functions).
- This prevents public pages from crashing due to database errors.

### Admin Data Layer

- All functions throw errors on Supabase failure. The calling page component is responsible for catching and displaying the error.
- This gives admin pages full control over error display and recovery.

### Storage Module

- Validation errors (wrong MIME type, file too large) are thrown synchronously before any network call.
- Supabase Storage upload errors are thrown as-is for the `ImageUpload` component to catch and display.

### ImageUpload Component

- Wraps the `uploadArticleImage` call in a try/catch.
- On error: sets `uploadState = 'error'` and `errorMessage` to the caught error message.
- Provides a "RETRY" button that resets state to `'idle'`.

### Admin Pages

- Create and edit pages maintain an `error: string | null` state.
- On submission failure: set `error` to the error message and display it above the submit bar.
- On success: call `router.push('/admin/articles')`.

---

## Testing Strategy

### Unit Tests

Unit tests cover pure logic that does not require a database connection:

- `src/lib/admin/storage.ts` — validation logic (MIME type check, file size check) using mocked `File` objects
- `src/types/article.ts` — TypeScript compilation verifies type correctness at build time
- `src/components/admin/ImageUpload.tsx` — component rendering in each state (idle, uploading, success, error) using mocked `uploadArticleImage`

### Property-Based Tests

Property-based tests use **fast-check** to verify universal properties across many generated inputs:

- **Property 1** (CRUD round-trip): Generate random `CreateArticleInput` objects, call `adminCreateArticle` with a mocked Supabase client, verify the returned article matches the input. Run 100 iterations.
- **Property 2** (Stats accuracy): Generate random arrays of articles with mixed `published` values, call `adminGetStats` with a mocked client, verify counts are correct. Run 100 iterations.
- **Property 3** (Invalid MIME rejection): Generate random strings that are not in the allowed MIME type set, verify `uploadArticleImage` throws. Run 100 iterations.
- **Property 4** (File size rejection): Generate random file sizes above 5MB, verify `uploadArticleImage` throws. Run 100 iterations.
- **Property 5** (Draft protection): Generate random article slugs with `published = false`, verify `getArticleBySlug` returns `null` with a mocked Supabase client. Run 100 iterations.

### Integration Tests

Integration tests verify end-to-end behavior with a real or test Supabase instance:

- Public data layer: seed articles with mixed published/draft status, verify each function returns only published articles
- Admin data layer: full CRUD cycle — create, read, update, delete
- Storage: upload a real image file, verify the public URL is returned and accessible

### Test Configuration

Each property test must be tagged with a comment referencing the design property:
```
// Feature: admin-crud-supabase, Property N: [property text]
```

Minimum 100 iterations per property test.

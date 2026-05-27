# Implementation Plan: Admin CRUD — Supabase Integration

## Overview

Wire the existing Nao-in admin UI to Supabase. All tasks are incremental — each step builds on the previous. The implementation order is: types → public data layer → admin data layer → storage module → ImageUpload component → ArticleFormShared cleanup → admin pages → public page draft protection.

No UI redesign. All existing visual styles are preserved.

## Tasks

- [x] 1. Create global Article type definitions
  - Create `src/types/article.ts` with the `Article` base interface matching the Supabase `articles` table: `id` (number), `slug`, `title`, `category`, `excerpt` (string | null), `content` (string | null), `image_src` (string | null), `published` (boolean), `created_at`, `updated_at`
  - Export `ArticlePreview` as `Pick<Article, 'id' | 'slug' | 'title' | 'category' | 'image_src' | 'created_at'>`
  - Export `ArticleFull` as `Article`
  - Export `ArticleAdmin` as `Article`
  - Do NOT include a `featured` field in any type
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Rewrite public data layer with published filter and server client
  - Rewrite `src/lib/articles.ts` to import `createClient` from `src/lib/supabase/server.ts` (not the browser client)
  - Add `.eq("published", true)` to every query: `getAllArticles`, `getArticlesFeatured`, `getRelatedArticles`, `getArticlesRecent`, `getArticlesPreview`, `getArticleBySlug`, `getArticlesByCategory`, `getCountArticles`
  - `getArticleBySlug` must add `.eq("published", true)` so it returns `null` for draft articles
  - Keep the `formatDate` helper and `CATEGORY_MAP` / `getCategoryMeta` unchanged
  - Keep all existing return shapes (with `tag` and `date` derived fields) so public page components need no changes
  - On Supabase error: log with `console.error` and return `null` or `[]` depending on function return type
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

  - [x] 2.1 Write property test for draft protection (Property 5)
    - **Property 5: Draft Articles Are Never Returned by Public Data Layer**
    - Mock the Supabase server client to return an article with `published = false`
    - Verify `getArticleBySlug` returns `null` for any such article
    - Use fast-check to generate random slugs and article data with `published = false`
    - Tag: `// Feature: admin-crud-supabase, Property 5: draft articles never returned by public layer`
    - **Validates: Requirements 2.7, 12.1**

- [x] 3. Build admin data layer with full CRUD and stats
  - Create `src/lib/admin/articles.ts` using `createClient` from `src/lib/supabase/server.ts`
  - Export `ArticleStats` interface: `{ total: number; published: number; drafts: number; lastUpdated: string | null }`
  - Export `CreateArticleInput` interface: `{ slug, title, category, excerpt, content, image_src, published }`
  - Export `UpdateArticleInput` as `Partial<CreateArticleInput>`
  - Implement `adminGetAllArticles()`: select all, order by `created_at` desc, no published filter
  - Implement `adminGetArticleBySlug(slug)`: select single by slug, return `null` if not found
  - Implement `adminCreateArticle(data)`: insert row, return created record; throw on error
  - Implement `adminUpdateArticle(slug, data)`: update row by slug, return updated record; throw on error
  - Implement `adminDeleteArticle(slug)`: delete row by slug; throw on error
  - Implement `adminGetStats()`: use `select('published')` to get all published values, compute total/published/drafts counts and find the most recent `updated_at`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

  - [x] 3.1 Write property test for CRUD round-trip (Property 1)
    - **Property 1: Admin CRUD Round-Trip**
    - Mock the Supabase server client
    - Use fast-check to generate random `CreateArticleInput` objects
    - Verify that `adminCreateArticle` returns an article whose fields match the input
    - Verify that `adminUpdateArticle` returns an article reflecting the updated fields
    - Tag: `// Feature: admin-crud-supabase, Property 1: admin CRUD round-trip`
    - **Validates: Requirements 3.5, 3.6**

  - [x] 3.2 Write property test for stats accuracy (Property 2)
    - **Property 2: Stats Counts Match Actual Data**
    - Mock the Supabase server client to return a generated array of articles
    - Use fast-check to generate arrays of articles with random `published` values
    - Verify `adminGetStats` returns `published + drafts === total` and each count matches the actual count
    - Tag: `// Feature: admin-crud-supabase, Property 2: stats counts match actual data`
    - **Validates: Requirements 3.8, 11.1, 11.2, 11.3, 11.4**

- [x] 4. Checkpoint — Verify data layers
  - Ensure all tests pass, ask the user if questions arise.
  - Manually verify: import `adminGetAllArticles` in a test page and confirm it returns real Supabase data

- [x] 5. Build Supabase Storage module
  - Create `src/lib/admin/storage.ts`
  - Import `createClient` from `src/lib/supabase/client.ts` (browser client — uploads are client-side)
  - Define `ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']` and `MAX_SIZE_BYTES = 5 * 1024 * 1024`
  - Implement `getExtFromMime(mime: string): string` mapping MIME types to extensions (`jpeg` → `jpg`, `png` → `png`, `webp` → `webp`, `gif` → `gif`)
  - Implement `uploadArticleImage(file: File, slug: string): Promise<string>`:
    - Validate MIME type: if not in `ALLOWED_TYPES`, throw `"Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."`
    - Validate file size: if `file.size > MAX_SIZE_BYTES`, throw `"File too large. Maximum size is 5MB."`
    - Generate filename: `${slug}-${Date.now()}.${getExtFromMime(file.type)}`
    - Upload to `articles` bucket using `supabase.storage.from('articles').upload(filename, file, { upsert: true })`
    - Return public URL via `supabase.storage.from('articles').getPublicUrl(filename).data.publicUrl`
    - Throw on Supabase upload error
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 5.1 Write property test for invalid MIME type rejection (Property 3)
    - **Property 3: Invalid MIME Type Rejection**
    - Use fast-check to generate arbitrary strings that are not in the allowed MIME type set
    - Verify `uploadArticleImage` throws with the exact message `"Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."`
    - Mock the Supabase client so no real network calls are made
    - Tag: `// Feature: admin-crud-supabase, Property 3: invalid MIME type rejection`
    - **Validates: Requirements 4.4**

  - [x] 5.2 Write property test for file size limit enforcement (Property 4)
    - **Property 4: File Size Limit Enforcement**
    - Use fast-check to generate file sizes greater than 5,242,880 bytes with a valid MIME type
    - Verify `uploadArticleImage` throws with the exact message `"File too large. Maximum size is 5MB."`
    - Also verify that files at exactly 5MB or below with valid MIME type do NOT throw for size reasons
    - Tag: `// Feature: admin-crud-supabase, Property 4: file size limit enforcement`
    - **Validates: Requirements 4.5**

- [x] 6. Build ImageUpload component
  - Create `src/components/admin/ImageUpload.tsx` as a `"use client"` component
  - Props: `onUpload: (url: string) => void`, `currentImageUrl?: string`, `slug: string`
  - Internal state: `uploadState: 'idle' | 'uploading' | 'success' | 'error'`, `previewUrl: string | null`, `errorMessage: string | null`, `isDragOver: boolean`
  - On mount: if `currentImageUrl` is provided, set `uploadState = 'success'` and `previewUrl = currentImageUrl`
  - Idle state UI: dark header bar (`bg-[#1a1a1a]`) with label "IMAGE MODULE — UPLOAD MODE", drop zone with terminal prompt `"> DROP IMAGE FILE HERE OR CLICK TO BROWSE"`, hidden `<input type="file" accept="image/*">`, drag-over border changes to yellow (`border-[#e8c830]`)
  - Uploading state UI: progress indicator with "UPLOADING..." text, disabled interaction
  - Success state UI: image preview with `<img>` tag, public URL displayed in mono text, "CHANGE IMAGE" button to reset to idle
  - Error state UI: error message in red-tinted panel, "RETRY" button to reset to idle
  - File handling: on file select or drop, call `uploadArticleImage(file, slug)` from `src/lib/admin/storage.ts`, on success call `onUpload(url)` and set success state, on error set error state
  - Match industrial/terminal style: `bg-[#1a1a1a]` header, `bg-[#c4c4c4]` body, `#e8c830` accent, mono font, corner ticks pattern
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10_

  - [x] 6.1 Write unit tests for ImageUpload component states
    - Test idle state renders drop zone with correct prompt text
    - Test success state renders image preview when `currentImageUrl` is provided
    - Test error state renders error message and retry button when upload fails
    - Mock `uploadArticleImage` to control upload outcomes
    - _Requirements: 5.3, 5.7, 5.8, 5.10_

- [x] 7. Update ArticleFormShared — remove featured, integrate ImageUpload
  - In `src/components/admin/ArticleFormShared.tsx`:
    - Remove `featured: boolean` from `ArticleFormData` interface
    - Remove `featured: false` from `EMPTY_FORM`
    - Remove `featured` and `setFeatured` props from `PublishSettingsSection` — delete the entire "Featured" toggle row (the `<div>` containing the "Featured" label and `ToggleSwitch`)
    - Remove `featured` prop from `FormSubmitBar` — delete the `{featured && <span ...>+ FEATURED</span>}` line from the status display
    - Keep `ImageSection` exported (backward compatibility) but it will no longer be used by the form pages
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4_

- [x] 8. Checkpoint — Verify form shared components
  - Ensure TypeScript compilation passes with no errors related to `featured`
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Wire admin create page to Supabase
  - Rewrite `src/app/(admin)/admin/articles/new/page.tsx`:
    - Keep `"use client"` directive and all existing form state (title, slug, slugLocked, category, excerpt, content, imageSrc, publishStatus)
    - Remove all `featured` state (`const [featured, setFeatured] = useState(false)`)
    - Replace `ImageSection` import and usage with `ImageUpload` component; pass `slug={slug}` and `onUpload={(url) => setImageSrc(url)}`
    - Add `error: string | null` state for submission errors
    - Add `"use server"` Server Action (or inline async function) that calls `adminCreateArticle` from `src/lib/admin/articles.ts`
    - On form submit: set `submitting = true`, call `adminCreateArticle({ slug, title, category, excerpt, content, image_src: imageSrc || null, published: publishStatus === 'published' })`, on success redirect to `/admin/articles`, on error set `error` state
    - "SAVE DRAFT" button: set `publishStatus = 'draft'` then trigger form submit
    - Display error message above `FormSubmitBar` if `error` is set
    - Pass updated `FormSubmitBar` without `featured` prop
    - Pass updated `PublishSettingsSection` without `featured`/`setFeatured` props
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [x] 10. Wire admin edit page to Supabase
  - Rewrite `src/app/(admin)/admin/articles/[slug]/page.tsx`:
    - Keep `"use client"` directive
    - Remove all mock data (`MOCK_ARTICLES` constant)
    - Add `loading: boolean` state, initialized to `true`
    - On mount (`useEffect`): call `adminGetArticleBySlug(slug)` from `src/lib/admin/articles.ts`, populate all form state fields from the returned article, set `loading = false`; if result is `null`, set `notFound = true`
    - Remove all `featured` state
    - Replace `ImageSection` with `ImageUpload` component; pass `slug={articleSlug}`, `currentImageUrl={imageSrc || undefined}`, `onUpload={(url) => setImageSrc(url)}`
    - Add `error: string | null` state
    - On form submit: call `adminUpdateArticle(slug, { ... })`, on success redirect to `/admin/articles`, on error set `error` state
    - On delete confirm: call `adminDeleteArticle(slug)`, on success redirect to `/admin/articles`
    - Display loading state while `loading === true`: show a terminal-style loading panel matching existing style
    - Display error message above `FormSubmitBar` if `error` is set
    - Pass updated `FormSubmitBar` and `PublishSettingsSection` without `featured` props
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

- [x] 11. Wire admin list page to Supabase
  - Rewrite `src/app/(admin)/admin/articles/page.tsx`:
    - Keep `"use client"` directive
    - Remove `MOCK_ARTICLES` constant
    - Remove `featured` from the local `Article` interface
    - Add `loading: boolean` state, initialized to `true`
    - On mount (`useEffect`): call `adminGetAllArticles()` and `adminGetStats()` from `src/lib/admin/articles.ts`, set `articles` and `stats` state, set `loading = false`
    - Replace the 4-cell stats grid with 3 cells: TOTAL, PUBLISHED, DRAFT (remove FEATURED cell)
    - Replace `FILTER_TABS` with `["ALL", "PUBLISHED", "DRAFT"]` — remove `"FEATURED"`
    - Remove `FeaturedBadge` component entirely
    - Remove `featured` from `ArticleRow` rendering (remove the FEAT column from desktop grid and mobile layout)
    - Update desktop grid template from 7 columns to 6 columns (remove the FEAT column)
    - Update table header to remove "FEAT" column header
    - On delete confirm: call `adminDeleteArticle(article.slug)` from `src/lib/admin/articles.ts`, then remove the article from local state
    - Display loading state while `loading === true`
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [x] 12. Wire admin dashboard to real stats
  - Update `src/app/(admin)/admin/dashboard/page.tsx`:
    - Import `adminGetStats` from `src/lib/admin/articles.ts`
    - Call `adminGetStats()` at the top of the `AdminDashboardPage` async function (it's already a Server Component)
    - Replace the `STATS` placeholder constant with real data from `adminGetStats()`
    - Update the stats grid to show: TOTAL ARTICLES (stats.total), PUBLISHED (stats.published), DRAFT (stats.drafts), LAST ARCHIVED (formatted `stats.lastUpdated` or `"—"`)
    - Format `lastUpdated` using `new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(stats.lastUpdated))` when not null
    - Keep all other sections (welcome panel, quick actions, archive status) completely unchanged
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [x] 13. Checkpoint — Verify admin pages end-to-end
  - Ensure all tests pass, ask the user if questions arise.
  - Manually verify: create a draft article, confirm it does not appear on public pages; publish it, confirm it appears

- [x] 14. Verify public pages draft protection
  - Confirm `src/app/(public)/articles/[slug]/page.tsx` already calls `notFound()` when `getArticleBySlug` returns `null` — no code change needed if already implemented
  - Confirm `src/app/(public)/page.tsx` uses `getArticlesFeatured` and `getArticlesRecent` — both now filter to published only, no page-level change needed
  - Confirm `src/app/(public)/categories/[slug]/page.tsx` uses `getArticlesByCategory` — now filters to published only, no page-level change needed
  - Confirm `src/app/(public)/articles/page.tsx` uses `getArticlesPreview` — now filters to published only, no page-level change needed
  - If any public page is still using the old browser-client-based functions directly, update it to use the rewritten `src/lib/articles.ts` functions
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 15. Final checkpoint — Full integration verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify TypeScript compilation passes with `npx tsc --noEmit`
  - Verify no references to `featured` remain in any component or page (except the kept `ImageSection` export if retained)

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- The `articles` Supabase Storage bucket must be set to public before image uploads will work
- Admin pages use `"use client"` and call data layer functions via Server Actions — ensure Server Actions are properly marked with `"use server"` when defined inside client component files
- The `getRelatedArticles` function signature changes from `(category: string, currentId: string)` to `(category: string, currentId: number)` to match the numeric `id` type — update any call sites
- fast-check must be installed as a dev dependency: `npm install --save-dev fast-check`

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2", "3"] },
    { "wave": 3, "tasks": ["4"] },
    { "wave": 4, "tasks": ["5"] },
    { "wave": 5, "tasks": ["6"] },
    { "wave": 6, "tasks": ["7"] },
    { "wave": 7, "tasks": ["8"] },
    { "wave": 8, "tasks": ["9", "10", "11", "12"] },
    { "wave": 9, "tasks": ["13"] },
    { "wave": 10, "tasks": ["14"] },
    { "wave": 11, "tasks": ["15"] }
  ]
}
```

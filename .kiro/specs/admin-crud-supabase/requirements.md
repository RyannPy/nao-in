# Requirements Document

## Introduction

This feature wires the existing Nao-in admin UI to Supabase for full CRUD operations on articles. The admin pages currently use mock data and placeholder logic. The goal is to replace all mock data with real Supabase queries, add a `published` draft system for draft protection on public pages, add Supabase Storage image upload to replace the URL-only input, and remove the `featured` field entirely from the codebase. No UI redesign is involved — all existing industrial/terminal aesthetic is preserved.

## Glossary

- **Article**: A blog post stored in the Supabase `articles` table with fields: `id`, `slug`, `title`, `category`, `excerpt`, `content`, `image_src`, `published`, `created_at`, `updated_at`.
- **Admin_Data_Layer**: The module at `src/lib/admin/articles.ts` that provides server-side CRUD functions for admin pages.
- **Public_Data_Layer**: The module at `src/lib/articles.ts` that provides server-side read-only functions for public pages, always filtered to published articles only.
- **Storage_Module**: The module at `src/lib/admin/storage.ts` that handles file uploads to Supabase Storage.
- **ImageUpload**: The React client component at `src/components/admin/ImageUpload.tsx` that provides drag-and-drop and file-picker upload UI.
- **ArticleFormShared**: The shared form building-blocks component at `src/components/admin/ArticleFormShared.tsx`.
- **Server_Client**: The Supabase client created via `createClient()` from `src/lib/supabase/server.ts`, used in Server Components and Server Actions.
- **Browser_Client**: The Supabase client created via `createClient()` from `src/lib/supabase/client.ts`, used only in Client Components that need auth state.
- **Draft**: An article with `published = false`. Drafts are never visible on public pages.
- **Published**: An article with `published = true`. Published articles are visible on all public pages.
- **articles_bucket**: The Supabase Storage bucket named `articles` used for article image uploads. Must be configured as public.

---

## Requirements

### Requirement 1: Global Article Type Definitions

**User Story:** As a developer, I want a single source of truth for article types, so that all parts of the codebase use consistent, type-safe interfaces.

#### Acceptance Criteria

1. THE System SHALL create `src/types/article.ts` with a base `Article` interface matching the Supabase `articles` table schema: `id` (number), `slug` (string), `title` (string), `category` (string), `excerpt` (string or null), `content` (string or null), `image_src` (string or null), `published` (boolean), `created_at` (string), `updated_at` (string).
2. THE System SHALL export an `ArticlePreview` type derived from `Article` containing only the fields needed for article cards: `id`, `slug`, `title`, `category`, `image_src`, `created_at`.
3. THE System SHALL export an `ArticleFull` type derived from `Article` containing all fields needed for the article detail page.
4. THE System SHALL export an `ArticleAdmin` type derived from `Article` containing all fields needed for the admin list and edit pages.
5. THE System SHALL NOT include a `featured` field in any exported type.

---

### Requirement 2: Public Data Layer — Published Filter

**User Story:** As a site visitor, I want to only see published articles on public pages, so that draft content is never accidentally exposed.

#### Acceptance Criteria

1. THE Public_Data_Layer SHALL rewrite `src/lib/articles.ts` to use the Server_Client instead of the Browser_Client.
2. WHEN `getAllArticles` is called, THE Public_Data_Layer SHALL return only articles where `published = true`, ordered by `created_at` descending.
3. WHEN `getArticlesFeatured` is called, THE Public_Data_Layer SHALL return the most recently created published article.
4. WHEN `getRelatedArticles` is called, THE Public_Data_Layer SHALL return only published articles in the same category, excluding the current article.
5. WHEN `getArticlesRecent` is called, THE Public_Data_Layer SHALL return the 4 most recently created published articles.
6. WHEN `getArticlesPreview` is called, THE Public_Data_Layer SHALL return all published articles ordered by `created_at` descending.
7. WHEN `getArticleBySlug` is called with a slug that matches a draft article, THE Public_Data_Layer SHALL return `null`.
8. WHEN `getArticlesByCategory` is called, THE Public_Data_Layer SHALL return only published articles in the specified category.
9. IF a Supabase query returns an error, THEN THE Public_Data_Layer SHALL log the error and return an empty array or `null` depending on the function's return type.

---

### Requirement 3: Admin Data Layer — Full CRUD

**User Story:** As an admin, I want to create, read, update, and delete articles through a data layer, so that admin pages have a clean interface to Supabase without direct queries in page components.

#### Acceptance Criteria

1. THE Admin_Data_Layer SHALL create `src/lib/admin/articles.ts` using the Server_Client for all operations.
2. WHEN `adminGetAllArticles` is called, THE Admin_Data_Layer SHALL return all articles regardless of `published` status, ordered by `created_at` descending.
3. WHEN `adminGetArticleBySlug` is called with a valid slug, THE Admin_Data_Layer SHALL return the full article record including `published` status.
4. WHEN `adminGetArticleBySlug` is called with a slug that does not exist, THE Admin_Data_Layer SHALL return `null`.
5. WHEN `adminCreateArticle` is called with valid article data, THE Admin_Data_Layer SHALL insert a new row into the `articles` table and return the created article.
6. WHEN `adminUpdateArticle` is called with a slug and updated fields, THE Admin_Data_Layer SHALL update the matching row and return the updated article.
7. WHEN `adminDeleteArticle` is called with a slug, THE Admin_Data_Layer SHALL delete the matching row from the `articles` table.
8. WHEN `adminGetStats` is called, THE Admin_Data_Layer SHALL return an object containing: `total` (total article count), `published` (count of published articles), `drafts` (count of draft articles), `lastUpdated` (the `updated_at` timestamp of the most recently updated article or `null` if no articles exist).
9. IF any Supabase operation returns an error, THEN THE Admin_Data_Layer SHALL throw the error so the calling page can handle it.

---

### Requirement 4: Supabase Storage Image Upload

**User Story:** As an admin, I want to upload article images directly to Supabase Storage, so that images are hosted reliably and linked to articles by public URL.

#### Acceptance Criteria

1. THE Storage_Module SHALL create `src/lib/admin/storage.ts` with an `uploadArticleImage(file: File, slug: string): Promise<string>` function.
2. WHEN `uploadArticleImage` is called, THE Storage_Module SHALL upload the file to the `articles_bucket` in Supabase Storage.
3. THE Storage_Module SHALL generate the storage filename as `{slug}-{timestamp}.{ext}` where `timestamp` is `Date.now()` and `ext` is the file extension derived from the MIME type.
4. IF the uploaded file's MIME type is not one of `image/jpeg`, `image/png`, `image/webp`, or `image/gif`, THEN THE Storage_Module SHALL throw an error with the message `"Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."`.
5. IF the uploaded file size exceeds 5MB (5 × 1024 × 1024 bytes), THEN THE Storage_Module SHALL throw an error with the message `"File too large. Maximum size is 5MB."`.
6. WHEN the upload succeeds, THE Storage_Module SHALL return the public URL of the uploaded file using `supabase.storage.from('articles').getPublicUrl(path).data.publicUrl`.

---

### Requirement 5: ImageUpload Component

**User Story:** As an admin, I want a drag-and-drop image upload component in the article form, so that I can upload images without leaving the editor.

#### Acceptance Criteria

1. THE ImageUpload component SHALL be created at `src/components/admin/ImageUpload.tsx` as a `"use client"` component.
2. THE ImageUpload component SHALL accept props: `onUpload: (url: string) => void`, `currentImageUrl?: string`, and `slug: string`.
3. WHEN the component is in the idle state, THE ImageUpload component SHALL display a drop zone with a terminal-style prompt and a file picker button.
4. WHEN a file is dragged over the drop zone, THE ImageUpload component SHALL provide visual feedback by changing the border style.
5. WHEN a file is dropped or selected via the file picker, THE ImageUpload component SHALL call `uploadArticleImage` from the Storage_Module and transition to the uploading state.
6. WHILE uploading, THE ImageUpload component SHALL display a progress indicator and disable further interaction.
7. WHEN the upload succeeds, THE ImageUpload component SHALL call `onUpload` with the returned public URL, display an image preview, and transition to the success state.
8. IF the upload fails, THEN THE ImageUpload component SHALL display the error message and provide a retry button, transitioning to the error state.
9. THE ImageUpload component SHALL match the existing industrial/terminal visual style: dark header bar (`bg-[#1a1a1a]`), light panel body (`bg-[#c4c4c4]`), yellow accent (`#e8c830`), mono font, border/corner ticks pattern.
10. WHERE a `currentImageUrl` prop is provided, THE ImageUpload component SHALL display the existing image as a preview in the success state on initial render.

---

### Requirement 6: Remove `featured` Field

**User Story:** As a developer, I want to remove the `featured` field from all components and pages, so that the codebase is consistent with the database schema which has no `featured` column.

#### Acceptance Criteria

1. THE System SHALL remove the `featured` field from the `ArticleFormData` interface in `ArticleFormShared.tsx`.
2. THE System SHALL remove `featured: false` from the `EMPTY_FORM` constant in `ArticleFormShared.tsx`.
3. THE System SHALL remove the `featured` and `setFeatured` props from the `PublishSettingsSection` component and its entire "Featured" toggle row.
4. THE System SHALL remove the `featured` prop from the `FormSubmitBar` component and the `+ FEATURED` status display from its status line.
5. THE System SHALL remove all `featured` state variables from the admin create page (`/admin/articles/new/page.tsx`).
6. THE System SHALL remove all `featured` state variables from the admin edit page (`/admin/articles/[slug]/page.tsx`).
7. THE System SHALL remove the `FEATURED` filter tab from the admin list page (`/admin/articles/page.tsx`).
8. THE System SHALL remove the `FEATURED` stat cell from the admin list page stats grid.
9. THE System SHALL remove the `FeaturedBadge` component from the admin list page.
10. THE System SHALL remove the `featured` field from the local `Article` interface in the admin list page.

---

### Requirement 7: Update ArticleFormShared

**User Story:** As a developer, I want `ArticleFormShared.tsx` updated to use the ImageUpload component and have `featured` removed, so that the shared form building blocks are consistent with the new architecture.

#### Acceptance Criteria

1. WHEN `ArticleFormShared.tsx` is updated, THE System SHALL replace the `ImageSection` usage pattern with the `ImageUpload` component for the image field in the form.
2. THE System SHALL keep the `ImageSection` component exported from `ArticleFormShared.tsx` for backward compatibility or remove it only after confirming no other consumers exist.
3. THE System SHALL update the `imageSrc` field in `ArticleFormData` to be set via the `onUpload` callback from `ImageUpload`.
4. THE System SHALL ensure `ArticleFormData` no longer contains a `featured` field after the update.

---

### Requirement 8: Admin Create Page — Supabase Integration

**User Story:** As an admin, I want the article create page to save new articles to Supabase, so that articles I write are persisted to the database.

#### Acceptance Criteria

1. WHEN the admin create page loads, THE System SHALL render the form with all fields empty and `publishStatus` defaulting to `"draft"`.
2. WHEN the form is submitted with `publishStatus = "published"`, THE System SHALL call `adminCreateArticle` with `published: true` and all form field values.
3. WHEN the "SAVE DRAFT" button is clicked, THE System SHALL set `publishStatus` to `"draft"` and submit the form, calling `adminCreateArticle` with `published: false`.
4. WHEN `adminCreateArticle` succeeds, THE System SHALL redirect the user to `/admin/articles`.
5. IF `adminCreateArticle` returns an error, THEN THE System SHALL display the error message to the user without navigating away.
6. WHILE the form is submitting, THE System SHALL disable the submit buttons and show a loading indicator.
7. THE System SHALL use the `ImageUpload` component for the image field, passing the article slug as the `slug` prop.
8. THE System SHALL NOT include any `featured` state or field in the create page.

---

### Requirement 9: Admin Edit Page — Supabase Integration

**User Story:** As an admin, I want the article edit page to load real article data from Supabase and save changes back, so that I can update existing articles.

#### Acceptance Criteria

1. WHEN the admin edit page loads, THE System SHALL call `adminGetArticleBySlug` with the URL slug parameter and populate all form fields with the returned data.
2. WHILE the article data is being fetched, THE System SHALL display a loading state.
3. IF `adminGetArticleBySlug` returns `null`, THEN THE System SHALL display the "ARTICLE NOT FOUND" state with a back button.
4. WHEN the form is submitted, THE System SHALL call `adminUpdateArticle` with the slug and all updated form field values.
5. WHEN `adminUpdateArticle` succeeds, THE System SHALL redirect the user to `/admin/articles`.
6. IF `adminUpdateArticle` returns an error, THEN THE System SHALL display the error message to the user without navigating away.
7. WHEN the delete button is clicked and confirmed in the modal, THE System SHALL call `adminDeleteArticle` with the article slug.
8. WHEN `adminDeleteArticle` succeeds, THE System SHALL redirect the user to `/admin/articles`.
9. THE System SHALL use the `ImageUpload` component for the image field, passing the existing `image_src` as `currentImageUrl` and the article slug as `slug`.
10. THE System SHALL NOT include any `featured` state or field in the edit page.

---

### Requirement 10: Admin List Page — Supabase Integration

**User Story:** As an admin, I want the article list page to show real articles from Supabase with working filters and delete, so that I can manage the article archive.

#### Acceptance Criteria

1. WHEN the admin list page loads, THE System SHALL call `adminGetAllArticles` and display the returned articles.
2. WHILE articles are being fetched, THE System SHALL display a loading state.
3. THE System SHALL display stats for TOTAL, PUBLISHED, and DRAFT article counts using data from `adminGetStats`.
4. THE System SHALL provide filter tabs for ALL, PUBLISHED, and DRAFT only — the FEATURED tab SHALL NOT exist.
5. WHEN the delete button is clicked and confirmed, THE System SHALL call `adminDeleteArticle` with the article slug and remove the article from the displayed list.
6. THE System SHALL NOT render a `FeaturedBadge` component or any `featured` display in article rows.
7. THE System SHALL NOT include a `featured` field in the local Article interface used by the list page.

---

### Requirement 11: Admin Dashboard — Real Stats

**User Story:** As an admin, I want the dashboard to show real article statistics from Supabase, so that I have an accurate overview of the archive.

#### Acceptance Criteria

1. WHEN the admin dashboard page loads, THE System SHALL call `adminGetStats` and display the returned data.
2. THE System SHALL display the total article count in the "TOTAL ARTICLES" stat cell.
3. THE System SHALL display the published article count in a "PUBLISHED" stat cell.
4. THE System SHALL display the draft article count in a "DRAFT" stat cell.
5. THE System SHALL display the `lastUpdated` date formatted as a readable string in the "LAST ARCHIVED" stat cell, or `"—"` if no articles exist.
6. THE System SHALL keep the existing dashboard layout, visual style, and all other sections (welcome panel, quick actions, archive status) unchanged.

---

### Requirement 12: Public Pages — Draft Protection

**User Story:** As a site visitor, I want draft articles to be completely inaccessible on public pages, so that unpublished content is never shown.

#### Acceptance Criteria

1. WHEN a visitor navigates to `/articles/[slug]` for a draft article, THE System SHALL call `notFound()` because `getArticleBySlug` returns `null` for unpublished articles.
2. WHEN the homepage loads, THE System SHALL only display published articles in the featured and recent sections.
3. WHEN a category page loads, THE System SHALL only display published articles for that category.
4. WHEN the articles list page loads, THE System SHALL only display published articles.
5. WHEN related articles are fetched for an article detail page, THE System SHALL only include published articles in the related list.

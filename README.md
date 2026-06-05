<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Next.js][Next.js]][Next-url]
[![React][React.js]][React-url]
[![Supabase][Supabase-badge]][Supabase-url]
[![TypeScript][TypeScript-badge]][TypeScript-url]
[![TailwindCSS][Tailwind-badge]][Tailwind-url]

<br />
<div align="center">
  <a href="https://github.com/RyannPy/nao-in">
    <img src="public/assets/mainlogo-w.png" alt="NAO-IN Logo" width="80" height="80">
  </a>

  <h3 align="center">NAO-IN</h3>

  <p align="center">
    A brutalist, sci-fi-inspired personal blog platform built for a single author.<br />
    Write, publish, and archive — with full admin control and zero public registration.
    <br />
    <br />
    <a href="https://github.com/RyannPy/nao-in/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/RyannPy/nao-in/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

---

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#key-features">Key Features</a></li>
    <li><a href="#screenshots">Screenshots</a></li>
    <li><a href="#technology-stack">Technology Stack</a></li>
    <li><a href="#architecture-overview">Architecture Overview</a></li>
    <li><a href="#folder-structure">Folder Structure</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#environment-variables">Environment Variables</a></li>
    <li><a href="#database-setup">Database Setup (Supabase)</a></li>
    <li><a href="#development-workflow">Development Workflow</a></li>
    <li><a href="#build-and-deployment">Build and Deployment</a></li>
    <li><a href="#admin-workflow">Admin Workflow</a></li>
    <li><a href="#public-user-workflow">Public User Workflow</a></li>
    <li><a href="#design-philosophy">Design Philosophy</a></li>
    <li><a href="#future-improvements">Future Improvements</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

## About The Project

**NAO-IN** is a single-author personal blog and content archive. It has no public registration — only one administrator (the site owner) can create and manage articles. Public visitors have read-only access to published content.

The platform is designed around a **sci-fi / industrial aesthetic** drawing from contemporary futuristic interfaces: high-contrast grayscale palettes, monospace typography, scanline textures, angular corner ticks, and a signature yellow accent (`#e8c830`). It feels like a terminal data archive, not a generic blog.

Built on Next.js 16 App Router and Supabase, it uses server-side rendering by default, server actions for mutations, and a robust server-side pagination system with full URL-state preservation.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Key Features

**Public**
- Paginated article archive (12 per page, URL-based)
- Client-side search filter on top of server-paginated data
- Article detail pages with custom Markdown renderer (H2, bold, links, fenced code blocks)
- Categorized browsing — 5 categories: Games, Science, Story, Coding, Study
- Paginated category pages with article counts
- Featured and recent articles on the homepage
- About page with author skills, timeline, and contact
- Fully responsive layout with desktop sidebar and mobile drawer
- Skeleton loading states across all pages
- `not-found` and `loading` pages for every route segment

**Admin**
- Supabase email/password authentication
- Middleware route guard — all `/admin/*` routes require an active session
- 30-minute inactivity auto-logout (`SessionTimeout`)
- Dashboard with live article stats (total, published, drafts, last updated)
- Full article CRUD — create, edit, delete
- Markdown content editor with toolbar snippets (H2, bold, link, code block)
- Slug auto-generation from title, with manual override
- Image upload to Supabase Storage (drag-and-drop or click-to-browse, 5 MB max, JPEG/PNG/WebP/GIF)
- Old image auto-deletion when a new image is uploaded on edit
- Publish / draft toggle per article
- Admin article list with search, filter tabs (All / Published / Draft), and pagination
- Delete confirmation modal to prevent accidents
- Zod schema validation on all article writes

**Technical**
- React Compiler enabled (`reactCompiler: true`)
- Security headers on all routes (CSP, `X-Frame-Options`, `X-Content-Type-Options`, etc.)
- Server-side pagination utilities (`validatePageNumber`, `calculateOffset`, `calculateTotalPages`)
- Unit tests with Vitest (pagination data layer + utility functions)
- Strongly typed throughout with TypeScript

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Screenshots

> Screenshots placeholder — add actual screenshots to `/public/assets/screenshots/` and update these paths.

| Page | Preview |
|---|---|
| Home | `public/assets/screenshots/home.png` |
| Article List | `public/assets/screenshots/articles.png` |
| Article Detail | `public/assets/screenshots/article-detail.png` |
| Categories | `public/assets/screenshots/categories.png` |
| Admin Dashboard | `public/assets/screenshots/admin-dashboard.png` |
| Admin Editor | `public/assets/screenshots/admin-editor.png` |
| Login | `public/assets/screenshots/login.png` |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| Supabase Client | `@supabase/ssr` + `@supabase/supabase-js` |
| Validation | Zod v4 |
| Testing | Vitest v4, `@testing-library/react` |
| Fonts | Geist Sans & Geist Mono (Google Fonts) |
| Compiler | React Compiler (babel-plugin-react-compiler) |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Architecture Overview

NAO-IN uses Next.js App Router route groups to cleanly separate three concerns:

```
(public)       → Public-facing blog — no auth, published articles only
(admin)        → Protected admin panel — requires valid Supabase session
(admin-auth)   → Login page — unauthenticated entry point to admin
```

**Request flow:**

1. The middleware (`src/proxy.ts`) intercepts all `/admin/*` requests.
2. It validates the Supabase session cookie server-side using `@supabase/ssr`.
3. Unauthenticated users are redirected to `/admin/login`. Authenticated users visiting the login page are redirected to `/admin/dashboard`.

**Data access:**

- Public pages call `src/lib/articles.ts` — all queries include `.eq("published", true)`.
- Admin pages call `src/lib/admin/articles.ts` via Next.js Server Actions — no `published` filter, all rows visible.
- Both layers require a server-side Supabase client created from cookies (`src/lib/supabase/server.ts`).
- The browser-side Supabase client (`src/lib/supabase/client.ts`) is used only for auth and Storage uploads from client components.

**Pagination:**

All list pages use URL-based server-side pagination. The page number is read from `searchParams`, validated with `validatePageNumber()`, and passed to Supabase `.range()`. Invalid page params redirect to a canonical URL. 12 articles per page is the default page size.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Folder Structure

```
nao-in/
├── public/
│   └── assets/
│       └── mainlogo-w.png
├── src/
│   ├── proxy.ts                        # Next.js middleware (auth guard for /admin/*)
│   ├── app/
│   │   ├── globals.css                 # Tailwind base + category card hover styles
│   │   ├── layout.tsx                  # Root layout (Geist fonts, favicon, metadata)
│   │   ├── (public)/
│   │   │   ├── layout.tsx              # Public layout — desktop + mobile sidebars
│   │   │   ├── loading.tsx             # Top-level loading screen
│   │   │   ├── page.tsx                # Home — featured + recent articles + stats
│   │   │   ├── about/page.tsx          # About page — skills, timeline, contact
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx            # Paginated article archive
│   │   │   │   └── [slug]/page.tsx     # Article detail with related articles
│   │   │   └── categories/
│   │   │       ├── page.tsx            # Category grid (5 categories)
│   │   │       └── [slug]/page.tsx     # Paginated articles filtered by category
│   │   ├── (admin)/
│   │   │   ├── layout.tsx              # Admin layout — sidebar + SessionTimeout
│   │   │   └── admin/
│   │   │       ├── dashboard/page.tsx  # Stats dashboard + quick actions
│   │   │       └── articles/
│   │   │           ├── page.tsx        # Admin article list
│   │   │           ├── actions.ts      # Server Actions (CRUD wrappers)
│   │   │           ├── AdminArticlesClient.tsx
│   │   │           ├── new/page.tsx    # Create article form
│   │   │           └── [slug]/
│   │   │               └── AdminEditArticleClient.tsx  # Edit article form
│   │   └── (admin-auth)/
│   │       └── admin/login/page.tsx    # Supabase login page
│   ├── components/
│   │   ├── ArticleCard.tsx             # Article card with image, badge, hover effects
│   │   ├── ArticlesClientList.tsx      # Client list + search for /articles
│   │   ├── CategoryArticlesList.tsx    # Client list + pagination for /categories/[slug]
│   │   ├── CategoryBadge.tsx           # Category label badge (3 variants)
│   │   ├── DesktopSidebar.tsx          # Fixed left sidebar (lg+)
│   │   ├── HeroImage.tsx               # Article hero image with loading skeleton
│   │   ├── MobileSidebar.tsx           # Top bar + drawer navigation (< lg)
│   │   ├── admin/
│   │   │   ├── ArticleFormShared.tsx   # Reusable form fields (shared by create + edit)
│   │   │   ├── ImageUpload.tsx         # Drag-drop upload to Supabase Storage
│   │   │   └── SessionTimeout.tsx      # 30-min inactivity auto-logout
│   │   ├── layout/
│   │   │   ├── PageContainer.tsx       # Page wrapper — bg, texture, content column
│   │   │   ├── PageTexture.tsx         # CSS grid texture overlay
│   │   │   └── StatusFooter.tsx        # Pinging status bar footer
│   │   ├── loading/
│   │   │   ├── index.ts                # Barrel export
│   │   │   ├── loading-constants.ts    # Shared skeleton class tokens
│   │   │   ├── LoadingArticle.tsx      # Full article page skeleton
│   │   │   ├── LoadingCard.tsx         # Article card skeleton + grid variant
│   │   │   ├── LoadingImage.tsx        # Hero image skeleton
│   │   │   ├── LoadingScreen.tsx       # Full-viewport loading overlay
│   │   │   └── LoadingText.tsx         # Text line skeleton
│   │   ├── prose/
│   │   │   ├── CodeBlock.tsx           # Code block with language label + wrap toggle
│   │   │   └── renderContent.tsx       # Markdown renderer (H2, bold, links, code)
│   │   └── ui/
│   │       ├── AccentDivider.tsx       # Yellow-accented horizontal rule
│   │       ├── MetaRow.tsx             # Dot-label metadata row
│   │       ├── PageHeader.tsx          # Standard page title with yellow underline
│   │       ├── Pagination.tsx          # Pagination + paginateItems/getTotalPages utils
│   │       └── SectionLabel.tsx        # "// SECTION" divider label
│   ├── lib/
│   │   ├── articles.ts                 # Public Supabase queries (published only)
│   │   ├── auth.ts                     # requireAdmin() — throws if no session
│   │   ├── pagination-utils.ts         # validatePageNumber / calculateOffset / calculateTotalPages
│   │   ├── theme.ts                    # Design tokens — COLORS, FONTS, TEXTURES, cx()
│   │   ├── validation.ts               # Zod ArticleSchema
│   │   ├── admin/
│   │   │   ├── articles.ts             # Admin CRUD + stats queries
│   │   │   └── storage.ts              # Supabase Storage upload / path extraction
│   │   ├── supabase/
│   │   │   ├── client.ts               # Browser Supabase client
│   │   │   └── server.ts               # Server Supabase client (cookie-based SSR)
│   │   └── __tests__/
│   │       ├── articles-pagination.test.ts
│   │       └── pagination-utils.test.ts
│   └── types/
│       └── article.ts                  # Article, ArticlePreview, ArticleFull, ArticleAdmin
├── .env.example
├── .env.local                          # Never commit — add your keys here
├── next.config.ts
├── package.json
└── tsconfig.json
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or a compatible package manager
- A Supabase project (free tier works)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/RyannPy/nao-in.git
   cd nao-in
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Copy the environment template and fill in your values:
   ```sh
   cp .env.example .env.local
   ```

4. Set up your Supabase database and storage bucket (see [Database Setup](#database-setup)).

5. Start the development server:
   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the public blog.
   The admin panel is at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Environment Variables

Create a `.env.local` file in the project root. All variables are required.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase project anon/public key |

```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Both variables are prefixed with `NEXT_PUBLIC_` and are safe to expose to the browser. Row Level Security (RLS) on Supabase controls what the anon key can actually access.

> Never commit `.env.local` to version control. It is already listed in `.gitignore`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Database Setup

### 1. Create the `articles` table

Run this SQL in the Supabase SQL editor:

```sql
create table articles (
  id          bigint generated by default as identity primary key,
  slug        text not null unique,
  title       text not null,
  category    text not null,
  excerpt     text,
  content     text,
  image_src   text,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger articles_updated_at
  before update on articles
  for each row execute procedure update_updated_at();
```

### 2. Row Level Security (RLS)

Enable RLS and add policies so the anon key can only read published articles, while authenticated users (the admin) can do full CRUD:

```sql
-- Enable RLS
alter table articles enable row level security;

-- Public: read published articles only
create policy "Public can read published articles"
  on articles for select
  using (published = true);

-- Admin (authenticated): full access
create policy "Admin full access"
  on articles for all
  using (auth.role() = 'authenticated');
```

### 3. Storage bucket

1. Go to **Storage** in the Supabase dashboard.
2. Create a bucket named `articles`.
3. Set it to **Public** (so image URLs work without a signed token).
4. Add a policy allowing authenticated users to upload:

```sql
create policy "Authenticated users can upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'articles');

create policy "Public can read"
  on storage.objects for select
  using (bucket_id = 'articles');

create policy "Authenticated users can delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'articles');
```

### 4. Create the admin user

Go to **Authentication → Users** in the Supabase dashboard and create a user manually with an email and password. This is the only account that will ever log in to the admin panel.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Development Workflow

```sh
# Start the development server with hot reload
npm run dev

# Type-check and lint
npm run lint

# Run the test suite (single run)
npm test

# Run tests in watch mode
npm run test:watch
```

The test suite covers:
- `src/lib/__tests__/pagination-utils.test.ts` — unit tests for `validatePageNumber`, `calculateOffset`, `calculateTotalPages`
- `src/lib/__tests__/articles-pagination.test.ts` — data layer tests for `getArticlesPreviewPaginated` and `getArticlesByCategoryPaginated` with a mocked Supabase client

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Build and Deployment

```sh
# Production build
npm run build

# Start the production server locally
npm start
```

For deployment, this project works with any platform that supports Next.js:

- **Vercel** (recommended) — zero configuration, just connect your repository and add the environment variables in the project settings.
- **Self-hosted** — run `npm run build` then `npm start` on your server.

Remember to add your two environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) to your deployment platform's environment configuration.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Admin Workflow

The admin panel lives at `/admin`. All routes under `/admin` require an active session — the middleware redirects unauthenticated visitors to `/admin/login`.

**Typical publishing flow:**

1. Navigate to `/admin/login` and sign in with your Supabase credentials.
2. You land on the **Dashboard** (`/admin/dashboard`), which shows total articles, published count, draft count, and last updated date.
3. Click **Create New Article** (`/admin/articles/new`) to open the editor.
4. Fill in:
   - **Title** — plain text, max 200 characters.
   - **Slug** — auto-generated from title, can be manually overridden. Lowercase alphanumeric and hyphens only.
   - **Category** — one of `games`, `coding`, `science`, `study`, `story`.
   - **Excerpt** — short summary shown on cards (max 500 characters).
   - **Image** — drag-and-drop or click to upload (JPEG/PNG/WebP/GIF, max 5 MB). Stored in Supabase Storage.
   - **Content** — plain Markdown subset. Use the toolbar to insert H2 headings, bold text, links, and fenced code blocks.
   - **Publish status** — toggle between `draft` and `published`.
5. Click **PUBLISH →** to save and publish, or **SAVE DRAFT** to save without publishing.
6. To edit later, go to **Manage Articles** (`/admin/articles`), find the article, and click **EDIT**.
7. To delete, click **DELETE ARTICLE** in the editor. A confirmation modal prevents accidental deletion.

**Session management:** After 30 minutes of inactivity (no mouse, keyboard, or touch events), the session is automatically ended and you are redirected to the login page.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Public User Workflow

Public visitors can read but cannot create accounts or interact with content beyond navigation.

| Route | Description |
|---|---|
| `/` | Home page — featured article (latest published) + 4 most recent articles + stats |
| `/articles` | Full archive — paginated list of all published articles with search |
| `/articles/[slug]` | Article detail — full content, hero image, excerpt, related articles |
| `/categories` | Category grid — 5 categories with custom SVG icons |
| `/categories/[slug]` | Category page — paginated list of published articles in that category |
| `/about` | Author page — skills, timeline, contact information |

**Searching articles:** On the `/articles` page, a search bar filters the current page's results by title or category in real time. Pagination is hidden while a search query is active.

**Pagination:** URL-based — bookmark any paginated page and the correct content will load. Invalid page numbers (out of range, non-numeric) are automatically redirected to the nearest valid page.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Design Philosophy

NAO-IN's visual language is inspired by **futuristic terminal interfaces** in contemporary sci-fi games and industrial HUDs. The goal is a reading experience that feels like accessing a classified data archive rather than a standard blog.

**Core principles:**

- **Monochrome base with a single accent.** The entire palette is built on grays (`#d0d0d0` → `#1a1a1a`) with a single yellow accent (`#e8c830`) reserved for interactive elements, active states, and decorative marks. Nothing competes for attention.

- **Monospace typography as structure.** Labels, codes, page identifiers (`PGE-001`, `ART-007`, `CAT-03`), and UI chrome are all rendered in monospace. This treats metadata as an aesthetic rather than a burden.

- **Industrial decoration.** Corner ticks, accent bars, scanline overlays, repeating grid textures, and diamond markers are used as micro-decorations. They reference engineering diagrams and CRT displays.

- **Dark-on-light inversion on hover.** Cards and nav items flip from light gray to dark (`#1a1a1a`) on hover. This creates a strong interaction signal without color changes.

- **Skeleton loading states that respect the design.** Every loading skeleton matches the exact layout it replaces — same proportions, same corner ticks, same scanline overlays — so transitions feel seamless.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Future Improvements

The following improvements are identifiable from the codebase structure and current implementation:

- **RSS feed** — `/rss.xml` is linked in the About page contact section but not yet implemented.
- **OG image generation** — Dynamic Open Graph images per article for social sharing.
- **Full-text search** — Supabase full-text search across all articles (currently only client-side filter on the current page).
- **Tag system** — Articles currently support only a single category. A many-to-many tag system would improve discoverability.
- **Syntax highlighting** — The `CodeBlock` component renders plain text. Integrating a library like `shiki` or `prism` would improve code readability.
- **Image optimization on upload** — Resize and compress images server-side before storing in Supabase Storage.
- **Markdown preview in editor** — A split-pane or tab-based preview mode in the admin editor.
- **Article view counts** — Track and display view counts per article.
- **Scheduled publishing** — Set a future `published_at` date for articles to go live automatically.
- **Draft auto-save** — Auto-save draft state to localStorage to prevent data loss in the editor.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## License

This project is open source. Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Contact

Ryan — [ryanbayu155@gmail.com](mailto:ryanbayu155@gmail.com)

GitHub: [https://github.com/RyannPy](https://github.com/RyannPy)

Project: [https://github.com/RyannPy/nao-in](https://github.com/RyannPy/nao-in)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- MARKDOWN LINKS & BADGES -->
[Next.js]: https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Supabase-badge]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
[TypeScript-badge]: https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Tailwind-badge]: https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/

// app/(admin)/admin/articles/page.tsx
// Requirements: 3.1, 3.2, 6.1, 6.2

import { Suspense } from "react";
import { adminGetAllArticles, adminGetStats } from "@/lib/admin/articles";
import AdminArticlesClient from "./AdminArticlesClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminArticlesPage({ searchParams }: PageProps) {
  // In Next.js 16, searchParams is a Promise and must be awaited (Req 3.1, 6.1)
  const { page: pageParam } = await searchParams;

  // Parse page number, defaulting to 1 for missing or invalid values (Req 3.2, 6.2)
  const parsed = parseInt(pageParam ?? "1", 10);
  const initialPage = isNaN(parsed) || parsed < 1 ? 1 : parsed;

  // Fetch ALL articles — admin uses hybrid approach with client-side search/filter (Req 6.3, 6.4)
  const [initialArticles, initialStats] = await Promise.all([
    adminGetAllArticles(),
    adminGetStats(),
  ]);

  return (
    // useSearchParams() in AdminArticlesClient requires a Suspense boundary
    <Suspense fallback={null}>
      <AdminArticlesClient
        initialArticles={initialArticles}
        initialStats={initialStats}
        initialPage={initialPage}
      />
    </Suspense>
  );
}

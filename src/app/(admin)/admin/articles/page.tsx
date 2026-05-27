// app/(admin)/admin/articles/page.tsx

import { adminGetAllArticles, adminGetStats } from "@/lib/admin/articles";
import AdminArticlesClient from "./AdminArticlesClient";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const [initialArticles, initialStats] = await Promise.all([
    adminGetAllArticles(),
    adminGetStats(),
  ]);

  return (
    <AdminArticlesClient
      initialArticles={initialArticles}
      initialStats={initialStats}
    />
  );
}

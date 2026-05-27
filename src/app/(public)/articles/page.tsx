// app/articles/page.tsx

import PageContainer from "@/components/layout/PageContainer";
import StatusFooter from "@/components/layout/StatusFooter";
import PageHeader from "@/components/ui/PageHeader";
import { getArticlesPreview } from "@/lib/articles";
import ArticlesClientList from "@/components/ArticlesClientList";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ArticlesPage() {
  const articles = await getArticlesPreview();

  return (
    <PageContainer className="font-mono">
      {/* ── Page header ── */}
      <PageHeader title="ARTICLES" code="PGE-002" className="mb-10" />

      {/* ── Search + article list (client component) ── */}
      <ArticlesClientList articles={articles} />

      {/* ── Footer ── */}
      <StatusFooter />
    </PageContainer>
  );
}

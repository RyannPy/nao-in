// app/(admin)/admin/articles/[slug]/page.tsx

import { adminGetArticleBySlug } from "@/lib/admin/articles";
import AdminEditArticleClient from "./AdminEditArticleClient";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminEditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await adminGetArticleBySlug(slug);
  console.log(article);

  if (!article) {
    return (
      <PageContainer>
        <PageHeader title="Edit Article" code="ADM-005" />
        <div className="mt-8 bg-[#c4c4c4] border border-[#b8b8b8] px-6 py-10 flex flex-col items-center gap-3 font-mono">
          <span className="text-[32px] text-[#ccc] select-none">◈</span>
          <p className="text-[11px] tracking-[0.3em] text-[#aaa] uppercase">
            ARTICLE NOT FOUND
          </p>
          <p className="text-[9px] tracking-[0.15em] text-[#bbb]">
            slug: /{slug}
          </p>
          <Link
            href="/admin/articles"
            className="mt-4 px-5 py-2 bg-[#1a1a1a] border border-[#1a1a1a] text-[#e8c830] text-[9px] tracking-[0.3em] font-mono uppercase hover:bg-[#2a2a2a] transition-colors duration-150 inline-block text-center"
          >
            ← BACK TO LIST
          </Link>
        </div>
      </PageContainer>
    );
  }

  return <AdminEditArticleClient initialArticle={article} />;
}

// app/(admin)/admin/articles/new/page.tsx

import AdminCreateArticleClient from "./AdminCreateArticleClient";

export const dynamic = "force-dynamic";

export default function AdminCreateArticlePage() {
  return <AdminCreateArticleClient />;
}

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/ui/PageHeader";

export default function AdminDashboardPage() {
  return (
    <PageContainer>
      <PageHeader title="Admin Dashboard" code="ADM-001" />
      <div className="mt-8 text-[#5a5a5a] text-sm font-mono border-l-2 border-[#e8c830] pl-4">
        <p>Dashboard is empty.</p>
        <p>Select a menu item from the sidebar to begin.</p>
      </div>
    </PageContainer>
  );
}

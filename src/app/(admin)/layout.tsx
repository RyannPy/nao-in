import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// Import globals.css from the public folder since it contains tailwind and base styles
import "@/app/globals.css";
import DesktopSidebar from "@/components/DesktopSidebar";
import MobileSidebar from "@/components/MobileSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard - Nao-in",
  description: "Nao-in Admin Dashboard",
};

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin/dashboard", tag: "ADM-001" },
  { label: "Article", href: "/admin/articles/new", tag: "ADM-002" },
  { label: "List", href: "/admin/articles", tag: "ADM-003" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <>
      <MobileSidebar items={ADMIN_NAV} siteTitle="NAO-IN ADMIN" />
      <DesktopSidebar items={ADMIN_NAV} siteTitle="NAO-IN ADMIN" />

      <main className="flex-1 lg:pl-64 w-full">
        {children}
      </main>
    </>
  );
}

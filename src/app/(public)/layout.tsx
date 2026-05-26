import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Nao-in",
  description: "What do you search?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <div className="min-h-screen flex flex-col lg:flex-row">
        <MobileSidebar />
        <DesktopSidebar />
        <main className="flex-1 w-full min-w-0 lg:pl-64">{children}</main>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HowRead - 독서 리뷰 플랫폼",
  description: "책을 검색하고, 평점을 남기고, 리뷰를 공유하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

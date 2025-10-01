import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import React from "react";
import ClientRoot from "@/components/client-root";
import SessionWrapper from "@/components/SessionWrapper";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Summer School 2025 - IEEE BVICAM",
  description: "Summer School 2025 - IEEE BVICAM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <SessionWrapper>
          <Toaster richColors />
        <ClientRoot>{children}</ClientRoot>

        </SessionWrapper>
        
      </body>
    </html>
  );
}
